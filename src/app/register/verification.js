import React, { useEffect, useState } from 'react'
import Swal  from 'sweetalert2';

const Modal = ({ isOpen, onClose, email, children }) => {
    
    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");
  
    let handleSubmit = async (e) => {
      
      e.preventDefault();
      try {
        const res = await fetch("https://api.wscshop.co.uk/api/account/verification", {
          method: "POST",
          headers: {
            'Accept': 'application/json, text/plain',
            'Content-Type': 'application/json;charset=UTF-8'
        },
          body: JSON.stringify({
            Email:email,
            EmailCode: code
          }),
        });
        const resJson = await res.json();
        if (res.status === 200) {
          
          if(resJson.status===400){
            setMessage(resJson.statusText);
          }
          else{
            setCode("");
            //setMessage("Your account has been verified successfully!");
            Swal.fire({
              title: 'Thanks for registration!',
              text: 'We will contact with you soon.',
              icon: 'success',
              showConfirmButton: false,
              timer: 4000
            });
            window.location.href="/login"
          }
          
        } else {
          setMessage(res.statusText);
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (!isOpen) return null;

    return (
        <div className='login-verification-modal-wrapper'>
            <div className='account-lr-wrap mx-auto p-8 text-center'>
                <h4 className='account-page-title'>Verification</h4>
                <p className='mb-8'>Please write the code sent to your e-mail.</p>
                <form className="w-full"onSubmit={handleSubmit}>
                    <div className='account-form-flex mb-4'>
                        <label className='text-sm'>Verification Code</label>
                        <input className='' type='text' placeholder='Code' value={code} onChange={(e) => setCode(e.target.value)}/>
                    </div>
                    <div class='mt-5 flex gap-3 justify-center'>
                        <button class="account-page-btn-success link-design1 inline-block border-none font-bold">Send</button>
                        <span class="account-page-btn link-design1 inline-block border-none font-bold cursor-pointer" onClick={onClose}>Cancel</span>
                    </div>
                    <div className="message">{message ? <p>{message}</p> : null}</div>
                </form>
            </div>
        </div>
    );
};

export default Modal;