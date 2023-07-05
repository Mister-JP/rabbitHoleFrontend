import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api/LocalApi';
import { useRouter } from 'next/navigation';
import Link from 'next/link';




const RefCardsMD = ({reference, nodeID}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [data, setData] = useState(null);
    const [rotationClass, setRotationClass] = useState('animate-spin--0')
    const [nodeScore, setNodeScore] = useState(0);
    const [totalScore, setTotalScore] = useState(null);
    const router = useRouter();
    const [pathID, setPathID] = useState('');
    // console.log(reference)
    // console.log(nodeID)

    useEffect(()=>{
        const fetchData = async () => {
            try{
                await fetchMovieDetails();
                await fetchUserNodescore();
                await fetchPathID();
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
            const response = await axios.get('https://api.themoviedb.org/3/movie/' + reference.imdbid, {
              headers: { Authorization: `Bearer ${bearerToken}` },
            });
            setData(response.data);
          } catch (error) {
            console.error(error);
          }
    }

    const fetchPathID = async () => {
        try{
            const pathID = await api.get('/getPathID', {
                params: { startNodeID: nodeID, endNodeID: reference.id },
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setPathID(pathID.data.pathID);
        }
        catch(e){
            console.error(e);
        }
    }

    const fetchUserNodescore = async() =>{
        const token = localStorage.getItem('token');
        const score = await api.get('/getUserScoreNode', {
            params: { nodeID: reference.id },
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        const nodeScore = await api.get('/getScoreNode', {
            params: {nodeID: reference.id},
            headers: {
                'Content-Type': 'application/json'
            }
        });
        setTotalScore(nodeScore.data.score);
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
        catch{
          console.log("Some error occured")
        }
      }


  return (
    <>
    <div className='m-3 flex flex-col justify-between rounded-[15px] overflow-hidden border border-black w-[550px] h-[220px]'>
    <div className='m-3 flex flex-row justify-between overflow-hidden'>
        {data!==null && <img src={`https://image.tmdb.org/t/p/w200${data.poster_path}`} alt={data.original_title} className='scale-100'/>}
        <div className='w-full flex flex-col justify-between'>
        {data!==null && <p className='m-2 p-1'>{data.original_title}</p>}
        <div className="m-2 p-1 flex space-between space-x-4">
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
    <div className='flex flex-row space-x-4 items-center'>
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
            <div class="border-r h-6 border-gray-200"></div>
            <div className='flex flex-row items-center'>
            <img src='/svgs/commentSVG.svg' className='m-1 w-6'/>
            {/* <div class="text-gray-600 text-sm">Comments</div> */}
            <Link href={`/comments/${pathID}`} className="text-gray-600 text-sm">Comments</Link>
            </div>
            <div class="border-r h-6 border-gray-200"></div>
            <div className='flex flex-row items-center'>
            <img src='/svgs/Recommendation.svg' className='m-1 w-6'/>
            <Link href={`/${reference.id}`} className="text-gray-600 text-sm">Recommendation</Link>
            </div>
            </div>
    </div>
    </>
  )
}

export default RefCardsMD