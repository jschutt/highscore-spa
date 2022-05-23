import React from "react";

const ScoreCard = ({ score, rank }) => {

  const { player, highscore, highscore_date } = score;

  return (
    <>
      <div className="game-scores mb-3 px-3 py-3 d-flex justify-content-between">
        <p>
          <strong>{rank}. </strong>
          {player}, {highscore_date}
        </p>
        <p>{highscore}</p>
      </div>
    </>
  );
};

export default ScoreCard;
