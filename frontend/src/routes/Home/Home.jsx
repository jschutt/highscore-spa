import React, {useEffect, useState} from 'react'
import GamesList from '../../components/GamesList/GamesList';

const Home = () => {

    const [games, setGames] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/games')
        .then(response => response.json())
        .then(games => setGames(games));
    }, [])

  return (
    <>
        <GamesList games={games}/>
    </>
  )
}

export default Home;