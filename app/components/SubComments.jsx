import React from 'react'
import { useState, useEffect } from 'react';
import api from '../api/LocalApi';
import RefCardsMD from './RefCardsMD';
import References from './References';

const SubCommentCard = ({isFrom, recommendation, nodeID, nodes}) => {

//   console.log(recommendation)
  const [recommendationScore, setRecommendationScore] = useState(0);
  const [totalScore, setTotalScore] = useState(null);
  const [refs, setRefs] = useState([]);

  const fetchRecScore = async () =>{
    try {
        const token = localStorage.getItem('token');
        const score = await api.get('/getScoreUserComment', {
            params: { commentID: recommendation.id },
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        const summary = await api.get('/getScoreComment', {
            params: {commentID: recommendation.id},
            headers: {
                'Content-Type': 'application/json'
            }
        });
        setTotalScore(summary.data.score);
        setRecommendationScore(score.data.score);
        // console.log("for nodeid: ", recommendation.id, "score = ", recommendationScore)
    } 
    catch (error) {
        console.log(error)
        setError('Error fetching source data');
    }
}

const fetchRefs = async () =>{
    try {
        const references = await api.get('/getRefsFromComment', {
            params: { commentID: recommendation.id, startnode_id: nodes[0].id, endnode_id: nodes[1].id },
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log("fetchrefs: ",recommendation.content)
        console.log(references.data.Refs)
        setRefs(references.data.Refs);
        // setRecommendationScore(score.data.score);
        // console.log("for nodeid: ", recommendation.id, "score = ", recommendationScore)
    } 
    catch (error) {
        console.log(error)
        setError('Error fetching source data');
    }
}

const handleScoreChange = async(newScore) =>{
    try{
      const token = localStorage.getItem('token');
      const response = await api.post("/scoreComment",
          {commentID: recommendation.id, score: newScore},
          {
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
          },
      }
      );
      fetchRecScore()
    //   setNodeScore(newScore);
    }
    catch{
      console.log("Some error occured")
    }
  }

  useEffect(() => {
        const fetchData = async () => {
            try{
                //setTotalScore(recommendation.score);
                await fetchRefs();
                await fetchRecScore();
                console.log("successfully loaded card: ", recommendation.content)
            }
            catch{
                console.log("found error in useffect of card: ", recommendation.content)
                console.log("Error occured!")
            }
        }
    
        fetchData();
    }, [recommendation])

  return (
    <>
    <div className='flex flex-col border border-black rounded-lg m-5'>
        <div className='flex flex-row'>
        <div className='flex flex-row border border-black rounded-full px-2 m-5'>
            <p>User level: 👶</p>
        </div>
        {isFrom && 
        <div className='flex flex-row border border-black rounded-full px-2 m-5'>
            <p>From: </p>
        </div>
        }
        </div>
        <p className='ml-5'>{recommendation.content}</p>
        <div className="ml-5 mt-5 flex space-between space-x-4">
                  <div className="flex border rounded-full p-1">
                    👶: {recommendation && totalScore && totalScore[0]}
                  </div>
                  <div className="flex border rounded-full p-1">
                    🧑‍🎓: {recommendation && totalScore && totalScore[1]}
                  </div>
                  <div className="flex border rounded-full p-1">
                    🧑‍💼: {recommendation && totalScore && totalScore[2]}
                  </div>
                  <div className="flex border rounded-full p-1">
                    🧑‍✈️: {recommendation && totalScore && totalScore[3]}
                  </div>
                  <div className="flex border rounded-full p-1">
                    🫅: {recommendation && totalScore && totalScore[4]}
                  </div>
                </div>
                <hr class="mx-5 my-2 h-1 mx-auto bg-gray-100 border-0 rounded light:bg-gray-700"></hr>
                {recommendationScore !== null && (
              <div className="ml-5 mb-5 flex space-between space-x-4">
                <img
                  src={
                    recommendationScore === 2
                      ? `/svgs/DoubleThumbsUpGreen.svg`
                      : `/svgs/DoubleThumbsUp.svg`
                  }
                  alt="double thumbs up"
                  className="w-6"
                  onClick={() => handleScoreChange(2)}
                />
                <img
                  src={
                    recommendationScore === 1
                      ? `/svgs/ThumbsUpGreen.svg`
                      : `/svgs/ThumbsUp.svg`
                  }
                  alt="thumbs up"
                  className="w-6"
                  onClick={() => handleScoreChange(1)}
                />
                <img
                  src={
                    recommendationScore === 0
                      ? `/svgs/PeaceYellow.svg`
                      : `/svgs/Peace.svg`
                  }
                  alt="peace"
                  className="w-6"
                  onClick={() => handleScoreChange(0)}
                />
                <img
                  src={
                    recommendationScore === -1
                      ? `/svgs/ThumbsUpRed.svg`
                      : `/svgs/ThumbsUp.svg`
                  }
                  alt="thumbs down"
                  className="w-6 rotate-180"
                  onClick={() => handleScoreChange(-1)}
                />
                <img
                  src={
                    recommendationScore === -2
                      ? `/svgs/DoubleThumbsUpRed.svg`
                      : `/svgs/DoubleThumbsUp.svg`
                  }
                  alt="double thumbs down"
                  className="w-6 rotate-180"
                  onClick={() => handleScoreChange(-2)}
                />
              </div>
            )}
        <References nodeID={nodeID} refs={refs}/>
    </div>
    
    </>
  )
}

export default SubCommentCard