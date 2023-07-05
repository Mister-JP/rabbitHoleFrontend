'use client'
import React, { useState } from 'react';
import ToggleButton from './ToggleButton';

export default function Dropdown({text, isCheckboxCheckedScore, isCheckboxCheckedTime, setIsCheckboxCheckedScore, setIsCheckboxCheckedTime, isUserLevel1, setIsUserLevel1, isUserLevel2, setIsUserLevel2, isUserLevel3, setIsUserLevel3, isUserLevel4, setIsUserLevel4, isUserLevel5, setIsUserLevel5, isDesc, setIsDesc, isNewest, setIsNewest, selectedOption, setSelectedOption}) {
  const [isHovering, setIsHovering] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  

  const handleChange = (e) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div 
      className="relative" 
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex items-center ml-5 border border-black rounded-lg p-2">
      {text==="Score" && 
      <>
        <img 
          src='/svgs/DropDown.svg' 
          className={`w-4 transition-transform duration-200 ease-in-out transform ${isHovering && isCheckboxCheckedScore ? 'animate-spin-0' : 'animate-spin-90'}`}
        />
        <p className={`mx-2 ${!isCheckboxCheckedScore ? 'opacity-50' : 'opacity-100'}`}>{text}</p>
        <input 
          type="checkbox" 
          className="form-checkbox h-5 w-5 text-black bg-white border-black" 
          checked={isCheckboxCheckedScore} 
          onChange={() => setIsCheckboxCheckedScore(!isCheckboxCheckedScore)}
        />
        </>}
        {text==="Time" && 
      <>
        <img 
          src='/svgs/DropDown.svg' 
          className={`w-4 transition-transform duration-200 ease-in-out transform ${isHovering && isCheckboxCheckedTime ? 'animate-spin-0' : 'animate-spin-90'}`}
        />
        <p className={`mx-2 ${!isCheckboxCheckedTime ? 'opacity-50' : 'opacity-100'}`}>{text}</p>
        <input 
          type="checkbox" 
          className="form-checkbox h-5 w-5 text-black bg-white border-black" 
          checked={isCheckboxCheckedTime} 
          onChange={() => setIsCheckboxCheckedTime(!isCheckboxCheckedTime)}
        />
        </>}

      </div>
      {(isHovering || isOpen) && ((text==="Score" && isCheckboxCheckedScore) || (text==="Time" && isCheckboxCheckedTime)) && (
        <div 
          className="absolute top-full w-72 p-2 border border-black rounded-lg bg-white transition-transform duration-200 ease-in-out transform" 
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {text==="Score" && <ToggleButton primary="Desc" secondary="Asc" primaryState={isDesc} setPrimaryState={setIsDesc}/>}
          {text==="Time" && <ToggleButton primary="Newest" secondary="Oldest" primaryState={isNewest} setPrimaryState={setIsNewest}/>}
          <div className='m-4'>
          <p>Filter:</p>
          </div>
          {text === "Score" && 
          <>
          <div className='m-4 flex flex-row justify-between'>
          <p>User level 👶</p>
          <input 
          type="checkbox" 
          className="form-checkbox h-5 w-5 text-black bg-white border-black" 
          checked={isUserLevel1} 
          onChange={() => setIsUserLevel1(!isUserLevel1)}
        />
        </div>
        <div className='m-4 flex flex-row justify-between'>
          <p>User level 🧑‍🎓</p>
          <input 
          type="checkbox" 
          className="form-checkbox h-5 w-5 text-black bg-white border-black" 
          checked={isUserLevel2} 
          onChange={() => setIsUserLevel2(!isUserLevel2)}
        />
        </div>
        <div className='m-4 flex flex-row justify-between'>
          <p>User level 🧑‍💼</p>
          <input 
          type="checkbox" 
          className="form-checkbox h-5 w-5 text-black bg-white border-black" 
          checked={isUserLevel3} 
          onChange={() => setIsUserLevel3(!isUserLevel3)}
        />
        </div>
        <div className='m-4 flex flex-row justify-between'>
          <p>User level 🧑‍✈️</p>
          <input 
          type="checkbox" 
          className="form-checkbox h-5 w-5 text-black bg-white border-black" 
          checked={isUserLevel4} 
          onChange={() => setIsUserLevel4(!isUserLevel4)}
        />
        </div>
        <div className='m-4 flex flex-row justify-between'>
          <p>User-level 🫅</p>
          <input 
          type="checkbox" 
          className="form-checkbox h-5 w-5 text-black bg-white border-black" 
          checked={isUserLevel5} 
          onChange={() => setIsUserLevel5(!isUserLevel5)}
        />
        </div>
        </>
        }
        {
          text==='Time' &&
          <>
      <div className='m-4 flex flex-row justify-between'>
        <p>Last 24 hours</p>
        <input 
          type="radio" 
          className="form-radio h-5 w-5 text-black bg-white border-black"
          name="time"
          value="24hours"
          checked={selectedOption === '24hours'}
          onChange={handleChange}
        />
      </div>
      <div className='m-4 flex flex-row justify-between'>
        <p>Last week</p>
        <input 
          type="radio" 
          className="form-radio h-5 w-5 text-black bg-white border-black"
          name="time"
          value="week"
          checked={selectedOption === 'week'}
          onChange={handleChange}
        />
      </div>
      <div className='m-4 flex flex-row justify-between'>
        <p>Last month</p>
        <input 
          type="radio" 
          className="form-radio h-5 w-5 text-black bg-white border-black"
          name="time"
          value="month"
          checked={selectedOption === 'month'}
          onChange={handleChange}
        />
      </div>
      <div className='m-4 flex flex-row justify-between'>
        <p>Last 6 months</p>
        <input 
          type="radio" 
          className="form-radio h-5 w-5 text-black bg-white border-black"
          name="time"
          value="6months"
          checked={selectedOption === '6months'}
          onChange={handleChange}
        />
      </div>
      <div className='m-4 flex flex-row justify-between'>
        <p>Last year</p>
        <input 
          type="radio" 
          className="form-radio h-5 w-5 text-black bg-white border-black"
          name="time"
          value="year"
          checked={selectedOption === 'year'}
          onChange={handleChange}
        />
      </div>
      <div className='m-4 flex flex-row justify-between'>
        <p>All time</p>
        <input 
          type="radio" 
          className="form-radio h-5 w-5 text-black bg-white border-black"
          name="time"
          value="AllTime"
          checked={selectedOption === 'AllTime'}
          onChange={handleChange}
        />
      </div>
    </>
        }
        </div>
      )}
    </div>
  );
}
