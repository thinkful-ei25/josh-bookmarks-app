'use strict';
/* global store, api, $ */

// eslint-disable-next-line no-unused-vars

$.fn.extend({
  serializeJson: function() {
    const formData = new FormData(this[0]);
    const o = {};
    formData.forEach((val, name) => o[name] = val);
    return JSON.stringify(o);
  }
});

const bookmarkList = (function(){

    function render() {
        let bookmarks = store.items;

        console.log('`render` ran');
        const bookmarkListItemsString = generateBookmarkItemsString(bookmarks);
        handleNewItemSubmit();
        $('.js-bookmark-list').html(bookmarkListItemsString);
        $('#error').html(store.errorMessage);
        if(store.addingItem){
            $('.adding').html(generateForm());
        }
    }

  function generateBookmarkElement(item) {

    let itemName = `<span class="bookmark-name">${item.title}</span>`;
        return `<li class='js-bookmark-element'><span class="title-of">${itemName}</span>
        <span class=rating-of>${getStarWidgetFilled(item.rating)}${getStarWidgetUnfilled(item.rating)}</span>
      </li>`;
    }


  function generateBookmarkItemsString(bookmarkList) {
    console.log("Generating bookmark element");
    const bookmarks = bookmarkList.map((item) => generateBookmarkElement(item));
    return bookmarks.join('');
  }

  function getStarWidgetFilled(num){
    let currentCount = 0;
    let myStarString = `<ul id='stars'>`;
    for(let i = 0; i < num; i++){
      myStarString += `<li class='star' title='Poor' data-value='1'>
        <i class='fa fa-star filled'></i>
        </li>`
        currentCount ++;
    }
    return myStarString;
  }

    function getStarWidgetUnfilled(num){
    let count = 5 - num;
    let myStarString = ``;
    for(let i = 0; i < count; i++){
      myStarString += `<li class='star' title='Poor' data-value='1'>
      <i class='fa fa-star'></i>
      </li>`
    }
    myStarString += `</ul>`
    return myStarString;
}
function generateForm(){
    return `
    <div id="form-div">
      <form id="reused_form">
        <input name="name" type="text" placeholder="Website Name" id="name" />
        <select class="rating">
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Stars</option>
        </select>
        <textarea name="message" id="comment" placeholder="Describe in your own words"></textarea>
        <input id="js-submit" class="js-submitButton" type="submit" value="SUBMIT" />
      </form>
    </div>`;
}



  function handleApiError(error){
    store.setErrorMessage(error.responseJSON.message);
    render();
    store.setErrorMessage(null);
  }


  function handleNewItemSubmit() {
    $(document).on('submit', '#reused_form', function(event) {
      event.preventDefault();
      newItemName = $(event.target).serializeJson();;
      api.createItem(newItemName, handleApiError,(item) => {
        store.addItem(item);
        store.toggleAddingItem();
        console.log(store.addingItem);
        render();
      });
    });
  }











//   function handleRatingFilter() {
//     $('.js-filter-checked').click(() => {
//       store.toggleCheckedFilter();
//       render();
//     });
//   }



  function fetchInitialItems() {
    api.getItems( handleApiError, (items) => {
      items.forEach((item) => {
       store.addItem(item);
      });
    bookmarkList.render();
    });
  }

  function handleAddingItem(){
    $('.addButton').on('click', function(){
      store.addingItem = true;
      console.log('you clicked add item');
     render();
    });
}

  function bindEventListeners() {
    handleAddingItem();
  }

  // This object contains the only exposed methods from this module:
  return {
    render: render,
    bindEventListeners: bindEventListeners,
    fetchInitialItems
  };
}());
