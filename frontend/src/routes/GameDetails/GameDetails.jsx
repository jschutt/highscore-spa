import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ScoreList from "../../components/ScoreList/ScoreList";

const GameDetails = () => {
  const [scores, setScores] = useState([]);
  const [game, setGame] = useState([]);

  const { urlSlug } = useParams();

  useEffect(() => {
    fetch(`http://localhost:5000/api/games/${urlSlug}/highscores`)
      .then((response) => response.json())
      .then((scores) => {
        let sortedScores = [...scores].sort((a, b) => b.highscore - a.highscore)
        setScores(sortedScores);  
        console.log(sortedScores);  
      });
      fetch(`http://localhost:5000/api/games/${urlSlug}`)
      .then((response) => response.json())
      .then((game) => {
        console.log(game);
        setGame(game[0]);
      });
  }, []);

  return (
    <>
      {game && (
        <section className="game-details row mt-4">
          <img
            src={game.imageUrl}
            className="d-block col-4"
            alt={"Picture of " + game.title}
          />
          <div className="col-8">
            <h1 className="mb-3">{game.title}</h1>
            <div className="mb-3">{game.releaseDate}, {game.genre}</div>
            <div className="mb-3">{game.description}</div>
          </div>
          <div className="score-list-container mt-4 pb-3">
            <h2 className="text-center my-3">Top 10 highscores</h2>
            <ScoreList scores={scores}/>
          </div>
        </section>
      )}
    </>
  );
};

export default GameDetails;
