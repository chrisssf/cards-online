import React, { useState } from 'react'
import './Join.css'



const Join = ({ name, setName, room, setRoom, setCurrentGame }) => {

    const handleSubmit = () =>{
        if(name !== "" && room !== "") setCurrentGame("HighCardGame")
    }

    return (
        <div className="joinOuterContainer">
            <div className="joinInnerContainer">
                <h1 className="heading">Join</h1>
                <div><input placeholder="Name" value={name} className="joinInput" type="text" onChange={(event) => setName(event.target.value)} /></div>
                <div><input placeholder="Room" className="joinInput mt-20" type="text" onChange={(event) => setRoom(event.target.value)} /></div>
                <button className="button mt-20" onClick={() => handleSubmit()}>Sign In</button>
            </div>
        </div>
    )
}

export default Join