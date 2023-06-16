'use client'
import { useState, useEffect } from "react";
import Score from "./Score";
import Paths from "./Paths";
import Comments from "./Comments";

const CommentCarousel = ({ data, fetchComments, nodeID }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [enablePathSection, setEnablePathSection] = useState(false);
  const [enableCommentSection, setEnableCommentSection] = useState(false);

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

  const handleTogglePath = () => {
    setEnablePathSection(enablePathSection ===1? 0 : 1);
  };

  return (
    <div>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <button onClick={handleLeftClick}>Left</button>
      {data && data.length > 0 && (
        <div style={{ textAlign: "center" }}>
          <p>{data[currentIndex].content}</p>
          <p>Refrences: </p>
          
          <Score type={"comment"} id={data[currentIndex].id} score={data[currentIndex].score}/>
        </div>
      )}
      <button onClick={handleRightClick}>Right</button>
    </div>
      <button onClick={handleToggleComment}>Comments</button>
      {data && data.length > 0 && enableCommentSection===1 && <Comments isPath={false} nodeID={nodeID} commentID={data[currentIndex].id}/>}
      <button onClick={handleTogglePath}>Paths</button>
      {data && data.length > 0 && enablePathSection===1 && <Paths isComment={true} nodeID={nodeID} commentID={data[currentIndex].id}/>}
    </div>
  );
};

export default CommentCarousel;
