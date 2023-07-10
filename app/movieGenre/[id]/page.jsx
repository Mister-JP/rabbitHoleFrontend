'use client';
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Card from '@/app/components/Card';




async function fetchlistMovie(id, moviePage, currentGenre, setMovieData) {
  // const[genrename, setGenreName] = useState(null);
  
    // console.log("here")
    const bearerToken = process.env.NEXT_PUBLIC_BEARER_TOKEN;

    try {
      const response = await axios.get(`https://api.themoviedb.org/3/discover/movie?include_adult=false&language=en-US&page=${moviePage}&sort_by=popularity.desc&with_genres=${id}`, {
        headers: { Authorization: `Bearer ${bearerToken}` },
      });
      console.log(response.data);
      setMovieData(response?.data.results);
    } catch (error) {
      console.error(error);
    }
  }


async function checkMovieID(setCurrentGenre, id, setGenre) {
  // console.log("here")
  const bearerToken = process.env.NEXT_PUBLIC_BEARER_TOKEN;
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/genre/movie/list`, {
      headers: { Authorization: `Bearer ${bearerToken}` },
    });
    // console.log(response.data.genres);
    setGenre(response?.data?.genres);
    // console.log(response?.data?.genres)
    console.log(id)
    const temp = response.data.genres
    console.log(temp)
    console.log(temp.find((item) => item.id.toString() === id).name)
    // setCurrentGenre(response?.data.genres.find((item) => item.id === id)?.name);
    // let foundObj = temp.find((item) => item.id === id);
    // console.log(foundObj)
    setCurrentGenre(temp.find((item) => item.id.toString() === id).name)
  } catch (error) {
    console.error(error);
  }
}


  


const genrePage = ({ params: { id } }) => {
  const [moviePage, setMoviePage] = useState(1);
  const [movieData, setMovieData] = useState([]);
  const [currentGenre, setCurrentGenre] = useState(null);
  const [genre, setGenre] = useState(null);

  useEffect(()=>{
    const fetchData = async() => {
      await checkMovieID(setCurrentGenre, id, setGenre);
      // await fetchlistMovie(id);

    }

    fetchData();
    
  }, [id])

  useEffect(()=>{
    const fetchData = async() => {
      if(currentGenre!==null){
        await fetchlistMovie(id, moviePage, currentGenre, setMovieData);
      }
    }
  
    fetchData();
  }, [currentGenre, moviePage])

  // useEffect(()=>{
  //   console.log(currentGenre)
  // }, [currentGenre])


    return(
        <>
        {currentGenre!==null && <div className='items-center text-center'>
        <h1 className='font-plusJakarta text-4xl mt-5 font-bold'>{currentGenre}</h1>
        </div>}
        <div className="flex flex-row w-full flex-wrap">
          {movieData && movieData.length>0 && movieData?.map(movie => 
          <>
          <div className='w-1/2'>
            <Card key={movie.id} data={movie} genre={genre} isMovie={true}/>
            </div>
          </>
          )}
          <div className="flex flex-row w-full items-center justify-center mt-4">
          <button 
            onClick={() => { 
                setMoviePage(moviePage - 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            disabled={moviePage === 1} 
            className='m-5 p-1 px-3 bg-black rounded-full text-white font-bold'
            >
            Previous
            </button>
            <button 
            onClick={() => { 
                setMoviePage(moviePage + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            className='m-5 p-1 px-3 bg-black rounded-full text-white font-bold'
            >
            Next
            </button>
          </div>
        </div>
        </>
    )
}

export default genrePage