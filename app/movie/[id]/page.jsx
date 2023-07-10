'use client';
import React, { useState, useEffect } from 'react'
// import api from '../../../api/LocalApi';
import api from '@/app/api/LocalApi';
import axios from 'axios';
import Recommendation from '@/app/components/Recommendation';
import Link from 'next/link';
// import Recommendation from '../../../components/Recommendation';
// import Reference from '@/components/Reference';
import Reference from '@/app/components/Reference';
import PopUpLoginRegister from '@/app/components/PopUpLoginRegister';


const SourcePage = ({ params: { id } }) => {
    const [node, setnode] = useState("");
    const [data, setData] = useState(null);
    const [error, setError] = useState();
    const [nodeScore, setNodeScore] = useState(0);
    const [isRecommendation, setIsRecommendation] = useState(true);
    const[errorCode, setErrorCode] = useState(0);

    const handleScoreChange = async(newScore) =>{
      try{
        const token = localStorage.getItem('token');
        const response = await api.post("/scoreNode",
            {nodeID: id, score: newScore},
            {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }
        );
        fetchNode()
        setNodeScore(newScore);
      }
      catch(error){
        if(error.response){
          setErrorCode(error.response.status);
        }
        console.log("Some error occured")
      }
    }

    const fetchNode = async () =>{
        try {
            const token = localStorage.getItem('token');

            
            const response = await api.get('/getNode', {
            params: { nodeID: id },
            headers: {
                'Content-Type': 'application/json',
            },
            });
            // console.log(response.data)
            setnode(response.data);
            const score = await api.get('/getUserScoreNode', {
                params: { nodeID: id },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            setNodeScore(score.data.Score);
        } 
        catch (error) {
            console.log("here5")
            console.log(error)
            // setError('Error fetching source data');
            console.log("here6")
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try{
                await fetchNode();
            }
            catch{
                console.log("Error occured!")
            }
        }
    
        fetchData();
    }, [])

    useEffect(() => {
        const fetchMovie = async () => {
          const bearerToken = process.env.NEXT_PUBLIC_BEARER_TOKEN;
          // console.log(node)
          try {
            const response = await axios.get('https://api.themoviedb.org/3/movie/' + node.imdbid, {
              headers: { Authorization: `Bearer ${bearerToken}` },
            });
            // console.log(response.data)
            setData(response.data);
          } catch (error) {
            console.error(error);
          }
        };
        if (node !== "") {
          fetchMovie();
        } else {
          setData([]);
        }
      }, [node]);

      // useEffect(()=>{
      //   console.log(data);
      // },[data])

    return (
      <>
      {errorCode===401 && <PopUpLoginRegister classname="z-100" setErrorCode={setErrorCode}/>}
        {data ? (
          <>
            <div className="flex m-5">
              {data && data.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w200${data.poster_path}`}
                  alt={data.original_title}
                  className="w-64 mr-2"
                />
              )}
              <div className="bg-white shadow rounded-lg p-6 w-full">
                <h2 className="text-2xl font-semibold text-gray-800 ">
                  {data.title}
                </h2>
                <p className="text-gray-700 mb-4">
                  {data.release_date && data.release_date.substring(0, 4)}
                </p>
                <div className="flex space-between space-x-4">
                  <div className="flex border rounded-full p-1">
                    👶: {node && node.score && node.score[0]}
                  </div>
                  <div className="flex border rounded-full p-1">
                    🧑‍🎓: {node && node.score && node.score[1]}
                  </div>
                  <div className="flex border rounded-full p-1">
                    🧑‍💼: {node && node.score && node.score[2]}
                  </div>
                  <div className="flex border rounded-full p-1">
                    🧑‍✈️: {node && node.score && node.score[3]}
                  </div>
                  <div className="flex border rounded-full p-1">
                    🫅: {node && node.score && node.score[4]}
                  </div>
                </div>
                <div className="mb-6">
                  <span className="font-medium text-gray-700">Genres: </span>
                  {data &&
                    data.genres &&
                    data.genres.map((genre, index) => (
                      <div key={index} className="text-gray-500">
                        {genre.name}
                        {index < data.genres.length - 1 ? ", " : ""}
                      </div>
                    ))}
                </div>
                <p className="text-gray-700">{data.overview}</p>
              </div>
            </div>
            <hr class="ml-5 mr-5 h-1 mx-auto my-4 bg-gray-100 border-0 rounded md:my-5 light:bg-gray-700"></hr>
            {nodeScore !== null && (
              <div className="ml-5 flex space-between space-x-4">
                <img
                  src={
                    nodeScore === 2
                      ? `/svgs/DoubleThumbsUpGreen.svg`
                      : `/svgs/DoubleThumbsUp.svg`
                  }
                  alt="double thumbs up"
                  className="w-6"
                  onClick={() => handleScoreChange(2)}
                />
                <img
                  src={
                    nodeScore === 1
                      ? `/svgs/ThumbsUpGreen.svg`
                      : `/svgs/ThumbsUp.svg`
                  }
                  alt="thumbs up"
                  className="w-6"
                  onClick={() => handleScoreChange(1)}
                />
                <img
                  src={
                    nodeScore === 0
                      ? `/svgs/PeaceYellow.svg`
                      : `/svgs/Peace.svg`
                  }
                  alt="peace"
                  className="w-6"
                  onClick={() => handleScoreChange(0)}
                />
                <img
                  src={
                    nodeScore === -1
                      ? `/svgs/ThumbsUpRed.svg`
                      : `/svgs/ThumbsUp.svg`
                  }
                  alt="thumbs down"
                  className="w-6 rotate-180"
                  onClick={() => handleScoreChange(-1)}
                />
                <img
                  src={
                    nodeScore === -2
                      ? `/svgs/DoubleThumbsUpRed.svg`
                      : `/svgs/DoubleThumbsUp.svg`
                  }
                  alt="double thumbs down"
                  className="w-6 rotate-180"
                  onClick={() => handleScoreChange(-2)}
                />
              </div>
            )}
            <div className="m-5 flex">
              <button
                className={`px-4 py-2 rounded-l-full ${
                  isRecommendation
                    ? "dark:bg-black dark:text-white"
                    : "dark:bg-gray-300 dark:text-black"
                }`}
                onClick={() => setIsRecommendation(true)}
              >
                Recommendation
              </button>
              <button
                className={`px-4 py-2 rounded-r-full ${
                  !isRecommendation
                    ? "dark:bg-black dark:text-white"
                    : "dark:bg-gray-300 dark:text-black"
                }`}
                onClick={() => setIsRecommendation(false)}
              >
                Only Reference
              </button>
            </div>
          </>
        ) : (
          <div>Loading...</div>
        )}
        {isRecommendation && <Recommendation nodeID={id} setErrorCode={setErrorCode}/>}
        {!isRecommendation && <Reference nodeID={id}/>}
        {error && <div className="text-red-500">{error}</div>}
        
      </>
    );
}

export default SourcePage