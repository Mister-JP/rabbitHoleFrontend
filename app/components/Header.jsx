'use client';
import Link from "next/link";
import SearchBar from "./SearchBar";
import api from "../api/LocalApi";
import PopUpLoginRegister from "./PopUpLoginRegister";
import { useState, useEffect } from "react";

const Header = () => {
  const [errorCode, setErrorCode] = useState(0);
  const [formType, setFormType] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    const checkTokenHealth = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get("/tokenHealth", 
        {
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
          },
      });
        if(response.data.email) {
            setUserEmail(response.data.email);
        } else {
            setUserEmail(null);
        }
      } catch (error) {
        console.error("Token health check failed: ", error);
        setUserEmail(null);
      }
    };
    checkTokenHealth();
  }, []);

  const handleButtonClick = (label) => {
    setFormType(label);
    setErrorCode(401);
  };

  const handleSearchClick = async (movie, router, isMovie) => {
    try {
      let response = null;
      if(isMovie){
       response = await api.get(`/getSourceByLink?offset=1&limit=1&link=${movie.original_title}&imdbid=${movie.id}&isMovie=1`);
      }
      else{
         response = await api.get(`/getSourceByLink?offset=1&limit=1&link=${movie.original_name}&imdbid=${movie.id}&isMovie=0`);
      }
      if (response.data && response.data.Source) {
        if(isMovie){
           router.push(`/movie/${response.data.Source}`);
      }
      else{
        router.push(`/tvShows/${response.data.Source}`);
   }
      }
    } catch (error) {
      console.error("API request failed: ", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userID');
    setUserEmail(null);
    setShowLogout(false);
  };

  return (
    <>
    {errorCode===401 && <PopUpLoginRegister formP={formType} setErrorCode={setErrorCode}/>}
    <div className="m-5 ml-5 mr-5 mx-auto flex space-between items-center">
      <h1 className="font-plusJakarta text-2xl md:text-3xl font-semibold">
        <Link href="/" className="hover:text-gray-300 transition duration-200">RabbitHole</Link>
      </h1>
      <SearchBar handleSearchClick={handleSearchClick}/>
      <nav className="flex space-x-6 items-center">
      <Link href="/" className="py-2 px-4 rounded hover:bg-black hover:text-white transition duration-200 h-full text-center">Home</Link>
      <Link href="/popular" className="py-2 px-4 rounded hover:bg-black hover:text-white transition duration-200">Popular</Link>
      <Link href="/topRated" className="py-2 px-4 rounded hover:bg-black hover:text-white transition duration-200">Top Rated</Link>
      <Link href="/genre" className="py-2 px-4 rounded hover:bg-black hover:text-white transition duration-200">Browse by Genere</Link>
        <Link href="/about" className="py-2 px-4 rounded hover:bg-black hover:text-white transition duration-200">About</Link>
        <div className="flex items-center space-x-2">
          {userEmail ? (
            <div onMouseEnter={() => setShowLogout(true)} onMouseLeave={() => setShowLogout(false)}>
              <p>{userEmail}</p>
              {showLogout && (
                <div className="absolute right-2 py-2 px-4 rounded border border-black rounded-full bg-white hover:bg-black hover:text-white font-normal transition duration-200">
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button onClick={() => handleButtonClick("login")} className="py-2 px-4 rounded border border-black rounded-full hover:bg-black hover:text-white font-normal transition duration-200">Login</button>
              <button onClick={() => handleButtonClick("register")} className="py-2 px-4 rounded border border-black rounded-full hover:bg-black hover:text-white font-normal transition duration-200">Register</button>
            </>
          )}
        </div>
      </nav>
    </div>
    </>
  );
}

export default Header;
