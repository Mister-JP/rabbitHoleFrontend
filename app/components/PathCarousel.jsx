'use client'
import { useState, useEffect } from "react";
import Score from "./Score";
import Paths from "./Paths";
import Comments from "./Comments";
import Summaries from "./Summaries";
import CreateComponent from './CreateComponent';


const PathCarousel = ({ data, fetchPaths, nodeID, currentIndex, setCurrentIndex }) => {
  const [hasMoreData, setHasMoreData] = useState(true);
  const [enableCommentSection, setEnableCommentSection] = useState(false);
  const [enableSummarySection, setEnableSummarySection] = useState(false);
  const [enableCreateCommentSection, setEnableCreateCommentSection] = useState(false);

  useEffect(() => {
    if (data && currentIndex === data.length - 3 && hasMoreData) {
        fetchPaths(data.length, 10).then((fetchedData) => {
        if (!fetchedData || fetchedData.length < 10) {
          setHasMoreData(false);
        }
      });
    }
  }, [currentIndex]);

  const handleLeftClick = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleRightClick = () => {
    if (currentIndex < data.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleToggleComment = () => {
    if (enableCommentSection ===1){
      setEnableCommentSection(0)
    }
    else{
      setEnableCommentSection(1)
      setEnableCreateCommentSection(0)
      setEnableSummarySection(0)
    }
    // setEnableCommentSection(enableCommentSection ===1? 0 : 1);
  };

  const handleToggleSummary = () => {
    if (enableSummarySection ===1){
      setEnableSummarySection(0)
    }
    else{
      setEnableCommentSection(0)
      setEnableCreateCommentSection(0)
      setEnableSummarySection(1)
    }
    // setEnableSummarySection(enableSummarySection ===1? 0 : 1);
  };

  const handleToggleCreateComment = () => {
    if (enableCreateCommentSection ===1){
      setEnableCreateCommentSection(0)
    }
    else{
      setEnableCommentSection(0)
      setEnableCreateCommentSection(1)
      setEnableSummarySection(0)
    }
    // setEnableCreateCommentSection(enableCreateCommentSection ===1? 0 : 1);
  };

  return (
    <div>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <button onClick={handleLeftClick}>Left</button>
      {data && data.length > 0 && (
        <div style={{ textAlign: "center" }}>
          <p>{data[currentIndex].node}</p>
          <p>Refrences: {data[currentIndex].id}</p>
          
          <Score type={"path"} id={data[currentIndex].id} score={data[currentIndex].score}/>
        </div>
      )}
      <button onClick={handleRightClick}>Right</button>
    </div>
      <button onClick={handleToggleComment}>Comments</button>
      
      <button onClick={handleToggleSummary}>Summaries</button>
      
      <button onClick={handleToggleCreateComment }>Create Comment</button>
      {data && data.length > 0 && enableCommentSection===1 && <Comments isPath={true} nodeID={nodeID} pathID={data[currentIndex].id}/>}
      {data && data.length > 0 && enableSummarySection===1 && <Summaries isPath={true} nodeID={nodeID} pathID={data[currentIndex].id}/>}
      {enableCreateCommentSection===1 && <CreateComponent nodeID={nodeID} type='commentOnPath' pathID={data[currentIndex].id}/>}
    </div>
  );
};

export default PathCarousel;