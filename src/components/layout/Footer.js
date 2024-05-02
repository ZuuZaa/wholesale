'use client'
import React, { useState ,useEffect } from 'react'
import Link from 'next/link';
import Image from 'next/image';
import Pcard from '../../../public/images/footer/Payment2.png';
import FColImg1 from '../../../public/images/footer/app-store.webp';
import FColImg2 from '../../../public/images/footer/google-play.webp';



  async function fetchData(){
    const response = await fetch("https://api.wscshop.co.uk/api/layout/get-footer");
    const data = await response.json();
    return data.output;
}
  
const Footer =()=> {
    const [data, setData] = useState({ 
        settings: [] ,
        socialMedia:[]
        });

  const [aboutPage, setAboutPage] = useState(0);
  const [faqPage, setFaqPage] = useState(0);
  const [contactPage, setContactPage] = useState(0);

useEffect(() => {

    async function fetchDataAsync() {

    const fetchedData = await fetchData();
        setData(fetchedData);
        setAboutPage(fetchedData.settings[0].aboutPage)
        setFaqPage(fetchedData.settings[0].faqPage)
        setContactPage(fetchedData.settings[0].contactPage)
    }

fetchDataAsync();
}, []);
const settings = data.settings; 
  return (
    <footer>
      <section className="top-footer pt-70 pb-30">
          <div className="frd-container mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ">
                  <div className="footer-col mb-5 sm:mb-7 lg:mb-10 text-center">
                      <h5 className="footer-col-title text-base font-semibold mb-5">Contact Us</h5>
                      {
                        settings.map(set=>{
                            return(
                                <ul className="footer-col-ul">
                                    <li><span>{set.companyName}</span></li>
                                    <li><span>{set.address}</span></li>
                                    <li><span>{set.phone}</span></li>
                                    <li><span>{set.email}</span></li>
                                </ul>

                            )
                        })
                      }
                      
                  </div>
                  {/* <div className="footer-col mb-5 sm:mb-7 lg:mb-10">
                      <h5 className="footer-col-title text-base font-semibold mb-5">Support</h5>
                      <ul className="footer-col-ul">
                          <li><Link href="/about">About Us</Link></li>
                          <li><Link href="/contact">Contact</Link></li>
                          <li><Link href="/faq">Help&FAQ</Link></li>
                          
                      </ul>
                  </div> */}
                  <div className="footer-col mb-5 sm:mb-7 lg:mb-10 text-center">
                      <h5 className="footer-col-title text-base font-semibold mb-5">Our Products</h5>
                      <ul className="footer-col-ul">
                          <li><Link href="/products/3">Trending Products</Link></li>
                          <li><Link href="/products/2">BestSeller Products</Link></li>
                          <li><Link href="/products/4">New Products</Link></li>
                          <li><Link href="/products/1">Featured Products</Link></li>
                      </ul>
                  </div>
                  <div className="footer-col mb-5 sm:mb-7 lg:mb-10 text-center">
                  <h5 className="footer-col-title text-base font-semibold mb-5">Information</h5>
                      <ul className="footer-col-ul">
                        {
                            aboutPage==1&&(<li><Link href="/about">About Us</Link></li>)
                        }
                        {
                            contactPage==1&&(<li><Link href="/contact">Contact</Link></li>)
                        }
                        {
                            faqPage==1&&(<li><Link href="/faq">FAQ</Link></li>)
                        }  
                          
                          
                          <li><Link href="#">Privacy&Policy</Link></li>
                          <li><Link href="#">Refund Policy</Link></li>
                          <li><Link href="#">Delivery Information</Link></li>
                          <li><Link href="#">Terms&Conditions</Link></li>
                      </ul>
                  </div>
              </div>
          </div>
      </section>
      <section className="bottom-footer">
            <div className="frd-container mx-auto py-4">
                <div className="flex items-center flex-col justify-center lg:flex-row lg:justify-between">
                    <div className="footer-copyright mb-5 text-center lg:text-left lg:mb-0">
                        {
                            settings.map(set=>{
                                return(
                                    <p>Copyright © {set.companyName} | Built by <Link href="https://logix.store">Logix</Link>.</p>
                                )
                            })
                        }
                        
                    </div>
                    <div className="footer-cards flex gap-3">
                        <Image src={Pcard} width={300} height={200} alt="Picture of the author"/>
                    </div>
                </div>
            </div>
        </section>
    </footer>
  )
}

export default Footer