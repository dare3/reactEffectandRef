import React from "react";

function Card({ image, value, suit }) {
  return (
    <img src={image} alt={`${value} of ${suit}`} />
  );
}

export default Card;
