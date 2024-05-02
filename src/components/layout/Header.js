'use client'

import {React, useEffect, useState} from 'react'
import { useTranslation } from 'react-i18next';

import Link from 'next/link'
import Image from 'next/image'
import { UilHeart, UilSearch, UilShoppingBag, UilComparison, UilBars } from '@iconscout/react-unicons'
import Logo from '../../../public/images/logo/logo.png'
import UserImg from '../../../public/images/user.png'
import Cartdropdown from './Cartdropdown'


let token="";
let session_id="";
if (typeof localStorage !== 'undefined') {
    
    token = localStorage.getItem("jwtToken");
    session_id=localStorage.getItem("sessionId");

    function uuidv4() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }
    if(session_id==null || session_id==""){
        let value = uuidv4();
        if(typeof localStorage !== 'undefined') {
            localStorage.setItem("sessionId",value)
        }
        
    }
}

async function getHeader(){
    // const token = localStorage.getItem("jwtToken");
    const params = new URLSearchParams();
    params.append('SessionId', session_id);
    const response = await fetch(`https://api.wscshop.co.uk/api/layout/get-header?${params.toString()}`,{
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
  

const Header = () => {
    let path="";
    if (typeof window !== 'undefined') {
        path=window.location.pathname
    }
    
    if(path.includes("login")==false && typeof localStorage !== 'undefined'){
        localStorage.setItem("pagePath",path)
    }

    const [data, setData] = useState({ 
                            header:[],
                            isLogin:[]
  });

//   const [isVisible, setIsVisible] = useState(false);
//   const toggleVisibility = () => {
//     setIsVisible(!isVisible);
//   };
  const [data1, setData1] = useState({ 
                            settings:[]
  });


  const [aboutPage, setAboutPage] = useState(0);
  const [faqPage, setFaqPage] = useState(0);
  const [contactPage, setContactPage] = useState(0);
  const [blogPage, setBlogPage] = useState(0);

    useEffect(() => {
        async function fetchDataAsync() {
        const fetchedData = await getHeader();
        setData(fetchedData);
        setData1(fetchedData.header)
        setAboutPage(fetchedData.header.settings[0].aboutPage)
        setFaqPage(fetchedData.header.settings[0].faqPage)
        setContactPage(fetchedData.header.settings[0].contactPage)
        setBlogPage(fetchedData.header.settings[0].blogPage)
        }
        fetchDataAsync();
    }, []);
    
    
    const totalQuantity=data.header.totalQuantity
    const islogin=data.isLogin;
    const settings=data1.settings


    let logout= async (event) => {
        
        const response = await fetch("https://api.wscshop.co.uk/api/account/logout", {
            method: "POST",
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': 'Bearer ' + token
              },});
              if(response.status==200 && typeof localStorage !== 'undefined'){
                localStorage.removeItem("jwtToken");
                localStorage.removeItem("refreshToken");
                if (typeof window !== 'undefined') {
                    window.location.href="/login"
                }
                
              }
      }
    
      let searchClick=async(event)=>{
        const searchWord=event.currentTarget.previousSibling.value;
        if (typeof window !== 'undefined') {
            window.location.href="/search?search="+searchWord
        }
        
      }
      let searchEnter=async(event)=>{
        if (event.key === 'Enter') {
            const searchWord=event.currentTarget.value;
            if (typeof window !== 'undefined') {
                window.location.href="/search?search="+searchWord
            }
            
        }
      }
  
    //   const { t, i18n } = useTranslation();
      
    //   const changeLanguage = async (lng) => {
    //     await i18n.changeLanguage(lng);
    // };
  
  return (
    <div>
        <header>
            <div className='frd-container mx-auto'>
                <div className='header-section-1 hidden lg:block'>
                    <div className='frd-container mx-auto'>
                        <div className='flex justify-between py-2 items-center'>
                            <div className='header-sec1-left'>
                                {
                                    settings.map(set=>{
                                        return(
                                            <ul className='flex'>
                                                <li>{set.phone}</li> 
                                                <li>{set.email}</li> 
                                            </ul>
                                        )
                                    })
                                }
                                
                            </div>
                            {/* <div className='header-sec1-middle'>
                                <span>Tell a friend about Drou & get 20% off *</span>
                            </div> */}
                            <div className='header-sec1-right'>
                                {islogin==0?(<ul className='flex'>

                                    <li>
                                    {/* <Link href='/login/'>{t('login')}</Link> */}
                                    <Link href="/login">Login/Sign Up</Link>
                                    </li>
                                </ul>):(<ul className='flex'>
                                <li className='header-user-list flex items-center gap-1 relative cursor-pointer'>
                                    My Account
                                    <Image src={UserImg} width={30} height={30} className='header-user-img rounded-full ml-2' alt="User Img"/>
                                    <ul className='header-user-dropdown absolute top-full right-0 bg-white py-5 px-4' >
                                        <Link href='/account/profile'>Profile</Link>
                                        <Link href='/account/history'>My Orders</Link>
                                        <Link href='#' onClick={logout}>Log Out</Link>
                                    </ul>
                                </li>
                            </ul>)}
                            </div>
                        </div>
                    </div>
                </div>

                <div className='header-section-2'>
                    <div className='frd-container mx-auto'>
                        <div className='flex justify-between items-center py-2'>
                            <div className='logo'>
                            <Link className='nav-link' href={'/'}>
                                {
                                    settings.map(set=>{
                                        return(
                                            <img src={set.logo} width={180} className='header-logo'></img>
                                        )
                                    })
                                }
                                
                            </Link>  
                                    
                            </div>
                            <div className='nav hidden lg:block'>
                                <ul className='header-nav-ul flex items-center mb-0 pl-0'>
                                    <li className='nav-item'>
                                        <Link className='nav-link' href={'/'}>Home</Link>                 
                                    </li>
                                    <li className='nav-item'>
                                        <Link className='nav-link' href={'/categories'}>Categories</Link>                 
                                    </li>
                                    {
                                        aboutPage==1&&(<li className='nav-item'>
                                        <Link className='nav-link' href={'/about'}>About</Link>                              
                                    </li>)
                                    }
                                    {
                                        faqPage==1&&(<li className='nav-item'>
                                        <Link className='nav-link' href={'/faq'}>Faq</Link>                 
                                    </li>)
                                    }
                                    {
                                        blogPage==1&&(<li className='nav-item'>
                                        <Link className='nav-link' href={'/blogs'}>Blogs </Link>                              
                                    </li>)
                                    }
                                    {
                                        contactPage==1&&(<li className='nav-item'>
                                        <Link className='nav-link' href={'/contact'}>Contact </Link>                              
                                    </li>)
                                    }
                                    
                                </ul>
                            </div>
                            <div className='extra flex gap-5 md:gap-6'>
                                <div className='relative header-search-btn'>
                                <UilSearch size="28" color="#333333" />
                                <div className='search-input-wrap absolute top-full -right-3 z-10 flex items-center justify-center rounded overflow-hidden w-64 p-1 invisible' style={{top:"35px"}}>
                                    <input type='text' className='h-10 py-1 px-3 outline-none'  placeholder='Search...' onKeyDown={searchEnter}/>
                                    <button type='button' className='w-7' onClick={searchClick}><UilSearch size="20" color="#222"/></button>
                                </div>
                            </div>
                                
                                <Link href={'/wishlist'}><UilHeart size="28" color="#333333"/> </Link>
                                {
                                    totalQuantity>0?(
                                    <div className='relative'>
                                        <UilShoppingBag size="28" color="#333333"/>
                                        
                                        <div className='absolute cart-item-count inline-flex items-center justify-center rounded-full text-white text-xs font-semibold' id="cart_quantity">{totalQuantity}</div>
                                        <Cartdropdown />
                                    </div>
                                ):(<div className='relative'>
                                    <UilShoppingBag size="28" color="#333333"/>
                                    <div style={{display:"none"}} className='absolute cart-item-count inline-flex items-center justify-center rounded-full text-white text-xs font-semibold' id="cart_quantity">{totalQuantity}</div>
                                    <Cartdropdown />
                                </div>)
                                }
                                
                                {/* <UilBars size="28" color="#333333"/>  */}
                                <Link href={'/compare'}><UilComparison size="24" color="#333333"/></Link>
                          </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    </div>
    
  )
}

export default Header