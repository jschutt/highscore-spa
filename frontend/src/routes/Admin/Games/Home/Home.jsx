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

  return (
    <>
      <h1>Games</h1>
      <Link to={"admin/games/new"} className="btn btn-primary">
        Add game
      </Link>
      <Link to={"admin/games/new"} className="btn btn-primary">
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
              <th>{game.release_date}</th>
              <th>
                <button>Delete</button>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Home;
