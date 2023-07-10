"use client";
import Link from "next/link";
import RootLayout from "./layout";
import FilterBar from "./components/FilterBar";
import HomeReccomendationCard from "./components/HomeReccomendationCard";
import HomeCommentCard from "./components/HomeCommentCard";

import { useState, useEffect } from "react";
import axios from 'axios';
// import SourceCard from "../components/SourceCard";
import SourceCard from "./components/SourceCard";
import PopUpLoginRegister from '@/app/components/PopUpLoginRegister'

export default function Home() {
  const [errorCode, setErrorCode] = useState(0);
  const [formType, setFormType] = useState("register");
  const [isExpanded, setIsExpanded] = useState(false);
  const [rotationClass, setRotationClass] = useState('animate-spin--0')
  const [isScore, setIsScore] = useState(true);
  const [search, setSearch] = useState('');
  const [feed, setFeed] = useState('recommendation');
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
  const [recommendation, setRecommendations] = useState(null);
  const [comments, setComments] = useState(null);


    const handleToggle = () => {
      setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        setRotationClass(isExpanded ? 'animate-spin-0' : 'animate-spin-90');
    }, [isExpanded])

    const fetchData = async () => {
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
        filterByNodeID: "1",
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
          newest: isNewest ? 1 : 0
        };

      }

      // Check sortOrder
      if (isCheckboxCheckedScore && isCheckboxCheckedTime) {
        params.sortOrderScoreTime = isScore ? "1" : "0";
      }

      if(feed === 'recommendation'){
        try {
          const response = await axios.get(
            "http://localhost:8000/recHome",
            {
              params: params,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          setRecommendations(response.data);
        } catch (error) {
          if(error.response){
            setErrorCode(error.response.status);
          }
          console.error("There was an error!", error);
        }
      }
      else if(feed==="comments"){
        try {
          const response = await axios.get(
            "http://localhost:8000/comHome",
            {
              params: params,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          setComments(response.data);
        } catch (error) {
          if(error.response){
            setErrorCode(error.response.status);
          }
          console.error("There was an error!", error);
        }
      }
    };
    

    useEffect(() => {
      

      fetchData();
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
      search,
      feed
    ]);


  const handleButtonClick = (label) => {
    setFormType(label);
    setErrorCode(401);
  };
  return (
    <>
    {errorCode===401 && <PopUpLoginRegister formP={formType} setErrorCode={setErrorCode}/>}
    <div className="bg-transparent h-96 flex flex-row relative">
        <div className="w-3/5 relative">
            <img src="/imgs/library.png" className="object-cover h-full w-full"/>
            <div className="bg-radial-gradient absolute inset-0 flex justify-start h-full w-full mt-2">
            <div className="flex flex-col p-2 bg-transparent">
              <h1 style={{textShadow: "2px 2px #000"}} className="font-plusJakarta text-white text-2xl md:text-6xl font-semibold">Explore, Engage, Enjoy: </h1>
              <h1 style={{textShadow: "2px 2px #000"}} className="font-plusJakarta text-white text-2xl md:text-6xl font-semibold">Welcome to Your Movie Community</h1>
              <p style={{textShadow: "2px 2px #000"}} className="mt-5 font-plusJakarta text-white text-l md:text-xl">Recommendations are made by movie lovers like you. Engage in threaded discussions, connect over suggestions, and broaden your cinematic horizons.</p>
              <button onClick={() => handleButtonClick("register")} className="mt-5 py-2 px-4 rounded border border-gray rounded-full font-bold hover:bg-white hover:text-black text-white transition duration-200 w-full md:w-[200px]">Sign up now!</button>
          </div>
            </div>
        </div>
        <img src="/imgs/community.png" className="object-cover h-full w-2/5"/>
    </div>
    <div className="flex flex-col m-5 space-x-4">
    <div className={`flex flex-row space-x-4 cursor-pointer`} onClick={handleToggle}>
        <img src='/svgs/DropDown.svg' className={`w-4 transform ${rotationClass}`}/>
        <div>Filter</div>
      </div>
      <div className={`transition-all duration-500 ease-in-out mb-5 ${isExpanded ? 'h-auto opacity-100' : 'overflow-hidden p-0 h-0 opacity-50'}`}>
        <FilterBar primary="Score" secondary="Time" feed={feed} setFeed={setFeed} searchBar={false} primaryState={isScore} setPrimaryState={setIsScore} search={search} setSearch={setSearch} isCheckboxCheckedScore={isCheckboxCheckedScore} setIsCheckboxCheckedScore={setIsCheckboxCheckedScore} isCheckboxCheckedTime={isCheckboxCheckedTime} setIsCheckboxCheckedTime={setIsCheckboxCheckedTime} isUserLevel1={isUserLevel1} setIsUserLevel1={setIsUserLevel1} isUserLevel2={isUserLevel2} setIsUserLevel2={setIsUserLevel2} isUserLevel3={isUserLevel3} setIsUserLevel3={setIsUserLevel3} isUserLevel4={isUserLevel4} setIsUserLevel4={setIsUserLevel4} isUserLevel5={isUserLevel5} setIsUserLevel5={setIsUserLevel5} isDesc={isDesc} setIsDesc={setIsDesc} isNewest={isNewest} setIsNewest={setIsNewest} selectedOption={selectedOption} setSelectedOption={setSelectedOption}/>
      </div>
      </div>
      {feed==='recommendation' && recommendation!==null &&
      recommendation.map((rec, i)=>{
        
        return (
          <>
          <HomeReccomendationCard key={i} recommendation={rec} setErrorCode={setErrorCode}/>
          </>
        )
      })
      }
      {
        feed==="comments" &&
        comments!==null && 
        comments.map((comm, i) => {
          return (
            <>
            <HomeCommentCard key={i} comment={comm} setErrorCode={setErrorCode} nodeID={comm.path.startnode}/>
            </>
          )
        })
      }
</>



  );
}
