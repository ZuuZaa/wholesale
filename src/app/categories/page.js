'use client'

import {React, useEffect, useState} from 'react'
import Link from 'next/link';
import Image from 'next/image'
import { UilPlus, UilMinus } from '@iconscout/react-unicons'
import ProductImg1 from '../../../public/images/products/1.webp';
import ProductImg2 from '../../../public/images/products/2.webp';

async function fetchData(){
    let token="";
    let session_id="";
    if (typeof localStorage !== 'undefined') {
        token = localStorage.getItem("jwtToken");
        session_id=localStorage.getItem("sessionId");
    }
    const params = new URLSearchParams();
    params.append('SessionId', session_id);
    const response = await fetch(`https://api.wscshop.co.uk/api/category/get-all?${params.toString()}`,{
        method: "GET",
        headers: {
          'Accept': 'application/json, text/plain',
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': 'Bearer ' + token
        }
    });
    const data = await response.json();
    return data.output;
  }
    export default function Categories() {
    const [data, setData] = useState({ 
                                mainCategories: [], 
                                categories: []
    });

  
  useEffect(() => {
    async function fetchDataAsync() {
    const fetchedData = await fetchData();
      setData(fetchedData);
    }
    fetchDataAsync();
  }, []);
    const mainCategories= data.mainCategories;
    const categories=data.categories;
    const [toggle, setToggle] = useState([])

    let setToggleClick=(e)=>{
        let _this = e.currentTarget;
        _this.parentNode.closest(".pcategories-item").querySelector(".pcategories-more-info-wrap").classList.toggle("active")
        let plusIcon = _this.parentNode.closest(".pcategories-item").querySelectorAll("svg")[0]
        let minusIcon = _this.parentNode.closest(".pcategories-item").querySelectorAll("svg")[1]
        if (plusIcon.classList.contains("active")) {
            plusIcon.classList.remove("active")
            plusIcon.style.display = "none"

            minusIcon.classList.add("active")
            minusIcon.style.display = "block"
        } else {
            minusIcon.classList.remove("active")
            minusIcon.style.display = "none"

            plusIcon.classList.add("active")
            plusIcon.style.display = "block"
        }
        // setToggle()
    }

    return (
        <main>

            {/* Breadcrumb */}
            <div className='breadcrumb-wrapper py-12'>
                <div className='custom-container mx-auto'>
                    <div className="flex" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">

                        <li className="inline-flex items-center">
                        <a href="/" className="inline-flex items-center text-sm font-medium text-gray-700 dark:text-gray-400"> Home </a>
                        </li>

                        <li>
                        <div className="flex items-center">
                            <a href="#" className="ms-1 text-sm font-medium text-gray-700  md:ms-2 dark:text-gray-400">Categories</a>
                        </div>
                        </li>

                    </ol>
                    </div>
                </div>
            </div>
            
            {/* Product Categories  Section Info */}
            <section className='pcategories-info-section mt-5'>
                <div className='frd-container mx-auto'>
                    <div>
                    <h1 className='text-center md:text-left text-xl md:text-4xl font-bold'>Categories</h1>
                    <p className='text-center md:text-left'>You can call us in working time or visit our office. All mails will get the response within 24 hours. Love to hear from you!</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7 mt-11">
                        {
                            mainCategories.map(main=>{
                                if(main.folder==1){
                                    return(
                                        <div className='pcategories-item relative'>
                                            <div className='img zoom-img'>
                                            <Link href={"/category/" + main.id}>
                                                <img src={main.image} width={300} height={400} className='category-product-item-img object-cover w-full h-full' alt='Product'></img>
                                            </Link>
                                            </div>
                                            <div className='info flex flex-row p-4 justify-between items-center'>
                                                <h4 className='text-lg'>{main.name}</h4>
                                                <UilPlus size='22' color='#333' onClick={ setToggleClick } style={{display: 'block'}} className={'active'} />  
                                                <UilMinus size='22' color='#333' onClick={ setToggleClick } style={{display: 'none'}} />   
                                                <div  className={ `${toggle ? "pcategories-more-info-wrap" : "pcategories-more-info-wrap active"} ` }>
                                                <ul>
                                                    { 
                                                        categories.filter(c=>c.mainId==main.id).map(cat=>{
                                                            return(
                                                                <li className='nav-dropdown-item'>
                                                                    <Link href={"/category/" + cat.id}><li className='hover-red hover:pl-1'>{cat.name}</li></Link>
                                                                    {/* <Link href={'a'} className='nav-dropdown-link'>{cat.name}</Link> */}
                                                                </li>
                                                            )
                                                            
                                                        })
                                                    }
                                                    
                                                </ul>
                                            </div>             
                                            </div>
                                            
                                        </div>
                                        )
                                }
                                else if(main.folder==0){
                                    return(
                                        <div className='pcategories-item'>
                                            <div className='img zoom-img'>
                                            <Link href={"/category/" + main.id}>
                                                <img src={main.image} width={300} height={400} className='category-product-item-img object-cover w-full h-full' alt='Product'></img>
                                            </Link>
                                            </div>
                                            <div className='info flex flex-row p-4 justify-between items-center'>
                                                <h4 className='text-lg'>{main.name}</h4>
                                                <UilPlus size='22' color='#333'/>                
                                            </div>
                                        </div>
                                    )

                                }
                            })
                        }

                    </div>
                    </div>
                </div>
            </section>


        </main>
    )
}

