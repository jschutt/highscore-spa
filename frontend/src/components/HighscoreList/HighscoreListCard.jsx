import React from "react";
import { Link } from "react-router-dom";

const HighscoreListCard = ({ title, player, highscore, highscoreDate, urlSlug }) => {
  return (
    <div className="user-card-list mb-2">
      <Link to={"/games/" + urlSlug}>
        <div className="user-card arrow-hover">
          <p className="fw-bolder fs-5">{title}</p>
          <p className="fw-bolder fs-5">
            {highscore ? highscore : "0"}
          </p>
          <div className="break"></div>
          <p>
            {highscore
              ? `${player}, ${highscoreDate}`
              : "No scores yet registered"}
          </p>
        </div>
        <img
          className="arrow"
          src="https://i.imgur.com/0vKgaDf.png"
          alt="arrow"
        />
      </Link>
    </div>
  );
};

export default HighscoreListCard;
