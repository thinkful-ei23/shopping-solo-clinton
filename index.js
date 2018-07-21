'use strict';
/* global $ */


// stores current state of app data
const STORE = {
  // shopping list
  items: [
    {name: 'apples', checked: false},
    {name: 'oranges', checked: false},
    {name: 'milk', checked: true},
    {name: 'bread', checked: false}
  ],
  // hide checked items?
  hideChecked: false,
};


// RENDERING:

// renders shopping list and inserts it into DOM
function renderShoppingList() {
  /* console.log('`renderShoppingList` ran'); */
  // get search bar contents from DOM
  let searchValue = $('.js-list-search').val().toLowerCase();

  // render filtered shopping list
  let listString = generateListString(filterList(searchValue));
  
  // insert rendered shopping list into DOM
  $('.js-shopping-list').html(listString);

  console.log('Current state of the items in `STORE`:');
  STORE.items.forEach(item => 
    console.log(`  {name: ${item.name}, checked: ${item.checked}}`));
}

// renders full item list from array of rendered items
function generateListString(shoppingList)	{
  /* console.log('`generateListString` ran'); */
  return shoppingList
    .map((item) => {
      // item index in filtered list may not match item index in `STORE`,
      // so get item index from store item with matching name
      const itemIndex = STORE.items.findIndex(obj => obj.name === item.name);
      return generateItemElement(item, itemIndex);
    })
    .join('');
}

// renders single item as HTML list item
function generateItemElement(item, itemIndex/*, template*/) {
  /* console.log('`generateItemElement` ran'); */
  return `
	<li class="js-item-index-element" data-item-index="${itemIndex}">
    <div class="js-shopping-item-name">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
    </div>
		<div class="shopping-item-controls">
			<button class="shopping-item-toggle js-item-toggle">
					<span class="button-label">check</span>
			</button>
			<button class="shopping-item-delete js-item-delete">
					<span class="button-label">delete</span>
			</button>
		</div>
	</li>`;
}


// LIST FILTERING:

// returns list of items filtered by user inputs
function filterList(searchValue) {
  /* console.log('`filterList` ran'); */
  // default value is unfiltered list
  let filteredList = STORE.items;
  
  // filter list by search value
  if (searchValue) {
    filteredList = filteredList
      .filter(item => item.name.toLowerCase().includes(searchValue));
  } 
  
  // filter list by value of `checked`
  if (STORE.hideChecked === true) {
    filteredList = filteredList
      .filter(item => item.checked === false);
  }

  return filteredList;
}

// listens for and handles search submissions
function handleSearchItems() {
  /* console.log('`handleSearchItems` ran'); */
  $('#js-shopping-list-search').submit(function(event) {
    // prevent form submission default behavior
    event.preventDefault();

    // re-render shopping list (with search filter)
    renderShoppingList();
  });
}

// listens for and handles search form reset
function handleSearchReset() {
  /* console.log('`handleSearchReset` ran'); */
  $('#js-shopping-list-search').on('click', '[type="reset"]', function() {
    // clear search form input
    $('.js-list-search').val('');

    // re-render shopping list (without search filter)
    renderShoppingList();
  });
}

// listens for and handles changes to `Hide checked items` checkbox
function handleHideChecked() {
  /* console.log('`handleHideChecked` ran'); */
  $('.js-unchecked-only').on('change', function() {
    // toggle value of hidChecked in `STORE`
    STORE.hideChecked = !STORE.hideChecked;

    // re-render shopping list (with current value of `hideChecked`)
    renderShoppingList();
  });
}


// ITEM ADD, CHECK & DELETE:

// listens for and handles new item submissions
function handleNewItemSubmit() {
  /* console.log('`handleNewItemSubmit` ran'); */
  $('#js-shopping-list-form').submit(function(event) {
    // prevent form submission default behavior
    event.preventDefault();

    // create and add new item to `STORE`
    const newItemName = $('.js-shopping-list-entry').val();
    addItemToShoppingList(newItemName);

    // clear new item form in DOM
    $('.js-shopping-list-entry').val('');

    // re-render updated shopping list (with new item)
    renderShoppingList();
  });
}

// adds new item to `STORE`
function addItemToShoppingList(itemName) {
  /* console.log('`addItemToShoppingList` ran'); */
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({name: itemName, checked: false});
}

