'use-client';
import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { useDebounce } from 'use-debounce';

function LinkInputForm({ links, setLinks, imdbids, setimdbids, deletesArr, setDeletes }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const dropdownRef = useRef(null);

  // Function to handle changes to the input fields
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Function to add a movie to the list
  const handleAddMovie = (result) => {
    setLinks([...links, result.titleText.text]);
    setimdbids([...imdbids, result.id]);
  };
  
  // Function to remove a movie from the list
  const handleRemoveMovie = (index) => {
    const newLinks = [...links];
    const newImdbids = [...imdbids];
    const linkRemoved = newLinks.splice(index, 1);
    const imdbidRemoved = newImdbids.splice(index, 1);
    setLinks(newLinks);
    setimdbids(newImdbids);
    setDeletes([...deletesArr, linkRemoved[0]]);
  };

  useEffect(() => {
    if (debouncedSearchTerm) {
      axios.get(`https://moviesdatabase.p.rapidapi.com/titles/search/title/${debouncedSearchTerm}?exact=false&titleType=movie&list=most_pop_movies`, {
        headers: {
          'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com',
          'X-RapidAPI-Key': '5499ca0270msh8d1a98d3b11a3cbp10294cjsn89df94456c3f'
        }
      }).then(results => {
        setIsResultsVisible(true)
        setResults(results.data.results.filter(result => result.primaryImage?.url));
      });
    } else {
      setResults([]);
    }
  }, [debouncedSearchTerm]);

  // Listen for clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsResultsVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        {isResultsVisible && results.length > 0 && (
          <div ref={dropdownRef} className="relative top-12 w-full mt-2 bg-white rounded-md shadow-lg max-h-60 overflow-y-auto transition-opacity duration-300">
            {results.map((result, index) => (
              <div key={index} className="p-4 border-b border-gray-200 flex items-center space-x-4 cursor-pointer hover:bg-blue-100 transition-colors duration-200 ease-in-out rounded-lg">
                <img src={result.primaryImage?.url} alt={result.titleText?.text} className="w-16 h-16 object-cover rounded"/>
                <div className="text-black">
                  <div className="font-bold">{result.titleText?.text}</div>
                  <div className="text-gray-600">{result.releaseYear?.year}</div>
                </div>
                <button onClick={() => handleAddMovie(result)} className="p-2 bg-green-500 text-white rounded-full h-10 w-10 flex items-center justify-center hover:bg-green-600">
                  Add
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {links.map((link, index) => (
        <div key={index} className="p-4 border-b border-gray-200 flex items-center space-x-4 cursor-pointer hover:bg-blue-100 transition-colors duration-200 ease-in-out rounded-lg">
          <div className="text-black">
            <div className="font-bold">{link}</div>
          </div>
          <button onClick={() => handleRemoveMovie(index)} className="p-2 bg-red-500 text-white rounded-full h-10 w-10 flex items-center justify-center hover:bg-red-600">
            X
          </button>
        </div>
      ))}
    </div>
  );
}

export default LinkInputForm;
