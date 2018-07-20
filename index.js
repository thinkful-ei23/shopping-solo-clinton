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
const STORE = [
	{name: "apples", checked: false},
	{name: "oranges", checked: false},
	{name: "milk", checked: true},
	{name: "bread", checked: false}
];

function generateItemElement(item, itemIndex, template) {
	return `
	<li>${item.name}</li>`;
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
	const shoppingListItemsString = generateShoppingItemsString(STORE);
	$('.js-shopping-list').html(shoppingListItemsString);

}

function handleNewItemSubmit() {
	// this function will be responsible for rendering the shopping list in
  // the DOM
	console.log('`handleNewItemSubmit` ran');
}

function handleItemCheckClicked() {
	// this function will be responsible for rendering the shopping list in
  // the DOM
	console.log('`handleItemCheckClicked` ran');
}

function handleDeleteItemClicked() {
	// this function will be responsible for rendering the shopping list in
  // the DOM
	console.log('`handleDeleteItemClicked` ran');
}

// this function will be responsible for rendering the shopping list in
// the DOM
function handleShoppingList() {
	renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);