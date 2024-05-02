'use client'
import React, { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe('pk_test_51HKNXMA30TKd8eOAjNrb7RdwrTmD4hlJQCLux7peKzHTeQHarrPOIApBg0ZCXC4UQE2NZ7bEnlyTwpA7MiPMINpN00Pe9eh8UE');

const mainFunc = async () => {
    let status;
    let fav_data=[];

    const fetchData = async () => {
        let token="";
        if (typeof localStorage !== 'undefined') {
            token = localStorage.getItem("jwtToken");
        }
        let response=await fetch(`https://api.wscshop.co.uk/api/checkout/get-client-secret`,{
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
         //console.log(resp)
         status=resp.status
         fav_data=resp.output
         //console.log(fav_data)
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
export default function Test() {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    async function fetchDataAsync() {
    const fetchedData = await mainFunc();
    //console.log(fetchedData)
    setClientSecret(fetchedData);
}
    fetchDataAsync();
}, []);

    
    const options = {
        // passing the client secret obtained from the server
        clientSecret: clientSecret,
      };
      console.log(options)

  return (
    //  <div></div>
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
  );
}