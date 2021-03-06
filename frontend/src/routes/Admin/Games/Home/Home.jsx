import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {

  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/games")
      .then((response) => response.json())
      .then((games) => {
        setGames(games);
      });
  }, []);

  const deleteGame = (id) => {
    fetch(`http://localhost:5000/api/games/${id}`, {
      method: "DELETE"
    })
    .then(response => {
      const filteredGames = games.filter(x => x.id != id)
      console.log(filteredGames)
      setGames(filteredGames);
    })
  }

  return (
    <>
      <h1>Games</h1>
      <Link to={"new"} className="btn btn-primary">
        Add game
      </Link>
      <Link to={"../scores/new"} className="btn btn-primary">
        Add score
      </Link>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Genre</th>
            <th>Release date</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => (
            <tr key={game.id}>
              <th>{game.id}</th>
              <th>{game.title}</th>
              <th>{game.genre}</th>
              <th>{game.releaseDate}</th>
              <th>
                <button onClick={() => deleteGame(game.id)}>Delete</button>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Home;
