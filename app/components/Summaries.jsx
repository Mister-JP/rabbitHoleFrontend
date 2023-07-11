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
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

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
              response = await axios.get('https://jignasu.pythonanywhere.com/getSummariesSortBoth', {
                params: {
                    indices: indices,
                    descending: scoreDesc,
                    before: before,
                    newest,
                    offset: offset,
                    limit: limit,
                    nodeID: nodeID,
                    filterByNodeID: 1,
                    filterByPathID: 1,
                    pathID,
                    sortOrderScoreTime: sortOrder,
                    summary_search_string: searchText
                },
                headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                },
            });
            }
            else if(timeEnabled){
              response = await axios.get('https://jignasu.pythonanywhere.com/getSummariesSortBoth', {
                  params: {
                      before: before,
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
          else{//sortscoreenabled
            response = await axios.get('https://jignasu.pythonanywhere.com/getSummariesSortBoth', {
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
      else{//unders node
          if(sortOrderEnabled){
            response = await axios.get('https://jignasu.pythonanywhere.com/getSummariesSortBoth', {
              params: {
                  indices: indices,
                  descending: scoreDesc,
                  before: before,
                  newest,
                  offset: offset,
                  limit: limit,
                  nodeID: nodeID,
                  filterByNodeID: 1,
                  sortOrderScoreTime: sortOrder,
                  summary_search_string: searchText
              },
              headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
              },
          });
          }
          else if(timeEnabled){
            response = await axios.get('https://jignasu.pythonanywhere.com/getSummariesSortBoth', {
                params: {
                    before: before,
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
          response = await axios.get('https://jignasu.pythonanywhere.com/getSummariesSortBoth', {
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
            response = await axios.get('https://jignasu.pythonanywhere.com/getSummariesSortBoth', {
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
                  sortOrderScoreTime: sortOrder,
                  summary_search_string: searchText
              },
              headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
              },
          });
          }
          else if(timeEnabled){
            response = await axios.get('https://jignasu.pythonanywhere.com/getSummariesSortBoth', {
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
            response = await axios.get('https://jignasu.pythonanywhere.com/getSummariesSortBoth', {
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
              response = await axios.get('https://jignasu.pythonanywhere.com/getSummariesSortBoth', {
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
                    sortOrderScoreTime: sortOrder,
                    summary_search_string: searchText
                },
                headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                },
            });
            }
            else if(timeEnabled){
              response = await axios.get('https://jignasu.pythonanywhere.com/getSummariesSortBoth', {
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
              response = await axios.get('https://jignasu.pythonanywhere.com/getSummariesSortBoth', {
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
    <div className="bg-white border border-black p-10 m-10 rounded-lg shadow-md">
      <div className="flex flex-col space-y-6">
        {/* Search Bar */}
        <div className="flex items-center space-x-4 mb-4">
          <input
            type="text"
            placeholder="Filter by Keyword..."
            value={searchText}
            onChange={handleSearchChange}
            className="border-2 border-blue-600 rounded px-2 py-1 flex-grow"
          />
        </div>

        {/* Primary Filters */}
        <div className="space-y-4">
          {/* Filter by Score */}
          <div className="flex items-center space-x-4 mb-4">
            <label className="font-semibold text-blue-600">Sort by Score</label>
            <input
              type="checkbox"
              checked={sortEnabled}
              onChange={toggleSort}
              className="border-2 border-blue-600 rounded h-5 w-5"
            />
          </div>

          {/* Sort Order */}
          <div
            className={`mb-4 ${sortEnabled ? "text-black" : "text-gray-300"}`}
          >
            <button
              onClick={handleScoreDescToggle}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              {scoreDesc === 1 ? "Descending" : "Ascending"}
            </button>
          </div>

          {/* Filter by Time */}
          <div className="flex items-center space-x-4 mb-4">
            <label className="font-semibold text-blue-600">Sort by Time</label>
            <input
              type="checkbox"
              checked={timeEnabled}
              onChange={toggleTime}
              className="border-2 border-blue-600 rounded h-5 w-5"
            />
          </div>

          {/* Sort Order (Time) */}
          <div
            className={`mb-4 ${timeEnabled ? "text-black" : "text-gray-300"}`}
          >
            <button
              onClick={handleNewestToggle}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              {newest === 1 ? "Newest First" : "Oldest First"}
            </button>
          </div>
        </div>
        <label
          for="Toggle3"
          className="inline-flex items-center p-2 rounded-md cursor-pointer dark:text-gray-800"
        >
          <input id="Toggle3" type="checkbox" className="hidden peer" />
          <span className="px-4 py-2 rounded-l-md dark:bg-violet-400 peer-checked:dark:bg-gray-300">
            Monthly
          </span>
          <span className="px-4 py-2 rounded-r-md dark:bg-gray-300 peer-checked:dark:bg-violet-400">
            Annually
          </span>
        </label>

        {/* Advanced Filters Toggle */}
        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          {showAdvancedFilters
            ? "Hide Advanced Filters"
            : "Show Advanced Filters"}
        </button>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="space-y-4">
            {/* Counting User Levels */}
            <div
              className={`space-y-2 mb-4 ${
                sortEnabled ? "text-black" : "text-gray-300"
              }`}
            >
              <p className="font-semibold text-blue-600">
                Include User Levels in Score
              </p>
              {["index1", "index2", "index3", "index4", "index5"].map(
                (indexKey) => (
                  <label
                    key={indexKey}
                    className="inline-flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      name={indexKey}
                      checked={index[indexKey] === 1}
                      onChange={handleCheckboxChange}
                      className="border-2 border-blue-600 rounded h-5 w-5"
                    />
                    <span>{indexKey}</span>
                  </label>
                )
              )}
            </div>

            {/* Detailed Time Filtering */}
            <div
              className={`space-y-2 mb-4 ${
                timeEnabled ? "text-black" : "text-gray-300"
              }`}
            >
              <p className="font-semibold text-blue-600">
                Detailed Time Filters
              </p>
              <button
                onClick={handleBeforeAfterToggle}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                {before === 1 ? "Before" : "After"}
              </button>
              <input
                type="date"
                value={date}
                onChange={handleDateChange}
                className="border-2 border-blue-600 rounded px-2 py-1"
              />
              <input
                type="time"
                value={timeStamp}
                onChange={handleTimeChange}
                className="border-2 border-blue-600 rounded px-2 py-1"
              />
            </div>

            {/* Sort Preference */}
            <div
              className={`space-y-2 mb-4 ${
                sortOrderEnabled ? "text-black" : "text-gray-300"
              }`}
            >
              <p className="font-semibold text-blue-600">Primary Sort</p>
              <div className="space-y-2">
                <label className="inline-flex items-center space-x-2">
                  <input
                    type="radio"
                    value="Score"
                    checked={sortOrder === 1}
                    onChange={handleSortOrderScoreTimeToggle}
                    className="h-5 w-5"
                  />
                  <span>Score</span>
                </label>
                <label className="inline-flex items-center space-x-2">
                  <input
                    type="radio"
                    value="Time"
                    checked={sortOrder === 0}
                    onChange={handleSortOrderScoreTimeToggle}
                    className="h-5 w-5"
                  />
                  <span>Time</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex space-x-4 mt-5 mb-4">
        <button
          onClick={handleToggleCreateSummary}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          Create/Edit Summary
        </button>
        <button
          onClick={handleRefresh}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          Refresh Summaries
        </button>
      </div>

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
