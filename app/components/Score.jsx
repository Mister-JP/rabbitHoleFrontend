'use client'
// import axios from "axios";
import api from "../api/LocalApi";
import { useEffect, useState } from "react";


const Score = ({ type, id, score: initialScore }) => {
  const [score, setScore] = useState(initialScore);
  const apiUrlMap = {
    comment: "/scoreComment",
    node: "/scoreNode",
    summary: "/scoreSummary",
    path: "/scorePath",
  };

  const getApiUrlMap = {
    comment: "/getScoreComment",
    node: "/getScoreNode",
    summary: "/getScoreSummary",
    path: "/getScorePath",
  };

  const idParamMap = {
    comment: "commentID",
    node: "nodeID",
    summary: "summaryID",
    path: "pathID",
  };

  const fetchScore = async () => {
    const token = localStorage.getItem("token");
    const apiEndpoint = getApiUrlMap[type];
    const idParamKey = idParamMap[type];

    try {
      const response = await api.get(apiEndpoint, {
        params: { [idParamKey]: id },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setScore(response.data.score);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const scoreRequest = async (score) => {
    const token = localStorage.getItem("token");
    const apiEndpoint = apiUrlMap[type];
    const idParamKey = idParamMap[type];

    try {
      await api.post(
        apiEndpoint,
        {
          [idParamKey]: id,
          score: score,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Fetch the updated score after a successful POST request
      fetchScore();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(()=>{
    fetchScore();
  }, [id])

  return (
    <>
    <div className="flex items-center justify-center space-x-4">
      <button onClick={() => scoreRequest(2)} className="bg-gradient-to-r from-green-500 to-green-300 hover:from-red-600 hover:to-green-600 text-white font-bold py-2 px-4 rounded-full">++</button>
      <button onClick={() => scoreRequest(1)} className="bg-gradient-to-r from-green-300 to-yellow-500 hover:from-yellow-600 hover:to-green-600 text-white font-bold py-2 px-4 rounded-full">+</button>
      <button onClick={() => scoreRequest(0)} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full">o</button>
      <button onClick={() => scoreRequest(-1)} className="bg-gradient-to-r from-yellow-500 to-red-300 hover:from-yellow-600 hover:to-red-600 text-white font-bold py-2 px-4 rounded-full">-</button>
      <button onClick={() => scoreRequest(-2)} className="bg-gradient-to-r from-red-300 to-red-500 hover:from-green-600 hover:to-red-600 text-white font-bold py-2 px-4 rounded-full">--</button>
</div>
{score &&
     <div className="flex justify-around mt-5">
        <div className="bg-gradient-to-r from-purple-200 to-pink-200 text-Black rounded-lg p-2"> {score[0]} lvl-1 </div>
        <div className="bg-gradient-to-r from-pink-200 to-purple-200 text-Black rounded-lg p-2"> {score[1]} lvl-2 </div>
        <div className="bg-gradient-to-r from-purple-200 to-pink-200 text-Black rounded-lg p-2"> {score[2]} lvl-3 </div>
        <div className="bg-gradient-to-r from-pink-200 to-purple-200 text-Black rounded-lg p-2"> {score[3]} lvl-4 </div>
        <div className="bg-gradient-to-r from-purple-200 to-pink-200 text-Black rounded-lg p-2"> {score[4]} lvl-5 </div>
    </div>
}

    </>
  );
};

export default Score;
