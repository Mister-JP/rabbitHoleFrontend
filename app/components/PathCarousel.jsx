'use client'
import { useState, useEffect } from "react";
import Score from "./Score";
import Paths from "./Paths";
import Comments from "./Comments";
import Summaries from "./Summaries";

const PathCarousel = ({ data, fetchPaths, nodeID }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [enableCommentSection, setEnableCommentSection] = useState(false);
  const [enableSummarySection, setEnableSummarySection] = useState(false);

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
    setEnableCommentSection(enableCommentSection ===1? 0 : 1);
  };

  const handleToggleSummary = () => {
    setEnableSummarySection(enableSummarySection ===1? 0 : 1);
  };

  return (
    <div>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <button onClick={handleLeftClick}>Left</button>
      {data && data.length > 0 && (
        <div style={{ textAlign: "center" }}>
          <p>{data[currentIndex].node}</p>
          <p>Refrences: </p>
          
          <Score type={"path"} id={data[currentIndex].id} score={data[currentIndex].score}/>
        </div>
      )}
      <button onClick={handleRightClick}>Right</button>
    </div>
      <button onClick={handleToggleComment}>Comments</button>
      {data && data.length > 0 && enableCommentSection===1 && <Comments isPath={true} nodeID={nodeID} pathID={data[currentIndex].id}/>}
      <button onClick={handleToggleSummary}>Summaries</button>
      {data && data.length > 0 && enableSummarySection===1 && <Summaries isPath={true} nodeID={nodeID} pathID={data[currentIndex].id}/>}
    </div>
  );
};

export default PathCarousel;
