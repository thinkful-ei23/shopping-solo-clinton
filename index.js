'use strict';
/* global $ */


// stores current state of app data
const STORE = {
  // shopping list
  items: [
    {name: 'apples', checked: false, hidden: false},
    {name: 'oranges', checked: false, hidden: false},
    {name: 'milk', checked: true, hidden: false},
    {name: 'bread', checked: false, hidden: false}
  ],
  // hide checked items?
  hideChecked: false,
};


// RENDERING:

// renders shopping list and inserts it into DOM
function renderShoppingList() {
  /* console.log('`renderShoppingList` ran'); */
  // hide items per `filterItems` function
  filterItems();

  // render shopping list
  let listString = generateListString(STORE.items);
  
  // insert rendered shopping list into DOM
  $('.js-shopping-list').html(listString);

  console.log('Current state of the items in `STORE`:');
  STORE.items.forEach(item => 
    console.log(`  {name: ${item.name}, checked: ${item.checked}, hidden: ${item.hidden}}`));
}

// renders full item list from array of item objects
function generateListString(shoppingList)	{
  /* console.log('`generateListString` ran'); */
  return shoppingList
    .map(function(item, itemIndex) {
      if (item.hidden === false) {
        return generateItemElement(item, itemIndex);
      } else {
        return generateHiddenItemElement(item, itemIndex);
      }
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

// renders single hidden item as HTML list item
function generateHiddenItemElement(item, itemIndex/*, template*/) {
  /* console.log('`generateHiddenItemElement` ran'); */
  return `
	<li hidden class="js-item-index-element" data-item-index="${itemIndex}">
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

// sets value of `.hidden` based on user inputs
function filterItems() {
  /* console.log('`filterItems` ran'); */
  let searchValue = $('.js-list-search').val().toLowerCase();
  
  // default for each item is "unhidden"
  STORE.items.forEach(item => item.hidden = false);

  // hide items not matching `searchValue`
  if (searchValue) {
    STORE.items.forEach(item => {
      if (!item.name.toLowerCase().includes(searchValue)) {
        item.hidden = true;
      }
    });
  }

  // hide `checked` items if checkbox ticked
  if (STORE.hideChecked === true) {
    STORE.items.forEach(item => {
      if (item.checked === true) {
        item.hidden = true;
      }
    });
  }
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
  $('.js-hide-checked').on('change', function() {
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
  STORE.items.push({name: itemName, checked: false, hidden: false});
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
      <input aria-label="name-edit-field" type="text" name="name-value" class="js-name-value" value="${name}" onfocus="this.select()">
      <button type="submit">Update</button>
      <button type="reset" class="js-reset">Cancel</button>
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
  $('.js-shopping-list').on('click', '.js-reset', function() {
    // get item's indexed location
    const itemIndex = Number(getItemIndexFromElement(event.target));

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