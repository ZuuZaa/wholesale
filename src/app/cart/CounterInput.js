import React, { useState } from 'react';

const CounterInput = ({ initialValue , min , max, id  }) => {
    const [count, setCount] = useState(initialValue);
    let token="";
    let session_id="";
    if (typeof localStorage !== 'undefined') {
        token = localStorage.getItem("jwtToken");
        session_id=localStorage.getItem("sessionId");
    }
    const handleIncrement = async (event) => {
      //console.log(event.currentTarget.parentElement.parentElement.previousSibling)
      
        if (count < max) {
            setCount(prevCount => prevCount + 1);
            const quant=count+1;
            let price=event.currentTarget.parentElement.parentElement.previousSibling.textContent.split('£')[1]
            let total=price*quant
            event.currentTarget.parentElement.parentElement.nextSibling.textContent="£"+total.toFixed(2)
            
            console.log(price)
            try {
                const res = await fetch("https://api.wscshop.co.uk/api/cart/update-cart", {
                  method: "POST",
                  headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': 'Bearer ' + token
                  },
                  body: JSON.stringify({
                    ProductId: id,
                    Quantity:quant,
                    SessionId:session_id
          
                  }),
                });
                const resJson = await res.json();
                  
                  if (res.status === 200) {
                    
                  
                  document.getElementById("subtotal").textContent=+"£"+resJson.output.subtotal.toFixed(2)
                  document.getElementById("total").textContent="£"+resJson.output.subtotal.toFixed(2)
                  var cart_dropdown=document.getElementById("cart_dropdown")
          var append_cart=``;
          var cart=resJson.output.cart
          for (let i = 0; i < cart.length; i++) 
          {
            append_cart+=`<div class='cartdropdown-item flex gap-3'>
            <div class='img relative'>
              <img src=${cart[i].productImage} width="82" height="82" class='cover' alt="${cart[i].productName}"></img>
              <span class='flex justify-center items-center absolute top-0 left-0 p-1 bg-red-500 rounded-2xl text-xs text-white font-semibold'>${cart[i].quantity}x</span>
            </div>
            <div class='content'> 
                <Link href='/product/${cart[i].productId}'><h5 class='hover-red text-sm mb-1'>${cart[i].productName}</h5></Link>
                <h6 class='text-sm text-rose-600 font-semibold'>£${cart[i].price.toFixed(2)}</h6>
            </div>
            <div class='remove-cart-item'>
            <div width="20" class='text-primary hover-red cursor-pointer remove-cart' id=${cart[i].id} tabindex=${cart[i].productId}><span>x</span></div>
            </div>
        </div>`
          }
          cart_dropdown.innerHTML=append_cart
          document.getElementById("cart_subtotal").innerText="£"+resJson.output.subtotal.toFixed(2)
          document.getElementById("cart_quantity").innerText=resJson.output.totalQuantity
          let remove_carts=document.getElementsByClassName("remove-cart")
          for (let i = 0; i < remove_carts.length; i++) 
          {
            remove_carts[i].addEventListener('click',removeCart)
          }
                }
              } catch (err) {
                console.log(err);
              }
        }
    };

    const handleDecrement = async (event) => {
        if (count > min) {
            setCount(prevCount => prevCount - 1);
            const quant=count-1;
            let price=event.currentTarget.parentElement.parentElement.previousSibling.textContent.split('£')[1]
            let total=price*quant
            event.currentTarget.parentElement.parentElement.nextSibling.textContent="£"+total.toFixed(2)
            try {
                const res = await fetch("https://api.wscshop.co.uk/api/cart/update-cart", {
                  method: "POST",
                  headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': 'Bearer ' + token
                  },
                  body: JSON.stringify({
                    ProductId: id,
                    Quantity:quant,
                    SessionId:session_id
          
                  }),
                });
                const resJson = await res.json();
                  console.log("decrement", resJson);
                  if (res.status === 200) {
                    
                    document.getElementById("subtotal").textContent="£"+resJson.output.subtotal.toFixed(2)
                    document.getElementById("total").textContent="£"+resJson.output.subtotal.toFixed(2)
                    var cart_dropdown=document.getElementById("cart_dropdown")
                    var append_cart=``;
                    var cart=resJson.output.cart
                    for (let i = 0; i < cart.length; i++) 
                    {
                      append_cart+=`<div class='cartdropdown-item flex gap-3'>
                      <div class='img relative'>
                        <img src=${cart[i].productImage} width="82" height="82" class='cover' alt="${cart[i].productName}"></img>
                        <span class='flex justify-center items-center absolute top-0 left-0 p-1 bg-red-500 rounded-2xl text-xs text-white font-semibold'>${cart[i].quantity}x</span>
                      </div>
                      <div class='content'> 
                          <Link href='/product/${cart[i].productId}'><h5 class='hover-red text-sm mb-1'>${cart[i].productName}</h5></Link>
                          <h6 class='text-sm text-rose-600 font-semibold'>£${cart[i].price.toFixed(2)}</h6>
                      </div>
                      <div class='remove-cart-item'>
                      <div width="20" class='text-primary hover-red cursor-pointer remove-cart' id=${cart[i].id} tabindex=${cart[i].productId}><span>x</span></div>
                      </div>
                  </div>`
                    }
                    cart_dropdown.innerHTML=append_cart
                    document.getElementById("cart_subtotal").innerText="£"+resJson.output.subtotal.toFixed(2)
                    document.getElementById("cart_quantity").innerText=resJson.output.totalQuantity
                    let remove_carts=document.getElementsByClassName("remove-cart")
                    for (let i = 0; i < remove_carts.length; i++) 
                    {
                      remove_carts[i].addEventListener('click',removeCart)
                    }
                  
                }
              } catch (err) {
                console.log(err);
              }
        }
    };

    return (
        <div className='minus-plus-wrap inline-flex'>
            <button onClick={handleDecrement} disabled={count <= min}>-</button>
            <input type="text" value={count} readOnly />
            <button onClick={handleIncrement} disabled={count >= max}>+</button>
        </div>
    );
};

export default CounterInput;