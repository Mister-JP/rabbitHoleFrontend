'use client';
import React from 'react'
import { useState, useEffect } from 'react';
import api from '../api/LocalApi';
import RefCardsMD from './RefCardsMD';
import References from './References';
import CreateComment from './CreateComment';
import FilterBar from './FilterBar';
import axios from 'axios';

const CommentSectionCard = ({pathID, isFrom, recommendation, nodeID, nodes}) => {

//   console.log(recommendation)
  const [recommendationScore, setRecommendationScore] = useState(0);
  const [totalScore, setTotalScore] = useState(null);
  const [refs, setRefs] = useState([]);

  const [isExpanded, setIsExpanded] = useState(false);
    const [rotationClass, setRotationClass] = useState('animate-spin--0')
    const [isScore, setIsScore] = useState(false);
    const [search, setSearch] = useState('');
    const [isUserLevel1, setIsUserLevel1] = useState(true);
    const [isUserLevel2, setIsUserLevel2] = useState(true);
    const [isUserLevel3, setIsUserLevel3] = useState(true);
    const [isUserLevel4, setIsUserLevel4] = useState(true);
    const [isUserLevel5, setIsUserLevel5] = useState(true);
    const [timeFrame, setTimeFrame] = useState(0);
    const [isDesc, setIsDesc] = useState(true);
    const [isNewest, setIsNewest] = useState(true);
    const [selectedOption, setSelectedOption] = useState('AllTime');
    const [isCheckboxCheckedScore, setIsCheckboxCheckedScore] = useState(true);
    const [isCheckboxCheckedTime, setIsCheckboxCheckedTime] = useState(true);
    const [recommendations, setRecommendations] = useState(null);
    let token;
    if (typeof window !== 'undefined') {
      token = window.localStorage.getItem('token');
    }
    

// Pass params object to axios get method


    const handleToggle = () => {
      setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        setRotationClass(isExpanded ? 'animate-spin-0' : 'animate-spin-90');
    }, [isExpanded])

    const fetchDataSubComments = async () => {
      // Calculate the timestamp
      const getCurrentDateTime = (offsetDays = 0) => {
        const date = new Date();
        date.setDate(date.getDate() - offsetDays); // Subtract days if any

        const current_date =
          date.getUTCFullYear() +
          "-" +
          (date.getUTCMonth() + 1).toString().padStart(2, "0") +
          "-" +
          date.getUTCDate().toString().padStart(2, "0");
        const current_time =
          date.getUTCHours().toString().padStart(2, "0") +
          ":" +
          date.getUTCMinutes().toString().padStart(2, "0") +
          ":" +
          date.getUTCSeconds().toString().padStart(2, "0");

        return `${current_date} ${current_time}`
      };

      let params = {
        offset: "0",
        limit: "50",
        before: "1",
        timestamp: getCurrentDateTime(),
        sortOrderScoreTime: "1",
        summary_search_string: search,
      };

      // Check score checkbox
      if (isCheckboxCheckedScore) {
        // Filter the levels based on state
        let userLevels = [
          isUserLevel1,
          isUserLevel2,
          isUserLevel3,
          isUserLevel4,
          isUserLevel5,
        ];
        let indices = userLevels.flatMap((level, index) =>
          level ? index + 1 : []
        );
        params.indices = indices.join(",");
        params = {
          ...params,
          indices: indices.toString(),
          descending: isDesc ? 1 : 0
        };
        if (isScore) {
          params.sortOrderScoreTime = 1;
        }
        if(!isCheckboxCheckedTime && !isScore){
          setIsScore(!isScore);
        }
      }

      // Check time checkbox
      if (isCheckboxCheckedTime) {
        switch (selectedOption) {
          case "24hours":
            params.before = "0";
            params.timestamp = getCurrentDateTime(1);
            break;
          case "1week":
            params.before = "0";
            params.timestamp = getCurrentDateTime(7);
            break;
          case "1month":
            params.before = "0";
            params.timestamp = getCurrentDateTime(30);
            break;
          case "6months":
            params.before = "0";
            params.timestamp = getCurrentDateTime(180);
            break;
          case "1year":
            params.before = "0";
            params.timestamp = getCurrentDateTime(365);
            break;
          default:
            params.before = "1";
            params.timestamp = getCurrentDateTime();
            break;
        }
        if (!isScore) {
          params.sortOrderScoreTime = 0;
        }
        if(!isCheckboxCheckedScore && isScore){
          setIsScore(!isScore);
        }
        params = {
          ...params,
          newest: isNewest ? 1 : 0,
          filterByCommentID: 1,
          commentID: recommendation.id
        };

      }

      

      // Check sortOrder
      if (isCheckboxCheckedScore && isCheckboxCheckedTime) {
        params.sortOrderScoreTime = isScore ? "1" : "0";
      }
      try {
          const response = await axios.get(
            "http://localhost:8000/getCommentsSortBoth",
            {
              params: params,
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setRecommendations(response.data.Comments);
      } catch (error) {
        console.error("There was an error!", error);
      }
    };
    

    useEffect(() => {
      
      

      fetchDataSubComments();
    }, [
      isScore,
      isUserLevel1,
      isUserLevel2,
      isUserLevel3,
      isUserLevel4,
      isUserLevel5,
      timeFrame,
      isDesc,
      isNewest,
      selectedOption,
      isCheckboxCheckedScore,
      isCheckboxCheckedTime,
      search
    ]);

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
    <div className='flex flex-col border border-black rounded-lg m-1'>
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
        <div className='ml-5 w-5/6'>
        <CreateComment labelText='Reply' isPath={false} commentID={recommendation.id} nodeID={nodeID} fetchData={fetchDataSubComments}/>
        </div>
        <References nodeID={nodeID} refs={refs} commentsButton={false}/>
        
    </div>
    { nodes!==null && recommendations && recommendations.length>0 &&
    <>
    <div className={`flex flex-row space-x-4 cursor-pointer mt-3`} onClick={handleToggle}>
        <img src='/svgs/DropDown.svg' className={`w-4 transform ${rotationClass}`}/>
        <div>Subcomments Filter</div>
      </div>
    <div className={`transition-all w-5/6 duration-500 ease-in-out ml-5 mb-5 ${isExpanded ? 'h-auto opacity-100' : 'overflow-hidden p-0 h-0 opacity-50'}`}>
    <FilterBar key={recommendation.id} primary="Score" secondary="Time" primaryState={isScore} setPrimaryState={setIsScore} search={search} setSearch={setSearch} isCheckboxCheckedScore={isCheckboxCheckedScore} setIsCheckboxCheckedScore={setIsCheckboxCheckedScore} isCheckboxCheckedTime={isCheckboxCheckedTime} setIsCheckboxCheckedTime={setIsCheckboxCheckedTime} isUserLevel1={isUserLevel1} setIsUserLevel1={setIsUserLevel1} isUserLevel2={isUserLevel2} setIsUserLevel2={setIsUserLevel2} isUserLevel3={isUserLevel3} setIsUserLevel3={setIsUserLevel3} isUserLevel4={isUserLevel4} setIsUserLevel4={setIsUserLevel4} isUserLevel5={isUserLevel5} setIsUserLevel5={setIsUserLevel5} isDesc={isDesc} setIsDesc={setIsDesc} isNewest={isNewest} setIsNewest={setIsNewest} selectedOption={selectedOption} setSelectedOption={setSelectedOption}/>
    </div></>}
    <div className='flex'>
        <div className='border-l-2 border-gray-100 hover:border-gray-700 h-30 transition-all duration-200 ml-1'></div>
        <div className='ml-4 w-full'>
          {nodes !== null && recommendations && recommendations.length > 0 &&
            recommendations.map((rec, i) => (
              <div key={i}>
                <CommentSectionCard isFrom={isFrom} recommendation={rec} pathID={pathID} nodeID={nodeID} nodes={nodes} />
              </div>
            ))}
        </div>
      </div>
    </>
  )
}

export default CommentSectionCard