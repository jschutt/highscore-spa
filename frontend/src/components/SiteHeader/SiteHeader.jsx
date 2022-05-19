import React from 'react'

const SiteHeader = () => {
  return (
    <header>
    <nav
      className="navbar navbar-light flex-column justify-content-center"
    >
      <a className="navbar-brand" href="/">
        <div className="logo-container">
          <img
            className="image-title my-4"
            src="https://i.imgur.com/XaXYCga.png"
            alt="Letter H"
          />
          <img
            className="image-title my-4"
            src="https://i.imgur.com/P3wkzUS.png"
            alt="Letter I"
          />
          <img
            className="image-title my-4"
            src="https://i.imgur.com/jtbC5LN.png"
            alt="Letter G"
          />
          <img
            className="image-title my-4"
            src="https://i.imgur.com/xoMT20P.png"
            alt="Letter H"
          />
          <img
            className="image-title my-4"
            src="https://i.imgur.com/nocFyTr.png"
            alt="Letter S"
          />
          <img
            className="image-title my-4"
            src="https://i.imgur.com/45eAnC6.png"
            alt="Letter C"
          />
          <img
            className="image-title my-4"
            src="https://i.imgur.com/luKBrBk.png"
            alt="Letter O"
          />
          <img
            className="image-title my-4"
            src="https://i.imgur.com/M7gjpAM.png"
            alt="Letter R"
          />
          <img
            className="image-title my-4"
            src="https://i.imgur.com/BAJJRkr.png"
            alt="Letter E"
          />
        </div>
      </a>
      <form action="/search" className="d-flex justify-content-center mb-4">
        <input
          className="search-bar form-control mr-sm-2"
          type="search"
          placeholder="Search games..."
          aria-label="Search"
          name="q"
        />
        <button className="search-btn mx-2" type="submit"></button>
      </form>
    </nav>
  </header>
  )
}

export default SiteHeader