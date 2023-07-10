'use client';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useDebounce } from 'use-debounce';
import api from '../api/LocalApi';
import { useRouter } from 'next/navigation';

const SearchBar = ({handleSearchClick}) => {
  const [input, setInput] = useState('');
  const [data, setData] = useState([]);
  const [debouncedInput] = useDebounce(input, 300);
  const [isInputActive, setIsInputActive] = useState(false);
  const inputRef = useRef();
  const router = useRouter();
  const [isMovie, setIsMovie] = useState(true); // New state variable to toggle between movie and TV show

  

  const handleSearchResultClick = async (movie) => {
    setIsInputActive(false);
    handleSearchClick(movie, router, isMovie)
    };

  useEffect(() => {
    const fetchMovie = async () => {
      const bearerToken = process.env.NEXT_PUBLIC_BEARER_TOKEN;
      
      try {
        let response = null;
        if(isMovie){
          response = await axios.get('https://api.themoviedb.org/3/search/movie', {
            headers: { Authorization: `Bearer ${bearerToken}` },
            params: { query: debouncedInput },
          });
        }
        else{
          response = await axios.get('https://api.themoviedb.org/3/search/tv', {
            headers: { Authorization: `Bearer ${bearerToken}` },
            params: { query: debouncedInput },
          });
        }
        console.log(response)
        setData(response.data.results);
      } catch (error) {
        console.error(error);
      }
    };

    if (debouncedInput !== '') {
      fetchMovie();
    } else {
      setData([]);
    }
  }, [debouncedInput, isMovie]);

  useEffect(() => {
    const checkIfClickedOutside = e => {
      if (isInputActive && inputRef.current && !inputRef.current.contains(e.target)) {
        setIsInputActive(false);
      }
    }

    document.addEventListener("mousedown", checkIfClickedOutside)

    return () => {
      // Remove the event listener when the component is unmounted or isInputActive changes
      document.removeEventListener("mousedown", checkIfClickedOutside)
    }
  }, [isInputActive]);

  const clearInput = () => {
    setInput('');
  };

  return (
    <div className="w-full max-w-md mx-auto justify-start" ref={inputRef}>
      <div className="flex">
        <button
          className={`px-4 rounded-l-full ${
            isMovie
              ? "bg-black text-white"
              : "bg-gray-300 text-black"
          }`}
          onClick={() => setIsMovie(true)}
        >
          Movies
        </button>
        <button
          className={`px-4 rounded-r-full ${
            !isMovie
              ? "bg-black text-white"
              : "bg-gray-300 text-black"
          }`}
          onClick={() => setIsMovie(false)}
        >
          TV Shows
        </button>
      </div>
      <div className="flex items-center m-1 border border-black rounded-full p-1 bg-white">
      
        <input
          className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search..."
          aria-label="Search"
          onFocus={() => setIsInputActive(true)}
        />
        {input && (
          <button className="flex-shrink-0 mr-2 bg-black text-white h-6 w-6 rounded-full flex items-center justify-center" onClick={clearInput} aria-label="Clear">
            X
          </button>
        )}
      </div>
      {isMovie===true && data.length > 0 && isInputActive && (
        <div className="border border-black bg-white absolute mt-2 overflow-auto h-half w-50 mr-2 md: mr-0 md:w-80 z-50">
          {data.map((movie, index) => (
            <div key={index} className="flex items-center border-t border-gray-300 p-2" onClick={() => handleSearchResultClick(movie)}>
              {movie.poster_path && (
                <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.original_title} className="w-16 mr-2" />
              )}
              <div>
                <h2 className="font-bold text-md md:text-lg">{movie.original_title}</h2>
                <p className="text-sm text-gray-600">{movie.release_date}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {isMovie===false && data.length > 0 && isInputActive && (
        <div className="border border-black bg-white absolute mt-2 overflow-auto h-half w-50 mr-2 md: mr-0 md:w-80 z-50">
          {data.map((movie, index) => (
            <div key={index} className="flex items-center border-t border-gray-300 p-2" onClick={() => handleSearchResultClick(movie)}>
              {movie.poster_path && (
                <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.original_name} className="w-16 mr-2" />
              )}
              <div>
                <h2 className="font-bold text-lg">{movie.original_name}</h2>
                <p className="text-sm text-gray-600">{movie.first_air_date}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
