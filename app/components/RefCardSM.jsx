'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RefCardSM = ({imdbids, handleRemoveMovie, isExpanded, isMovies}) => {
    const [data, setData] = useState(null);
    // useEffect(()=>{
    //     console.log(imdbids)
    //     console.log(data)
    //     console.log(isMovies)

    // }, [imdbids, data])    

      // Function to remove a movie from the list


      useEffect(() => {
        async function fetchMovie() {
            const bearerToken = process.env.NEXT_PUBLIC_BEARER_TOKEN;
            let promises = [];
        
            imdbids.forEach((imdbid, index) => {
                if (isMovies[index]) {
                    promises.push(
                        axios.get('https://api.themoviedb.org/3/movie/' + imdbid, {
                            headers: { Authorization: `Bearer ${bearerToken}` },
                        })
                    );
                } else {
                    promises.push(
                        axios.get('https://api.themoviedb.org/3/tv/' + imdbid, {
                            headers: { Authorization: `Bearer ${bearerToken}` },
                        })
                    );
                }
            });
        
            Promise.all(promises)
                .then((results) => {
                    let newData = results.map(response => response.data);
                    // console.log(newData);
                    setData(newData);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
      
        if (imdbids !== [] && imdbids.length > 0) {
          fetchMovie();
        }
      }, [imdbids, isMovies]);

    //   useEffect(()=>{
    //     if (data) {
    //         data.map((row, index) => {
    //           console.log("index: ", index, "row: ", row)
    //         });
    //       } else {
    //         console.log('Data is not available');
    //       }
    //     console.log("only printing data: in useeffect")
    //     console.log(data)
    //   }, [data])
  
  return (
    <>
        {data?.map((row, index) => {
            // console.log("in the jsx map", isMovies[index])
            // console.log(row)
            if(isMovies[index]){
                return(
                <div key = {index} className='m-1 flex justify-between rounded-lg overflow-hidden flex-row border border-black w-[200px] h-[100px]'>
                    {row.poster_path && (
                        <img src={`https://image.tmdb.org/t/p/w200${row.poster_path}`} alt={row.original_title} className="w-16 mr-2" />
                    )}
                    <div className='flex flex-col p-1 m-2 justify-start'>
                        <div className='flex flex-row justify-end content-center '>
                            {isExpanded && 
                                <button onClick={() => handleRemoveMovie(row.id)} className={`absolute -m-4 p-2 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center hover:bg-red-600 ${isExpanded ? 'opacity-100' : 'opacity-0'}"`}>
                                        -
                                </button>
                            }
                        </div>
                        <p>{row.title}</p>
                        </div>
                    </div>
                )
            }
            return(
                <div key = {index} className='m-1 flex justify-between rounded-lg overflow-hidden flex-row border border-black w-[200px] h-[100px]'>
                    {row.poster_path && (
                        <img src={`https://image.tmdb.org/t/p/w200${row.poster_path}`} alt={row.original_name} className="w-16 mr-2" />
                    )}
                    <div className='flex flex-col p-1 m-2 justify-start'>
                        <div className='flex flex-row justify-end content-center '>
                            {isExpanded && 
                                <button onClick={() => handleRemoveMovie(row.id)} className={`absolute -m-4 p-2 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center hover:bg-red-600 ${isExpanded ? 'opacity-100' : 'opacity-0'}"`}>
                                        -
                                </button>
                            }
                        </div>
                        <p>{row.original_name}</p>
                        </div>
                    </div>
                )
            
            
    })
        }
    </>
  )
}

export default RefCardSM