'use client'
import React, { useState, useEffect } from 'react';
import Dropdown from './CheckBox';
import ToggleButton from './ToggleButton';
import FilterBar from './FilterBar';
import CreateRecommendation from './CreateRecommendation';
import RecommendationCard from './RecommendationCard';
import axios from 'axios';
import RefCardsMD from './RefCardsMD';

const Reference = ({nodeID}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [rotationClass, setRotationClass] = useState('animate-spin--0')
    const [isScore, setIsScore] = useState(false);
    const [isFrom, setIsFrom] = useState(true)
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
    const [references, setReferences] = useState(null);
    let token;
    if (typeof window !== 'undefined') {
      token = window.localStorage.getItem('token');
    }
    

    // useEffect(()=>{
    //   console.log(references)
    // }, [references])


    const handleToggle = () => {
      setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        setRotationClass(isExpanded ? 'animate-spin-0' : 'animate-spin-90');
    }, [isExpanded])
    

    useEffect(() => {
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
          nodeID: nodeID,
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
        if(!isFrom){
          try {
            const response = await axios.get(
              "https://jignasu.pythonanywhere.com/getRefsToNodeID",
              {
                params: params,
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setReferences(response.data.Nodes);
          } catch (error) {
            console.error("There was an error!", error);
          }
        }
        else{
          try {
            const response = await axios.get(
              "https://jignasu.pythonanywhere.com/getRefsFromNodeID",
              {
                params: params,
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setReferences(response.data.Nodes);
          } catch (error) {
            console.error("There was an error!", error);
          }
        }
        // try {
        //   const response = await axios.get(
        //     "https://jignasu.pythonanywhere.com/getSummariesSortBoth",
        //     {
        //       params: params,
        //       headers: {
        //         "Content-Type": "application/json",
        //         Authorization: `Bearer ${token}`,
        //       },
        //     }
        //   );
        //   setReferences(response.data.Source);
        //   console.log(response.data);
        // } catch (error) {
        //   console.error("There was an error!", error);
        // }
      };

      fetchData();
    }, [
      isScore,
      isFrom,
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

  return (
    <>
     <div className="flex flex-col m-5 space-x-4">
      <div className={`flex flex-row space-x-4 cursor-pointer`} onClick={handleToggle}>
        <img src='/svgs/DropDown.svg' className={`w-4 transform ${rotationClass}`}/>
        <div>Filter</div>
      </div>
      <div className={`transition-all duration-500 ease-in-out mb-5 ${isExpanded ? 'h-auto opacity-100' : 'overflow-hidden p-0 h-0 opacity-50'}`}>
      <FilterBar primary="Score" secondary="Time" primaryState={isScore} setPrimaryState={setIsScore} search={search} setSearch={setSearch} isCheckboxCheckedScore={isCheckboxCheckedScore} setIsCheckboxCheckedScore={setIsCheckboxCheckedScore} isCheckboxCheckedTime={isCheckboxCheckedTime} setIsCheckboxCheckedTime={setIsCheckboxCheckedTime} isUserLevel1={isUserLevel1} setIsUserLevel1={setIsUserLevel1} isUserLevel2={isUserLevel2} setIsUserLevel2={setIsUserLevel2} isUserLevel3={isUserLevel3} setIsUserLevel3={setIsUserLevel3} isUserLevel4={isUserLevel4} setIsUserLevel4={setIsUserLevel4} isUserLevel5={isUserLevel5} setIsUserLevel5={setIsUserLevel5} isDesc={isDesc} setIsDesc={setIsDesc} isNewest={isNewest} setIsNewest={setIsNewest} selectedOption={selectedOption} setSelectedOption={setSelectedOption}/>
      </div>
      <ToggleButton primary="From" secondary="To" primaryState={isFrom} setPrimaryState={setIsFrom}/>
      <div className='flex flex-row m-5'>
      
      <img src="/svgs/refSVG.svg" className='w-5'/>
      <p>Reference: </p>
      </div>
      { references && references.length>0 &&
      references.map((reference, index)=>(
        
        // console.log(reference)
        <RefCardsMD reference={reference} key={index} nodeID={nodeID}/>
        
      ))
      }
    </div>
    </>
  )
}

export default Reference