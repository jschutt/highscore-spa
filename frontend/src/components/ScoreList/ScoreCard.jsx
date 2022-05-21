import React from 'react'

const ScoreCard = ({score}) => {

    const {
        player,
        highscore,
        highscore_date,
    } = score;

  return (
      <>
      <div className="game-scores mb-3 px-3 py-3 d-flex justify-content-between">
        <p><strong></strong>{player}, {highscore_date}</p>
        <p>{highscore}</p>
      </div>
  </>
  )
}

export default ScoreCard