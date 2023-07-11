'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api/LocalApi';
import { useRouter } from 'next/navigation';
import Link from 'next/link';




const RefCardsMD = ({reference, nodeID, commentsButton, setErrorCode}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [data, setData] = useState(null);
    const [rotationClass, setRotationClass] = useState('animate-spin--0')
    const [nodeScore, setNodeScore] = useState(0);
    const [totalScore, setTotalScore] = useState(null);
    const router = useRouter();
    const [pathID, setPathID] = useState(null);
    const [enableComment, setEnableComment] = useState(true);
    // console.log(reference)
    // console.log(nodeID)

    useEffect(()=>{
        if(commentsButton!==null){
            setEnableComment(commentsButton)
        }
        
    }, [])

    useEffect(()=>{
        const fetchData = async () => {
            try{
                await fetchPathID();
                await fetchMovieDetails();
                await fetchUserNodescore();
                
            }
            catch{
                console.log("Error occured!")
            }
        }
    
        fetchData();
    }, [reference])

    const fetchMovieDetails = async () => {
        try {
            const bearerToken = process.env.NEXT_PUBLIC_BEARER_TOKEN;
            let response = null;
            if(reference.isMovie===true){
                 response = await axios.get('https://api.themoviedb.org/3/movie/' + reference.imdbid, {
                    headers: { Authorization: `Bearer ${bearerToken}` },
                    });
            }
            if(reference.isMovie===false){
                 response = await axios.get('https://api.themoviedb.org/3/tv/' + reference.imdbid, {
                    headers: { Authorization: `Bearer ${bearerToken}` },
                    });
            }
            
            setData(response.data);
          } catch (error) {
            console.error(error);
          }
    }

    const fetchPathID = async () => {
        try{
            const userID = localStorage.getItem('userID');
            
            const pathID = await api.get('/getPathID', {
                params: { startNodeID: nodeID, endNodeID: reference.id, userID: userID},
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setPathID(pathID.data.pathID);
        }
        catch(e){
            if(e.response){
                setErrorCode(e.response.status);
              }
            console.error(e);
        }
    }

    const fetchUserNodescore = async() =>{
        const token = localStorage.getItem('token');
        const nodeScore = await api.get('/getScoreNode', {
            params: {nodeID: reference.id},
            headers: {
                'Content-Type': 'application/json'
            }
        });
        setTotalScore(nodeScore.data.score);
        const score = await api.get('/getUserScoreNode', {
            params: { nodeID: reference.id },
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        setNodeScore(score.data.Score);
    }

    const handleScoreChange = async(newScore) =>{
        try{
          const token = localStorage.getItem('token');
          const response = await api.post("/scoreNode",
              {nodeID: reference.id, score: newScore},
              {
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
              },
          }
          );
          fetchUserNodescore()
        //   setNodeScore(newScore);
        }
        catch(error){
            if(error.response){
                setErrorCode(error.response.status);
              }
          console.log("Some error occured")
        }
      }

    useEffect(()=>{
        console.log(reference)
    }, [reference])


  return (
    <>
    <div className='m-1 md:m-3 flex flex-col justify-between rounded-[15px] border border-black w-[200px] md:w-[550px] h-auto'>
    <div className='m-1 md:m-3 flex flex-col md:flex-row justify-between overflow-hidden items-center'>
        {data!==null && reference.isMovie===true && <img src={`https://image.tmdb.org/t/p/w200${data.poster_path}`} alt={data.original_title} className='md:h-auto w-32 '/>}
        {data!==null && reference.isMovie===false  && <img src={`https://image.tmdb.org/t/p/w200${data.poster_path}`} alt={data.original_name} className='md:h-auto w-32'/>}
        <div className='w-full flex flex-col justify-between'>
        {data!==null && reference.isMovie===true && <p className='m-2 p-1 text-2xl md:text-xl font-bold'>{data.original_title}</p>}
        {data!==null && reference.isMovie===false && <p className='m-2 p-1 text-2xl md:text-xl font-bold'>{data.original_name}</p>}
        <div className="ml-5 mt-5 flex flex-wrap space-between space-x-4">
                  <div className="flex border rounded-full p-1">
                    👶: {totalScore && totalScore[0]}
                  </div>
                  <div className="flex border rounded-full p-1">
                    🧑‍🎓: {totalScore && totalScore[1]}
                  </div>
                  <div className="flex border rounded-full p-1">
                    🧑‍💼: {totalScore && totalScore[2]}
                  </div>
                  <div className="flex border rounded-full p-1">
                    🧑‍✈️: {totalScore && totalScore[3]}
                  </div>
                  <div className="flex border rounded-full p-1">
                    🫅: {totalScore && totalScore[4]}
                  </div>
                </div>
        </div>
                
    </div>
    <hr className="mx-3 my-1 h-1 mx-auto bg-gray-200 border-0 rounded light:bg-gray-700"></hr>
    <div className='flex flex-col md:flex-row space-x-4 items-center w-full'>
    {nodeScore !== null && (
              <div className="m-2 flex space-between space-x-4">
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
            {enableComment && <><div class="border-r h-6 border-gray-200"></div>
            <div className='flex flex-row items-center'>
            <img src='/svgs/commentSVG.svg' className='m-1 w-6'/>
            {/* <div class="text-gray-600 text-sm">Comments</div> */}
            <Link href={`/comments/${pathID}/${nodeID}`} className="text-gray-600 text-sm">Comments</Link>
            </div></>}
            <div class="border-r h-6 border-gray-200"></div>
            <div className='flex flex-row items-center'>
            <img src='/svgs/Recommendation.svg' className='m-1 w-6'/>
            <Link href={`${reference.isMovie===true? '/movie': '/tvShows'}/${reference.id}`} className="text-gray-600 text-sm">Recommendation</Link>
            </div>
            </div>
    </div>
    </>
  )
}

export default RefCardsMD