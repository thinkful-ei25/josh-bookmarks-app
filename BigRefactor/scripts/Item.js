/* global cuid */

// eslint-disable-next-line no-unused-vars
const Item = (function(){

    const validateName = function(name) {
      if (!name) throw new TypeError('Name must not be blank');
    };
  
    const create = function(name) {
      return {
        id: cuid(),
        name,
        link,
        rating,
        description,
        expanded: false
      };
    };
  
    return {
      validateName,
      create,
    };
    
  }());
  