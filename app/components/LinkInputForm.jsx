'use client';
import React, { useState } from "react";

function LinkInputForm({ links, setLinks, deletesArr, setDeletes }) {
  // Function to handle changes to the input fields
  const handleInputChange = (event, index) => {
    const newLinks = [...links];
    newLinks[index] = event.target.value;
    setLinks(newLinks);
  };

  // Function to add a new input field
  const handleAddLink = () => {
    if (links.length < 500) {
      setLinks([...links, ""]);
    }
  };
  console.log(deletesArr)
  console.log(links)
  // Function to remove an input field
  const handleRemoveLink = (index) => {
    const newLinks = [...links];
    const linkRemoved = newLinks.splice(index, 1);
    setLinks(newLinks);
    setDeletes([...deletesArr, linkRemoved[0]]);
  };

  // Placeholder function for validating a link
  const isValidLink = (link) => {
    return true;
  };

  return (
    <div>
      {links.map((link, index) => (
        <div key={index}>
          <input
            type="text"
            value={link}
            onChange={(event) => handleInputChange(event, index)}
            required
          />
          <button type="button" onClick={() => handleRemoveLink(index)}>
            X
          </button>
          {isValidLink(link) ? null : <p>Please enter a valid link.</p>}
        </div>
      ))}
      <button type="button" onClick={handleAddLink}>
        Add Link
      </button>
    </div>
  );
}

export default LinkInputForm;
