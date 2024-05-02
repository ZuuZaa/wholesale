
import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";

async function fetchData(payment_intent){
  let token="";
      if (typeof localStorage !== 'undefined') {
          token = localStorage.getItem("jwtToken");
      }
  const params = new URLSearchParams();
          params.append('payment_intent', payment_intent);
          let response= await fetch(`https://api.wscshop.co.uk/api/checkout/get-payment?${params.toString()}`,{
          method: 'GET',
          dataType: 'json',
          headers: {
              'Accept': 'application/json, text/plain',
              'Content-Type': 'application/json;charset=UTF-8',
              'Authorization': 'Bearer ' + token
          },
      }
      )
  const data = await response.json();
  return data;
}

      

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(async({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          // const fetchedData = await fetchData(paymentIntent.id);
          // console.log(fetchedData)
          // if (fetchedData.status === 200){
          //   //window.location.href="/success"
          // }
          let shipping_id="";
            if (typeof localStorage !== 'undefined' && localStorage.getItem("shipping") !== null) {
              shipping_id=localStorage.getItem("shipping")
                
            }
            let address_id="";
            if (typeof localStorage !== 'undefined' && localStorage.getItem("address") !== null) {
              address_id=localStorage.getItem("address")
                
            }
          let token="";
            if (typeof localStorage !== 'undefined') {
                token = localStorage.getItem("jwtToken");
            }
          const res = await fetch("https://api.wscshop.co.uk/api/checkout/post-payment", {
            method: "POST",
            headers: {
              'Accept': 'application/json, text/plain',
              'Content-Type': 'application/json;charset=UTF-8',
              'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
              PaymentType:1,
              ShippingType:shipping_id,
              AddressId:address_id,
              PaymentIntent:paymentIntent.id
            }),
          });
          console.log(res.status)
          if(res.status==200){
            window.location.href="/success?payment_intent="+paymentIntent.id+"&payment_type=1"
          }
          // const resJson = await res.json();
          // console.log(resJson)
       //const resp =  response.json();
       
          //window.location.href="/success"
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: "http://localhost:3000/checkout",
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs"
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit}>

      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <button className="stripe_button" disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}