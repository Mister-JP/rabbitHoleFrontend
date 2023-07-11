'use client';
import React, { useState, useEffect } from 'react';
import RefCardsMD from './RefCardsMD';
import Scroller from './ScrollComponent';




const References = ({refs, nodeID, commentsButton, setErrorCode}) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [rotationClass, setRotationClass] = useState('animate-spin--0')
    

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
      };
    
    useEffect(() => {
        setRotationClass(isExpanded ? 'animate-spin-0' : 'animate-spin-90');
    }, [isExpanded])
    

  return (
    <>
    <div className="flex flex-col m-1 md:m-5 space-x-1 md:space-x-4">
      <div className={`flex flex-row space-x-2 cursor-pointer`} onClick={handleToggle}>
        <img src='/svgs/DropDown.svg' className={`w-4 transform ${rotationClass}`}/>
        <img src='/svgs/refSVG.svg' className='w-4'/>
        <div>References:</div>
      </div>
      <div className="relative">
      </div>
      <div>
      <Scroller refs={refs} isExpanded={isExpanded} nodeID={nodeID} commentsButton={commentsButton} setErrorCode={setErrorCode}/>
      </div>
      {/* <div className={`transition-all duration-500 ease-in-out mb-5 ${isExpanded ? 'h-auto opacity-100' : 'overflow-hidden p-0 h-0 opacity-50'}`}>
        {refs.length>0 && refs.map((ref, index) =>{
            return( <RefCardsMD reference={ref} key={index} nodeID={nodeID} commentsButton={commentsButton}/>)
        })}
      </div> */}

      </div>
    </>
  )
}

export default References