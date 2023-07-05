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
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6 text-gray-800">
  <div className="flex items-center justify-between space-x-4">
    <button 
      onClick={handleLeftClick}
      className="bg-blue-200 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-300"
    >
      Left
    </button>

    {data && data.length > 0 && (
      <div className="text-center">
        {data[currentIndex].userID === userID && (
          <div className="text-sm text-gray-500 mb-2">Edit</div>
        )}

        <p className="text-lg">{data[currentIndex].content}</p>

        <p className="text-sm text-gray-500 mt-4 mb-2">References:</p>
        
        <Score 
          type={"summary"} 
          id={data[currentIndex].id} 
          score={data[currentIndex].score}
          className="text-sm text-gray-500"
        />
      </div>
    )}

    <button 
      onClick={handleRightClick}
      className="bg-blue-200 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-300"
    >
      Right
    </button>
  </div>

  <button 
    onClick={handleTogglePath}
    className="bg-green-200 text-green-700 py-2 px-4 rounded-lg hover:bg-green-300 w-full text-center"
  >
    Path
  </button>

  {data && data.length > 0 && enablePathSection === 1 && (
    <Paths nodeID={nodeID} summaryID={data[currentIndex].id} />
  )}
</div>

  );
};

export default SummaryCarousel;
