/*
 * Processing the tree
 */

var rootNode;
const NODE_WIDTH = 4;
const LEVEL_HEIGHT = -8;
const MIN_TREE_DISTANCE = 1;

// Node object
function Node(parentNode, depth){
  this.x = 0;
  this.y = depth;
  this.mod = 0;
  this.depth = depth;
  this.name = null;
  this.value = null;
  this.parentNode = parentNode;
  this.childNodes = [];
  this.previousSibling = null;
  this.nextSibling = null;
  this.geometry = null;

  this.isLeaf = function(){ return this.childNodes.length === 0; }
  this.isLeftMost = function(){ return this.previousSibling === null; }
  this.isRightMost = function(){ return this.nextSibling === null; }
  this.getLeftMostChild = function(){
    if(!this.isLeaf())
      return this.childNodes[0];
    else
      return null;
  }
  this.getRightMostChild = function(){
    if(!this.isLeaf())
      return this.childNodes[this.childNodes.length-1];
    else
      return null;
  }
  this.show = function(){
    console.log("(" + this.x + ", " + this.y + ")");
    console.log("depth: " + this.depth);
    console.log("name: " + this.name);
    console.log("value: " + this.value);
    console.log("parent");
    console.log(this.parentNode);
    console.log("previousSibling");
    console.log(this.previousSibling);
    console.log("nextSibling");
    console.log(this.nextSibling);
    console.log("==== show done ====\n");
  }
}

// parse XML, create a tree and give it to the renderer
function parseXML(xmlStr){
  console.log(xmlStr);
  var xmlDoc = $.parseXML(xmlStr);
  var xmlDocumentNode = xmlDoc.documentElement;
  rootNode = copyTree(xmlDocumentNode, null, 0);
  firstWalk(rootNode);
  thirdWalk(rootNode, rootNode.mod);
  printTree(rootNode);
  console.log("======== print done ========\n");
}

function render3D(node){
  // leaf
  node.show();
  node.entity = addSphere(node.x * NODE_WIDTH, node.y * LEVEL_HEIGHT, 0, 1);
  // branch
  if(!node.isLeaf()){
    for(var i=0; i<node.childNodes.length; i++){
      render3D(node.childNodes[i]);
    }
    for(var i=0; i<node.childNodes.length; i++){
      addLine(node.entity.position, node.childNodes[i].entity.position);
    }
  }
}

// create self-defined tree structure from XML DOM
function copyTree(xmlNode, parentNode, depth){
  var node = new Node(parentNode, depth);
  node.name = xmlNode.nodeName;
  // text node
  if(xmlNode.nodeType === 3){
    node.value = xmlNode.nodeValue;
  }
  // elelement node
  else if(xmlNode.nodeType === 1){
    // child nodes
    for(var child = xmlNode.firstChild; child != null; child = child.nextSibling){
      node.childNodes.push(copyTree(child, node, depth + 1));
    }
    // childs' siblings
    for(var i=0; i<node.childNodes.length; i++){
      // previous sibling
      if(i>0)
        node.childNodes[i].previousSibling = node.childNodes[i-1];
      // next sibling
      if(i<node.childNodes.length-1)
        node.childNodes[i].nextSibling = node.childNodes[i+1];
    }
  }
  return node;
}

// print the tree to the console
function printTree(node){
  // leaf
  node.show();
  // branch
  if(!node.isLeaf()){
    for(var i=0; i<node.childNodes.length; i++)
      printTree(node.childNodes[i]);
  }
}

