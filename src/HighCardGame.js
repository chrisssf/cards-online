import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import './HighCardGame.css'


let socket

const HighCardGame =  ({ name, room, setRoom, setCurrentGame }) => {

    const ENDPOINT = 'localhost:5000'  // LOCAL

    useEffect(() => {

        socket = io(ENDPOINT, {transports:['websocket']}) //newer => these both work
        socket.emit('join', { name, room }, () => {

        })

    }, [ENDPOINT, name, room])


    const handleGoHome = () => {
        setRoom("")
        setCurrentGame("")
    }

    return (
        <>
            <p>high card game</p>
            <button onClick={() => handleGoHome()}> Home </button>
        </>
    )
}

export default HighCardGame