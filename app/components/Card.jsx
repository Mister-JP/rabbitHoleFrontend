'use client'
import React, { useEffect } from 'react';
import Link from 'next/link';
import { Balancer } from 'react-wrap-balancer';
import { useRouter } from "next/navigation";
import api from '../api/LocalApi';
import { useState } from 'react';
import axios from 'axios';

function Card({ data, genre, isMovie=true }) {
//   useEffect(()=>{
//     console.log(genre)
//   }, [genre])
  const router = useRouter();
  
  if (!data) {
    return <img src="/imgs/filler_poster.png" alt="filler_image" className="w-64 mr-2" />
  }

  const handleSearchClick = async (movie) => {
    console.log("in the card first print")
    console.log(movie)
    try {
        if(movie?.id!==null){
        if(movie?.original_name!==null){
      let response = null;
      if(isMovie){
        response = await api.get(`/getSourceByLink?offset=1&limit=1&link=${movie.original_title}&imdbid=${movie.id}&isMovie=1`);
      }
      else{
        response = await api.get(`/getSourceByLink?offset=1&limit=1&link=${movie.original_name}&imdbid=${movie.id}&isMovie=0`);
      }
      console.log("in the card second print")
      console.log(response)
      if (response.data && response.data.Source) {
        if(isMovie){
        router.push(`/movie/${response.data.Source}`);

        }
        else{
        router.push(`/tvShows/${response.data.Source}`);

        }
      }
    }
}
    } catch (error) {
        console.error("API request failed: ", error);
    }
  };

  

//   useEffect(()=>{
//         console.log(genre);
//   }, [genre])

//   useEffect(()=>{
//     checkID()
//   }, [])


  const releaseYear = data.release_date && data.release_date.substring(0, 4);
  console.log(data.genre_ids)

  return (
    <div className="flex flex-row w-full m-5 cursor-pointer items-center p-5 hover:bg-gray-100 transition-colors duration-200 ease-in-out" onClick={() => handleSearchClick(data)}>
        
      {data.poster_path && (
        <img
          src={`https://image.tmdb.org/t/p/w200${data.poster_path}`}
          alt={data.original_title}
          className="w-64 h-64 mr-2"
        />
      )}
      <div className="m-5 flex flex-col w-full">
        <div className="m-5 flex flex-col space-y-4">
          {isMovie===true && <h2 className="text-2xl font-semibold text-gray-800">{data.title}</h2>}
          {isMovie===false && <h2 className="text-2xl font-semibold text-gray-800">{data.original_name}</h2>}
          <p className="text-gray-700 mb-4">{releaseYear}</p>
          <div className="flex flex-row space-x-2 flex-wrap">

            {data?.genre_ids?.map((gnr, index) => {
                // let res = data.filter((item) => gnr.includes(item.id));
                let foundObj = genre?.find((item) => item.id === gnr);
            return(

              <Link href={`/${isMovie? 'movieGenre': 'tvGenre'}/${gnr}`} key={gnr}
                className="py-2 px-4 mx-2 my-1 rounded-full border border-black hover:bg-black hover:text-white transition duration-200 text-center"
                onClick={(event) => event.stopPropagation()}>
                   {foundObj?.name}
              </Link>)
            })}
          </div>
          <Balancer className="text-gray-700">
          {data.overview}
          </Balancer>
          {/* <p className="text-gray-700">{data.overview}</p> */}
        </div>
      </div>
    </div>
  );
}

export default Card;
