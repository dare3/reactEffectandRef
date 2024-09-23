import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "./Card"; // Import the Card component

const BASE_URL = "https://deckofcardsapi.com/api/deck";

function Deck() {
  const [deckId, setDeckId] = useState(null); // To store the deck ID
  const [cards, setCards] = useState([]);     // To store drawn cards
  const [remaining, setRemaining] = useState(52); // Number of cards left in deck
  const [isDrawing, setIsDrawing] = useState(false); // Control button to prevent over-clicking
  const [isShuffling, setIsShuffling] = useState(false); // Control button during shuffling

  // Get a new deck when the component loads
  useEffect(() => {
    async function fetchDeck() {
      const res = await axios.get(`${BASE_URL}/new/shuffle/`);
     setDeckId(res.data.deck_id);
      setRemaining(res.data.remaining);
    }
    fetchDeck();
  }, []);

  // Draw a card when the button is clicked
  async function drawCard() {
    if (remaining === 0) {
      alert("Error: no cards remaining!");
      return;
    }

    setIsDrawing(true); // Prevent multiple requests

    const res = await axios.get(`${BASE_URL}/${deckId}/draw/?count=2`);
    const newCard = res.data.cards[0];
    setCards([...cards, newCard]);
    setRemaining(res.data.remaining);

    setIsDrawing(false); // Re-enable the button
  }

  // Shuffle the deck when the button is clicked
  async function shuffleDeck() {
    setIsShuffling(true); // Disable shuffle button during shuffle

    const res = await axios.get(`${BASE_URL}/${deckId}/shuffle/`);
    setRemaining(res.data.remaining);
    setCards([]); // Clear all displayed cards

    setIsShuffling(false); // Re-enable the button after shuffle
  }

  return (
    <div>
      <button onClick={drawCard} disabled={isDrawing || isShuffling}>Draw Card</button>
      <button onClick={shuffleDeck} disabled={isShuffling}>Shuffle Deck</button>
      <div>
        {cards.map(card => (
          <Card key={card.code} image={card.image} value={card.value} suit={card.suit} />
        ))}
      </div>
    </div>
  );
}

export default Deck;
