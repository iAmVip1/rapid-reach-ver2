import React, { useState } from 'react';
import contactImg from '../../../imagesForWeb/contactus.jpg';
import emailjs from '@emailjs/browser';

export default function Contact() {
  const [openPopup, setOpenPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const sendEmail = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name_of.value.trim();
    const email = form.email_from.value.trim();
    const message = form.message.value.trim();

    // Validation
    if (!name || !email || !message) {
      setPopupMessage('Please fill up all fields!');
      setOpenPopup(true);
      return;
    }

    emailjs.sendForm(
      'service_7ypwibd',
      'template_fbveuhj',
      e.target,
      'f-20bUQYCHKal6pvn'
    ).then(() => {
      setPopupMessage('Bravo!! Your message has been sent');
      setOpenPopup(true);
    }).catch((error) => {
      setPopupMessage(`Error: ${error.message}`);
      setOpenPopup(true);
    });
  };

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-700">
        <div className="flex flex-col lg:flex-row bg-white dark:bg-zinc-800 shadow-lg rounded-lg p-8 lg:w-3/4">
          {/* Left - Contact Form */}
          <div className="lg:w-1/2 w-full lg:mr-8 mb-6 lg:mb-0">
            <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
            <form className="space-y-4" onSubmit={sendEmail}>
              {/* Name Field */}
              <div>
                <label
                  className="block text-sm font-semibold text-gray-700"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  name="name_of"
                  type="text"
                  id="name"
                  placeholder="Your Name"
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              {/* Email Field */}
              <div>
                <label
                  className="block text-sm font-semibold text-gray-700"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  name="email_from"
                  type="email"
                  id="email"
                  placeholder="Your Email"
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              {/* Message Field */}
              <div>
                <label
                  className="block text-sm font-semibold text-gray-700"
                  htmlFor="message"
                >
                  How we can help...
                </label>
                <textarea
                  name="message"
                  id="message"
                  placeholder="Your Message"
                  rows="4"
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                ></textarea>
              </div>
              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-md focus:outline-none"
              >
                Submit
              </button>
            </form>
            {openPopup && (
              <div className="rounded-md p-4 bg-white popup">
                <div className="flex flex-row justify-between">
                  <h2>Notification</h2>
                  <button onClick={() => setOpenPopup(false)}>X</button>
                </div>
                <p className="text-xl">{popupMessage}</p>
              </div>
            )}
          </div>
          {/* Right - Image Section */}
          <div className="lg:w-1/2 w-full flex flex-col items-center">
            <h3 className="text-lg font-medium mb-4">Don't hesitate to contact</h3>
            <img
              src={contactImg}
              alt="Contact Us "
              className="w-full h-auto max-h-64 object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}