//closest polyfill, to detect closest ancestor for an element
if (window.Element && !Element.prototype.closest) {
  Element.prototype.closest = 
  function(s) {
      var matches = (this.document || this.ownerDocument).querySelectorAll(s),
          i,
          el = this;
      do {
          i = matches.length;
          while (--i >= 0 && matches.item(i) !== el) {};
      } while ((i < 0) && (el = el.parentElement)); 
      return el;
  };
}
          
//loop through an array to find specific expression
Array.prototype.searchFor = function(candid) {
for (var i=0; i<this.length; i++)
    if (this[i].indexOf(candid) == 0)
        return i;
return -1;
};
          
// makes a string of object properties
Object.prototype.cartObjString = function(id, name, price, count ){
  return id + name + price + count;
}
          
          
var buy = document.querySelectorAll('.buy'); // item buy button


var cartContent = JSON.parse(localStorage.getItem('cart')); //getting local storage data 
var cartStrings = JSON.parse(localStorage.getItem('cartStrings')); //getting local storage data in string

if(cartContent == null){
  cartContent = [];
  cartStrings = [];
}
          
          
//this function builds a cart when the buy button is clicked
function buildCart(optionsArray){
    buy.forEach(function(el, index, array){
      el.addEventListener('click', function(){
          var parent = this.closest('.item');
          var idText = parent.getAttribute('data-id');
          var idNum = parseFloat(parent.getAttribute('data-id'));

          
          var cartElements = [];
          var item = {}
          item.itemId = idNum;
          
          for(var i=0; i < optionsArray.length; i++){
              var option = parent.querySelector('.' + optionsArray[i]);
              cartElements.push(option);
              
              var sliced = optionsArray[i].slice(5);
              
              switch(sliced){
                  case 'count':
                      item[sliced] = cartElements[i].children[0].value;
                  break;
                  default:
                      item[sliced] = cartElements[i].innerHTML;
              }
              
          }
          
          
          var uglied = item.cartObjString(item.itemId, item.name, item.price, item.count);

          if(cartStrings.searchFor(idText) != -1){
              alert('This item is already chosen');
          } else {

              cartContent.push(item);
              cartStrings.push(uglied);

              localStorage.setItem('cart', JSON.stringify(cartContent));
              localStorage.setItem('cartStrings', JSON.stringify(cartStrings));
              

              var newElement = document.createElement('div');
              newElement.classList.add('item');
              
              var btn = document.createElement('button');
              btn.classList.add('delete');
              btn.innerHTML = 'Remove';
              
              
               
            
              for(var prop in item){
                  
                  switch(prop){
                      case 'count':
                          newElement.innerHTML += '<div class="' + prop + '">' + cartContent[cartContent.length - 1][prop] + 'x</div>';
                          break;
                      case 'cartObjString':
                          break;
                      case 'itemId':
                          newElement.setAttribute('data-id', cartContent[cartContent.length - 1].itemId);
                          break;
                      default:
                          newElement.innerHTML += '<div class="' + prop + '">' + cartContent[cartContent.length - 1][prop] + '</div>';
                  }
                  
              }
                

              newElement.appendChild(btn);
              
              document.querySelector('.cart .items').appendChild(newElement);

              
              //hides and shows checkout and clear button
              if(cartContent.length > 0){
                    document.querySelector('.checkout').style.display = 'block';
                    document.querySelector('.clear').style.display = 'block';
                } else {
                    document.querySelector('.checkout').style.display = 'none';
                    document.querySelector('.clear').style.display = 'none';
                }

          }

      });

    });
}       
          

//this function gets data from local storage and builds cart when document is loaded       
function loadItemsToCart(){


    for (var i=0; i < cartContent.length; i++) {
        
        var wrapper = document.createElement('div');
        wrapper.classList.add('items');
        
        var newElement = document.createElement('div');
        newElement.classList.add('item');
        
        var btn = document.createElement('button');
        btn.classList.add('delete');
        btn.innerHTML = 'Remove';
        
        newElement.setAttribute('data-id', cartContent[i].itemId);
        
        for(var prop in cartContent[i]){
                  
              switch(prop){
                  case 'count':
                      newElement.innerHTML += '<div class="' + prop + '">' + cartContent[cartContent.length - 1][prop] + 'x</div>';
                      break;
                  case 'cartObjString':
                      break;
                  case 'itemId':
                      newElement.setAttribute('data-id', cartContent[i].itemId);
                      break;
                  default:
                      newElement.innerHTML += '<div class="' + prop + '">' + cartContent[i][prop] + '</div>';
              }

          }

        newElement.appendChild(btn);
              
        document.querySelector('.cart .items').appendChild(newElement);
    }
    
    if(cartContent.length > 0){
        document.querySelector('.checkout').style.display = 'block';
        document.querySelector('.clear').style.display = 'block';
    } else {
        document.querySelector('.checkout').style.display = 'none';
        document.querySelector('.clear').style.display = 'none';
    }
    
}
 
loadItemsToCart();
          
          
//remove desired item from cart        
document.addEventListener('click', function(e){
  if(e.target.classList.contains('delete')){
      var item = e.target.parentElement;
      var itemIdStr = item.getAttribute('data-id');
      var itemID = parseFloat(itemIdStr);

      var cart = item.parentElement;
      cart.removeChild(item);

      function getByValue(arr, value) {

          for (var i=0, iLen=arr.length; i<iLen; i++) {

            if (arr[i].id == value) return i;
          }
        }



      cartContent.splice(getByValue(cartContent, itemID), 1);
      cartStrings.splice(cartStrings.searchFor(itemIdStr), 1);

      localStorage.setItem('cart', JSON.stringify(cartContent));
      localStorage.setItem('cartStrings', JSON.stringify(cartStrings));
      
      if(cartContent.length > 0){
            document.querySelector('.checkout').style.display = 'block';
            document.querySelector('.clear').style.display = 'block';
        } else {
            document.querySelector('.checkout').style.display = 'none';
            document.querySelector('.clear').style.display = 'none';
        }
  }
});

//removes all items from cart
document.querySelector('.clear').addEventListener('click', function(){
    var myNode = document.querySelector(".cart .items");
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }
    
    localStorage.removeItem('cart');
    localStorage.removeItem('cartStrings');
    
    cartContent = [];
    cartStrings = [];
    
    document.querySelector('.checkout').style.display = 'none';
    document.querySelector('.clear').style.display = 'none';
});



//this calls function when we want to checkout products
document.querySelector('.checkout').addEventListener('click', function(){
    
    var checkoutArr = [];
    for(var i=0; i < cartContent.length; i++){
        checkoutArr.push(cartContent[i].itemId);
    }
    
    alert('We checkout product IDs: ' + checkoutArr);
    
});