import React, { useState } from 'react'
import './Join.css'

const Join = ({ name, setName, room, setRoom, setCurrentGame }) => {

    

    return (
        <div className="joinOuterContainer">
            <div className="joinInnerContainer">
                <h1 className="heading">Join</h1>
                <div><input placeholder="Name" className="joinInput" type="text" onChange={(event) => setName(event.target.value)} /></div>
                <div><input placeholder="Room" className="joinInput mt-20" type="text" onChange={(event) => setRoom(event.target.value)} /></div>
                {/* <Link onClick={event => (!name || !room) ? event.preventDefault() : null} to={`/chat?name=${name}&room=${room}`}> */}
                    <button className="button mt-20" onClick={() => setCurrentGame("HighCardGame")}>Sign In</button>
                {/* </Link> */}
            </div>
        </div>
    )
}

export default Join