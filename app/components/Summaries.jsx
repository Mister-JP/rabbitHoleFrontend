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
  const indexStr = ["", "1", "2", "3", "4", "5"];
  
  const [before, setBefore] = useState(1);
  const [scoreDesc, setScoreDesc] = useState(1);
  const [newest, setNewest] = useState(1);
  const [sortOrder, setSortorder] = useState(1);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [timeStamp, setTimeStamp] = useState(current_time);
  const [date, setDate] = useState(current_date);
  const [searchText, setSearchText] = useState("");
  const [enableCreateSummarySection, setEnableCreateSummarySection] = useState(false);
  const [sortEnabled, setSortEnabled] = useState(true);
  const [timeEnabled, setTimeEnabled] = useState(true);

  const toggleSort = () => setSortEnabled(!sortEnabled);
  const toggleTime = () => setTimeEnabled(!timeEnabled);

  const sortOrderEnabled = sortEnabled && timeEnabled;

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
    setBefore(before === 1 ? 0 : 1);
  };

  const handleScoreDescToggle = () => {
    setScoreDesc(scoreDesc === 1 ? 0 : 1);
  };

  const handleNewestToggle = () => {
    setNewest(newest === 1 ? 0 : 1);
  };

  const handleSortOrderScoreTimeToggle = () => {
    setSortorder(sortOrder === 1 ? 0 : 1);
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
      const indices = indexStr[index.index1 === 1? 1 : 0].toString() + (index.index1 === 1? ",": "") + indexStr[index.index2 === 1? 2: 0].toString() +(index.index2 === 1? ",": "")+ indexStr[index.index3 === 1? 3: 0].toString() + (index.index3 === 1? ",": "") + indexStr[index.index4 === 1? 4: 0].toString() + (index.index4 === 1? ",": "") + indexStr[index.index5 === 1? 5: 0].toString();
      let response = null;
      if(isPath){//under path
            if(sortOrderEnabled){
              response = await axios.get('http://localhost:8000/getSummariesSortBoth', {
                params: {
                    indices: indices,
                    descending: scoreDesc,
                    before: before,
                    timestamp: `${date} ${timeStamp}`,
                    newest,
                    offset: offset,
                    limit: limit,
                    nodeID: nodeID,
                    filterByNodeID: 1,
                    filterByPathID: 1,
                    pathID,
                    sortOrderScoreTime: 0,
                    summary_search_string: searchText
                },
                headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                },
            });
            }
            else if(timeEnabled){
              response = await axios.get('http://localhost:8000/getSummariesSortBoth', {
                  params: {
                      before: before,
                      timestamp: `${date} ${timeStamp}`,
                      newest,
                      offset: offset,
                      limit: limit,
                      nodeID: nodeID,
                      filterByNodeID: 1,
                      filterByPathID: 1,
                      pathID,
                      sortOrderScoreTime: 0,
                      summary_search_string: searchText
                  },
                  headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                  },
              });
          }
          else{//sortenabled
            response = await axios.get('http://localhost:8000/getSummariesSortBoth', {
                params: {
                    indices: indices,
                    descending: scoreDesc,
                    offset: offset,
                    limit: limit,
                    nodeID: nodeID,
                    filterByNodeID: 1,
                    sortOrderScoreTime: 1,
                    summary_search_string: searchText
                },
                headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                },
            });
          }
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
      else{//unders summary
        console.log("here0")
          if(sortOrderEnabled){
            console.log("both")
            response = await axios.get('http://localhost:8000/getSummariesSortBoth', {
              params: {
                  indices: indices,
                  descending: scoreDesc,
                  before: before,
                  timestamp: `${date} ${timeStamp}`,
                  newest,
                  offset: offset,
                  limit: limit,
                  nodeID: nodeID,
                  filterByNodeID: 1,
                  sortOrderScoreTime: 0,
                  summary_search_string: searchText
              },
              headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
              },
          });
          }
          else if(timeEnabled){
            console.log("time")
            response = await axios.get('http://localhost:8000/getSummariesSortBoth', {
                params: {
                    before: before,
                    timestamp: `${date} ${timeStamp}`,
                    newest,
                    offset: offset,
                    limit: limit,
                    nodeID: nodeID,
                    filterByNodeID: 1,
                    sortOrderScoreTime: 0,
                    summary_search_string: searchText
                },
                headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                },
            });
        }
        else{//sortenabled
          console.log("here1")
          response = await axios.get('http://localhost:8000/getSummariesSortBoth', {
              params: {
                  indices: indices,
                  descending: scoreDesc,
                  offset: offset,
                  limit: limit,
                  nodeID: nodeID,
                  filterByNodeID: 1,
                  sortOrderScoreTime: 1,
                  summary_search_string: searchText
              },
              headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
              },
          });
        }
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

  const refreshContent = async ()=>{
    const indices = indexStr[index.index1 === 1? 1 : 0].toString() + (index.index1 === 1? ",": "") + indexStr[index.index2 === 1? 2: 0].toString() +(index.index2 === 1? ",": "")+ indexStr[index.index3 === 1? 3: 0].toString() + (index.index3 === 1? ",": "") + indexStr[index.index4 === 1? 4: 0].toString() + (index.index4 === 1? ",": "") + indexStr[index.index5 === 1? 5: 0].toString();
      try{
        if(isPath){
          let refreshDataLimit = data.length
          if(refreshDataLimit<10){
            refreshDataLimit = 10;
          }
          let response = null;
          if(sortOrderEnabled){
            console.log("both")
            response = await axios.get('http://localhost:8000/getSummariesSortBoth', {
              params: {
                  indices: indices,
                  descending: scoreDesc,
                  before: before,
                  timestamp: `${date} ${timeStamp}`,
                  newest,
                  offset: 0,
                  limit: refreshDataLimit,
                  nodeID: nodeID,
                  filterByNodeID: 1,
                  filterByPathID: 1,
                  pathID,
                  sortOrderScoreTime: 0,
                  summary_search_string: searchText
              },
              headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
              },
          });
          }
          else if(timeEnabled){
            console.log("time")
            response = await axios.get('http://localhost:8000/getSummariesSortBoth', {
                params: {
                    before: before,
                    timestamp: `${date} ${timeStamp}`,
                    newest,
                    offset: 0,
                    limit: refreshDataLimit,
                    nodeID: nodeID,
                    filterByNodeID: 1,
                    filterByPathID: 1,
                    pathID,
                    sortOrderScoreTime: 0,
                    summary_search_string: searchText
                },
                headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                },
            });
          }
          else{//sortenabled
            console.log("here1")
            response = await axios.get('http://localhost:8000/getSummariesSortBoth', {
                params: {
                    indices: indices,
                    descending: scoreDesc,
                    offset: 0,
                    limit: refreshDataLimit,
                    nodeID: nodeID,
                    filterByNodeID: 1,
                    filterByPathID: 1,
                    pathID,
                    sortOrderScoreTime: 1,
                    summary_search_string: searchText
                },
                headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                },
            });
          }
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
            console.log("refresh under node")
            let refreshDataLimit = data.length
            if(refreshDataLimit<10){
              refreshDataLimit = 10;
            }
            let response = null;
            if(sortOrderEnabled){
              console.log("both")
              response = await axios.get('http://localhost:8000/getSummariesSortBoth', {
                params: {
                    indices: indices,
                    descending: scoreDesc,
                    before: before,
                    timestamp: `${date} ${timeStamp}`,
                    newest,
                    offset: 0,
                    limit: refreshDataLimit,
                    nodeID: nodeID,
                    filterByNodeID: 1,
                    sortOrderScoreTime: 0,
                    summary_search_string: searchText
                },
                headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                },
            });
            }
            else if(timeEnabled){
              console.log("time")
              response = await axios.get('http://localhost:8000/getSummariesSortBoth', {
                  params: {
                      before: before,
                      timestamp: `${date} ${timeStamp}`,
                      newest,
                      offset: 0,
                      limit: refreshDataLimit,
                      nodeID: nodeID,
                      filterByNodeID: 1,
                      sortOrderScoreTime: 0,
                      summary_search_string: searchText
                  },
                  headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                  },
              });
            }
            else{//sortenabled
              console.log("here1")
              response = await axios.get('http://localhost:8000/getSummariesSortBoth', {
                  params: {
                      indices: indices,
                      descending: scoreDesc,
                      offset: 0,
                      limit: refreshDataLimit,
                      nodeID: nodeID,
                      filterByNodeID: 1,
                      sortOrderScoreTime: 1,
                      summary_search_string: searchText
                  },
                  headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                  },
              });
            }
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
  }

  useEffect(() => {
    fetchSummaries(offset, limit);
  }, []);

  const handleToggleCreateSummary = () => {
    setEnableCreateSummarySection(enableCreateSummarySection ===1? 0 : 1);
  };

  const handleRefresh = () => {
    refreshContent();
  };

  return (
    <div style={{ border: "1px solid black", padding: "10px" }}>
      <div>
        <label>Filter by Score</label>
        <input type="checkbox" checked={sortEnabled} onChange={toggleSort} />
      </div>
      <div className={`sort-controls ${sortEnabled ? "enabled" : "disabled"}`}>
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

        <button onClick={handleScoreDescToggle}>
          {scoreDesc === 1 ? "Desc" : "Asc"}
        </button>
      </div>
      <div>
        <label>Filter by Time</label>
        <input type="checkbox" checked={timeEnabled} onChange={toggleTime} />
      </div>
      <div className={`time-controls ${timeEnabled ? "enabled" : "disabled"}`}>
        <button onClick={handleBeforeAfterToggle}>
          {before === 1 ? "before" : "after"}
        </button>
        <input type="date" value={date} onChange={handleDateChange} />
        <input type="time" value={timeStamp} onChange={handleTimeChange} />
        <button onClick={handleNewestToggle}>
          {newest === 1 ? "New to Old" : "Old to New"}
        </button>
      </div>

      <div
        className={`sort-order-controls ${
          sortOrderEnabled ? "enabled" : "disabled"
        }`}
      >
        <p>Primary Sort</p>
        <label>
          <input
            type="radio"
            value="Score"
            checked={sortOrder === 1}
            onChange={handleSortOrderScoreTimeToggle}
          />
          Score
        </label>
        <label>
          <input
            type="radio"
            value="Time"
            checked={sortOrder === 0}
            onChange={handleSortOrderScoreTimeToggle}
          />
          Time
        </label>
      </div>

      <div className="search-controls">
        <input
          type="text"
          placeholder="Search..."
          value={searchText}
          onChange={handleSearchChange}
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>

      <button onClick={handleToggleCreateSummary}>Create/Edit Summary</button>
      <button onClick={handleRefresh}>Refresh Summaries</button>
      {enableCreateSummarySection === 1 && (
        <CreateComponent
          nodeID={nodeID}
          type="summary"
          fetchSummaries={fetchSummaries}
        />
      )}

      <div>
        {data && (
          <SummaryCarousel
            data={data}
            fetchSummaries={fetchSummaries}
            nodeID={nodeID}
            userID={userID}
          />
        )}
      </div>
    </div>
  );
};

export default Summaries;
