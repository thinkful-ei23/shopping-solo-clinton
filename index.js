'use strict';
/* global $ */

// `STORE` is responsible for storing the underlying data
// that our app needs to keep track of in order to work.
//
// for a shopping list, our data model is pretty simple.
// we just have an array of shopping list items. each one
// is an object with a `name` and a `checked` property that
// indicates if it's checked off or not.
// we're pre-adding items to the shopping list so there's
// something to see when the page first loads.
const STORE = {
  items: [
    {name: 'apples', checked: false},
    {name: 'oranges', checked: false},
    {name: 'milk', checked: true},
    {name: 'bread', checked: false}
  ],
  displayChecked: true,
};


function handleDisplayUncheckedClicked() {
  $('.js-unchecked-only').on('change', function() {
    console.log('Toggling display of unchecked items');
    STORE.displayChecked = !STORE.displayChecked;
    const searchValue = $('.js-list-search').val().toLowerCase();
    renderShoppingList();
  });
}


function generateItemElement(item, itemIndex, template) {
  return `
	<li class="js-item-index-element" data-item-index="${itemIndex}">
		<span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
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


function inputToName(item) {
  // generates the html inside the <li> for an item, replacing the form input with a span
  return `
    <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
    <div class="shopping-item-controls">
      <button class="shopping-item-toggle js-item-toggle">
          <span class="button-label">check</span>
      </button>
      <button class="shopping-item-delete js-item-delete">
          <span class="button-label">delete</span>
      </button>
    </div>`;
}


function nameToInput(name) {
  // generates the html inside the <li> for an item, replacing the span with a form input
  return `
    <form class="name-editor">
      <input type="text" name="name-value" class="js-name-value" value="${name}" onfocus="this.select()">
      <button type="submit">Update</button>
      <button type="reset">Cancel</button>
    </form>
    <div class="shopping-item-controls">
			<button class="shopping-item-toggle js-item-toggle">
					<span class="button-label">check</span>
			</button>
			<button class="shopping-item-delete js-item-delete">
					<span class="button-label">delete</span>
			</button>
		</div>`;
}

function handleEditorPreview() {
  // listens for hover over list item name, then outlines the name with a box
  $('ul').on('mouseenter', '.js-shopping-item', function() {
    // this = <span>
    $(this).css({'border': '1px solid gray'});
  });

  $('ul').on('mouseleave', '.js-shopping-item', function() {
    // this = <span>
    $(this).css({'border': 'none'});
  });
}

function handleNameToInput() {
  // listens for click on list item name, then runs nameToInput on that element
  $('ul').on('click', '.js-shopping-item', function() {
    $(this).closest('li').html(nameToInput($(this).text()));
  });
}

function handleNameChangeSubmit() {
  // listens for a form submission inside a <ul>, collects the new name, and assigns it to the triggering item
  $('.js-shopping-list').on('submit', '.name-editor', function(event) {
    event.preventDefault();
    const newItemName = $('.js-name-value').val();
    // this = <form>
    const itemIndex = $(this).closest('li').attr('data-item-index');

    STORE.items[itemIndex].name = newItemName;
    
    renderShoppingList();
  });
}

function handleNameChangeCancel() {
  // listens for a form reset inside a <ul>,
  // resets the html for the triggering item
  $('.js-shopping-list').on('click', '[type="reset"]', function() {
    const itemIndex = $(this).closest('li').attr('data-item-index');

    const item = STORE.items[itemIndex];

    $(this).closest('li').html(inputToName(item));
  });
}


function generateShoppingItemsString(shoppingList)	{
  console.log('Generating shopping list element');

  const items = shoppingList.map((item, index) => generateItemElement(item, index));

  return items.join('');
}


function renderShoppingList() {
  // this function will be responsible for rendering the shopping list in
  // the DOM
  console.log('`renderShoppingList` ran');
  let searchValue = $('.js-list-search').val().toLowerCase();
  let shoppingListItemsString = generateShoppingItemsString(filterList(searchValue));
  
  $('.js-shopping-list').html(shoppingListItemsString);

}


function filterList(searchValue) {
  let filteredList = STORE.items;
  
  if (searchValue) {
    filteredList = filteredList
      .filter(item => item.name.toLowerCase().includes(searchValue));
  } 
  
  if (STORE.displayChecked === false) {
    filteredList = filteredList
      .filter(item => item.checked === false);
  }

  return filteredList;
}


function handleItemSearch() {
  $('#js-shopping-list-search').submit(function(event) {
    event.preventDefault();
    renderShoppingList();
  });
}


function handleSearchReset() {
  $('#js-shopping-list-search').on('click', '[type="reset"]', function() {
    $('.js-list-search').val('');
    renderShoppingList();
  });
}


function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({name: itemName, checked: false});
}


function handleNewItemSubmit() {
  // this function will be responsible for rendering the shopping list in
  // the DOM
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    const newItemName = $('.js-shopping-list-entry').val();
    console.log(newItemName);
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}


function toggleCheckedForListItem(itemIndex) {
  console.log('Toggling checked property for item at index ' + itemIndex);
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}


function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}


function handleItemCheckClicked() {
  // this function will be responsible for rendering the shopping list in
  // the DOM
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    console.log(itemIndex);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });

}


function deleteItemClicked(itemIndex) {
  console.log(`Deleting "${STORE.items[itemIndex].name}" from shopping list`);
  STORE.items.splice(itemIndex, 1);
}


function handleDeleteItemClicked() {
  // this function will be responsible for when users want to delete a shopping list
  // item
  $('.js-shopping-list').on('click', '.shopping-item-delete', event => {
    console.log('`handleDeleteItemClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    console.log(itemIndex);
    deleteItemClicked(itemIndex);
    renderShoppingList();
  });
  console.log('`handleDeleteItemClicked` ran');
}


// this function will be responsible for rendering the shopping list in
// the DOM
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleDisplayUncheckedClicked();
  handleItemSearch();
  handleSearchReset();
  handleNameToInput();
  handleNameChangeSubmit();
  handleNameChangeCancel();
  handleEditorPreview();
}


// when the page loads, call `handleShoppingList`
$(handleShoppingList);