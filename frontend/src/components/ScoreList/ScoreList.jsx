import React from "react";
import ScoreCard from "./ScoreCard";

//TODO: Visa bara top 10 scores, samt bästa highscore ska vara högst upp

const ScoreList = ({ scores }) => {
  return (
    <div className="score-list">
      {scores.map((score, i) => (
        <ScoreCard score={score} key={i} />
        ))}
    </div>
  );
};

export default ScoreList;
