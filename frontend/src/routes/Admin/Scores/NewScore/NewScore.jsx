import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const NewScore = () => {

    const [games, setGames] = useState([]);
    const [title, setTitle] = useState("");
    const [player, setPlayer] = useState("");
    const [highscoreDate, setHighscoreDate] = useState("");
    const [highscore, setHighscore] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:5000/api/games')
        .then(response => response.json())
        .then(games => {
            console.log(games)
            setGames(games);
        })
    }, [])

    const handleSubmit = (event) => {
        event.preventDefault();

        const score = {
            title,
            player,
            highscoreDate,
            highscore
        }

        console.log(score)

        fetch("http://localhost:5000/api/scores", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(score)
        }).then(resp => {
            navigate('/admin/games')
        });
    };

  return (
    <>
      <h1>New highscore</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="gameTitle">Select game</label>
        <select 
            name="gameTitle" 
            id="gameTitle"
            onChange={(e) => setTitle(e.target.value)}
            >
            {games.map((game) => (
          <option value={game.title} key={game.id}>{game.title}</option>
            ))}
        </select>
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              name="player"
              className="form-control"
              placeholder="Player name"
              onChange={(e) => setPlayer(e.target.value)}
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <label htmlFor="highscoreDate">Highscore date</label>
            <input
              type="text"
              name="highscoreDate"
              id="highscoreDate"
              className="form-control"
              placeholder="YYYY-MM-DD"
              onChange={(e) => setHighscoreDate(e.target.value)}
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <input
              type="number"
              name="highscore"
              className="form-control"
              placeholder="Highscore"
              onChange={(e) => setHighscore(e.target.value)}
            />
          </div>
        </div>
        <button className="add-game-btn">Add score</button>
      </form>
    </>
  );
};

export default NewScore;
