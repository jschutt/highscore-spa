import React from "react";

const ScoreCard = ({ score, rank }) => {

  const { player, highscore, highscoreDate } = score;

  return (
    <>
      <div className="game-scores mb-3 px-3 py-3 d-flex justify-content-between">
        <p>
          <strong>{rank}. </strong>
          {player}, {highscoreDate}
        </p>
        <p>{highscore}</p>
      </div>
    </>
  );
};

export default ScoreCard;
