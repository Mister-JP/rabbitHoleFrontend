'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { AiOutlineMenu } from 'react-icons/ai';

const NavBar = ({ userEmail, handleButtonClick, handleLogout, showLogout, setShowLogout }) => {
  const [isMenuOpen, setMenuOpen] = useState(true);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        // setMenuOpen(false);
      }
    };
  
    // Attach the listeners to the document
    document.addEventListener("mouseup", handleClickOutside);
  
    // Cleanup the listeners
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center justify-center p-5">
        <div className='flex flex-row'>
            <div onClick={toggleMenu} className="md:hidden cursor-pointer">
             <AiOutlineMenu size={30} />
            </div>

  <div ref={menuRef} className={`transition duration-500 w-full justify-center ease right-0 top-[80px] md:top-0 item-center w-screen md:space-x-4 absolute md:relative bg-white z-50 ${!isMenuOpen ? "flex flex-col md:flex-row" : "hidden"} md:flex md:flex-row space-x-0 md:space-x-6 items-start md:items-center md:bg-transparent`}>
    <div className="px-5 pt-10 md:pt-0 md:px-0 space-y-4 justify-end md:space-y-0 md:flex md:space-x-6 w-full md:w-[900px]">
      <Link href="/" className="py-2 px-4 block text-left rounded hover:bg-black hover:text-white transition duration-200 h-full md:inline w-full md:w-auto" onClick={()=>{setMenuOpen(!isMenuOpen);}}>Home</Link>
      <Link href="/popular" className="py-2 px-4 block text-left rounded hover:bg-black hover:text-white transition duration-200 md:inline w-full md:w-auto" onClick={()=>{setMenuOpen(!isMenuOpen);}}>Popular</Link>
      <Link href="/topRated" className="py-2 px-4 block text-left rounded hover:bg-black hover:text-white transition duration-200 md:inline w-full md:w-auto" onClick={()=>{setMenuOpen(!isMenuOpen);}}>Top Rated</Link>
      <Link href="/genre" className="py-2 px-4 block text-left rounded hover:bg-black hover:text-white transition duration-200 md:inline w-full md:w-auto" onClick={()=>{setMenuOpen(!isMenuOpen);}}>Browse by Genre</Link>
      <Link href="/about" className="py-2 px-4 block text-left rounded hover:bg-black hover:text-white transition duration-200 md:inline w-full md:w-auto" onClick={()=>{setMenuOpen(!isMenuOpen);}}>About</Link>
    </div>

    <div className="px-5 pb-10 md:pb-0 md:px-0 space-y-4 md:space-y-0 md:flex items-start md:items-center space-x-2">
      {userEmail ? (
        <div onMouseEnter={() => setShowLogout(true)} onMouseLeave={() => setShowLogout(false)}>
          <p>{userEmail}</p>
          {showLogout && (
            <div className="absolute py-2 px-4 rounded border border-black rounded-full bg-white hover:bg-black hover:text-white font-normal transition duration-200">
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      ) : (
        <>
          <button onClick={() => {setMenuOpen(!isMenuOpen); handleButtonClick("login")}} className="py-2 px-4 rounded border border-black rounded-full hover:bg-black hover:text-white font-normal transition duration-200">Login</button>
          <button onClick={() => {setMenuOpen(!isMenuOpen); handleButtonClick("register")}} className="py-2 px-4 rounded border border-black rounded-full hover:bg-black hover:text-white font-normal transition duration-200">Register</button>
        </>
      )}
    </div>
  </div>
  </div>
</div>

  );
};

export default NavBar;
