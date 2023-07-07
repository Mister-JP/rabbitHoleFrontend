'use client'
import RefCardsMD from './RefCardsMD';
import { useRef } from 'react';

const scrollAmount = 550; // Change this to adjust scroll amount

function Scroller({refs, isExpanded, nodeID, commentsButton}) {
  const scrollRef = useRef();

  const handleScroll = (direction) => {
    if (direction === 'left') {
      scrollRef.current.scrollBy({ top: 0, left: -scrollAmount, behavior: 'smooth' });
    } else {
      scrollRef.current.scrollBy({ top: 0, left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
  {refs.length > 2 && (
    <>
      <button
        className="absolute z-20 left-0 top-1/2 transform -translate-y-1/2 rotate-90 bg-gradient-to-r from-white to-transparent"
        onClick={() => handleScroll('left')}
      >
        <img src='/svgs/DropDown.svg' className='w-4'/>
      </button>
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent"></div>
      <button
        className="absolute z-20 right-0 top-1/2 transform -translate-y-1/2 -rotate-90 bg-gradient-to-l from-white to-transparent"
        onClick={() => handleScroll('right')}
      >
        <img src='/svgs/DropDown.svg' className='w-4'/>
      </button>
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent"></div>
    </>
  )}
  <div
    ref={scrollRef}
    className={`flex space-x-4 overflow-x-scroll scrollbar-hide transition-all duration-500 ease-in-out mb-5 ${isExpanded ? 'h-auto opacity-100' : 'overflow-hidden p-0 h-0 opacity-50'}`}
  >
    {refs.length > 0 && refs.map((ref, index) => {
      return (
        <div className='min-w-[550px]'>
          <RefCardsMD reference={ref} key={index} nodeID={nodeID} commentsButton={commentsButton}/>
        </div>
      )
    })}
  </div>
</div>

  );
}

export default Scroller;
