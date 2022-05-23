import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./stylesheets/style.css"
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./routes/Home/Home";
import GameDetails from "./routes/GameDetails/GameDetails";
import SearchResults from "./routes/SearchResults/SearchResults";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="games/:urlSlug" element={<GameDetails />} />
        <Route path="search" element={<SearchResults />}/>
      </Route>
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
