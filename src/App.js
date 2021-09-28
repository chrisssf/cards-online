import React, { useState, useEffect } from 'react'
import HighCardGame from './HighCardGame'
import Join from './Join'

const App = () => {

    const [ name, setName ] = useState("")
    const [ room, setRoom ] = useState("")
    const [ currentGame, setCurrentGame ] = useState("")

    return (

        <>
            <p>App!!!!</p>
            {currentGame === "" && 
                <Join 
                    name={name} 
                    setName={setName} 
                    room={room} 
                    setRoom={setRoom} 
                    setCurrentGame={setCurrentGame}
                />
            }
            {currentGame === "HighCardGame" && 
                <HighCardGame
                    name={name} 
                    room={room}
                    setRoom={setRoom} 
                    setCurrentGame={setCurrentGame}
                />
            }
        </>
    )
}

export default App