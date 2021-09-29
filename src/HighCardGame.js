// things to add........
// turn order or at least stop multiple cards being played
// handle end round to determine who played highest hand
// have a suit ranking system for ties, or trump suit
// keep track of points for each player
// fix 2 of same username issue
// change start button to deal after starting and stop it being pressed mid game

import React, { useCallback, useEffect, useState } from 'react'
import io from 'socket.io-client'
import './HighCardGame.css'


let socket

const HighCardGame =  ({ name, room, setRoom, setCurrentGame }) => {

    const [ players, setPlayers ] = useState([])
    const [ deck, setDeck ] = useState([])
    const [ hand, setHand ] = useState([])
    const [ cardPot, setCardPot ] = useState([])

    const ENDPOINT = 'localhost:5000'  // LOCAL

    useEffect(() => {

        socket = io(ENDPOINT, {transports:['websocket']}) //newer => these both work
        socket.emit('join', { name, room }, () => {

        })
        
        return () => {
            // socket.emit('disconnect')
            // socket.off()
            socket.disconnect()
        }
    }, [ENDPOINT, name, room])

    useEffect(() => {
        socket.on('players', (message) => {
            console.log(message);
            setPlayers(message.users)
        })

        socket.on('hand', ({ hand }) => {
            setHand(hand)
        })

        socket.on('update-card-pot', ({updatedCardPot}) => {
            setCardPot(updatedCardPot)
        })
    }, [])

    useEffect(() => {
        if(deck.length === 52){
            dealCards()
        }
    },[deck])

    const dealCards = () => {
        players.forEach((player, index) => {
            // const playerCards = deck[0]
            const playerCards = deck.slice((index * 5), (index * 5 + 5))
            socket.emit('player-hand', { playerId: player.id, hand: playerCards }, () => {

            })
        })
        setDeck([])
    }


    const handleGoHome = () => {
        setRoom("")
        setCurrentGame("")
    }

    const handleStartGame = () => {

        let numberOfDecks = 1 

        fetch('https://deckofcardsapi.com/api/deck/new/shuffle?deck_count=' + numberOfDecks)
        .then(res => res.json())
        .then(results => {
            fetch('https://deckofcardsapi.com/api/deck/' + results.deck_id + '/draw/?count=' + (52 * numberOfDecks))
            .then(res => res.json())
            .then(results => {
                console.log(results.cards);
                setDeck(results.cards)
                socket.emit('start-game', {players :players, deck: results.cards}, () => {

                })
            })

        })
        .catch(err => console.log(err))
    }

    const displayPlayers = () => {
        return players.map(player => <p>{player.name}</p>)
    }

    const displayPotCards = () => {
        const cardImages = cardPot.map((card, index) => <img src={card.image} alt={card.code} />);
        return <div className="whist-player-hand">{cardImages}</div>;
    }

    const displayCards = () => {
        const cardImages = hand.map((card, index) => <img onClick={() => handleSelectCard(card, index, hand)} src={card.image} alt={card.code} />);
        return <div className="whist-player-hand">{cardImages}</div>;
    }

    const handleSelectCard = (card, index) => {
        card.player = socket.id
        socket.emit("play-card", { card: card, cardPot: cardPot }, () => {
            const newHand = [...hand]
            newHand.splice(index, 1)
            setHand(newHand)
        })
    }


    return (
        <>
            <p>high card game</p>
            <button onClick={() => handleGoHome()}> Home </button>
            <p>Played Cards</p>
            {displayPotCards()}
            <p>Players currently in {room} are....</p>
            {displayPlayers()}
            <button onClick={() => handleStartGame()}>Start</button>
            <p>Player Hand</p>
            {displayCards()}
        </>
    )
}

export default HighCardGame