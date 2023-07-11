'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../components/Card';

function TopRatedPage() {  // Renaming the component to TopRatedPage
  const [movieData, setMovieData] = useState([]);
  const [moviePage, setMoviePage] = useState(1);
  const [isMovie, setIsMovie] = useState(true);
  const [genre, setGenre] = useState(null);
  const [tvShowPage, setTvShowPage] = useState(1);
  const [tvShowData, setTvShowData] = useState([]);

  


  const bearerToken = process.env.NEXT_PUBLIC_BEARER_TOKEN;

  async function checkMovieID() {
    // console.log("here")
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/genre/movie/list`, {
        headers: { Authorization: `Bearer ${bearerToken}` },
      });
    //   console.log(response.data.genres);
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
    //   console.log(response.data.genres);
      setGenre(response?.data?.genres);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchMovieData();
    fetchTvShowData();
  }, [moviePage, tvShowPage]);

  async function fetchMovieData() {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/top_rated?include_adult=false&include_video=false&language=en-US&page=${moviePage}&sort_by=vote_average.desc&without_genres=99,10755&vote_count.gte=200`, {
        headers: { Authorization: `Bearer ${bearerToken}` },
      });
      setMovieData(response.data.results);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchTvShowData() {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/tv/top_rated?include_adult=false&language=en-US&page=${tvShowPage}&sort_by=popularity.desc`, {
        headers: { Authorization: `Bearer ${bearerToken}` }, 
      });
    //   console.log(response)
      setTvShowData(response.data.results);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(()=>{
    // console.log("here")
    if(isMovie){
        // fetchMovieData();
        checkMovieID();
    }
    else{
        checkTVID();
        // fetchTvShowData();
    }
    
  },[isMovie])

  return (
    <div className="flex flex-col m-5 space-y-4">
      <div className='items-center text-center'>
        <h1 className='font-plusJakarta text-4xl mt-5 font-bold'>Top Rated</h1>  {/* Updating the title to 'Top Rated' */}
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
      <div className="flex flex-row w-full flex-wrap">
      {isMovie ? (
        <div className="flex flex-row w-full flex-wrap">
          {movieData.map(movie => 
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
      ) : (true && 
        <div className="w-full">
          <div className="flex flex-row w-full flex-wrap">
          {tvShowData?.map(show => 
          <>
          <div className='w-1/2'>
          <Card key={show.id} data={show} genre={genre} isMovie={false}/>
            </div>
          </>
          )}
          </div>
          <div className="flex flex-row w-full items-center justify-center mt-4">
            <button onClick={() => {setTvShowPage(tvShowPage - 1); window.scrollTo({ top: 0, behavior: 'smooth' });}} disabled={tvShowPage === 1} className='m-5 p-1 px-3 bg-black rounded-full text-white font-bold'>Previous</button>
            <button onClick={() => {setTvShowPage(tvShowPage + 1); window.scrollTo({ top: 0, behavior: 'smooth' });}} className='m-5 p-1 px-3 bg-black rounded-full text-white font-bold'>Next</button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default TopRatedPage;


