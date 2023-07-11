'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';  // make sure to install this package
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import PathCarousel from './PathCarousel';
import CreateComponent from './CreateComponent';

//So paths when inside the summary we will not allow user to give the numbers we will just ask user
//to enter the links in the summary in some special way such that we know what to replace in the summary with the 
//numbers and then also allow the sorting and the filtering in the paths
//how will we refer to the source filtered out of the list?
const Paths = ({ nodeID, summaryID, isComment, commentID }) => {
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
  const [loading, setLoading] = useState(true);
  const [errorOccured, setErrorOccured] = useState(false)
  const [hasMoreData, setHasMoreData] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const fetchPaths = async (offset = 0, limit = 10) => {
    try {
      const indices = indexStr[index.index1 === 1? 1 : 0].toString() + (index.index1 === 1? ",": "") + indexStr[index.index2 === 1? 2: 0].toString() +(index.index2 === 1? ",": "")+ indexStr[index.index3 === 1? 3: 0].toString() + (index.index3 === 1? ",": "") + indexStr[index.index4 === 1? 4: 0].toString() + (index.index4 === 1? ",": "") + indexStr[index.index5 === 1? 5: 0].toString();
      let response = null;
      //change it to filter_sort_tables later to apply the filter
        if(isComment){
            setLoading(true);
            setErrorOccured(false)
            if(sortOrderEnabled){
              response = await axios.get('https://jignasu.pythonanywhere.com/getPathsSortBoth', {
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
                      filterByCommentID: 1,
                      commentID,
                      sortOrderScoreTime: sortOrder,
                      path_search_string: searchText
                  },
                  headers: {
                  'Content-Type': 'application/json'
                  },
              });
            }
            else if(timeEnabled){
              response = await axios.get('https://jignasu.pythonanywhere.com/getSummariesSortBoth', {
                  params: {
                    before: before,
                    timestamp: `${date} ${timeStamp}`,
                    newest,
                    offset: offset,
                    limit: limit,
                    nodeID: nodeID,
                    filterByNodeID: 1,
                    filterByCommentID: 1,
                    commentID,
                    sortOrderScoreTime: 0,
                    path_search_string: searchText
                  },
                  headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                  },
              });
            }
            else{//sortscoreenabled
              response = await axios.get('https://jignasu.pythonanywhere.com/getPathsSortBoth', {
                  params: {
                      indices: indices,
                      descending: scoreDesc,
                      offset: offset,
                      limit: limit,
                      nodeID: nodeID,
                      filterByNodeID: 1,
                      filterByCommentID: 1,
                      commentID,
                      sortOrderScoreTime: 1,
                      path_search_string: searchText
                  },
                  headers: {
                  'Content-Type': 'application/json'
                  },
              });
            }
            if(response.status == 200){
                setLoading(false)
                setErrorOccured(false)
            }
            else{
                setErrorOccured(true)
            }
            if (offset === 0) 
            {
                setData(response.data.Paths);
            } 
            else 
            {
                setData((data) => [...data, ...response.data.Paths]);
            }
            if (response.data.Paths.length < 10) {
                setHasMoreData(false);
            }
            return response.data;
        }
        else{
            setLoading(true);
            setErrorOccured(false);
            if(sortOrderEnabled){
              response = await axios.get('https://jignasu.pythonanywhere.com/getPathsSortBoth', {
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
                      sortOrderScoreTime: sortOrder,
                      path_search_string: searchText,
                      filterBySummaryID: 1,
                      summaryID,
                      offset: offset,
                      limit: limit,
                  },
                  headers: {
                  'Content-Type': 'application/json'
                  },
              });
            }
            else if(timeEnabled){
              response = await axios.get('https://jignasu.pythonanywhere.com/getPathsSortBoth', {
                  params: {
                      before: before,
                      timestamp: `${date} ${timeStamp}`,
                      newest,
                      offset: offset,
                      limit: limit,
                      nodeID: nodeID,
                      filterByNodeID: 1,
                      sortOrderScoreTime: 0,
                      path_search_string: searchText,
                      filterBySummaryID: 1,
                      summaryID,
                      offset: offset,
                      limit: limit,
                  },
                  headers: {
                  'Content-Type': 'application/json'
                  },
              });
            }
            else{//sortenabled
              response = await axios.get('https://jignasu.pythonanywhere.com/getPathsSortBoth', {
                  params: {
                      indices: indices,
                      descending: scoreDesc,
                      offset: offset,
                      limit: limit,
                      nodeID: nodeID,
                      filterByNodeID: 1,
                      sortOrderScoreTime: sortOrder,
                      path_search_string: searchText,
                      filterBySummaryID: 1,
                      summaryID,
                      offset: offset,
                      limit: limit,
                  },
                  headers: {
                  'Content-Type': 'application/json'
                  },
              });
            }
            if(response.status == 200){
                setLoading(false)
                setErrorOccured(false)
            }
            else{
                setErrorOccured(true)
            }
            if (offset === 0) 
            {
                setData(response.data.Paths);
            } 
            else 
            {
                setData((data) => [...data, ...response.data.Paths]);
            }
            if (response.data.Paths.length < 10) {
                setHasMoreData(false);
            }
            return response.data;
        }
        
    } catch (error) {
      console.log("error")
      console.error(error);
      setErrorOccured(true);  // Set errorOccurred to true in case of error
      setLoading(false); 
    }
  };

  const refreshContent = async() => {
    const indices = indexStr[index.index1 === 1? 1 : 0].toString() + (index.index1 === 1? ",": "") + indexStr[index.index2 === 1? 2: 0].toString() +(index.index2 === 1? ",": "")+ indexStr[index.index3 === 1? 3: 0].toString() + (index.index3 === 1? ",": "") + indexStr[index.index4 === 1? 4: 0].toString() + (index.index4 === 1? ",": "") + indexStr[index.index5 === 1? 5: 0].toString();
    let response = null;  
    try {
      setCurrentIndex(0)
      let refreshDataLimit = data.length
      if(refreshDataLimit<10)
      {
        refreshDataLimit = 10;
      }
      //change it to filter_sort_tables later to apply the filter
      if(isComment){
          setLoading(true);
          setErrorOccured(false)
          if(sortOrderEnabled){
            response = await axios.get('https://jignasu.pythonanywhere.com/getPathsSortBoth', {
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
                    filterByCommentID: 1,
                    commentID,
                    sortOrderScoreTime: sortOrder,
                    path_search_string: searchText
                },
                headers: {
                'Content-Type': 'application/json'
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
                  filterByCommentID: 1,
                  commentID,
                  sortOrderScoreTime: 0,
                  path_search_string: searchText
                },
                headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                },
            });
          }
          else{//sortscoreenabled
            response = await axios.get('https://jignasu.pythonanywhere.com/getPathsSortBoth', {
                params: {
                    indices: indices,
                    descending: scoreDesc,
                    offset: 0,
                    limit: refreshDataLimit,
                    nodeID: nodeID,
                    filterByNodeID: 1,
                    filterByCommentID: 1,
                    commentID,
                    sortOrderScoreTime: 1,
                    path_search_string: searchText
                },
                headers: {
                'Content-Type': 'application/json'
                },
            });
          }
          if(response.status == 200){
              setLoading(false)
              setErrorOccured(false)
          }
          if(index>response.data.Paths.length){
            setCurrentIndex(0)
          }
          else{
              setErrorOccured(true)
          }
          if (offset === 0) 
          {
              setData(response.data.Paths);
          } 
          else 
          {
              setData((data) => [...data, ...response.data.Paths]);
          }
          if (response.data.Paths.length < 10) {
              setHasMoreData(false);
          }
          return response.data;
      }
      else{
          setLoading(true);
          setErrorOccured(false);
          if(sortOrderEnabled){
            response = await axios.get('https://jignasu.pythonanywhere.com/getPathsSortBoth', {
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
                    path_search_string: searchText,
                    filterBySummaryID: 1,
                    summaryID,
                    offset: offset,
                    limit: limit,
                },
                headers: {
                'Content-Type': 'application/json'
                },
            });
          }
          else if(timeEnabled){
            response = await axios.get('https://jignasu.pythonanywhere.com/getPathsSortBoth', {
                params: {
                    before: before,
                    timestamp: `${date} ${timeStamp}`,
                    newest,
                    offset: 0,
                    limit: refreshDataLimit,
                    nodeID: nodeID,
                    filterByNodeID: 1,
                    sortOrderScoreTime: 0,
                    path_search_string: searchText,
                    filterBySummaryID: 1,
                    summaryID,
                    offset: offset,
                    limit: limit,
                },
                headers: {
                'Content-Type': 'application/json'
                },
            });
          }
          else{//sortenabled
            response = await axios.get('https://jignasu.pythonanywhere.com/getPathsSortBoth', {
                params: {
                    indices: indices,
                    descending: scoreDesc,
                    offset: 0,
                    limit: refreshDataLimit,
                    nodeID: nodeID,
                    filterByNodeID: 1,
                    sortOrderScoreTime: sortOrder,
                    path_search_string: searchText,
                    filterBySummaryID: 1,
                    summaryID,
                    offset: offset,
                    limit: limit,
                },
                headers: {
                'Content-Type': 'application/json'
                },
            });
          }
          if(response.status == 200){
              setLoading(false)
              setErrorOccured(false)
          }
          if(index>response.data.Paths.length){
            setCurrentIndex(0)
          }
          if (response.data.Paths.length < 10) {
              setHasMoreData(false);
          }
          else{
              setErrorOccured(true)
          }
          if (offset === 0) 
          {
              setData(response.data.Paths);
          } 
          else 
          {
              setData((data) => [...data, ...response.data.Paths]);
          }
          return response.data;
      }
    }
    catch (error) {
      console.log("error")
      console.error(error);
      setErrorOccured(true);  // Set errorOccurred to true in case of error
      setLoading(false); 
    }
  }

  useEffect(() => {
    fetchPaths(offset, limit);
  }, [summaryID, commentID]);

  const handleRefresh = () => {
    refreshContent();
  };

  return (
    <>
      <div style={{ border: "1px solid black", padding: "10px" }}>
        <div>
          <label>Filter by Score</label>
          <input type="checkbox" checked={sortEnabled} onChange={toggleSort} />
        </div>
        <div
          className={`sort-controls ${sortEnabled ? "enabled" : "disabled"}`}
        >
          {["index1", "index2", "index3", "index4", "index5"].map(
            (indexKey) => (
              <label key={indexKey}>
                <input
                  type="checkbox"
                  name={indexKey}
                  checked={index[indexKey] === 1}
                  onChange={handleCheckboxChange}
                />
                {indexKey}
              </label>
            )
          )}

          <button onClick={handleScoreDescToggle}>
            {scoreDesc === 1 ? "Desc" : "Asc"}
          </button>
        </div>
        <div>
          <label>Filter by Time</label>
          <input type="checkbox" checked={timeEnabled} onChange={toggleTime} />
        </div>
        <div
          className={`time-controls ${timeEnabled ? "enabled" : "disabled"}`}
        >
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
        <button onClick={handleRefresh}>Refresh Paths</button>
      </div>
      <div>
        {/* {data && data.length > 0 && <><PathCarousel data={data} fetchPaths={fetchPaths} nodeID={nodeID}/></>} */}
        {data && data.length > 0 && (
          <>
            <PathCarousel
              data={data}
              fetchPaths={fetchPaths}
              nodeID={nodeID}
              loading={loading}
              errorOccurred={errorOccured}
              hasMoreData={hasMoreData}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
            />
          </>
        )}
      </div>
      {/* <CreateComponent nodeID={nodeID} type='summary'/> */}
    </>
  );
};

export default Paths;
