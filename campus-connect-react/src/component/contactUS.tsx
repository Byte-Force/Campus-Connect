import React, { useState } from 'react';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ContactUs: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();



  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Submitting contact form:', name, email, message);


    // Replace the endpoint URL with the actual API endpoint for submitting the contact form



    console.log('Contact form submitted successfully');
    setName('');
    setEmail('');
    setMessage('');

    // Redirect or display a success message here
    navigate('/home');


  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
      <div className="border rounded-lg shadow-lg p-8 bg-white w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Contact Us
        </h1>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-5">
            <label className="text-gray-700 font-bold text-xl">Name:</label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>
          <div className="mb-5">
            <label className="text-gray-700 font-bold text-xl">Email:</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>
          <div className="mb-5">
            <label className="text-gray-700 font-bold text-xl">Message:</label>
            <textarea
              value={message}
              onChange={handleMessageChange}
              className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-300"
              rows={5}
              required
            />
          </div>
          <button
            className="w-full bg-gradient-to-r from-blue-400 to-purple-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-2 rounded-lg transition-colors duration-300"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
