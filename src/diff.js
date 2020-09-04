const ATTRS = "ATTRS";
const TEXT = "TEXT";
const REMOVE = "REMOVE";
const REPLACE = "REPLACE";
let Index = 0;

function diff(oldTree, newTree) {
  let patchers = {};
  let index = 0; //  这个index表示是第几层的dom
  walk(oldTree, newTree, index, patchers);
  return patchers;
}

//  判断是否是字符串类型
function isString(node) {
  return Object.prototype.toString.call(node) === "[object String]";
}

function diffAttr(oldAttrs, newAttrs) {
  let patch = {};
  //  判断老的属性和新的属性的关系
  for (let key in oldAttrs) {
    if (oldAttrs[key] !== newAttrs[key]) {
      patch[key] = newAttrs[key]; //  newAttrs[key]有可能为undefined
    }
  }
  // 老节点没有新节点的属性
  for (let key in newAttrs) {
    if (!oldAttrs.hasOwnProperty(key)) {
      patch[key] = newAttrs[key];
    }
  }

  return patch;
}

function diffChildren(oldChildren, newChildren, patches) {
  // 比较老的第一个和新的第一个
  oldChildren.forEach((child, idx) => {
    // 索引不应该是index了 ------------------
    // index 每次传递给waklk时 index是递增的,所有的都基于一个序号来实现
    walk(child,newChildren[idx],++Index,patches)
  });
}

//  index被私有化到walk作用域内
function walk(oldNode, newNode, index, patches) {
  let currentPatch = []; //  每个元素都有一个补丁对象
  if (!newNode) {
    //  没有新节点就删除
    currentPatch.push({ type: REMOVE, index });
  } else if (isString(oldNode) && isString(newNode)) {
    // 判断是文本节点
    if (oldNode !== newNode) {
      currentPatch.push({ type: TEXT, text: newNode });
    }
  } else if (oldNode.type === newNode.type) {
    //  比较属性是否有更改
    let attrs = diffAttr(oldNode.props, newNode.props);
    if (Object.keys(attrs).length>0) {
      currentPatch.push({ type: ATTRS, attrs });
    }
    //  如果有子节点 遍历子节点
    diffChildren(oldNode.children, newNode.children, patches);
  } else {
    //  节点被替换情况
    currentPatch.push({ type: REPLACE, newNode });
  }
  if (currentPatch.length > 0) {
    //  当前元素有补丁包
    //  将元素和补丁对应起来 放到大补丁包中
    patches[index] = currentPatch;
  }
}

export default diff;
