import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchCard from "../../components/SearchCard/SearchCard";

const SearchResults = () => {
  const [searchParams] = useSearchParams();

  const [searchResult, setSearchResult] = useState([]);

  const searchTerm = searchParams.get("q");

  useEffect(() => {
    fetch(`http://localhost:5000/api/games?title=${searchTerm}`)
      .then((response) => response.json())
      .then((results) => {
        setSearchResult(results);
      });
  }, [searchParams]);

  return (
    <section className="search-results mb-4">
      <div className="text-center fs-5 my-4">
        Found {searchResult.length} matches on "{searchTerm}"
      </div>
      <div className="row">
        {searchResult &&
          searchResult.map((game, i) => <SearchCard game={game} key={i} />)}
      </div>
    </section>
  );
};

export default SearchResults;
