'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';


const page = () => {
    const [genre, setGenre] = useState(null);
    const [isMovie, setIsMovie] = useState(true);

    const bearerToken = process.env.NEXT_PUBLIC_BEARER_TOKEN;
    async function checkMovieID() {
        // console.log("here")
        try {
          const response = await axios.get(`https://api.themoviedb.org/3/genre/movie/list`, {
            headers: { Authorization: `Bearer ${bearerToken}` },
          });
          console.log(response.data.genres);
          setGenre(response?.data?.genres);
        } catch (error) {
          console.error(error);
        }
      }
    
      async function checkTVID() {
        // console.log("here")
        try {
          const response = await axios.get(`https://api.themoviedb.org/3/genre/tv/list`, {
            headers: { Authorization: `Bearer ${bearerToken}` },
          });
          console.log(response.data.genres);
          setGenre(response?.data?.genres);
        } catch (error) {
          console.error(error);
        }
      }

      const handleButtonClick = (e) => {

      }
  

      useEffect(()=>{
        // console.log("here")
        if(isMovie){
            checkMovieID();
        }
        else{
            checkTVID();
        }
        
      },[isMovie])

  return (
    <>
    <div className='m-5 p-2 item-center w-full'>
        <h1 className='font-plusJakarta text-4xl mt-5 font-bold text-center'>Browse by Genre</h1>
    </div>
    {true && <div className="m-5 flex">
        <button
          className={`px-4 py-2 rounded-l-full ${
            isMovie
              ? "bg-black text-white"
              : "bg-gray-300 text-black"
          }`}
          onClick={() => setIsMovie(true)}
        >
          Movies
        </button>
        <button
          className={`px-4 py-2 rounded-r-full ${
            !isMovie
              ? "bg-black text-white"
              : "bg-gray-300 text-black"
          }`}
          onClick={() => setIsMovie(false)}
        >
          TV Shows
        </button>
      </div>}
      <div className='flex flex-row flex-wrap space-x-5 w-full m-5 p-2'>
        
        {genre?.map((g) => {
                {/* image */}
                return(
                    <div className='flex flex-row w-2/7 m-2 p-1 justify-end'>
            <div key = {g?.id} className='flex flex-col space-y-1 justify-between p-1' >
            <Link href={`/genre/${g?.id}`} key={g?.id}
                className="font-plusJakarta text-2xl mt-5 font-bold text-center py-2 px-4 mx-2 my-1 rounded-full border border-black hover:bg-black hover:text-white transition duration-200 text-center">
                   {g?.name}
              </Link>
            {/* <button onClick={() => handleButtonClick(e)} className='font-plusJakarta text-2xl mt-5 font-bold text-center py-2 px-4 rounded border border-black rounded-full hover:bg-black hover:text-white font-normal transition duration-200'>{g.name}</button> */}
            </div></div>)
        })}
      </div>
    </>
  )
}

export default page