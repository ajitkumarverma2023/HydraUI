import React from 'react';
import _isEmpty from 'lodash/isEmpty'
import _toLower from 'lodash/toLower';

const ENTER_KEY = 'Enter';
const SPACE_KEY = ' ';
const HIGHLIGHT_MARK_END ='</span>';
const isSelectionKeyPressed = key => key && (key === ENTER_KEY || key === SPACE_KEY);

// case insensitive matching all occurrences
const isMatched = (item, searchPattern) => {
  const itemIsIncluded = _toLower(item).indexOf(_toLower(searchPattern)) >= 0;
  return _isEmpty(searchPattern) || itemIsIncluded;
};

const markItem = (item, searchPattern, highlightClassName) => {
  if (!item) {
    return null;
  }
  if (!searchPattern || searchPattern.length === 0) {
    return item;
  }
  const HIGHLIGHT_MARK_START = `<span class=${highlightClassName}>`;
  let endingIndex = 0;
  const searchPatternLength = searchPattern.length;
  let markedText = item;
  while (true) {
    const startIndex = (markedText).indexOf(searchPattern, endingIndex);
    if (startIndex === -1) {
       break;
    }
    const actualText = markedText.substr(startIndex, searchPatternLength);
    const replacementText = `${HIGHLIGHT_MARK_START}${actualText}${HIGHLIGHT_MARK_END}`;
    const beginningText = startIndex > 0 ?  markedText.slice(0,startIndex) : '';
    const endingText = markedText.slice(startIndex + searchPatternLength);
    markedText = beginningText + replacementText + endingText;
    endingIndex = startIndex + searchPatternLength + HIGHLIGHT_MARK_START.length + HIGHLIGHT_MARK_END.length;
  }
  return <div dangerouslySetInnerHTML={{ __html: markedText }}></div>;
};

// exact matching
const isMatchedExactly = (item, searchPattern) => {
  const itemIsIncluded = item && item.indexOf(searchPattern) >= 0;
  return _isEmpty(searchPattern) || itemIsIncluded;
};

// mark all matching TreeItems and the parents of the matchingTreeItems
const filterTreeItems = (data, filterValue) => {
  if (filterValue !== undefined && filterValue.length === 0) {
    return;
  }
  let hasMatches = false;
  for (let treeIndex = 0; treeIndex < data.length; treeIndex += 1) {
      const isTextMatched = isMatchedExactly(data[treeIndex].text, filterValue);
      if (isTextMatched) {
        hasMatches = true;
        data[treeIndex].isMatched = true;
      }
      if (data[treeIndex].isBranch) {
        const hasNodeMatches = filterTreeItems(data[treeIndex].nodes, filterValue);
        if (hasNodeMatches) {
          data[treeIndex].childIsMatched = true;
          hasMatches = true;
        }
      }
  }
  return hasMatches;
};

const isNodeExpanded = node => node.state && node.state.expanded;
const nodeHasChildren = node => node.children && node.children.length;
// return array of opened items in the Tree, all at one level
const getFlattenedTree = (nodes, parents = []) =>
  nodes.reduce((flattenedTree, node) => {
    const deepness = parents.length;
    const nodeWithHelpers = {...node, deepness, parents};

    if (!nodeHasChildren(node) || !isNodeExpanded(node)) {
      return [...flattenedTree, nodeWithHelpers];
    }

    return [...flattenedTree, nodeWithHelpers, ...getFlattenedTree(node.children, [...parents, node.id])];
  }, []);

// return array of all items in the Tree, all at one level
const nodeHasNodes = node => node.nodes && node.nodes.length;
const getWholeFlattenedTree = (nodes, parents = []) =>
nodes.reduce((flattenedTree, node) => {
  const deepness = parents.length;
  const nodeWithHelpers = {...node, deepness, parents};

  if (!nodeHasNodes(node)) {
    return [...flattenedTree, nodeWithHelpers];
  }

  return [...flattenedTree, nodeWithHelpers, ...getWholeFlattenedTree(node.nodes, [...parents, node.id])];
}, []);


export {
  isSelectionKeyPressed,
  isMatched,
  isMatchedExactly,
  markItem,
  filterTreeItems,
  getFlattenedTree,
  getWholeFlattenedTree,
};