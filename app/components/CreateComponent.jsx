'use client'
import React, { useEffect } from 'react'
import { useState } from 'react';
import LinkInputForm from './LinkInputForm';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const CreateComponent = ({type, nodeID, summaryID, commentID, pathID, fetchSummaries}) => {
    const [summary, setSummary] = useState("");
    const [links, setlinks] = useState([]);
    const [imdbids, setimdbids] = useState([]);
    const [deletesArr, setDeletes] = useState([]);
    const [content, setContent] = useState("");
    const [linkCount, setLinkCount] = useState(1);
    const router = useRouter();

    // const router = useRouter();
    async function onStartGetSummary(){
      try{
        const token = localStorage.getItem("token");
        if(type==='summary'){
          
          const response = await axios.get('https://jignasu.pythonanywhere.com/getSummaryFromUserAndNode', {
                params: {
                    nodeID: nodeID
                },
                headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                },
            });
            if(response.status ==200){
            setSummary(response.data.Summary.content);
            setlinks(response.data.Summary.links)
            setimdbids(response.data.Summary?.imdbids)
          }
        }
      }
      catch (error) {
        if(error.response.status == 401){
          router.push("/login");
        }
      }

    }

    useEffect(()=>{
      if(type=='summary'){
        onStartGetSummary();
      }
    }, [])

    const sleep = (milliseconds) => {
      return new Promise((resolve) => setTimeout(resolve, milliseconds));
    };
  
    async function onSubmitCreateSummary() {
        try {
          
          const token = localStorage.getItem("token");
          const response = await axios.post(
            "https://jignasu.pythonanywhere.com/createSummary",
            {
              content: summary,
              links,
              imdbids,
              nodeID,
              deletes: deletesArr 
            },
            {
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
            }
          );
          console.log(response.data);
          await sleep(2000);
          fetchSummaries();
        //   router.push("/source/" + response.data.nodeID);
        } catch (error) {
          console.error("Error during create source:", error);
        }
    }

    async function onSubmitCreateCommentOnPath() {
      try {
        
        const token = localStorage.getItem("token");
        const response = await axios.post(
          "https://jignasu.pythonanywhere.com/createComment",
          {
            content,
            links,
            imdbids,
            nodeID,
            pathID
          },
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
      //   router.push("/source/" + response.data.nodeID);
      } catch (error) {
        console.error("Error during create source:", error);
      }
  }

  async function onSubmitCreateSubComment() {
    try {
      
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://jignasu.pythonanywhere.com/createComment",
        {
          content,
          links,
          imdbids,
          nodeID,
          underCommentID: commentID
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
    //   router.push("/source/" + response.data.nodeID);
    } catch (error) {
      console.error("Error during create source:", error);
    }
}

  async function onSubmitCreatePath() {
    try {
      
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://jignasu.pythonanywhere.com/createPath",
        {
          links,
          nodeID
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
    //   router.push("/source/" + response.data.nodeID);
    } catch (error) {
      console.error("Error during create source:", error);
    }
}


const isSummary = type === 'summary';
const isComment = type === 'commentOnPath' || type==='commentOnComment';
const isPath = type === 'path';



  return (
    <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-md mx-auto">
  <form
    onSubmit={(e) => {
      e.preventDefault();
      if (type==='summary'){
        onSubmitCreateSummary();
      }
      else if(type ==='commentOnPath'){
        onSubmitCreateCommentOnPath();
      }
      else if(type ==='commentOnComment'){
        onSubmitCreateSubComment();
      }
      else if(type === 'path'){
        onSubmitCreatePath();
      }
      else{
        console.log('no type recognized.')
      }
      // onSubmitCreateSource();
    }}
    className="space-y-6"
  >
    {isSummary && 
    <>
    <label htmlFor="link" className="block text-sm font-medium text-gray-700">Summary:</label>
    <input
      type="text"
      id="summary"
      name="summary"
      value={summary}
      required
      onChange={(e) => setSummary(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded-md"
    />
    <LinkInputForm links={links} setLinks={setlinks} imdbids={imdbids} setimdbids={setimdbids} deletesArr={deletesArr} setDeletes={setDeletes} />
    </>}

    {isComment &&
      <>
      <label htmlFor="link" className="block text-sm font-medium text-gray-700">Comment:</label>
      <input
        type="text"
        id="comment"
        name="comment"
        value={content}
        required
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md"
      />
      <LinkInputForm links={links} setLinks={setlinks} imdbids={imdbids} setimdbids={setimdbids} deletesArr={deletesArr} setDeletes={setDeletes} />
      </>}

    {isPath &&
    <>
    <label htmlFor="link" className="block text-sm font-medium text-gray-700">Path:</label>
    <input
      type="text"
      id="path"
      name="path"
      value={summary}
      required
      onChange={(e) => setSummary(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded-md"
    />
    </>}
    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-200">Submit</button>
  </form>
</div>

  )
}

export default CreateComponent