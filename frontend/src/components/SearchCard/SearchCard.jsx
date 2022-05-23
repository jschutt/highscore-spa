import React from "react";
import '../../stylesheets/style.css'
import { Link } from "react-router-dom";

const SearchCard = ({game}) => {

    const {
        title,
        genre,
        release_date,
        image_url,
        url_slug
    } = game;

    console.log(game)

  return (
    <Link to={"/games/" + url_slug}>
      <div className="search-card">
        <p className="search-title">{title}</p>
        <img className="search-image" src={image_url} alt="Picture of title" />
        <p className="search-genre">{genre}, {release_date}</p>
      </div>
    </Link>
  );
};

export default SearchCard;
