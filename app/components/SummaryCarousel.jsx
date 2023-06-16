'use client'
import { useState, useEffect } from "react";
import Score from "./Score";
import Paths from "./Paths";

const SummaryCarousel = ({ data, fetchSummaries, nodeID, userID }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [enablePathSection, setEnablePathSection] = useState(false);
//   console.log(data)
// console.log(userID)

  useEffect(() => {
    if (data && currentIndex === data.length - 3 && hasMoreData) {
      fetchSummaries(data.length, 10).then((fetchedData) => {
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

  const handleTogglePath = () => {
    setEnablePathSection(enablePathSection ===1? 0 : 1);
  };
    

  return (
    <div>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <button onClick={handleLeftClick}>Left</button>
      {data && data.length > 0 && (
        <div style={{ textAlign: "center" }}>
            {data[currentIndex].userID === userID && <>
                <div>edit</div>
            </>}
          <p>{data[currentIndex].content}</p>
          <p>Refrences: </p>
          
          <Score type={"summary"} id={data[currentIndex].id} score={data[currentIndex].score}/>
        </div>
      )}

      <button onClick={handleRightClick}>Right</button>
    </div>
      <button onClick={handleTogglePath}>Path</button>
      {data && data.length > 0 && enablePathSection===1 && <Paths nodeID={nodeID} summaryID={data[currentIndex].id}/>}
    </div>
  );
};

export default SummaryCarousel;
