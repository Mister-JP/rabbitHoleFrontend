"use client";
import React, { useState, useEffect } from 'react';
import Dropdown from './CheckBox';
import ToggleButton from './ToggleButton';

const FilterBar = ({primary, secondary, primaryState, setPrimaryState, isCheckboxCheckedScore, search, setSearch, isCheckboxCheckedTime, setIsCheckboxCheckedScore, setIsCheckboxCheckedTime, isUserLevel1, setIsUserLevel1, isUserLevel2, setIsUserLevel2, isUserLevel3, setIsUserLevel3, isUserLevel4, setIsUserLevel4, isUserLevel5, setIsUserLevel5, isDesc, setIsDesc, isNewest, setIsNewest, selectedOption, setSelectedOption}) => {
  // const [search, setSearch] = useState('');
  return (
    <div className={`flex flex-row justify-between items-center border border-black mt-1 rounded-full p-2 transition-all duration-500 ease-in-out`}>
        <input type="text" placeholder="Search..." className='border border-black rounded-full p-2 mr-5 bg-white' onChange={(e) => setSearch(e.target.value)}/>
        <div className='flex flex-row space-between items-center space-x-1'>
        <p className='mr-0'>
            Sort By:   
        </p>
        <Dropdown text="Score" isCheckboxCheckedTime={isCheckboxCheckedTime} setIsCheckboxCheckedTime={setIsCheckboxCheckedTime} isCheckboxCheckedScore={isCheckboxCheckedScore} setIsCheckboxCheckedScore={setIsCheckboxCheckedScore} isUserLevel1={isUserLevel1} setIsUserLevel1={setIsUserLevel1} isUserLevel2={isUserLevel2} setIsUserLevel2={setIsUserLevel2} isUserLevel3={isUserLevel3} setIsUserLevel3={setIsUserLevel3} isUserLevel4={isUserLevel4} setIsUserLevel4={setIsUserLevel4} isUserLevel5={isUserLevel5} setIsUserLevel5={setIsUserLevel5} isDesc={isDesc} setIsDesc={setIsDesc} isNewest={isNewest} setIsNewest={setIsNewest} selectedOption={selectedOption} setSelectedOption={setSelectedOption}/>
        <Dropdown text="Time" isCheckboxCheckedTime={isCheckboxCheckedTime} setIsCheckboxCheckedTime={setIsCheckboxCheckedTime} isCheckboxCheckedScore={isCheckboxCheckedScore} setIsCheckboxCheckedScore={setIsCheckboxCheckedScore} isUserLevel1={isUserLevel1} setIsUserLevel1={setIsUserLevel1} isUserLevel2={isUserLevel2} setIsUserLevel2={setIsUserLevel2} isUserLevel3={isUserLevel3} setIsUserLevel3={setIsUserLevel3} isUserLevel4={isUserLevel4} setIsUserLevel4={setIsUserLevel4} isUserLevel5={isUserLevel5} setIsUserLevel5={setIsUserLevel5} isDesc={isDesc} setIsDesc={setIsDesc} isNewest={isNewest} setIsNewest={setIsNewest} selectedOption={selectedOption} setSelectedOption={setSelectedOption}/>
        </div>
        <div className='flex flex-row space-between items-center space-x-1'>
        <p className='ml-3'>
            Primary Sort: 
        </p>
        <ToggleButton primary={primary} secondary={secondary} primaryState={primaryState} setPrimaryState={setPrimaryState}/>
        </div>
        {/* <button className='bg-gray-300 dark:text-black rounded-full p-2 px-7'>Apply</button> */}
      </div>
  )
}

export default FilterBar