'use client'
import React from 'react'
import { useEffect, useState } from 'react'
import api from '@/app/api/LocalApi'
import RefCardsMD from '@/app/components/RefCardsMD'
import CommentsSection from '@/app/components/CommentsSection'
import CreateComment from '@/app/components/CreateComment'
import PopUpLoginRegister from '@/app/components/PopUpLoginRegister'
import CommentSectionCard from './CommentSectionCard'
import Link from 'next/link'

const HomeCommentCard = ({comment, nodeID, setErrorCode}) => {
    const pathID = comment?.path?.id
    const [nodes, setNodes] = useState(null);
    const [totalScore, setTotalScore] = useState(null);
    const [nodeScore, setNodeScore] = useState(null);
    const [isComments, setIsComments] = useState(true);
    // const[errorCode, setErrorCode] = useState(0);
  
    const handleScoreChange = async(newScore) =>{
      try{
        const token = localStorage.getItem('token');
        const response = await api.post("/scorePath",
            {pathID: pathID, score: newScore},
            {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }
        );
        fetchPathScore()
        fetchPathScoreByUser()
      //   setNodeScore(newScore);
      }
      catch(error){
          if(error.response){
              setErrorCode(error.response.status);
            }
        console.log("Some error occured")
      }
    }
  
    const fetchPathScore = async () =>{
      try {
  
          
          const response = await api.get('/getScorePath', {
          params: { pathID: pathID },
          headers: {
              'Content-Type': 'application/json'
          },
          });
          setTotalScore(response.data.score);
      } 
      catch (error) {
          console.log(error)
      }
    }
  
    const fetchPathScoreByUser = async() => {
      try {
          const token = localStorage.getItem('token');
  
          
          const response = await api.get('/getUserScorePath', {
          params: { pathID: pathID },
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
          },
          });
          setNodeScore(response.data.score);
      } 
      catch (error) {
          console.log(error)
      }
    }
  
    const fetchNodeInfo = async() => {
      try{
          const token = localStorage.getItem('token');
          const response = await api.get("/getNodesFromPathID",{
              params: { pathID: pathID },
              headers: {
                  'Content-Type': 'application/json',
              },
          }
          );
          setNodes(response.data.pathID);
          // console.log(response.data.pathID)
          // setNodeScore(newScore);
        }
        catch{
          console.log("Some error occured")
        }
    }
  
    useEffect(()=>{
      const fetchData = async () => {
          try{
              await fetchNodeInfo();
              await fetchPathScore();
              await fetchPathScoreByUser();
          }
          catch{
              console.log("Error occured!")
          }
      }
  
      fetchData();
    }, [pathID])
    return (
      <>
      <div className="m-1 md:m-5 border border-black p-0 md:p-5 rounded-md">
      {/* {errorCode===401 && <PopUpLoginRegister setErrorCode={setErrorCode}/>} */}
      <div className='flex flex-row justify-between items-center'>
      {nodes!==null && nodes.length > 0 &&
          nodes.map((node, index)=>{
              return(
                      <>
                      <RefCardsMD reference={node} nodeID={nodeID} commentsButton={false} setErrorCode={setErrorCode}/>
                      {index===0 && <img src='/svgs/pathSVG.svg' className='w-12 h-12 hidden md:block'/>}
                      </>
                  )
              })
          }
      </div>
      <div className="flex flex-wrap space-between space-x-4 ml-5 mt-5">
          <div className="flex border rounded-full p-1">
              👶: {totalScore!==null && totalScore.length===5 && totalScore[0]}
          </div>
          <div className="flex border rounded-full p-1">
              🧑‍🎓: {totalScore!==null && totalScore.length===5 && totalScore[1]}
          </div>
          <div className="flex border rounded-full p-1">
              🧑‍💼: {totalScore!==null && totalScore.length===5 && totalScore[2]}
          </div>
          <div className="flex border rounded-full p-1">
              🧑‍✈️: {totalScore!==null && totalScore.length===5 && totalScore[3]}
          </div>
          <div className="flex border rounded-full p-1">
              🫅: {totalScore!==null && totalScore.length===5 && totalScore[4]}
          </div>
      </div>
      <hr class="ml-5 mr-5 h-1 mx-auto my-4 bg-gray-100 border-0 rounded md:my-5 light:bg-gray-700"></hr>
      {nodeScore !== null && (
          <div className="ml-5 flex space-between space-x-4">
              <img
                  src={
                  nodeScore === 2
                      ? `/svgs/DoubleThumbsUpGreen.svg`
                      : `/svgs/DoubleThumbsUp.svg`
                  }
                  alt="double thumbs up"
                  className="w-6"
                  onClick={() => handleScoreChange(2)}
              />
              <img
                  src={
                  nodeScore === 1
                      ? `/svgs/ThumbsUpGreen.svg`
                      : `/svgs/ThumbsUp.svg`
                  }
                  alt="thumbs up"
                  className="w-6"
                  onClick={() => handleScoreChange(1)}
              />
              <img
                  src={
                  nodeScore === 0
                      ? `/svgs/PeaceYellow.svg`
                      : `/svgs/Peace.svg`
                  }
                  alt="peace"
                  className="w-6"
                  onClick={() => handleScoreChange(0)}
              />
              <img
                  src={
                  nodeScore === -1
                      ? `/svgs/ThumbsUpRed.svg`
                      : `/svgs/ThumbsUp.svg`
                  }
                  alt="thumbs down"
                  className="w-6 rotate-180"
                  onClick={() => handleScoreChange(-1)}
              />
              <img
                  src={
                  nodeScore === -2
                      ? `/svgs/DoubleThumbsUpRed.svg`
                      : `/svgs/DoubleThumbsUp.svg`
                  }
                  alt="double thumbs down"
                  className="w-6 rotate-180"
                  onClick={() => handleScoreChange(-2)}
              />
          </div>
      )}
      {/* {isComments && nodes!==null && <CommentsSection pathID={pathID} nodeID={nodeID} nodes={nodes} setErrorCode={setErrorCode} enableSubcomments={false} isFrom={false}/>} */}
      {comment!==null && comment?.comment!==null && nodes!==null && <CommentSectionCard enableSubcomments={false} isFrom={false} recommendation={comment.comment} pathID={pathID} nodeID={nodeID} nodes={nodes} setErrorCode={setErrorCode}/>}
      <div className='m-5'>
      <Link
            key={comment?.path?.id}
            href={`/comments/${comment.path.id}/${comment.path.startnode}`}
            className="py-2 px-4 rounded-full border border-black bg-gray-900 text-white hover:bg-black font-bold hover:text-white transition duration-200 text-center"
        >
            Read More Comments...
      </Link>
      </div>
      </div>
      </>
    )
}

export default HomeCommentCard