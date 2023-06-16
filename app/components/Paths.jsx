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
  
  const [beforeAfter, setBeforeAfter] = useState(1);
  const [scoreDesc, setScoreDesc] = useState(1);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [timeStamp, setTimeStamp] = useState(current_time);
  const [date, setDate] = useState(current_date);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorOccured, setErrorOccured] = useState(false)
  const [hasMoreData, setHasMoreData] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const fetchPaths = async (offset = 0, limit = 10) => {
    try {
        //change it to filter_sort_tables later to apply the filter
        if(isComment){
            setLoading(true);
            setErrorOccured(false)
            const response = await axios.get('http://localhost:8000/getPathsSortBoth', {
                params: {
                    filterByCommentID: 1,
                    commentID,
                    offset: offset,
                    limit: limit,
                    nodeID,
                },
                headers: {
                'Content-Type': 'application/json'
                },
            });
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
            const response = await axios.get('http://localhost:8000/getPathsSortBoth', {
                params: {
                    filterBySummaryID: 1,
                    summaryID,
                    offset: offset,
                    limit: limit,
                    nodeID
                },
                headers: {
                'Content-Type': 'application/json'
                },
            });
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
          const response = await axios.get('http://localhost:8000/getPathsSortBoth', {
              params: {
                  filterByCommentID: 1,
                  commentID,
                  offset: offset,
                  limit: refreshDataLimit,
                  nodeID,
              },
              headers: {
              'Content-Type': 'application/json'
              },
          });
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
          const response = await axios.get('http://localhost:8000/getPathsSortBoth', {
              params: {
                  filterBySummaryID: 1,
                  summaryID,
                  offset: offset,
                  limit: refreshDataLimit,
                  nodeID
              },
              headers: {
              'Content-Type': 'application/json'
              },
          });
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
            {beforeAfter === 1 ? "before" : "after"}
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
      <button onClick={handleRefresh}>Refresh Paths</button>
      </div>
      <div>
      {/* {data && data.length > 0 && <><PathCarousel data={data} fetchPaths={fetchPaths} nodeID={nodeID}/></>} */}
      {data && data.length > 0 &&<><PathCarousel data={data} fetchPaths={fetchPaths} nodeID={nodeID} loading={loading} errorOccurred={errorOccured} hasMoreData={hasMoreData} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex}/></>}
      
    </div>
    {/* <CreateComponent nodeID={nodeID} type='summary'/> */}
    </>
  );
};

export default Paths;
