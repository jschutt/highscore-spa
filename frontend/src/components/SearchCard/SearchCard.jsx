import React from "react";
import '../../stylesheets/style.css'
import { Link } from "react-router-dom";

const SearchCard = ({game}) => {

    const {
        title,
        genre,
        releaseDate,
        imageUrl,
        urlSlug
    } = game;

    console.log(game)

  return (
    <Link to={"/games/" + urlSlug}>
      <div className="search-card">
        <p className="search-title">{title}</p>
        <img className="search-image" src={imageUrl} alt="Picture of title" />
        <p className="search-genre">{genre}, {releaseDate}</p>
      </div>
    </Link>
  );
};

export default SearchCard;
