import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./stylesheets/style.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./routes/Home/Home";
import GameDetails from "./routes/GameDetails/GameDetails";
import SearchResults from "./routes/SearchResults/SearchResults";
import Admin from "./routes/Admin/Admin";
import { default as AdminHome } from "./routes/Admin/Home/Home";
import { default as AdminGames } from "./routes/Admin/Games/Home/Home";
import { default as AdminNewGame } from "./routes/Admin/Games/NewGame/NewGame";
import {default as AdminNewScore} from './routes/Admin/Scores/NewScore/NewScore';

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/admin" element={<Admin />}>
        <Route index element={<AdminHome />} />
        <Route path="games" element={<AdminGames />} />
        <Route path="games/new" element={<AdminNewGame />} />
        <Route path="scores/new" element={<AdminNewScore />} />
      </Route>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="games/:urlSlug" element={<GameDetails />} />
        <Route path="search" element={<SearchResults />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
