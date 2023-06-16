'use client'
// import axios from "axios";
import api from "../api/LocalApi";
import { useState } from "react";


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

  return (
    <>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <button onClick={() => scoreRequest(2)}>++</button>
      <button onClick={() => scoreRequest(1)}>+</button>
      <button onClick={() => scoreRequest(0)}>o</button>
      <button onClick={() => scoreRequest(-1)}>-</button>
      <button onClick={() => scoreRequest(-2)}>--</button>
    </div>
    {score &&
     <p>
        {score[0]} lvl-1, {score[1]} lvl-2, {score[2]} lvl-3, {score[3]} lvl-4, {score[4]} lvl-5
    </p>
    }
    </>
  );
};

export default Score;
