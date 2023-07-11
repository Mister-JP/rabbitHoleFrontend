import React from 'react'

const ToggleButton = ({primary, secondary, primaryState, setPrimaryState, w}) => {
  return (
    <div className="flex">
              <button
                className={`px-4 py-2 rounded-l-full ${
                    primaryState
                    ? "dark:bg-black dark:text-white"
                    : "dark:bg-gray-300 dark:text-black"
                }`}
                onClick={() => setPrimaryState(true)}
              >
                {primary}
              </button>
              <button
                className={`px-4 py-2 rounded-r-full ${
                  !primaryState
                    ? "dark:bg-black dark:text-white"
                    : "dark:bg-gray-300 dark:text-black"
                }`}
                onClick={() => setPrimaryState(false)}
              >
                {secondary}
              </button>
            </div>
  )
}

export default ToggleButton