import React from "react";
import HighscoreListCard from "./HighscoreListCard";

const HighscoreList = ({ scores }) => {
  return (
    <section className="home-section px-4 pb-3">
      <h1 className="text-center mb-4 pt-4">Top scores</h1>
      <div className="highscore-list mb-5">
        {scores.map((score, i) => (
          <HighscoreListCard 
          player={score.player} 
          highscore={score.highscore} 
          title={score.title}
          highscoreDate={score.highscore_date}
          urlSlug={score.url_slug}
          key={i} />
        ))}
      </div>
    </section>
  );
};

export default HighscoreList;
