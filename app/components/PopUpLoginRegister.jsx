'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const PopUpLoginRegister = ({setErrorCode, formP = "login" }) => {
  const [form, setForm] = useState(formP); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState("");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleFormSwitch = () => {
    setForm(form === 'login' ? 'register' : 'login');
  };

  const handleInputChange = (setter) => (event) => {
    setter(event.target.value);
  };

  async function onSubmitRegister(){
    try {
        const response = await axios.post(
          "http://localhost:8000/register",
          {
            email,
            date_of_birth: dateOfBirth,
            password,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        console.log(response.data.message);
        router.push("/login");

    } catch (error) {
        if(error.response){
            setErrorCode(error.response.status);
          }
        console.error("Error during registration:", error);
    }
  }

  async function onSubmitLogin() {
    try {
      const response = await axios.post(
        "http://localhost:8000/login",
        {
          email,
          password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response.data.message);
      setErrorCode(response.status)
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userID", response.data.userID);
    } catch (error) {
        if(error.response){
            setErrorCode(error.response.status);
          }
      console.error("Error during login:", error);
      // Show the "Wrong credentials" message
      alert("Incorrect email or password");
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    // Call the appropriate function based on the current form
    if (form === 'login') {
      onSubmitLogin();
    } else {
      onSubmitRegister();
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-[100]">
      <form onSubmit={handleSubmit} className="bg-white p-8 min-w-[400px] max-w-[600px] w-1/4 z-100">
        <div className='flex flex-row justify-end' onClick={() => {setErrorCode(200)}}>
            <img src='/svgs/CrossSVG.svg' className='w-6'/>
        </div>

        <h1 className="font-plusJakarta text-lg font-bold mb-4">{form === 'login' ? 'Login' : 'Register'}</h1>
        <input type="email" placeholder="Email" value={email} onChange={handleInputChange(setEmail)} className="font-plusJakarta border border-black rounded-full mb-4 w-full p-2" />
        
        {form === 'register' && (
          <>
          <label htmlFor="dateOfBirth" className="font-plusJakarta mb-4 w-full p-2">Date of Birth:</label>
          <input
          type="date"
          id="dateOfBirth"
          name="dateOfBirth"
          value={dateOfBirth}
          required
          min="1923-01-01"
          max="2003-12-31"
          className="font-plusJakarta border border-black rounded-full mb-4 w-full p-2" 
          onChange={(e) => setDateOfBirth(e.target.value)}
        />
        </>
        )}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={handleInputChange(setPassword)}
            className="font-plusJakarta border border-black rounded-full mb-4 w-full p-2"
          />
          <button
            type="button"
            className="right-3 top-1/2 transform -translate-y-2/4 p-2"
            onMouseDown={() => setShowPassword(true)}
            onMouseUp={() => setShowPassword(false)}
            onMouseLeave={() => setShowPassword(false)} // handle the case when the button is still pressed but the mouse leaves the button area
          >
            {showPassword ? "Release to Hide" : "Press to Show"}
          </button>
        </div>
        <button type="submit" className="font-plusJakarta mb-4 w-full p-2 bg-black text-white">{form === 'login' ? 'Login' : 'Register'}</button>
        <button type="button" onClick={handleFormSwitch} className="font-plusJakarta w-full p-2 bg-gray-300">{form === 'login' ? 'New here? Register' : 'Already have an account? Login'}</button>
      </form>
    </div>
  );
};

export default PopUpLoginRegister;
