// things to add........
// turn order or at least stop multiple cards being played
// fix 2 of same username issue


import React, { useCallback, useEffect, useState } from 'react'
import io from 'socket.io-client'
import './HighCardGame.css'


let socket

const HighCardGame =  ({ name, room, setRoom, setCurrentGame }) => {

    const [ players, setPlayers ] = useState([])
    const [ deck, setDeck ] = useState([])
    const [ hand, setHand ] = useState([])
    const [ cardPot, setCardPot ] = useState([])
    const [ playerScores, setPlayerScores ] = useState([])

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
        socket.on('players', ({ players }) => {
            players.forEach((player, index) => player.playerNumber = index + 1)
            console.log(players);
            setPlayers(players)
        })

        socket.on('hand', ({ hand }) => {
            setHand(hand)
        })

        socket.on('update-card-pot', ({updatedCardPot}) => {
            setCardPot(updatedCardPot)
        })

        socket.on('update-scores', ({scores}) => {
            setPlayerScores(scores)
        })
    }, [])

    useEffect(() => {
        if(deck.length === 52){
            dealCards()
        }
    },[deck])


    useEffect(() => {
        if(cardPot.length === players.length) handleEndRound()
    }, [cardPot])

    const handleEndRound = () => {
        let highestCard = { value: 0 }
        cardPot.forEach(card => {
            if(card.value === "JACK")card.value = "11"
            if(card.value === "QUEEN")card.value = "12"
            if(card.value === "KING")card.value = "13"
            if(card.value === "ACE")card.value = "14"

            if(card.suit === "CLUBS")card.suitRank = 1
            if(card.suit === "DIMONDS")card.suitRank = 2
            if(card.suit === "HEARTS")card.suitRank = 3
            if(card.suit === "SPADES")card.suitRank = 4

            if(parseInt(card.value) > parseInt(highestCard.value)) highestCard = card
            if(card.value === highestCard.value) {
                if(card.suitRank > highestCard.suitRank) highestCard = card
            }
        })
        console.log(highestCard.player);
        console.log(highestCard);
        console.log(players);
        let roundWinner = null
        players.forEach(player => {
            if(player.id === highestCard.player) {
                const winnerIndex = playerScores.findIndex(score =>  score.name === player.name)
                console.log("index", winnerIndex);
                let updateablePlayerScores = [...playerScores]
                updateablePlayerScores[winnerIndex].score ++
                setPlayerScores(updateablePlayerScores)
                console.log("playerScores", playerScores);

                // player.score ++
                roundWinner = player.name
            }
        })
        // if(roundWinner) alert(roundWinner + " has won this hand")
    }

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

        let scores 

        if(hand.length === 0) {
            // doing scores this way means if someone drops out and comes back with same name their score will not be lost
            scores = players.map(player => {
                return {name: player.name, score: 0}
            })
            setPlayerScores(scores)
        } else {
            scores = playerScores
        }

        let numberOfDecks = 1 

        fetch('https://deckofcardsapi.com/api/deck/new/shuffle?deck_count=' + numberOfDecks)
        .then(res => res.json())
        .then(results => {
            fetch('https://deckofcardsapi.com/api/deck/' + results.deck_id + '/draw/?count=' + (52 * numberOfDecks))
            .then(res => res.json())
            .then(results => {
                console.log(results.cards);
                setDeck(results.cards)
                socket.emit('start-game', {players :players, deck: results.cards, scores: scores}, () => {

                })
            })

        })
        .catch(err => console.log(err))


        
    }

    const displayPlayers = () => {
        return players.map(player => {
            let scoreObject = playerScores.find(score =>  score.name === player.name) || {score: 0}
            console.log("scoreObject", scoreObject);
            return <p>{player.name} ---------- {scoreObject.score}</p>
        })
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
            <p>Welcome <b>{name}</b> to High Card Game</p>
            <button onClick={() => handleGoHome()}> Home </button>
            <p>Played Cards</p>
            {displayPotCards()}
            <p>Players currently in <b>{room}</b> are....</p>
            <p>Name ---------- Score</p>
            {displayPlayers()}
            <button disabled={hand.length > 0 && cardPot.length < players.length} onClick={() => handleStartGame()}>{hand.length === 0 ? "Start" : "Deal"}</button>
            <p>Player Hand</p>
            {displayCards()}
        </>
    )
}

export default HighCardGame