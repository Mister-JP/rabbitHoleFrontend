'use client'
import { useState, useEffect } from "react";
import Score from "./Score";
import Paths from "./Paths";
import Comments from "./Comments";
import CreateComponent from './CreateComponent';

const CommentCarousel = ({ data, fetchComments, nodeID, currentIndex, setCurrentIndex }) => {
  // const [currentIndex, setCurrentIndex] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [enablePathSection, setEnablePathSection] = useState(false);
  const [enableCommentSection, setEnableCommentSection] = useState(false);
  const [enableCreateCommentSection, setEnableCreateCommentSection] = useState(false);

  useEffect(() => {
    if (data && currentIndex === data.length - 3 && hasMoreData) {
        fetchComments(data.length, 10).then((fetchedData) => {
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
      setEnablePathSection(0)
    }
    // setEnableCommentSection(enableCommentSection ===1? 0 : 1);
  };

  const handleTogglePath = () => {
    if (enablePathSection ===1){
      setEnablePathSection(0)
    }
    else{
      setEnableCommentSection(0)
      setEnableCreateCommentSection(0)
      setEnablePathSection(1)
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
      setEnablePathSection(0)
    }
    // setEnableCreateCommentSection(enableCreateCommentSection ===1? 0 : 1);
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
      
      <button onClick={handleTogglePath}>Paths</button>
      
      <button onClick={handleToggleCreateComment }>Create Comment</button>
      {data && data.length > 0 && enableCommentSection===1 && <Comments isPath={false} nodeID={nodeID} commentID={data[currentIndex].id}/>}
      {data && data.length > 0 && enablePathSection===1 && <Paths isComment={true} nodeID={nodeID} commentID={data[currentIndex].id}/>}
      {enableCreateCommentSection===1 && <CreateComponent nodeID={nodeID} type='commentOnComment' commentID={data[currentIndex].id}/>}
    </div>
  );
};

export default CommentCarousel;
