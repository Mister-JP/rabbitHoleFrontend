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
  

  const handleSearchResultClick = async (movie) => {
    setIsInputActive(false);
    handleSearchClick(movie, router)
    };

  useEffect(() => {
    const fetchMovie = async () => {
      const bearerToken = process.env.NEXT_PUBLIC_BEARER_TOKEN;

      try {
        const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
          headers: { Authorization: `Bearer ${bearerToken}` },
          params: { query: debouncedInput },
        });
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
  }, [debouncedInput]);

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
    <div className="w-full max-w-md mx-auto" ref={inputRef}>
      <div className="flex items-center m-1 border border-black rounded-full py-2 bg-white">
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
      {data.length > 0 && isInputActive && (
        <div className="border border-black bg-white absolute mt-2 overflow-auto h-half w-80">
          {data.map((movie, index) => (
            <div key={index} className="flex items-center border-t border-gray-300 p-2" onClick={() => handleSearchResultClick(movie)}>
              {movie.poster_path && (
                <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.original_title} className="w-16 mr-2" />
              )}
              <div>
                <h2 className="font-bold text-lg">{movie.original_title}</h2>
                <p className="text-sm text-gray-600">{movie.release_date}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
