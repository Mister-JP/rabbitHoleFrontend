'use client'
import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'
import api from '../api/LocalApi'
import RecommendationCard from './RecommendationCard'
import { useRouter } from 'next/navigation';

const HomeReccomendationCard = ({recommendation, setErrorCode}) => {
  const [data, setData] = useState(null);
  const [nodeScore, setNodeScore] = useState(0);
  const [totalScore, setTotalScore] = useState(null);
  const router = useRouter();

  const fetchNodeScore = async () =>{
    try {

        
        const response = await api.get('/getScoreNode', {
        params: { nodeID: recommendation?.node?.id },
        headers: {
            'Content-Type': 'application/json'
        },
        });
        // console.log(response.data.score)
        setTotalScore(response.data.score);
    } 
    catch (error) {
        console.log(error)
    }
  }

  const fetchNodeScoreByUser = async() => {
    try {
        const token = localStorage.getItem('token');

        
        const response = await api.get('/getUserScoreNode', {
        params: { nodeID: recommendation?.node?.id },
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        });
        setNodeScore(response.data.Score);
    } 
    catch (error) {
        console.log(error)
    }
  }

  const handleScoreChange = async(newScore) =>{
    try{
      const token = localStorage.getItem('token');
      const response = await api.post("/scoreNode",
          {nodeID: recommendation?.node?.id, score: newScore},
          {
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
          },
      }
      );
      fetchNodeScore();
    //   fetchNode()
      setNodeScore(newScore);
    }
    catch(error){
      if(error.response){
        setErrorCode(error.response.status);
      }
      console.log("Some error occured")
    }
  }

  useEffect(()=>{
    const fetchData = async () => {
        try{
            await fetchNodeScore();
            await fetchNodeScoreByUser();
            // await fetchPathScore();
            // await fetchPathScoreByUser();
        }
        catch{
            console.log("Error occured!")
        }
    }

    fetchData();
  }, [recommendation])

  useEffect(() => {
    const fetchMovie = async () => {
      const bearerToken = process.env.NEXT_PUBLIC_BEARER_TOKEN;
    //   console.log(recommendation)
      try {
        let response =null;
        if(recommendation?.node.isMovie===true){
            // console.log("movie")
            // console.log(recommendation)
            response = await axios.get('https://api.themoviedb.org/3/movie/' + recommendation?.node?.imdbid, {
          headers: { Authorization: `Bearer ${bearerToken}` },
            });
        }
        else{
            // console.log("tv")
            // console.log(recommendation)
            response = await axios.get('https://api.themoviedb.org/3/tv/' + recommendation?.node?.imdbid, {
          headers: { Authorization: `Bearer ${bearerToken}` },
        });
        }
        // console.log(response.data)
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    if (recommendation !== null && recommendation?.node?.imdbid!==null) {
      fetchMovie();
    } else {
      setData(null);
    }
  }, [recommendation]);


  //   useEffect(()=>{
//     // console.log(data?.genres)
//     data?.genres?.map((genre)=>{
//     // console.log(genre)
//   })
//   console.log(recommendation.summary)
//   }, [data])

const handleCardClick = () =>{
    router.push(`/${recommendation?.node.isMovie===true? 'movie': 'tvShows'}/${recommendation.node.id}`)
}
  
 
  return (
    <>
      <div className="m-1 md:m-5 border border-black p-0 md:p-5 rounded-md">
      <div className='flex flex-col items-center'>
            <p className='font-plusJakarta text-2xl md:text-3xl font-semibold mb-5 decoration-gray-50'>
                If you liked:
            </p>
          </div>

        <div className="flex flex-col md:flex-row w-full items-center">
            
          {data !== null && data.poster_path && data.poster_path!==null && (
            <img
              src={`https://image.tmdb.org/t/p/w200${data.poster_path}`}
              alt={`${recommendation.node.isMovie===true ? data.original_title : data.original_name}`}
              className="w-64 h-auto mt-1 md:w-64 mr-2 hover:opacity-75"
              onClick={() => handleCardClick()}
            />
          )}
          {data === null && (
            <img
              src="/imgs/filler_poster.png"
              alt="filler_image"
              className="w-64 mr-2"
              
            />
          )}
          <div className="m-5 flex flex-col justify-between w-full">
            <div className="m-5 flex flex-col space-y-4">
              {recommendation !== null && (
                <h2 className="text-2xl font-semibold text-gray-800 hover:underline"  onClick={() => handleCardClick()}>
                  {recommendation.node.link}
                </h2>
              )}
              {data !== null && data.release_date && (
                <p className="text-gray-700 mb-4">
                  {data.release_date && data.release_date.substring(0, 4)}
                </p>
              )}
              <div className="flex flex-row flex-wrap space-y-1 space-x-2 w-full">
                {data !== null &&
                  data?.genres?.map((genre, index) => (
                    <Link
                      key={genre.id}
                      href={`/${recommendation.node.isMovie===true ? 'movie':'tv'}Genre/${genre.id}`}
                      className="py-2 px-4 rounded-full border border-black hover:bg-black hover:text-white transition duration-200 text-center"
                    >
                      {genre.name}
                    </Link>
                  ))}
              </div>
              {data !== null && (
                <p className="text-gray-700">{data.overview}</p>
              )}
            </div>
            <div className="flex flex-col w-full">
              <div className="flex space-between space-x-4 ml-5 mt-5">
                <div className="flex border rounded-full p-1">
                  👶:{" "}
                  {totalScore !== null &&
                    totalScore.length === 5 &&
                    totalScore[0]}
                </div>
                <div className="flex border rounded-full p-1">
                  🧑‍🎓:{" "}
                  {totalScore !== null &&
                    totalScore.length === 5 &&
                    totalScore[1]}
                </div>
                <div className="flex border rounded-full p-1">
                  🧑‍💼:{" "}
                  {totalScore !== null &&
                    totalScore.length === 5 &&
                    totalScore[2]}
                </div>
                <div className="flex border rounded-full p-1">
                  🧑‍✈️:{" "}
                  {totalScore !== null &&
                    totalScore.length === 5 &&
                    totalScore[3]}
                </div>
                <div className="flex border rounded-full p-1">
                  🫅:{" "}
                  {totalScore !== null &&
                    totalScore.length === 5 &&
                    totalScore[4]}
                </div>
              </div>
              <hr class="ml-5 mr-5 h-1 w-6/7 mx-auto my-4 bg-gray-100 border-0 rounded md:my-5 light:bg-gray-700"></hr>
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
            </div>
          </div>
        </div>
        <p className='font-plusJakarta text-2xl md:text-3xl font-semibold mb-5 decoration-gray-50'>
            Human suggestion to watch next:
            </p>
        { recommendation && 
          <RecommendationCard key={recommendation.summary.id} isFrom={false} recommendation={recommendation.summary} nodeID={recommendation.node.id} setErrorCode={setErrorCode}/>
        }
        <div className='m-5'>
      <Link
            key={recommendation?.node?.id}
            href={`/${recommendation?.node.isMovie===true? 'movie': 'tvShows'}/${recommendation.node.id}`}
            className="py-2 px-4 rounded-full border border-black bg-gray-900 text-white hover:bg-black font-bold hover:text-white transition duration-200 text-center"
        >
            Read More Recommendations...
      </Link>
      </div>
      </div>
      
    </>
  );
}

export default HomeReccomendationCard