'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RefCardSM = ({imdbids, handleRemoveMovie, isExpanded}) => {
    const [data, setData] = useState(null);
    

      // Function to remove a movie from the list


      useEffect(() => {
        const fetchMovie = async () => {
          const bearerToken = process.env.NEXT_PUBLIC_BEARER_TOKEN;
          let newData = [];
        
          // Fetch data for each id
          for (let imdbid of imdbids) {
            try {
              const response = await axios.get('https://api.themoviedb.org/3/movie/' + imdbid, {
                headers: { Authorization: `Bearer ${bearerToken}` },
              });
        
              // Add the data to the temporary array
              if (!newData.some(item => item.id === response.data.id)) {
                newData.push(response.data);
              }
            } catch (error) {
              console.error(error);
            }
          }
      
          // Set the state with the new data
          setData(newData);
        };
      
        if (imdbids !== [] && imdbids.length > 0) {
          fetchMovie();
        } else {
          setData([]);
        }
      }, [imdbids]);
  
  return (
    <>
        {data!==null &&
        data.map((row, index) => {
            return(<div key = {index} className='m-1 flex justify-between rounded-lg overflow-hidden flex-row border border-black w-[200px] h-[100px]'>
                {row.poster_path && (
                <img src={`https://image.tmdb.org/t/p/w200${row.poster_path}`} alt={row.original_title} className="w-16 mr-2" />
              )}
              <div className='flex flex-col p-1 m-2 justify-start'>
              <div className='flex flex-row justify-end content-center '>
              {isExpanded && <button onClick={() => handleRemoveMovie(row.id)} className={`absolute -m-4 p-2 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center hover:bg-red-600 ${isExpanded ? 'opacity-100' : 'opacity-0'}"`}>
                    -
                </button>}
          
          </div>
                <p>{row.title}</p>
            </div>
        </div>)
    })
        }
    </>
  )
}

export default RefCardSM