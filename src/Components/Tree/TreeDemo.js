import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import _findIndex from 'lodash/findIndex';
import _cloneDeep from 'lodash/cloneDeep';
import _uniqueId from 'lodash/uniqueId';
import ic_folder from '@nokia-csf-uxr/ccfk-assets/icons/legacy/folder.svg';
import ic_folder_open from '@nokia-csf-uxr/ccfk-assets/icons/legacy/folder_open.svg';
import ic_file from '@nokia-csf-uxr/ccfk-assets/icons/legacy/file.svg';

import ChevronRightIcon from '@nokia-csf-uxr/ccfk-assets/legacy/ChevronRightIcon';
import ChevronLeftIcon from '@nokia-csf-uxr/ccfk-assets/legacy/ChevronLeftIcon';

// Dropdown Icons for legacy and latest themes
//import ArrowTriangleDownIcon from '@nokia-csf-uxr/ccfk-assets/legacy/ArrowTriangleDownIcon';
import ArrowTriangleDownIconLatest from '@nokia-csf-uxr/ccfk-assets/latest/TriangleArrowDownFillIcon';
import ic_folder_latest from '@nokia-csf-uxr/ccfk-assets/icons/latest/folder-fill.svg';
import ic_folder_open_latest from '@nokia-csf-uxr/ccfk-assets/icons/latest/folder.svg';

import Tree from '@nokia-csf-uxr/ccfk/Tree';
import Button from '@nokia-csf-uxr/ccfk/Button';
import Dialog from '@nokia-csf-uxr/ccfk/Dialog';
import Checkbox from '@nokia-csf-uxr/ccfk/Checkbox';
import IconButton from '@nokia-csf-uxr/ccfk/IconButton';
import Typography from '@nokia-csf-uxr/ccfk/Typography';
import 
  FilterField,
  { 
    FilterFieldIcon,
    FindMatchContainer,
    HIGHLIGHT_CLASSNAME,
    SELECTED_HIGHLIGHT_CLASSNAME
  } from '@nokia-csf-uxr/ccfk/FilterField';
import Icon from '@nokia-csf-uxr/ccfk/Icon';
import TextInput from '@nokia-csf-uxr/ccfk/TextInput';
import Label from '@nokia-csf-uxr/ccfk/Label';

import {
  TreeBranch,
  TreeIcon,
  TreeText,
  TreeNode,
  TreeDropDownButton,
  TreeContainer,
  TreeTitle,
  TreeFooter,
  TreeFilterContainer,
  TreeMoreButton,
  TreeMoreButtonItem,
  TreeMoreButtonItemText,
} from '@nokia-csf-uxr/ccfk/Tree';
import {
  DialogTitle,
  DialogContent,
  DialogFooter,
} from '@nokia-csf-uxr/ccfk/Dialog';
import {
  CheckboxLabelContent
} from '@nokia-csf-uxr/ccfk/Checkbox';
import { AlertBar } from '@nokia-csf-uxr/ccfk/Alert';
import { TextInputLabelContent } from '@nokia-csf-uxr/ccfk/TextInput';
import { markItem, filterTreeItems} from './common';


// in rem units
const TITLE_HEIGHT = 1.5;
const FOOTER_HEIGHT = 4;
const FILTER_HEIGHT = 3.375;
const FILTER_MATCHES_HEIGHT = 2.3125; 
const DIV_PADDING_HEIGHT = 1;
const FOOTER_DIVIDER_HEIGHT = 0.0625;
const ROW_HEIGHT = 2;

const DIALOG_STYLE = {
  top: 'calc((100vh - 16.25rem) / 2)',
  height: '17.0rem',
  minHeight: '17.0rem',
  left: 'calc((100vw - 25rem) / 2)',
  right: 'calc((100vw - 25rem) / 2)',
  width: '25rem'
};

const ENTER_KEY = 'Enter';
const SPACE_KEY = ' ';
const TAB = 'Tab';
const ARROW_LEFT = 'ArrowLeft';
const ARROW_RIGHT = 'ArrowRight';
const isSelectionKeyPressed = key => key && (key === ENTER_KEY || key === SPACE_KEY);
const isLeftRightArrowPressed = key => key &&( key === ARROW_LEFT || key === ARROW_RIGHT);

/**
 * Example of a Tree with optional Find and drag and drop of treeitems.
 */
