'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';  // make sure to install this package
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import CommentCard from './CommentCard';
import SummaryCarousel from './SummaryCarousel';
import CreateComponent from './CreateComponent';

const Summaries = ({ nodeID, isPath=false, pathID=null }) => {
  const getCurrentDateTime = () => {
    const date = new Date();

  const current_date = date.getUTCFullYear() + '-' + (date.getUTCMonth() + 1).toString().padStart(2, '0') + '-' + date.getUTCDate().toString().padStart(2, '0');
  const current_time = date.getUTCHours().toString().padStart(2, '0') + ':' + date.getUTCMinutes().toString().padStart(2, '0') + ':' + date.getUTCSeconds().toString().padStart(2, '0');

  return { current_date, current_time };
  };
  
  const { current_date, current_time } = getCurrentDateTime();
  const [data, setData] = useState([]);
  const [index, setIndex] = useState({
    index1: 1,
    index2: 1,
    index3: 1,
    index4: 1,
    index5: 1,
  });
  
  const [before, setBefore] = useState(1);
  const [scoreDesc, setScoreDesc] = useState(1);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [timeStamp, setTimeStamp] = useState(current_time);
  const [date, setDate] = useState(current_date);
  const [searchText, setSearchText] = useState("");
  const [enableCreateSummarySection, setEnableCreateSummarySection] = useState(false);

  const handleCheckboxChange = (e) => {
    setIndex({ ...index, [e.target.name]: e.target.checked ? 1 : 0 });
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    setTimeStamp(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleBeforeAfterToggle = () => {
    setBeforeAfter(beforeAfter === 1 ? 0 : 1);
  };

  const handleScoreDescToggle = () => {
    setScoreDesc(scoreDesc === 1 ? 0 : 1);
  };

  const handleSubmit = () => {
    console.log("clicked");
  };

  let token;
  if (typeof window !== 'undefined') {
    token = window.localStorage.getItem('token');
  }

  let userID=null;
  if (typeof window !== 'undefined') {
    userID = window.localStorage.getItem('userID');
  }

//   console.log(token)

  const fetchSummaries = async (offset = 0, limit = 10) => {
    try {
        if(isPath){
            const response = await axios.get('http://localhost:8000/getSummariesSortBoth', {
                params: {
                    index1: index.index1,
                    index2: index.index2,
                    index3: index.index3,
                    index4: index.index4,
                    index5: index.index5,
                    before_after: before === 1 ? "before" : "after",
                    score_desc: scoreDesc,
                    timestamp: `${date} ${timeStamp}`,
                    summary_search_string: searchText,
                    offset: offset,
                    limit: limit,
                    nodeID: nodeID,
                    filterByNodeID: 1,
                    filterByPathID: 1,
                    pathID
                },
                headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                },
            });
            if (offset === 0) 
            {
                setData(response.data.Source);
            } 
            else 
            {
                setData((data) => [...data, ...response.data.Source]);
            }
            return response.data;
        }
        else{
            const response = await axios.get('http://localhost:8000/getSummariesSortBoth', {
                params: {
                    index1: index.index1,
                    index2: index.index2,
                    index3: index.index3,
                    index4: index.index4,
                    index5: index.index5,
                    before_after: before === 1 ? "before" : "after",
                    score_desc: scoreDesc,
                    timestamp: `${date} ${timeStamp}`,
                    summary_search_string: searchText,
                    offset: offset,
                    limit: limit,
                    nodeID: nodeID,
                    filterByNodeID: 1,
                },
                headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                },
            });
            if (offset === 0) 
            {
                setData(response.data.Source);
            } 
            else 
            {
                setData((data) => [...data, ...response.data.Source]);
            }
            return response.data;
        }
    } 
    catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log("here")
    fetchSummaries(offset, limit);
  }, []);

  const handleToggleCreateSummary = () => {
    setEnableCreateSummarySection(enableCreateSummarySection ===1? 0 : 1);
  };

  return (
    <div style={{ border: '1px solid black', padding: '10px' }}>
      <div>
        {["index1", "index2", "index3", "index4", "index5"].map((indexKey) => (
            <label key={indexKey}>
            <input
                type="checkbox"
                name={indexKey}
                checked={index[indexKey] === 1}
                onChange={handleCheckboxChange}
            />
            {indexKey}
            </label>
        ))}

        <input type="date" value={date} onChange={handleDateChange} />
        <input type="time" value={timeStamp} onChange={handleTimeChange} />

        <button onClick={handleBeforeAfterToggle}>
            {before === 1 ? "before" : "after"}
        </button>
        <button onClick={handleScoreDescToggle}>
            {scoreDesc === 1 ? "Desc" : "Asc"}
        </button>

        <input
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={handleSearchChange}
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>
      <button onClick={handleToggleCreateSummary }>Create/Edit Summary</button>
      {enableCreateSummarySection===1 && <CreateComponent nodeID={nodeID} type='summary'/>}
      <div>
      {data && <SummaryCarousel data={data} fetchSummaries={fetchSummaries} nodeID={nodeID} userID={userID}/>}
    </div>
    
    </div>
  );
};

export default Summaries;
