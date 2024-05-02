'use client'
import {React, useEffect, useState} from 'react'
import { useParams  } from 'next/navigation';
import Link from 'next/link';
import { UilCheck, UilInfo, UilMap, UilEnvelope } from '@iconscout/react-unicons'
import Image from 'next/image';

import Tick from '../../../public/images/tick.png';

const mainFunc=async () => {
  let status;
  let fav_data=[];

  const fetchData = async () => {
      let token="";
      if (typeof localStorage !== 'undefined') {
          token = localStorage.getItem("jwtToken");
      }
      let response=await fetch(`https://api.wscshop.co.uk/api/checkout/get-success`,{
          method: 'GET',
          dataType: 'json',
          headers: {
              'Accept': 'application/json, text/plain',
              'Content-Type': 'application/json;charset=UTF-8',
              'Authorization': 'Bearer ' + token
          },
      }
      )
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
export default function Success() {
  const [data, setData] = useState({ 
                                cart: [], 
                                sale: [], 
                                saleProducts: [], 
                                subtotal: [], 
                                discount: [],
                                total:[],
                                totalEnd: [],
                                totalQuantity:[],
                                userAddress:[],
                                user:[],
                                balance:[],
                                bonus:[],
                                usedBalance:[],
                                stripeDetails:[],
                                paypalDetails:[]
  });
  useEffect(() => {
    
    async function fetchDataAsync() {
      let searchParams = new URLSearchParams(window.location.search)
      let param = searchParams.get('payment_intent')
      let param2 = searchParams.get('payment_type')
      console.log(param)
      
      if(param2==null || param2==""){
        window.location.href="/checkout"
      }
      else{
        if(param2==1 && (param==null || param=="")){
          window.location.href="/checkout"
        }
        else {
          const fetchedData = await mainFunc();
          setData(fetchedData);
        }
      }
      
    }
    fetchDataAsync();
  }, []);
  
  const user=data.user
  console.log(user)
  
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
                    <a href="#" className="ms-1 text-sm font-medium md:ms-2 flex items-center">Success</a>
                  </div>
                </li>

              </ol>
            </div>
          </div>
        </div>
        
        {/* Success  Section */}
        <section className='login-register-main-section mt-5'>
          <div className='custom-container mx-auto'>
            <div className='account-lr-wrap mx-auto p-8 text-center'>
                <Image src={Tick} width={200} height={200} className='success-page-icon object-cover w-full h-full' alt='Product'/>
                <h4 className='account-page-title'>Order Completed!</h4>
                <p className='mb-8'>Thanks for your order! We received your order request, we'll be in touch shortly.</p>
            </div>
          </div> 
        </section>

    </main>
  )
}

