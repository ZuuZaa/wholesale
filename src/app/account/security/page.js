'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { UilSearch, UilCalender, UilCommentAltLines,UilArrowRight,UilArrowLeft     } from '@iconscout/react-unicons'
import Menu from '../menu'
export default function Account() {
    const fetchData=async () => {
        let status;
        let fav_data=[];
    
        const fetchData = async () => {
            let token="";
            if (typeof localStorage !== 'undefined') {
                token = localStorage.getItem("jwtToken");
            }
            let response=await fetch(`https://api.wscshop.co.uk/api/profile/get-index`,{
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
    const [email, setEmail] = useState("");

    useEffect(() => {
        async function fetchDataAsync() {
            try{
                const fetchedData = await fetchData();
                
                setEmail(fetchedData.user[0].email)
            }
            catch(error){
                console.log(error)
            }
        }
        
  
      fetchDataAsync();
    }, []);

    const [oldPassword, setoldPassword] = useState("");
    const [newPassword, setnewPassword] = useState("");
    const [confirmPassword, setconfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    let handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const res = await fetch("https://api.wscshop.co.uk/api/profile/edit-password", {
            method: "POST",
            headers: {
              'Accept': 'application/json, text/plain',
              'Content-Type': 'application/json;charset=UTF-8',
              'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
              Email:email,
              OldPassword: oldPassword,
              NewPassword: newPassword,
              Confirm: confirmPassword
            }),
          });
          const resJson = await res.json();
          if (res.status === 200) {
            
            setMessage("Password has been changed successfully");
          } else {
            setMessage("Some error occured");
          }
        } catch (err) {
          console.log(err);
        }
      };
    return (
    
        <main>
            {/* Breadcrumb */}
            <div className='breadcrumb-wrapper py-12'>
                <div className='custom-container mx-auto'>
                    <div className="flex" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">

                            <li className="inline-flex items-center">
                                <a href="/" className="inline-flex items-center text-sm font-medium"> Account </a>
                            </li>

                            <li>
                                <div className="flex items-center">
                                    <a href="#" className="ms-1 text-sm font-medium md:ms-2">Security</a>
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
                            <div className='account-security-information-wrapper'>
                                <div className="w-full">
                                     
                                    <form className="px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-semibold mb-2" for="oldpassword"> Old Password </label>
                                            <input  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                    id="oldpassword"  type="password" placeholder="Old Password" onChange={(e) => setoldPassword(e.target.value)} />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-semibold mb-2" for="newpassword"> New Password </label>
                                            <input  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                    id="newpassword"  type="password" placeholder="New Password" onChange={(e) => setnewPassword(e.target.value)} />
                                        </div>
                                        <div className="mb-6">
                                            <label className="block text-gray-700 text-sm font-semibold mb-2" for="newpassword2"> Confirm Password </label>
                                            <input  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                    id="newpassword2"  type="password" placeholder="Confirm Password"  onChange={(e) => setconfirmPassword(e.target.value)} />
                                        </div>
                                        <div className="flex items-center justify-between w-full">
                                            <button className="bg-slate-600 hover:bg-slate-800 w-full text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Submit </button>
                                        </div>
                                        <div className="message mt-4">{message ? <p>{message}</p> : null}</div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </main>

    )
}

