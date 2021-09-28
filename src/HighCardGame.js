import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import './HighCardGame.css'


let socket

const HighCardGame =  ({ name, room, setRoom, setCurrentGame }) => {

    const [ players, setPlayers ] = useState([])

    const ENDPOINT = 'localhost:5000'  // LOCAL

    useEffect(() => {

        socket = io(ENDPOINT, {transports:['websocket']}) //newer => these both work
        socket.emit('join', { name, room }, () => {

        })

        return () => {
            socket.emit('disconnect')
            socket.off()
        }
    }, [ENDPOINT, name, room])

    useEffect(() => {
        socket.on('players', (message) => {
            console.log(message);
            setPlayers(message.users)
        })
    }, [])


    const handleGoHome = () => {
        setRoom("")
        setCurrentGame("")
    }

    const displayPlayers = () => {
        return players.map(player => <p>{player.name}</p>)
    }

    return (
        <>
            <p>high card game</p>
            <button onClick={() => handleGoHome()}> Home </button>
            <p>Players currently in {room} are....</p>
            {displayPlayers()}
        </>
    )
}

export default HighCardGame