const TreeDemo = (props) => {
  const { useFilter, allowDnd, dndDropIsOverTimeout, allowDuplicateTreeItemNames, preventFocusHandling, isLegacy } = props;
  // const TREE_DATA = getTreeData({ isLegacy });
   const [treeData, setTreeData] = useState('');  // complete Tree
  const [branchOpenStates, setBranchOpenStates] = useState([]); // open state of each TreeBranch
  const [moreButtonOpenStates, setMoreButtonOpenStates] = useState([]); // open states of each TreeItem context menu
  const [selectedNodeId, setSelectedNodeId] = useState(undefined); // selected Tree item id
  const [sortNewFolder, setSortNewFolder] = useState(false);
  const [showAddBranchDialog, setShowAddBranchDialog] = useState(false);
  const [showAddTreeItemDialog, setShowAddTreeItemDialog] = useState(false);
  const [showRenameTreeItemDialog, setShowRenameTreeItemDialog] = useState(false);
  const [showDeleteTreeItemDialog, setShowDeleteTreeItemDialog] = useState(false);
  const [addBranchItem, setAddBranchItem] = useState(false);
  const [value, setValue] = useState(''); // used in addBranchDialog TextInput
  const [nodeValue, setNodeValue] = useState(''); // used in Dialog to add or rename TreeItem
  const [filterFieldValue, setFilterFieldValue] = useState(''); // value of text typed during filtering
  const [selectedIndex, setSelectedIndex] = useState(undefined); 
  const treeItemToUpdate = useRef(undefined); // id of current TreeItem being updated
  const treeMatchedCount = useRef(0); // number of matches when filtering
  const treeRef = useRef();
  const listRef = useRef();
  const filterFieldInputRef = useRef();

  const FOLDER_ICONS = isLegacy ? { collapsedIcon: ic_folder, expandedIcon: ic_folder_open } : { collapsedIcon: ic_folder_latest, expandedIcon: ic_folder_open_latest };

  // initialize array to hold tree branchs open/close state
  const initializeStates = (data, dataArray = []) => {
    for (let treeIndex = 0; treeIndex < data.length; treeIndex += 1) {
      const treeItem = data[treeIndex];
      if (treeItem.isBranch) {
        dataArray.push({
          id: treeItem.id,
          isOpen: treeItem.isOpen !== undefined ? treeItem.isOpen : false,
        });
        if (treeItem.nodes && treeItem.nodes.length > 0) {
          initializeStates(treeItem.nodes, dataArray);
        }
      }
    }
    setBranchOpenStates(dataArray);
  }
  useEffect(() => {
    // array to hold branch open state
    initializeStates('');
  }, []); // on mount only

  const isBranchOpen = (id) => {
    const currentIndex = _findIndex(branchOpenStates, elem => elem.id === id);
    return currentIndex >= 0 && branchOpenStates[currentIndex].isOpen;
  }
  // update the isOpen branch state
  const updateBranchState = (id, isBranchOpen) => {
    const newStates = _cloneDeep(branchOpenStates);
    const currentIndex = _findIndex(newStates, elem => elem.id === id);
    newStates[currentIndex].isOpen = isBranchOpen;
    setBranchOpenStates(newStates);
  };
  // toggle the isOpen branch state
  const toggle = (id) => {
    const newStates = _cloneDeep(branchOpenStates);
    const currentIndex = _findIndex(newStates, elem => elem.id === id);
    const currentOpenState = newStates[currentIndex].isOpen;
    newStates[currentIndex].isOpen = !currentOpenState;
    setBranchOpenStates(newStates);
  }
  const toggleIsOpen = (id) => (event) => {
    const { type, key } = event;
    switch (type) {
      case 'keydown':
        if (isSelectionKeyPressed(key)) {
          event.stopPropagation();
          event.preventDefault();
          toggle(id);
          setSelectedNodeId(id);
        } else if (isLeftRightArrowPressed(key)) {
          event.preventDefault();
          key === ARROW_LEFT && event.stopPropagation();
          if (isBranchOpen(id) && key === ARROW_LEFT) {
            // open and left arrow, close node
            event.stopPropagation();
            updateBranchState(id, false);
          } else if (!isBranchOpen(id) && key === ARROW_RIGHT) {
            // closed and right arrow, open node
            event.stopPropagation();
            updateBranchState(id, true);
          }
        }
      break;
      case 'dblclick':
        toggle(id);
      break;
      case 'click':
        event.stopPropagation();
        toggle(id);
      break;
      default:
    }
  };
  const handleClickEvent = (id) => (e) => {
    setSelectedNodeId(id);
    e.stopPropagation();
  };
  const handleNodeKeyDownEvent = (id) => (event) => {
    const { key, type } = event;
    if (type === 'keydown') {
      if (isSelectionKeyPressed(key)) {
        setSelectedNodeId(id);
        event.stopPropagation();
        event.preventDefault();
      } else if (isLeftRightArrowPressed(key)) {
        event.stopPropagation();
        event.preventDefault();
      }
    }
  };

  const isFiltering = () => filterFieldValue && filterFieldValue.length > 0;
  // count the number of matched filtered items
  const countMatches = (data, searchText) => {
    for (let treeIndex = 0; treeIndex < data.length; treeIndex += 1) {
      const treeItem = data[treeIndex];
      if (treeItem.isMatched) {
        // the searchTerm may appear multiple times per tree node name
        const pattern = new RegExp(`${searchText}`, 'g');
        const appearanceNumber = treeItem.text.match(pattern, "").length;
        treeMatchedCount.current +=  appearanceNumber;
      }
      if (treeItem.nodes && treeItem.nodes.length > 0) {
        countMatches(treeItem.nodes, searchText);
      }
    }
  };
  // set all branches with filtered children to open
  const updateBranchOpenStates = (data, newStates) => {
    for (let treeIndex = 0; treeIndex < data.length; treeIndex += 1) {
      const treeItem = data[treeIndex];
      if (treeItem.childIsMatched) {
        const currentIndex = _findIndex(newStates, elem => elem.id === treeItem.id);
        newStates[currentIndex].isOpen = true;
        if (treeItem.nodes && treeItem.nodes.length > 0) {
          updateBranchOpenStates(treeItem.nodes, newStates);
        }
      }
    }
  };
  const filterData = (filterText, data) => {
    treeMatchedCount.current = 0;
    const treeDataCopy = _cloneDeep(data);
    filterTreeItems(treeDataCopy, filterText);
    const newStates = _cloneDeep(branchOpenStates);
    updateBranchOpenStates(treeDataCopy, newStates);
    setBranchOpenStates(newStates);
    countMatches(treeDataCopy, filterText);
  }
  // get matching filtered tree items
 
  // scroll the container to show the selected highlighted search text
  const scrollToView = (selectHighlightedTextEl) => {
    if (listRef.current && treeRef.current) {
      const listRect = listRef.current.getBoundingClientRect();
      const highlightedBlockRect =  selectHighlightedTextEl.getBoundingClientRect();

      // check if new item is hidden below the list or above the list
      const isInvisibleBelowList = (highlightedBlockRect.top + highlightedBlockRect.height) > (listRect.height + listRect.top);
      const isInvisibleAboveList = highlightedBlockRect.top < listRect.top;

      // adjust scrollTop based on the condition.
      if (isInvisibleBelowList) {
        const delta = (highlightedBlockRect.top + highlightedBlockRect.height) - (listRect.height + listRect.top);
        listRef.current.scrollTop = listRef.current.scrollTop  + delta + 60;
      } else if (isInvisibleAboveList) {
        const delta = listRect.top - highlightedBlockRect.top + 60;
        listRef.current.scrollTop = listRef.current.scrollTop - delta > 0 ? listRef.current.scrollTop - delta : 0;
      }
    }
  }

  const highlightSelectedFindText = (index) => {
    if (listRef.current && treeRef.current) {
      const highlightedTextArray = treeRef.current.querySelectorAll(`span.${HIGHLIGHT_CLASSNAME}`);
      // remove selected highlight for all searched text.
      if (highlightedTextArray.length > 0) {
        highlightedTextArray.forEach(element => element.classList.remove(SELECTED_HIGHLIGHT_CLASSNAME));
        const selectHighlightedTextEl = highlightedTextArray[index];
        // add the selected highlight for new selected text.
        selectHighlightedTextEl.classList.add(SELECTED_HIGHLIGHT_CLASSNAME);
  
        // scroll the element into view.
        scrollToView(selectHighlightedTextEl);
      }
    }
  }

  const selectNextMatch = () => {
    let nextMatch;
    if (selectedIndex == null) {
      nextMatch = 0
    } else {
      nextMatch = selectedIndex + 1 > treeMatchedCount.current -1 ? 0 : selectedIndex + 1;
    }
    setSelectedIndex(nextMatch);
    highlightSelectedFindText(nextMatch);
  }
  const selectPreviousMatch = () => {
    let previousMatch;
    if (selectedIndex == null) {
      previousMatch = treeMatchedCount.current -1;
    } else {
      previousMatch = selectedIndex - 1 < 0 ? treeMatchedCount.current -1 : selectedIndex - 1;
    }
    setSelectedIndex(previousMatch);
    highlightSelectedFindText(previousMatch);
  }
  
  const clearFind = () => {
    const highlightedTextArray = treeRef.current.querySelectorAll(`span.${HIGHLIGHT_CLASSNAME}`);
    // remove selected highlight for all searched text.
    highlightedTextArray.forEach(element => {
      element.classList.remove(HIGHLIGHT_CLASSNAME);
      element.classList.remove(SELECTED_HIGHLIGHT_CLASSNAME);
    });
    treeMatchedCount.current = 0;
    setSelectedIndex(0); 
    setFilterFieldValue('');
  
  }
  const handleClearButtonCLick = () => {
    setValue('');
    clearFind();
    filterFieldInputRef.current.focus()
  }

  const handleFilterTree = (event) => {
    const filterValue = event.target.value;
    setSelectedIndex(0);
    setFilterFieldValue(filterValue);
    filterData(filterValue, treeData);

    setTimeout(() => highlightSelectedFindText(0));
  };


  const treeFilter = (
    <TreeFilterContainer>
      <FilterField
        variant={isLegacy ? 'underlined' : 'outlined-small'}
        textInputProps={{
          placeholder: 'Search',
          showClearButton: true,
          inputProps: {
            ref: filterFieldInputRef,
            'aria-label': 'Search',
            style: { paddingLeft: '2.0rem' },
          },
          clearButtonProps: {
            'aria-label': "Clear Find",
            onClick: () => {
              handleClearButtonCLick();
            }
          },
        }}
        value={filterFieldValue}
        onChange={handleFilterTree}
        renderIcon={<FilterFieldIcon />}
      />
      {isFiltering() &&
        <>
          {treeMatchedCount.current > 0 &&
            <FindMatchContainer aria-live aria-label={`${treeMatchedCount.current} matched found`} matchNumberContent={`${selectedIndex + 1 || 0}/${treeMatchedCount.current}`}>
              {treeMatchedCount.current > 0 &&
                (
                  <>
                    <IconButton size='small' aria-label={`Next previous item. Number ${selectedIndex + 1} matched item focused`} onClick={selectPreviousMatch}>
                      <ChevronLeftIcon />
                    </IconButton>
                    <IconButton size='small' aria-label={`Next next item. Number ${selectedIndex + 1} matched item focused`} onClick={selectNextMatch}>
                      <ChevronRightIcon />
                    </IconButton>
                  </>
                )
              }
            </FindMatchContainer>
          }
          {treeMatchedCount.current === 0 &&
            <>
              <TreeText aria-label=" No matching items" style={{ paddingTop: '1rem', textAlign: 'center' }}>No matching items</TreeText>
              <br />
              <TreeText aria-label="Try to adjust your criteria to find the items" style={{ textAlign: 'center', whiteSpace: 'pre-line' }}>
                Try to adjust your criteria to find the items.
              </TreeText>
            </>
          }
        </>
      }
     </TreeFilterContainer>
  );

  // Add TreeBranch to main level of Tree
  const handleAddBranchClick = () => {
    const newId = `branch-${value}`;
    // add folder to Tree
    const newTreeData = _cloneDeep(treeData);
    const newTreeFolder = { id: newId, text: value, isBranch: true, level: 0, ...FOLDER_ICONS, posinset: 1, setsize: 1, nodes: []};
    newTreeData.push(newTreeFolder);
    let sortedTreeData = newTreeData;
    if (sortNewFolder) {
      // sort tree
      sortedTreeData = newTreeData.sort((a,b) => {
        const x = a.text.toUpperCase();
        const y = b.text.toUpperCase();
        return x === y ? 0 : x > y ? 1 : -1;
    });
    }
    setTreeData(sortedTreeData);
    // add open state
    const newStates = _cloneDeep(branchOpenStates);
    const newFolderState = { id: newId, isOpen: false }
    newStates.push(newFolderState);
    setBranchOpenStates(newStates);
    // close Dialog
    setShowAddBranchDialog(false);
    // clear branch value
    setValue('');
  }
  // Dialog to add TreeBranch to main level (0) of Tree
  const addBranchDialog = (
    <Dialog ariaHideApp={false} isOpen style={{ content: DIALOG_STYLE }}>
      <DialogTitle title="Add Folder"/>
      <DialogContent>
        <Label variant="vertical-layout">
          <TextInputLabelContent required>
            Folder name
          </TextInputLabelContent>
        </Label>
        <TextInput
          autoFocus
          placeholder="Folder Name"
          onChange={(event) => { setValue(event.target.value); }}
          value={value}
        />
        <div style={{ height: '0.5rem' }}/>
        <Label>
          <Checkbox
            checked={sortNewFolder}
            onChange={(event) => { event.persist(); setSortNewFolder(event.target.checked); }}
            inputProps={{'aria-label': 'Sort main Tree branches'}}
          />
          <CheckboxLabelContent>Sort main Tree branches</CheckboxLabelContent>
        </Label>
      </DialogContent>
      <DialogFooter>
          <Button onClick={()=>{ setShowAddBranchDialog(false); setValue(''); }}>CANCEL</Button>
          <Button onClick={handleAddBranchClick}>ADD</Button>
      </DialogFooter>
    </Dialog>
  );

  const addTreeNode = (data, branchId,  nodeName) => {
    if (!data || data[0] === undefined) return [];
    for (let treeIndex = 0; treeIndex < data.length; treeIndex += 1) {
      const treeItem = data[treeIndex];
      if (treeItem.id === branchId) {
        //replace spaces with dashes for id
        const newId = `${branchId}-${addBranchItem ? 'branch' : 'node'}-${nodeName.replace(/ /gi, '-')}-${_uniqueId('branchId')}`;
        treeItem.nodes.push({
          id: newId,
          text: nodeName,
          icon: addBranchItem ? undefined : ic_file,
          collapsedIcon: addBranchItem ? ic_folder : undefined,
          expandedIcon: addBranchItem ? ic_folder_open : undefined,
          isBranch: addBranchItem,
          level: addBranchItem ? treeItem.level + 1 : undefined,
        });
        // if adding a Branch, add entry to open states array
        if (addBranchItem) {
          const newStates = _cloneDeep(branchOpenStates);
          const newFolderState = { id: newId, isOpen: false }
          newStates.push(newFolderState);
          setBranchOpenStates(newStates);
        }
        return;
      }
      if (treeItem.nodes && treeItem.nodes.length > 0) {
        addTreeNode(treeItem.nodes, branchId, nodeName);
      }
    }
    return;
  };

  // Add a new item to the Tree
  const handleAddNodeClick = (treeItem) => () => {
    const newTreeData = _cloneDeep(treeData);
    // find branch in data and add a new node
    addTreeNode(newTreeData, treeItemToUpdate.current,  nodeValue);
    setTreeData(newTreeData);
    // close dialog
    setShowAddTreeItemDialog(false);
    // clear folder value
    setNodeValue('');
    // if filtering, rename in that dataset
    if (isFiltering()) {
      filterData(filterFieldValue, newTreeData);
    }
    // reset branch indicator
    setAddBranchItem(false);
  };

  // delete the entire contents of Tree item with id
  const deleteTreeItem = (data, id) => {
    if (!data || data[0] === undefined) return [];
    for (let treeIndex = 0; treeIndex < data.length; treeIndex += 1) {
      const treeItem = data[treeIndex];
      // remove the treeitem with matching id
      if (treeItem.id === id) {
        data.splice(treeIndex,1);
        return;
      }
      if (treeItem.nodes && treeItem.nodes.length > 0) {
        deleteTreeItem(treeItem.nodes, id);
      }
    }
    return;
  };
  // Delete Branch along with all its sub nodes
  const handleDeleteTreeItemClick = (branchId) => (event) => {
    const newTreeData = _cloneDeep(treeData);
    // find branchId in treeData and delete the branch entry
    deleteTreeItem(newTreeData, branchId);
    setTreeData(newTreeData);
    // if filtering, delete from that dataset
    if (isFiltering()) {
      filterData(filterFieldValue, newTreeData);
    }
    // close dialog
    setShowDeleteTreeItemDialog(false);
  };
  // return the id and text values of the nodes and nested nodes in data
  const getBranchContents = (data, returnedItems = []) => {
    if (!data || data[0] === undefined) return [];
    for (let treeIndex = 0; treeIndex < data.length; treeIndex += 1) {
      const treeItem = data[treeIndex];
      returnedItems.push({
        id: treeItem.id,
        text: treeItem.text,
      });
      if (treeItem.nodes && treeItem.nodes.length > 0) {
        getBranchContents(treeItem.nodes, returnedItems);
      }
    }
    return returnedItems;
  };

  // search all data nodes and nested nodes and return the node with the matching id
  const getTreeItem = (data, id, returnedItems = []) => {
    if (!data || data[0] === undefined) return [];
    for (let treeIndex = 0; treeIndex < data.length; treeIndex += 1) {
      const treeItem = data[treeIndex];
      if (treeItem.id === id) {
        returnedItems.push(treeItem);
      }
      if (treeItem.nodes && treeItem.nodes.length > 0) {
        getTreeItem(treeItem.nodes, id, returnedItems);
      }
    }
    return returnedItems;
  };
  // Delete a TreeBranch and all sub nodes
  const renderDeleteTreeItemDialog = () => {
    const branchContents = getTreeItem(treeData, treeItemToUpdate.current);
    const branchItems = getBranchContents(branchContents);
    return (
      <Dialog ariaHideApp={false} isOpen style={{ content: DIALOG_STYLE }}>
        <AlertBar type="CONFIRM" />
        <DialogTitle title={`Do you want to delete id: ${treeItemToUpdate.current} name: '${branchItems[0].text}'?`}/>
        <DialogContent>
          <Typography typography="BODY">Continuing will permanently remove:</Typography>
          {branchItems.map(branchItem => {return <Typography key={`${branchItem.id}`} typography="BODY">{branchItem.text}</Typography>})}
        </DialogContent>
        <DialogFooter>
            <Button onClick={()=>{ setShowDeleteTreeItemDialog(false); }}>CANCEL</Button>
            <Button onClick={handleDeleteTreeItemClick(treeItemToUpdate.current)}>DELETE</Button>
        </DialogFooter>
      </Dialog>
    );
  }

  // find the id and change the name
  const renameTreeItem = (data, id,  name) => {
    if (!data || data[0] === undefined) return [];
    for (let treeIndex = 0; treeIndex < data.length; treeIndex += 1) {
      const treeItem = data[treeIndex];
      // remove the treeitem with matching id
      if (treeItem.id === id) {
        // update with new name
        treeItem.text = name;
        return;
      }
      if (treeItem.nodes && treeItem.nodes.length > 0) {
        renameTreeItem(treeItem.nodes, id, name);
      }
    }
    return;
  };
  // return true if the text exists in the Tree data text field
  const doesTreeNameExist = (data, text, nameExists = [false]) => {
    if (!data || data[0] === undefined) return [false];
    for (let treeIndex = 0; treeIndex < data.length; treeIndex += 1) {
      const treeItem = data[treeIndex];
      if (treeItem.text === text) {
        nameExists[0] = true;
      }
      if (treeItem.nodes && treeItem.nodes.length > 0) {
        doesTreeNameExist(treeItem.nodes, text, nameExists);
      }
    }
    return nameExists[0];
  };
  // update error and errorMessage properties of the tree item
  const updateTreeItemErrorMessage = (data, id, error, errorMessage = '') => {
    if (!data || data[0] === undefined) return [];
    for (let treeIndex = 0; treeIndex < data.length; treeIndex += 1) {
      const treeItem = data[treeIndex];
      if (treeItem.id === id) {
        // update with new values
        treeItem.error = error;
        treeItem.errorMessage = errorMessage;
        return;
      }
      if (treeItem.nodes && treeItem.nodes.length > 0) {
        updateTreeItemErrorMessage(treeItem.nodes, id, error, errorMessage);
      }
    }
    return;
  };
  // rename existing Tree item
  const handleRenameClick = (treeItem) => () => {
    const newTreeData = _cloneDeep(treeData);
    // check for duplicate name
    const alreadyExists = doesTreeNameExist(newTreeData, nodeValue);
    if (alreadyExists && !allowDuplicateTreeItemNames) {
      // set error state and don't allow the rename
      updateTreeItemErrorMessage(newTreeData, treeItem[0].id, true, `'${nodeValue}' already exists in the Tree. Try again.`);
    } else {
      // clear any error messages
      updateTreeItemErrorMessage(newTreeData, treeItem[0].id, false, '');
      // find and update name of the tree item
      renameTreeItem(newTreeData, treeItemToUpdate.current,  nodeValue);
      // if filtering, rename in that dataset
      if (filterFieldValue && filterFieldValue.length) {
        filterData(filterFieldValue, newTreeData);
      }
    }
    // clear value used in Dialog
    setNodeValue('');
    // udpate dataset with new values
    setTreeData(newTreeData);
    // close dialog
    setShowRenameTreeItemDialog(false);
  };

  const renderDialog = (dialogAction, setShowDialog, handleAction) => {
    const treeItem = getTreeItem(treeData, treeItemToUpdate.current);
    const treeItemName = treeItem[0].text;
    const isAdd = dialogAction === 'Add';
    const dialogTitle = isAdd ? 'Add Tree Item' : `${dialogAction} '${treeItemName}'`;
    return (
      <Dialog ariaHideApp={false} isOpen style={{ content: DIALOG_STYLE }}>
        <DialogTitle title={dialogTitle}/>
        <DialogContent>
          <Label variant="vertical-layout">
            <TextInputLabelContent required>Name</TextInputLabelContent>
          </Label>
          <TextInput
            autoFocus
            placeholder="Name"
            onChange={(event) => { setNodeValue(event.target.value); }}
            value={nodeValue}
          />
          <div style={{ height: '0.5rem' }}/>
          {isAdd &&
            <Label>
              <Checkbox
                checked={addBranchItem}
                onChange={(event) => { event.persist(); setAddBranchItem(event.target.checked); }}
                inputProps={{'aria-label': 'New Tree Item is Tree Branch'}}
              />
              <CheckboxLabelContent>Branch</CheckboxLabelContent>
            </Label>
          }
        </DialogContent>
        <DialogFooter>
            <Button onClick={()=>{ setShowDialog(false); setNodeValue(''); }}>CANCEL</Button>
            <Button onClick={handleAction(treeItem)}>{isAdd ? "ADD" : "RENAME"}</Button>
        </DialogFooter>
      </Dialog>
    );
  }

  // find parent (branch) of childId
  const findParent = (data, childId, dataArray = []) => {
    for (let treeIndex = 0; treeIndex < data.length; treeIndex += 1) {
      const treeItem = data[treeIndex];
      if (treeItem.isBranch) {
        const treeNodes = treeItem.nodes;
        for (let nodeIndex = 0; nodeIndex < treeNodes.length; nodeIndex += 1) {
          const nodeItem = treeNodes[nodeIndex];
          if (nodeItem.id === childId) {
            dataArray.push(treeItem);
            return dataArray;
          }
        }
        findParent(treeNodes,childId, dataArray);
      }
    }
    return dataArray;
  };
  // update any branch levels in the branches in newTreeItem
  const updateBranchLevels = (data, level) => {
    for (let treeIndex = 0; treeIndex < data.length; treeIndex += 1) {
      const treeItem = data[treeIndex];
      if (treeItem.isBranch) {
        treeItem.level = level + 1;
        if (treeItem.nodes && treeItem.nodes.length > 0) {
          updateBranchLevels(treeItem.nodes, level + 1);
        }
      }
    }
    return;
  }
  
  // add saved copy of dragged tree item to the Tree. If dragging to a TreeBranch and the branch is open,
  // add the dragged item to the branch children. Otherwise add after the dragged to item.
  const addItemToTree = (data, branchId, newTreeItem) => {
    if (!data || data[0] === undefined) return [];
    for (let treeIndex = 0; treeIndex < data.length; treeIndex += 1) {
      const treeItem = data[treeIndex];
      if (treeItem.id === branchId) {
        if (treeItem.isBranch && treeItem.nodes) {
          if (isBranchOpen(treeItem.id)) {
            // insert inside an opened Tree branch
            // update any levels in the branches that are moving
            updateBranchLevels(newTreeItem, treeItem.level);
            treeItem.nodes.unshift(newTreeItem[0]);
          } else {
            // insert after a closed tree branch (on the same level)
            const newTreeLevel = treeItem.level;
            updateBranchLevels(newTreeItem, treeItem.level - 1);
            // add newTreeItem to tree data after branchId
            data.splice(treeIndex + 1, 0, newTreeItem[0]);
          }
        } else {
            // if adding an item under a node, udpates the levels
            if (newTreeItem[0].isBranch) {
              const parentItemArray = findParent(treeData, data[treeIndex].id); // find branch parent to get correct level for insertion
              const parentItem = parentItemArray[0];
              parentItem && updateBranchLevels(newTreeItem, parentItem.level);
            }
            data.splice(treeIndex + 1, 0, newTreeItem[0]);
        }
        return;
      }
      if (treeItem.nodes && treeItem.nodes.length > 0) {
        addItemToTree(treeItem.nodes, branchId, newTreeItem);
      }
    }
    return;
  };
  // Drag and drop callback function
  const handleDndCallback = (dndData) => {
    const { draggedId, droppedOnToId } = dndData;
    // copy treedata
    const newTreeData = _cloneDeep(treeData);
    // get copy of tree item that is moving
    const savedTreeItemArray = getTreeItem(newTreeData, draggedId);
    // delete moving tree item from tree
    deleteTreeItem(newTreeData, draggedId);
    // add saved copy of dragged tree item to the Tree. If dragging to a TreeBranch and the branch is open,
    // add the dragged item to the branch children. Otherwise add after the dragged to item.
    addItemToTree(newTreeData, droppedOnToId, savedTreeItemArray);
    // if filtering, update that dataset
    if (filterFieldValue && filterFieldValue.length) {
      filterData(filterFieldValue, newTreeData);
    }
    // update treedata in state
    setTreeData(newTreeData);
  };
  // when dragging over the branch, open it
  const handleDndDropIsOverCallback = (id) => (dndData) => {
    if (dndData.isOver) {
      updateBranchState(id, true);
    }
  };

  // MoreButton list item was selected
  const handleMoreButtonItemEvent = moreButtonAction => (event) => {
    const { type, key } = event;
    const { id, contextMenuItem } = moreButtonAction;
    if (type === 'click' || (type === 'keydown' && isSelectionKeyPressed(key))) {
      if (contextMenuItem === 'Add Tree Item') {
        treeItemToUpdate.current = id;
        setShowAddTreeItemDialog(true);
      } else if (contextMenuItem === 'Delete') {
        treeItemToUpdate.current = id;
        setShowDeleteTreeItemDialog(true);
      } else if (contextMenuItem === 'Rename') {
        treeItemToUpdate.current = id;
        setShowRenameTreeItemDialog(true);
      } else if (contextMenuItem === 'Cancel Pending Action') {
        treeItemToUpdate.current = id;
        const newTreeData = _cloneDeep(treeData);
        updateTreeItemErrorMessage(newTreeData, id, false, '');
        setTreeData(newTreeData);
      }
    }
  };
  // MoreButton was opened; stop the event spreading to the rest of the Tree item
  const handleMoreButtonKeyDown = id => (event) => {
    const { key } = event;
    if (isSelectionKeyPressed(key)) {
      event.stopPropagation();
    } else if (key === TAB) {
      setMoreButtonOpenStateForId({ id, isOpen: false });
    }
  };
  const getMoreButtonOpenStateForId = (id) => {
    const moreButtonIndex = _findIndex(moreButtonOpenStates, elem => elem.id === id);
    return moreButtonIndex >= 0 && moreButtonOpenStates[moreButtonIndex].isOpen;
  };
  const setMoreButtonOpenStateForId = (data) => {
    const { id, isOpen } = data;
    const newMoreButtonOpenStates = _cloneDeep(moreButtonOpenStates);
    const moreButtonIndex = _findIndex(newMoreButtonOpenStates, elem => elem.id === id);
    if (moreButtonIndex > -1) {
      newMoreButtonOpenStates[moreButtonIndex].isOpen = isOpen;
    } else {
      // add new entry for this id
      newMoreButtonOpenStates.push(data);
    }
    setMoreButtonOpenStates(newMoreButtonOpenStates);
  };
  const renderContextMenu = (data) => {
    const { id, contextMenuItems } = data;
    return (
      <TreeMoreButton
        treeItemId={id}
        moreButtonProps={{
          isOpen: getMoreButtonOpenStateForId(id),
          'aria-label': `${id} context menu`,
          onOpen() {setMoreButtonOpenStateForId({id, isOpen: true})},
          onClose() {setMoreButtonOpenStateForId({id, isOpen: false})},
          onKeyDown: handleMoreButtonKeyDown(id),
        }}
      >
        {contextMenuItems.map((item, x) => {
          return (
            <TreeMoreButtonItem
              key={`id-${item}`}
              onClick={handleMoreButtonItemEvent({id, contextMenuItem: item})}
              onKeyDown={handleMoreButtonItemEvent({id, contextMenuItem: item})}
              aria-label={item}
            >
              <TreeMoreButtonItemText>{item}</TreeMoreButtonItemText>
            </TreeMoreButtonItem>
          );
        })}
      </TreeMoreButton>
    );
  };
  const renderBranchContent = (id, text, collapsedIcon, expandedIcon) => () => {
    return (
      <>
        <TreeDropDownButton
          iconButtonProps={{
            'aria-label': `Toggle ${text}`,
            onClick: toggleIsOpen(id),
          }}
        >
          {/* {isLegacy ? <ArrowTriangleDownIcon size={24} aria-label={null}/> : <ArrowTriangleDownIconLatest aria-label={null}/>} */}
        </TreeDropDownButton>
        <TreeIcon><Icon size={!isLegacy ? '1rem' : undefined} src={ isBranchOpen(id) ? expandedIcon : collapsedIcon } aria-label={null} /></TreeIcon>
        <TreeText>{markItem(text, filterFieldValue, HIGHLIGHT_CLASSNAME)}</TreeText>
      </>
    );
  };
  const renderTreeData = (data) => {
    const treeNodes = [];
    let treeNode = undefined;
    for (let treeIndex = 0; treeIndex < data.length; treeIndex += 1) {
      const node = data[treeIndex];
      if (node.isBranch) {
        treeNode = (
          <TreeBranch
            key={node.id}
            id={node.id}
            level={node.level}
            disabled={node.disabled}
            selected={selectedNodeId === node.id}
            error={node.error}
            errorMessage={node.errorMessage}
            onClick={!node.disabled && handleClickEvent(node.id)}
            onDoubleClick={!node.disabled && toggleIsOpen(node.id)}
            onKeyDown={!node.disabled && toggleIsOpen(node.id)}
            isOpen={isBranchOpen(node.id)}
            role="presentation"
            treeBranchContentProps={{
              'aria-label': selectedNodeId === node.id ? `${node.text} selected` : `${node.text}`,
              'aria-posinset': node.posinset,
              'aria-setsize': node.setsize,
              'aria-selected': selectedNodeId === node.id,
            }}
            renderBranchContent={renderBranchContent(node.id, node.text, node.collapsedIcon, node.expandedIcon)}
            renderContextMenu={node.contextMenuItems && renderContextMenu({ id: node.id, contextMenuItems: node.contextMenuItems})}
            dndDropIsOverTimeout={dndDropIsOverTimeout}
            dndDropIsOverCallback={handleDndDropIsOverCallback(node.id)}
          >
            {node.nodes && node.nodes.length > 0 && renderTreeData(node.nodes)}
          </TreeBranch>
        );
      } else {
        treeNode = (
          <TreeNode
            key={node.id}
            id={node.id}
            aria-posinset={node.posinset}
            aria-setsize={node.setsize}
            aria-selected={selectedNodeId === node.id}
            aria-label={selectedNodeId === node.id ? `${node.text} selected` : `${node.text}`}
            onClick={!node.disabled && handleClickEvent(node.id)}
            onKeyDown={!node.disabled && handleNodeKeyDownEvent(node.id)}
            selected={selectedNodeId === node.id}
            disabled={node.disabled}
            renderContextMenu={node.contextMenuItems && renderContextMenu({ id: node.id, contextMenuItems: node.contextMenuItems})}
            >
            <TreeIcon><Icon size={!isLegacy ? '1rem' : undefined} src={node.icon} aria-label={null}/></TreeIcon>
            <TreeText>{markItem(node.text, filterFieldValue, HIGHLIGHT_CLASSNAME)}</TreeText>
          </TreeNode>
        );
      }
      treeNodes.push(treeNode);
    }
    return treeNodes;
  }

  // listProps maxHeight is 100vh - (title height + footer height + filter height + filter matches height + padding top + padding bottom)
  const haveFilterMatches = useFilter ? treeMatchedCount.current > 0 : false;
  const treeContainerPartsHeight = TITLE_HEIGHT + FOOTER_HEIGHT + (useFilter ? FILTER_HEIGHT : 0) +
        (haveFilterMatches ? FILTER_MATCHES_HEIGHT : 0) + DIV_PADDING_HEIGHT + FOOTER_DIVIDER_HEIGHT + 0.625;
  const treeContainerPartsHeightInRem = `${treeContainerPartsHeight}rem`;
  const windowInnerHeightInRem = window.innerHeight * 0.0625;
  const treeitemsPerPage = Math.floor( (windowInnerHeightInRem - treeContainerPartsHeight) / ROW_HEIGHT) - 1;
  return (
    <div style={{ width: '33vw', height: '100vh', padding: '.5rem', boxSizing: 'border-box' }}>
      <TreeContainer
        dndProviderProps={{ context: window }}
        style={{ width: '100%', height: '100%', minHeight: '100%', overflow: 'hidden' }}
      >
        <TreeTitle id="ccfk-tree-label" htmlFor="ccfk-tree-id">TREE DEMO</TreeTitle>
        {useFilter && treeFilter}
        <Tree
          id="ccfk-tree-id"
          ref={treeRef}
          aria-labelledby="ccfk-tree-label"
          preventFocusHandling={preventFocusHandling}
          listProps={{ ref: listRef, preventFocusHandling: true, ulProps: { role: "group" }, style: {height: '100%', maxHeight: `calc(100vh - ${treeContainerPartsHeightInRem})` }}}
          dnd={allowDnd}
          dndCallback={handleDndCallback}
          itemsPerPage={treeitemsPerPage}
        >
          {((isFiltering() && treeMatchedCount.current !== 0) || !isFiltering()) && renderTreeData(treeData)}
        </Tree>
        <TreeFooter>
          <Button aria-label="Add New Folder" onClick={() => { setShowAddBranchDialog(true); }}>
            NEW FOLDER
          </Button>
        </TreeFooter>
      </TreeContainer>
      {showAddBranchDialog && addBranchDialog}
      {showDeleteTreeItemDialog && renderDeleteTreeItemDialog()}
      {showAddTreeItemDialog && renderDialog('Add', setShowAddTreeItemDialog, handleAddNodeClick)}
      {showRenameTreeItemDialog && renderDialog('Rename', setShowRenameTreeItemDialog, handleRenameClick)}
    </div>
  );
};

TreeDemo.propTypes = {
  useFilter: PropTypes.bool,
  allowDnd: PropTypes.bool,
  preventFocusHandling: PropTypes.bool,
  allowDuplicateTreeItemNames: PropTypes.bool,
  dndDropIsOverTimeout: PropTypes.number,
  isLegacy: PropTypes.bool,
};

TreeDemo.defaultProps = {
  useFilter: true,
  allowDnd: false,
  allowDuplicateTreeItemNames: true,
  dndDropIsOverTimeout: 1200,
  preventFocusHandling: false,
  isLegacy: true,
};

export default TreeDemo;

