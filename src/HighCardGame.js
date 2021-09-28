import React, { useState } from 'react'
import './HighCardGame.css'

const HighCardGame = ({ setCurrentGame }) => {

    

    return (
        <>
            <p>high card game</p>
            <button onClick={() => setCurrentGame("")}> Home </button>
        </>
    )
}

export default HighCardGame