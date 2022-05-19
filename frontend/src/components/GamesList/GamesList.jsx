import React from 'react'

const GamesList = ({games}) => {
  return (
    <>
    {games.map((game) => (
      <div>Game</div>
    ))}
    </>
  )
}

export default GamesList;