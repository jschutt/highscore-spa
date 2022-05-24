import "./App.css";
import "./stylesheets/style.css";
import { Outlet } from "react-router-dom";
import SiteHeader from "./components/SiteHeader/SiteHeader";

function App() {
  return (
    <div className="container-fluid">
      <SiteHeader />
      <main>
        <Outlet />
      </main>
      <footer className="site-footer text-center">&copy; Highscore</footer>
    </div>
  );
}

export default App;