// first traversal
function firstWalk(node){
  console.log("firstWalk");
  // post order traversal
  for(var i=0; i<node.childNodes.length; i++){
    firstWalk(node.childNodes[i]);
  }

  // if no children
  if(node.isLeaf()){
    if(!node.isLeftMost())
      node.x = node.previousSibling.x + 1;
    else
      node.x = 0;
  }
  // if just one child
  else if (node.childNodes.length === 1){
    if(node.isLeftMost())
      node.x = node.childNodes[0].x;
    else{
      node.x = node.previousSibling.x + 1;
      node.mod = node.x - node.childNodes[0].x;
    }
  }
  // for multiple children
  else{
    var mid = (node.getLeftMostChild().x + node.getRightMostChild().x) / 2;
    if(node.isLeftMost()){
      node.x = mid;
    }
    else{
      node.x = node.previousSibling.x + 1;
      node.mod = node.x - mid;
    }
  }

  if(node.childNodes.length > 0 && !node.isLeftMost())
    resolveConflicts(node);
}

function resolveConflicts(node){
  console.log("resolveConflicts");
  var minDistance = MIN_TREE_DISTANCE;
  var shiftValue = 0;

  var nodeContour = {};

  getLeftContour(node, 0, nodeContour);

  var sibling = node.parentNode.getLeftMostChild();

  while(sibling !== null && sibling !== node){
    var siblingContour = {};
    getRightContour(sibling, 0, siblingContour);

    var max_siblingContour = Math.max.apply(null, Object.keys(siblingContour));
    var max_nodeContour = Math.max.apply(null, Object.keys(nodeContour));

    for(var level = node.depth + 1; level <= Math.min(max_siblingContour, max_nodeContour); level++){
      console.log("========called========");
      console.log("max_node: " + max_nodeContour);
      console.log("max_sibling: " + max_siblingContour);
      console.log(nodeContour);
      node.show();
      max_siblingContour = Math.max.apply(null, Object.keys(siblingContour));
      max_nodeContour = Math.max.apply(null, Object.keys(nodeContour));
      var distance = nodeContour[level] - siblingContour[level];
      if(distance + shiftValue < minDistance){
        shiftValue = minDistance - distance;
      }
    }

    if(shiftValue > 0){
      node.x += shiftValue;
      node.mod += shiftValue;

      centerNodesBetween(node, sibling);

      shiftValue = 0;
    }

    sibling = sibling.nextSibling;
  }
}

function centerNodesBetween(leftNode, rightNode){
  console.log("centerNodesBetween");
  var rightIndex = rightNode.parentNode.childNodes.indexOf(rightNode);
  var leftIndex = leftNode.parentNode.childNodes.indexOf(leftNode);

  var numNodesBetween = (rightIndex - leftIndex) - 1;

  if(numNodesBetween > 0){
    var distanceBetween = (leftNode.x - rightNode.x) / (numNodesBetween + 1);

    var count = 1;
    for(var i=leftIndex+1; i<rightIndex; i++){
      var middleNode = leftNode.parentNode.childNodes[i];

      var desiredX = rightNode.x + (distanceBetween * count);

      var offset = desiredX - middleNode.x;
      middleNode.x += offset;
      middleNode.mod += offset;

      count++;
      console.log("count++");
    }

    resolveConflicts(leftNode);
  }
}

function getLeftContour(node, modSum, contour){
  console.log(contour);
  console.log("getLeftContor");
  if(!contour.hasOwnProperty(node.depth))
    contour[node.depth] = node.x + modSum;
  else
    contour[node.depth] = Math.min(contour[node.depth], node.x + modSum);

  modSum += node.mod;

  for(var i=0; i<node.childNodes.length; i++){
    getLeftContour(node.childNodes[i], modSum, contour);
  }
}
function getRightContour(node, modSum, contour){
  console.log(contour);
  console.log("getRightContor");
  if(!contour.hasOwnProperty(node.depth))
    contour[node.depth] = node.x + modSum;
  else
    contour[node.depth] = Math.max(contour[node.depth], node.x + modSum);

  modSum += node.mod;

  for(var i=0; i<node.childNodes.length; i++){
    getRightContour(node.childNodes[i], modSum, contour);
  }
}

function thirdWalk(node, modSum){
  console.log("thirdWalk");
  node.x += modSum;
  modSum += node.mod;

  for(var i=0; i<node.childNodes.length; i++){
    thirdWalk(node.childNodes[i], modSum);
  }
}
