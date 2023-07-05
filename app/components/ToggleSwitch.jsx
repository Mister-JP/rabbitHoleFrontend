'use-client'
import React from 'react';

const ToggleSwitch = ({ checked, onToggle }) => {
    return (
        <div className="container">
            <form className="toggle">
                <input type="radio" id="choice1" name="choice" value="creative" checked={checked} onChange={onToggle} />
                <label htmlFor="choice1">Speed</label>

                <input type="radio" id="choice2" name="choice" value="productive" checked={!checked} onChange={onToggle} />
                <label htmlFor="choice2">Quality</label>

                <div id="flap"><span className="content">{checked ? "creative" : "productive"}</span></div>
            </form>
        </div>
    );
};

export default ToggleSwitch;