// listens for and handles checking off existing items
function handleItemCheckClicked() {
  /* console.log('`handleItemCheckClicked` ran'); */
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    // get item's indexed location
    const itemIndex = getItemIndexFromElement(event.currentTarget);

    // toggle `checked` value of item
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

// toggles value of `checked` for item at indexed location
function toggleCheckedForListItem(itemIndex) {
  /* console.log('`toggleCheckedForListItem` ran'); */

  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}

// listens for and handles existing item deletions
function handleItemDeleteClicked() {
  /* console.log('`handleItemDeleteClicked` ran'); */
  $('.js-shopping-list').on('click', '.shopping-item-delete', event => {
    // get item's indexed location
    const itemIndex = getItemIndexFromElement(event.currentTarget);

    // delete item from `STORE`
    itemDelete(itemIndex);

    // re-render updated shopping list (with item removed)
    renderShoppingList();
  });
}

// deletes item at indexed location in `STORE`
function itemDelete(itemIndex) {
  /* console.log('`itemDelete` ran'); */
  console.log(`Deleting "${STORE.items[itemIndex].name}" from shopping list`);
  STORE.items.splice(itemIndex, 1);
}

// gets indexed location of item
function getItemIndexFromElement(item) {
  /* console.log('`getItemIndexFromElement` ran'); */
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}


// NAME EDITOR:

// listens for and handles hover-preview of name editor
function handleHoverEditPreview() {
  /* console.log('`handleHoverEditPreview` ran'); */
  // listen for `mouseenter` on item name
  $('ul').on('mouseenter', '.js-shopping-item', function() {
    // add border around item name
    $(this).css({'border': '1px solid gray'});
  });

  // listen for `mouseleave` on item name
  $('ul').on('mouseleave', '.js-shopping-item', function() {
    // remove border from item name
    $(this).css({'border': 'none'});
  });
}

// listens for and handles clicks on item names to open name editor
function handleOpenNameEditor() {
  /* console.log('`handleOpenNameEditor` ran'); */
  $('ul').on('click', '.js-shopping-item', function() {
    // replace contents of <div> with output of `nameToInput`
    $(this).closest('.js-shopping-item-name').html(nameToInput($(this).text()));
  });
}

// returns name editor <form> pre-filled with current item name
function nameToInput(name) {
  /* console.log('`nameToInput` ran'); */
  return `
    <form class="name-editor">
      <input type="text" name="name-value" class="js-name-value" value="${name}" onfocus="this.select()">
      <button type="submit">Update</button>
      <button type="reset">Cancel</button>
    </form>`;
}

// listens for and handles name editor submissions
function handleNameChangeSubmit() {
  /* console.log('`handleNameChangeSubmit` ran'); */
  $('.js-shopping-list').on('submit', '.name-editor', function(event) {
    // prevent form submission default behavior
    event.preventDefault();

    // get new name from form input
    const newItemName = $('.js-name-value').val();

    // get item index
    const itemIndex = $(this).closest('li').attr('data-item-index');

    // rename item in `STORE`
    STORE.items[itemIndex].name = newItemName;
    
    // re-render shopping list (with new item name)
    renderShoppingList();
  });
}

// listens for and handles form reset to close name editor
function handleNameChangeCancel() {
  /* console.log('`handleNameChangeCancel` ran'); */
  $('.js-shopping-item-name').on('click', '[type="reset"]', function() {
    // get item's indexed location
    const itemIndex = getItemIndexFromElement(event.currentTarget);

    // get item from `STORE`
    const item = STORE.items[itemIndex];

    // replace contents of <div> with output of `inputToName`
    $(this).closest('.js-shopping-item-name').html(inputToName(item));
  });
}

// returns item name in custom <span>
function inputToName(item) {
  /* console.log('`inputToName` ran'); */
  return `
    <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>`;
}



// provides initial rendering of shopping list and
// activates all event listener functions
function handleShoppingList() {
  // provide initial rendering of shopping list
  renderShoppingList();

  // add/check/delete event listeners:
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleItemDeleteClicked();

  // list filter event listeners:
  handleSearchItems();
  handleSearchReset();
  handleHideChecked();

  // name editor event listeners:
  handleHoverEditPreview();
  handleOpenNameEditor();
  handleNameChangeSubmit();
  handleNameChangeCancel();
}

// call `handleShoppingList` after the DOM loads
$(handleShoppingList);