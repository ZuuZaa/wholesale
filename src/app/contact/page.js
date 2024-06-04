'use client'
import React, { useState ,useEffect } from 'react'
import { UilLocationPoint, UilPhone, UilClock } from '@iconscout/react-unicons'
async function fetchData(){
  const response = await fetch("https://api.wscshop.co.uk/api/about/get-index");
  const data = await response.json();
  return data.output;
}
import './contact.scss';

export default function Contact() {
  const [data, setData] = useState({ 
      settings: []
  });
  const [contactPage, setContactPage] = useState(0);
  useEffect(() => {
        
    async function fetchDataAsync() {
      
      const fetchedData = await fetchData();
          setData(fetchedData);
          setContactPage(fetchedData.settings[0].contactPage)
      }

    fetchDataAsync();
  }, []);
  const settings = data.settings;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");

    let handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const res = await fetch("https://api.wscshop.co.uk/api/about/add-message", {
            method: "POST",
            headers: {
              'Accept': 'application/json, text/plain',
              'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify({
              Name: name,
              Email: email,
              Subject: subject,
              Message:text
            }),
          });
          const resJson = await res.json();
          if (res.status === 200) {
            setName("");
            setEmail("");
            setSubject("");
            setText("");
            setMessage("User created successfully");
          } else {
            setMessage("Some error occured");
          }
        } catch (err) {
          console.log(err);
        }
      };
  return (
    <main>
      <div className="contact-page-container">
        {contactPage == 1 ? (
          <div>
            {/* Breadcrumb */}
            <div className="breadcrumb-wrapper py-12">
              <div className="custom-container mx-auto">
                <div className="flex" aria-label="Breadcrumb">
                  <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                    <li className="inline-flex items-center">
                      <a
                        href="#"
                        className="inline-flex items-center text-sm font-medium text-gray-700 dark:text-gray-400"
                      >
                        {" "}
                        Home{" "}
                      </a>
                    </li>

                    <li>
                      <div className="flex items-center">
                        <a
                          href="#"
                          className="ms-1 text-sm font-medium text-gray-700  md:ms-2 dark:text-gray-400"
                        >
                          Contact
                        </a>
                      </div>
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Contact  Section Info */}
            <section className="contact-info-section mt-5">
              <div className="custom-container mx-auto">
                <div>
                  <h1 className="text-center md:text-left text-xl md:text-4xl font-bold">
                    We're always eager to hear from you!
                  </h1>
                  <p className="text-center md:text-left ">
                    You can call us in working time or visit our office. All
                    mails will get the response within 24 hours. Love to hear
                    from you!
                  </p>
                  {settings.map((set) => {
                    const hours = set.workTimes.split(",");
                    console.log(hours);
                    const hours_div = [];
                    hours.map((hour) => {
                      hours_div.push(<li>{hour}</li>);
                    });
                    return (
                      <div className="grid grid-cols-1 lg:grid-cols-3 mt-11 gap-2">
                        <div className="flex mb-3 lg:mb-0">
                          <div className="icon mr-5">
                            <UilLocationPoint size="40" color="#e55022" />
                          </div>
                          <div className="content">
                            <h3 className="mb-3 lg:mb-5">Address</h3>

                            <ul>
                              <li>{set.address}</li>
                            </ul>
                          </div>
                        </div>
                        <div className="flex mb-3 lg:mb-0">
                          <div className="icon mr-5">
                            <UilPhone size="40" color="#e55022" />
                          </div>
                          <div className="content">
                            <h3 className="mb-3 lg:mb-5">Contact</h3>

                            <ul>
                              <li>
                                Mobile: <b>{set.phone}</b>
                              </li>
                              <li>
                                Whatsapp: <b>{set.whatsappNo}</b>
                              </li>
                              <li>
                                Email: <b>{set.email}</b>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="flex mb-3 lg:mb-0">
                          <div className="icon mr-5">
                            <UilClock size="40" color="#e55022" />
                          </div>
                          <div className="content">
                            <h3 className="mb-3 lg:mb-5">We are open:</h3>
                            <ul>{hours_div}</ul>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Contact  Section Map */}
            <section className="contact-map-section">
              <div className="custom-container mx-auto">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1244.8769438889544!2d-0.1448854016051989!3d51.389201199999974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4876062f7b172457%3A0x8b818ac37b5c336e!2sWSC%20-Wholesale%20Packaging%20and%20Cleaning%20Products%20Supplier!5e0!3m2!1sen!2str!4v1714057269657!5m2!1sen!2str"
                  width="600"
                  height="450"
                  style={{ border: 0 }}
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </section>

            {/* Contact  Section Form */}
            <section className="contact-form-section">
              <div className="custom-container mx-auto">
                <form className="w-full" onSubmit={handleSubmit}>
                  <h1 className="text-center text-2xl md:text-4xl font-semibold ls-5 mb-12">
                    Ask us anything here
                  </h1>
                  <div className="flex flex-wrap -mx-3">
                    <div className="w-full md:w-1/2 px-3">
                      <input
                        className="appearance-none block w-full  border rounded-full py-3 px-4  leading-tight"
                        id="grid-first-name"
                        type="text"
                        value={name}
                        placeholder="Name *"
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    <div className="w-full md:w-1/2 px-3">
                      <input
                        className="appearance-none block w-full border rounded-full py-3 px-4 leading-tight"
                        id="grid-last-name"
                        type="email"
                        value={email}
                        placeholder="Email *"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap -mx-3">
                    <div className="w-full px-3">
                      <input
                        className="appearance-none block w-full border rounded-full py-3 px-4 leading-tight"
                        id="grid-last-name"
                        type="text"
                        value={subject}
                        placeholder="Subject *"
                        onChange={(e) => setSubject(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap -mx-3">
                    <div className="w-full px-3">
                      <textarea
                        name="postContent"
                        value={text}
                        className="appearance-none block w-full border rounded py-3 px-4 leading-tight"
                        placeholder="Message *"
                        onChange={(e) => setText(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="button-wrapper">
                    <button
                      type="submit"
                      className="inline-block border-none font-bold"
                    >
                      Send message
                    </button>
                  </div>
                  <div className="message">
                    {message ? <p>{message}</p> : null}
                  </div>
                </form>
              </div>
            </section>
          </div>
        ) : (
          <div className="frd-container mx-auto text-center p-12">
            <h1>Page Not Found</h1>
          </div>
        )}
      </div>
    </main>
  );
}

