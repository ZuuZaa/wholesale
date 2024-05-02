'use client'

import React, { useEffect, useState } from 'react'
import { useParams  } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { UilSearch, UilCalender, UilCommentAltLines,UilArrowRight,UilArrowLeft     } from '@iconscout/react-unicons'
import Menu from '../../menu'
import { Card, Typography } from "@material-tailwind/react";

import ProductImg1 from  '../../../../../public/images/products/1.webp';



export default function Account() {
    const pathname = useParams ();
    const id  = pathname.id;
    const params = new URLSearchParams();
    params.append('Id',id)
    const mainFunc=async () => {
        let status;
        let fav_data=[];
    
        const fetchData = async () => {
            let token="";
            if (typeof localStorage !== 'undefined') {
                token = localStorage.getItem("jwtToken");
            }
            let response=await fetch(`https://api.wscshop.co.uk/api/profile/get-order-details?${params.toString()}`,{
                method: 'GET',
                dataType: 'json',
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': 'Bearer ' + token
                },
            }
            )
            console.log(response)
             const resp = await response.json();
             status=resp.status
             fav_data=resp.output
             //return resp.output;
        }
    
        await fetchData()
    
        if (status === 401) {
            try {
                let token="";
                let refreshToken="";
                if (typeof localStorage !== 'undefined') {
                    token = localStorage.getItem("jwtToken");
                    refreshToken=localStorage.getItem("refreshToken");
                }
                console.log(token)
                console.log(refreshToken)
                let response=await fetch(`https://api.wscshop.co.uk/api/account/refresh-token?userRefreshToken=${refreshToken}`,{
                    method: 'POST',
                    dataType: 'json',
                    headers: {
                        'Accept': 'application/json, text/plain',
                        'Content-Type': 'application/json;charset=UTF-8',
                        'Authorization': 'Bearer ' + token
                    },
                })
                console.log(response)
                const resp = await response.json();
                
                if(resp.status !== 400) {
                    if (typeof localStorage !== 'undefined') {
                        localStorage.setItem("refreshToken", resp.output.refreshToken);
                        localStorage.setItem("jwtToken", resp.output.token);
                    }
                    
    
                    await fetchData();
                } else {
                    
                    if (typeof window !== 'undefined') {
                        window.location.href="/login"
                      }
                    //go to login page
                    //alert(1)
                }
            } 
            catch {
                console.log("error")
            }
        }
        else{
            return fav_data
        }
        
    }
    
    const [data, setData] = useState({ 
                        userOrders: [],
                        orderDetails: [],
                        orderProducts:[]
                    }); 
    useEffect(() => {
        async function fetchDataAsync() {
        const fetchedData = await mainFunc();
        setData(fetchedData);
    }
        fetchDataAsync();
    }, []);

      console.log(data)
    const userOrders = data.userOrders; 
    const orderDetails = data.orderDetails;
    const orderProducts = data.orderProducts;
    
    return (
    
        <main>
            
            {/* Breadcrumb */}
            <div className='breadcrumb-wrapper py-12'>
                <div className='custom-container mx-auto'>
                    <div className="flex" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">

                            <li className="inline-flex items-center">
                                <a href="/account" className="inline-flex items-center text-sm font-medium"> Account </a>
                            </li>

                            <li>
                                <div className="flex items-center">
                                    <a href="#" className="ms-1 text-sm font-medium md:ms-2">History</a>
                                </div>
                            </li>
                            
                        </ol>
                    </div>
                </div>
            </div>
            
            {/* Account Section */}
            <section className='account-page-main-section my-20 py-3'>
                <div className='custom-container mx-auto'>
                    <div className='flex'>
                       
                        <div className='account-page-menu w-2/5'>
                            <h5 className='title relative mb-5 text-lg'>Account Menu</h5>
                            <Menu />
                        </div>
                        
                        <div className='account-page-main w-3/5'>
                            <div className='account-history-wrapper'>
                                <div className="w-full">
                                     {/* Info */}
                                     {
                                        orderDetails.map(details=>{
                                            return(
                                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-8'>
                                                    <div className='text-center border border-black-100 rounded-sm py-5 px-1'>
                                                        <h5 className='text-gray-500'>Order No#</h5>
                                                        <h6>{details.id}</h6>
                                                    </div>
                                                    <div className='text-center border border-black-100 rounded-sm py-5 px-1'>
                                                        <h5 className='text-gray-500'>Order Date</h5>
                                                        <h6>{details.soldDate.split('T')[0]}</h6>
                                                    </div>
                                                    <div className='text-center border border-black-100 rounded-sm py-5 px-1'>
                                                        <h5 className='text-gray-500'>Quantity</h5>
                                                        <h6>{details.quantity}</h6>
                                                    </div>
                                                    <div className='text-center border border-black-100 rounded-sm py-5 px-1'>
                                                        <h5 className='text-gray-500'>Total</h5>
                                                        <h6>{details.total.toFixed(2)}£</h6>
                                                    </div>
                                                </div>
                                            )
                                        })

                                     }
                                     

                                     {/* Table */}
                                    <table id='addp-main-table2' className="text-center min-w-full divide-y divide-gray-200">
                                        <thead class="bg-gray-50">
                                        <tr>
                                            <th scope="col" class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                            <th scope="col" class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th scope="col" class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                            <th scope="col" class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                            <th scope="col" class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                orderProducts.map(product=>{
                                                    return(
                                                    <tr className='border-b border-gray-200'>
                                                        
                                                        <td><img src={product.productImage} width={70} height={70} className='aspect-square addp-item-img object-contain mx-auto' alt='Product'></img></td>
                                                        <td class="font-medium text-black hover:text-gray-700 transition ease-in">{product.productName}</td>
                                                        <td class="font-medium text-black hover:text-gray-700 transition duration-1">{product.price.toFixed(2)}£</td>
                                                        <td class="font-medium text-black hover:text-gray-700 transition duration-1">{product.quantity}</td>
                                                        <td class="font-medium text-black hover:text-gray-700 transition duration-1">{product.total.toFixed(2)}£</td>
                                                    
                                                    </tr>
                                                    )
                                                })
                                            }


                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

        </main>

    )
}

