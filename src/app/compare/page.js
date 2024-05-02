'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import Image from 'next/image';
import {UilMultiply } from '@iconscout/react-unicons'

let token="";
let session_id="";
if (typeof localStorage !== 'undefined') {
    token = localStorage.getItem("jwtToken");
    session_id=localStorage.getItem("sessionId");
}
const params = new URLSearchParams();
params.append('SessionId', session_id);
async function fetchData(){
    const response = await fetch(`https://api.wscshop.co.uk/api/compare/get-index?${params.toString()}`,{
      method: "GET",
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': 'Bearer ' + token
      },
});
    const data = await response.json();
    return data.output;
}


export default function Compare() {
  const [data, setData] = useState({ 
                                    compareProducts: []
                                    });
    
    useEffect(() => {
        
      async function fetchDataAsync() {
        
        const fetchedData = await fetchData();
            setData(fetchedData);
        }
  
      fetchDataAsync();
    }, []);
      
    const compareProducts = data.compareProducts;
    let removeCompare=async (event) => {
      let prodid=event.currentTarget.getAttribute('id')
      let token="";
      let session_id="";
      if (typeof localStorage !== 'undefined') {
          token = localStorage.getItem("jwtToken");
          session_id=localStorage.getItem("sessionId");
      }
      let comp_button=event.currentTarget;
      try {
        const res = await fetch("https://api.wscshop.co.uk/api/compare/remove-compare", {
          method: "POST",
          headers: {
            'Accept': 'application/json, text/plain',
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({
            ProductId: prodid,
            SessionId:session_id
  
          }),
        });
        const resJson = await res.json();
          
          if (res.status === 200) {
            
          console.log("success remove compare")
          comp_button.parentElement.parentElement.remove();
          if(resJson.output.compareProducts==null){
            document.getElementById("compare_table").innerHTML="<p>There is no product for comparing!</p>";
          }
          
        }
      } catch (err) {
        console.log(err);
      }
    }
  return (
    <main>
        {/* Breadcrumb */}
        <div className='breadcrumb-wrapper py-12'>
          <div className='custom-container mx-auto'>
            <div className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">

                <li className="inline-flex items-center">
                  <a href="/" className="inline-flex items-center text-sm font-medium"> Home </a>
                </li>

                <li>
                  <div className="flex items-center">
                    <span className="ms-1 text-sm font-medium md:ms-2">Compare Products</span>
                  </div>
                </li>

              </ol>
            </div>
          </div>
        </div>
        
        {/* Compare Product Section */}
        <section className='compare-main-section mt-5 pt-16'>
            <div className='frd-container mx-auto'>
                {/* Compare Products */}
                <div className='compare-wrapper mt-11 mb-20'>
                    <div className='compare-page-table' id="compare_table">
                      {
                        compareProducts.length>0?(<div className='table'>

                        <div className='flex'>
                            {/* First Column */}
                            <div className='first-column'>
                                <div className='row'><h5>Action</h5></div>
                                <div className='row'><h6>Product name</h6></div>
                                <div className='row'><h6>Product image</h6></div>
                                <div className='row'><h6>Product description</h6></div>
                                <div className='row'><h6>Availability</h6></div>
                            </div>
                            {
                                compareProducts.map(product=>{
                                    let stock_text="";
                                    if(product.productStock>0){
                                        stock_text="Available In stock"      
                                    }
                                    else{
                                        stock_text="Unavailable In stock"
                                    }
                                    return(
                                        <div className='product-column'>
                                            <div className='row'> <span className='remove-compare-item-span hover-red-bg' onClick={removeCompare} id={product.productId}><UilMultiply size="12" color="#ffffff" /></span> </div>
                                            <div className='row'> {product.productName} </div>
                                            <div className='row'>
                                                <div className='flex flex-col'>
                                                    <img src={product.productImage} width={150} height={150} className='blog-swiper-item-img object-cover mx-auto' alt='Product'></img>
                                                    {/* <Image src={PImg1} width={150} height={150} className='blog-swiper-item-img object-cover mx-auto' alt='Blog'/> */}
                                                    <h5 className='text-red-600 font-semibold my-3'>On Sale <span className='font-medium ml-1'>£{product.productPrice.toFixed(2)}</span></h5>
                                                    <Link href={"/details/" + product.productId} key={product.id} passHref={true} className='hover-red'>view product</Link>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <p>{product.productAbout}</p>
                                            </div>
                                            <div className='row'>
                                                <h6>{stock_text}</h6>
                                            </div>
                                        </div>
                                    )
                                })

                            }
                        </div>

                    </div>):(<p>There is no product for comparing!</p>)
                      }
                        
                    </div>
                </div>
            </div>
        </section>

    </main>
  )
}

