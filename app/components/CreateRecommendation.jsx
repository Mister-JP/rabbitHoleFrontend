'use client';
import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import RefCardSM from './RefCardSM';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const CreateRecommendation = ({nodeID, fetchData, setErrorCode}) => {

    const [isExpanded, setIsExpanded] = useState(false);
    const [rotationClass, setRotationClass] = useState('animate-spin--0')
    const [links, setLinks] = useState([]);
    const [imdbids, setimdbids] = useState([]);
    const [isMovies, setIsMovies] = useState([]);
    const [deletesArr, setDeletes] = useState([]);
    const [summary, setSummary] = useState("");
    const router = useRouter();

    const handleToggle = () => {
      setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        setRotationClass(isExpanded ? 'animate-spin-0' : 'animate-spin-90');
        onStartGetSummary()
    }, [isExpanded])

    const handleSearchClick = (movie,id,isMovie) => {
      // const response = await api.get(`/getSourceByLink?offset=1&limit=1&link=${movie.original_title}&imdbid=${movie.id}`);
      // console.log(movie, isMovie)
      if(isMovie){
        setLinks([...links, movie.original_title]);
      }
      else{
        setLinks([...links, movie.original_name]);
      }
      
      setIsMovies([...isMovies, isMovie]);
      setimdbids([...imdbids, movie.id]);
    }


    const handleRemoveMovie = (imdbid, isMovie) => {
      var index = imdbids.indexOf(imdbid);
      if (index !== -1) {
        const newLinks = [...links];
        const newImdbids = [...imdbids];
        const newIsMovies = [...isMovies];
        const linkRemoved = newLinks.splice(index, 1);
        const imdbidRemoved = newImdbids.splice(index, 1);
        const isMoviesRemoved = newIsMovies.splice(index, 1);
        setLinks(newLinks);
        setimdbids(newImdbids);
        setIsMovies(newIsMovies);
        setDeletes([...deletesArr, linkRemoved[0]]);
      }
    };

    // const router = useRouter();
    async function onStartGetSummary(){
      if(isExpanded){
        try{
          const token = localStorage.getItem("token");
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
              setLinks(response.data.Summary.links)
              setimdbids(response.data.Summary?.imdbids.map(id => parseInt(id)))
              setIsMovies(response.data.Summary?.isMovies)
          }
        }
        catch (error) {
          if(error.response){
            setErrorCode(error.response.status);
          }
          if(error.response.status == 401){
            console.log('login')
          }
        }
      }

    }

    // useEffect(()=>{
    //   onStartGetSummary();
    // }, [isExpanded])

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
            deletes: deletesArr,
            isMovies
          },
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }
        );
        setIsExpanded(false);
        fetchData();
      //   router.push("/source/" + response.data.nodeID);
      } catch (error) {
        if(error.response){
          setErrorCode(error.response.status);
        }
        console.error("Error during create source:", error);
      }
  }

    

    

  return (
    <>
    <div className={`flex flex-row space-x-4 cursor-pointer`} onClick={handleToggle}>
        <img src='/svgs/DropDown.svg' className={`w-4 transform ${rotationClass}`}/>
        <div>Create Recommendation</div>
      </div>
      <div className={`transition-all duration-500 ease-in-out ${isExpanded ? 'h-auto opacity-100' : 'overflow-hidden p-0 h-0 opacity-0'}`}>
      <div className={`flex flex-col justify-between border border-black mt-1 rounded-lg p-2 transition-all duration-500 ease-in-out`}>
        <p className='p-1'>
          Describe your recommendation on what to watch next? 
          
        </p>
        <p className='p-1'>
        Why did you choose it? What mood is best to watch it? 
        </p>
        <p className='p-1'>
        Please dont give any major spoilers.
        </p>
        <input type="text" placeholder="Recommendation..." className='border border-black rounded-full p-2 w-full bg-white' value={summary} onChange={(e) => setSummary(e.target.value)}/>
        <div className='m-2 flex flex-row space-x-2 items-center'>
            <img src="/svgs/refSVG.svg" className='m-1 p-1 w-10'/>
            <p className='m-1'>Add Reference:</p>
            <SearchBar handleSearchClick={handleSearchClick}/>
            
        </div>
        <div className='m-2 flex flex-wrap  flex-row space-x-2 items-center'>
          <RefCardSM imdbids = {imdbids} handleRemoveMovie={handleRemoveMovie} isExpanded={isExpanded} isMovies={isMovies}/>
        </div>
        <div className='m-2 flex flex-row-reverse'>
        <button className='border border-black bg-black text-white font-bold rounded-full px-5 transition duration-300 ease-in-out hover:bg-gray-800 transform hover:scale-105' onClick={onSubmitCreateSummary}>Post</button>
        </div>
      </div>
      
      </div>
    </>
  )
}

export default CreateRecommendation