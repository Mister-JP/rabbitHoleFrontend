'use client'
import React, { useEffect } from 'react'
import { useState } from 'react';
import LinkInputForm from './LinkInputForm';
import axios from 'axios';

const CreateComponent = ({type, nodeID, summaryID, commentID, pathID}) => {
    const [summary, setSummary] = useState("");
    const [links, setlinks] = useState([]);
    const [deletesArr, setDeletes] = useState([]);
    const [content, setContent] = useState("");
    const [linkCount, setLinkCount] = useState(1);

    // const router = useRouter();
    async function onStartGetSummary(){
      try{
        const token = localStorage.getItem("token");
        if(type==='summary'){
          const response = await axios.get('http://localhost:8000/getSummaryFromUserAndNode', {
                params: {
                    nodeID: nodeID
                },
                headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                },
            });
            setSummary(response.data.Summary.content);
            setlinks(response.data.Summary.links)
        }
      }
      catch (error) {
        console.error(error);
      }

    }

    useEffect(()=>{
      onStartGetSummary();
      console.log(deletesArr)
    }, [])
  
    async function onSubmitCreateSummary() {
      console.log("here!!!")
        try {
          
          const token = localStorage.getItem("token");
          const response = await axios.post(
            "http://localhost:8000/createSummary",
            {
              content: summary,
              links,
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
        //   router.push("/source/" + response.data.nodeID);
        } catch (error) {
          console.error("Error during create source:", error);
        }
    }

    async function onSubmitCreateComment() {
      try {
        
        const token = localStorage.getItem("token");
        const response = await axios.post(
          "http://localhost:8000/createComment",
          {
            content,
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

  async function onSubmitCreatePath() {
    try {
      
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8000/createPath",
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
const isComment = type === 'comment';
const isPath = type === 'path';



  return (
    <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log("0000", type)
            if (type==='summary'){
              onSubmitCreateSummary();
            }
            else if(type ==='comment'){
              onSubmitCreateComment();
            }
            else if(type === 'path'){
              onSubmitCreatePath();
            }
            else{
              console.log('no type recognized.')
            }
            // onSubmitCreateSource();
          }}
        >
          {isSummary && 
          <>
          <label htmlFor="link">Summary:</label>
          <input
            type="text"
            id="summary"
            name="summary"
            value={summary}
            required
            onChange={(e) => setSummary(e.target.value)}
          />
          <LinkInputForm links={links} setLinks={setlinks} deletesArr={deletesArr} setDeletes={setDeletes}/>
          <br /></>}

          {isComment &&
            <>
            <label htmlFor="link">Comment:</label>
              <input
                type="text"
                id="comment"
                name="comment"
                value={content}
                required
                onChange={(e) => setContent(e.target.value)}
              />
          <br /></>}

          {isPath &&
          <>
          <label htmlFor="link">Path:</label>
          <input
            type="text"
            id="path"
            name="path"
            value={summary}
            required
            onChange={(e) => setSummary(e.target.value)}
          />
          <LinkInputForm links={links} setLinks={setlinks}/>
          <br /></>
          }
          <button type="submit">Create {type}</button>
        </form>
      </div>
  )
}

export default CreateComponent