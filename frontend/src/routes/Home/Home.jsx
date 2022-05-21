import React, {useEffect, useState} from 'react'
import HighscoreList from '../../components/HighscoreList/HighscoreList';

const Home = () => {

    const [scores, setScores] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/scores/highscores')
        .then(response => response.json())
        .then(scores => {
          setScores(scores)
        });
    }, [])

  return (
    <>
        <HighscoreList scores={scores}/>
    </>
  )
}

export default Home;