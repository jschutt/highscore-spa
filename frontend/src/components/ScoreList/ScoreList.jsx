import React, { useEffect } from "react";
import ScoreCard from "./ScoreCard";

//TODO: Visa bara top 10 scores, samt bästa highscore ska vara högst upp

const ScoreList = ({ scores }) => {

  const topTenScores = scores.slice(0, 10);
  console.log(topTenScores)

  let rank = 1;

  return (
    <div className="score-list">
      {topTenScores.length !== 0 ? topTenScores.map((score, i) => (
        <ScoreCard score={score} rank={rank++} key={i} />
        )) 
        :
        (<p className="text-center">No scores yet registered</p>)}
    </div>
  );
};

export default ScoreList;
