"use client";
import React, { useState, useEffect } from 'react';
import Dropdown from './CheckBox';
import ToggleButton from './ToggleButton';


const FilterBar = ({primary, secondary, primaryState, setPrimaryState, isCheckboxCheckedScore, search, setSearch, isCheckboxCheckedTime, setIsCheckboxCheckedScore, setIsCheckboxCheckedTime, isUserLevel1, setIsUserLevel1, isUserLevel2, setIsUserLevel2, isUserLevel3, setIsUserLevel3, isUserLevel4, setIsUserLevel4, isUserLevel5, setIsUserLevel5, isDesc, setIsDesc, isNewest, setIsNewest, selectedOption, setSelectedOption, searchBar=true, feed=null, setFeed=null}) => {
  // const [search, setSearch] = useState('');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const handleChange = (e) => {
    setFeed(e.target.value);
  }

  return (
    <div className={`flex flex-col md:flex-row justify-between items-center border border-black mt-1 rounded-lg space-y-2 md:rounded-full p-3 transition-all duration-500 ease-in-out w-full md:w-4/5 space-x-4`}>
        {searchBar && <input type="text" placeholder="Search..." className='border border-black rounded-full p-2 mr-5 bg-white' onChange={(e) => setSearch(e.target.value)}/>}
        {!searchBar &&
        <div 
            className="relative inline-block text-left w-64"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <div>
              <span className="rounded-md shadow-sm">
                <button type="button" className="inline-flex justify-center w-full rounded-full border border-gray-300 px-4 py-2 bg-black text-sm leading-5 font-medium text-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150" id="options-menu" aria-haspopup="true" aria-expanded="true">
                  {feed === 'recommendation' && 'Recommendation'}
                  {feed === 'comments' && 'Comments'}
                  {feed === 'movies' && 'Movies & TV'}
                  <svg className="-mr-1 ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-.707.293 1 1 0 01-.707-.293l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </span>
            </div>

            {isDropdownOpen && (
              <>
              <div className='h-2'></div>
              <div className="origin-top-right relative md:absolute right-0 w-full rounded-md shadow-lg">
                <div className="rounded-md bg-white shadow-xs">
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    <button onClick={() => setFeed('recommendation')} className="block w-full px-4 py-2 text-sm leading-5 text-black hover:bg-gray-100 hover:text-black focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">Recommendation</button>
                    <button onClick={() => setFeed('comments')} className="block px-4 py-2 w-full text-sm leading-5 text-black hover:bg-gray-100 hover:text-black focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">Comments</button>
                    {/* <button onClick={() => setFeed('movies')} className="block px-4 py-2 text-sm w-full leading-5 text-black hover:bg-gray-100 hover:text-black focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">Movies & TV</button> */}
                  </div>
                </div>
              </div>
              </>
            )}
          </div>}
          <p className='mr-0'>
            Sort By:   
        </p>
        <div className='flex flex-row space-between items-center space-x-1'>
        
        <Dropdown text="Score" isCheckboxCheckedTime={isCheckboxCheckedTime} setIsCheckboxCheckedTime={setIsCheckboxCheckedTime} isCheckboxCheckedScore={isCheckboxCheckedScore} setIsCheckboxCheckedScore={setIsCheckboxCheckedScore} isUserLevel1={isUserLevel1} setIsUserLevel1={setIsUserLevel1} isUserLevel2={isUserLevel2} setIsUserLevel2={setIsUserLevel2} isUserLevel3={isUserLevel3} setIsUserLevel3={setIsUserLevel3} isUserLevel4={isUserLevel4} setIsUserLevel4={setIsUserLevel4} isUserLevel5={isUserLevel5} setIsUserLevel5={setIsUserLevel5} isDesc={isDesc} setIsDesc={setIsDesc} isNewest={isNewest} setIsNewest={setIsNewest} selectedOption={selectedOption} setSelectedOption={setSelectedOption}/>
        <Dropdown text="Time" isCheckboxCheckedTime={isCheckboxCheckedTime} setIsCheckboxCheckedTime={setIsCheckboxCheckedTime} isCheckboxCheckedScore={isCheckboxCheckedScore} setIsCheckboxCheckedScore={setIsCheckboxCheckedScore} isUserLevel1={isUserLevel1} setIsUserLevel1={setIsUserLevel1} isUserLevel2={isUserLevel2} setIsUserLevel2={setIsUserLevel2} isUserLevel3={isUserLevel3} setIsUserLevel3={setIsUserLevel3} isUserLevel4={isUserLevel4} setIsUserLevel4={setIsUserLevel4} isUserLevel5={isUserLevel5} setIsUserLevel5={setIsUserLevel5} isDesc={isDesc} setIsDesc={setIsDesc} isNewest={isNewest} setIsNewest={setIsNewest} selectedOption={selectedOption} setSelectedOption={setSelectedOption}/>
        </div>
        <p className='ml-3'>
            Primary Sort: 
        </p>
        <div className='flex flex-row space-between items-center space-x-1'>
        
        <ToggleButton primary={primary} secondary={secondary} primaryState={primaryState} setPrimaryState={setPrimaryState}/>
        </div>
        {/* <button className='bg-gray-300 dark:text-black rounded-full p-2 px-7'>Apply</button> */}
      </div>
  )
}

export default FilterBar