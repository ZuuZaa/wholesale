import React, { useEffect, useState } from 'react'

const Modal = ({ isOpen, onClose, email, children }) => {
    
    const [code, setCode] = useState("");
    const [new_pass,setNewPass]=useState("");
    const [conf_pass,setConfPass]=useState("");
    const [message, setMessage] = useState("");

  let changePass = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://api.wscshop.co.uk/api/account/change-password", {
        method: "POST",
        headers: {
          'Accept': 'application/json, text/plain',
          'Content-Type': 'application/json;charset=UTF-8'
      },
        body: JSON.stringify({
          Email: email,
          EmailCode:code,
          Password: new_pass,
        }),
      });
      const resJson = await res.json();
      console.log(resJson);
      if (res.status === 200) {
        
        if(resJson.status===400){
          setMessage(resJson.statusText);
        }
        else{
          setCode("");
          setNewPass("");
          setConfPass("");
          setMessage("Your password has been changed successfully");
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
                <h4 className='account-page-title'>Change Password</h4>
                <p className='mb-8'>Please, write the code sent to your e-mail and write new password.</p>
                <form className="w-full" onSubmit={changePass}>
                  <div className='account-form-flex mb-4'>
                    <label className='text-sm'>Code</label>
                    <input className='' type='text' placeholder='Code' value={code} onChange={(e) => setCode(e.target.value)}/>
                  </div>
                  <div className='account-form-flex mb-4'>
                    <label className='text-sm'>New Password</label>
                    <input className='' type='password' placeholder='New Password' value={new_pass} onChange={(e) => setNewPass(e.target.value)}/>
                  </div>
                  <div className='account-form-flex mb-4'>
                    <label className='text-sm'>Confirm Password</label>
                    <input className='' type='password' placeholder='Confirm Password' value={conf_pass} onChange={(e) => setConfPass(e.target.value)}/>
                  </div>
                  <div className='mt-5 flex gap-3 justify-center'>
                    <button className="account-page-btn-success link-design1 inline-block border-none font-bold">Send</button>
                    <span className="account-page-btn link-design1 inline-block border-none font-bold cursor-pointer" onClick={onClose}>Cancel</span>
                  </div>
                  <div className="message">{message ? <p>{message}</p> : null}</div>
                </form>
            </div>
          </div>
    );
};

export default Modal;