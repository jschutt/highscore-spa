import "./App.css";
import "./stylesheets/style.css";
import { Outlet } from "react-router-dom";
import SiteHeader from "./components/SiteHeader/SiteHeader";

function App() {
  return (
    <div className="container-fluid">
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
        crossOrigin="anonymous"
      />
      <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p"
        crossOrigin="anonymous"
      ></script>
      <SiteHeader />
      <main>
        <Outlet />
      </main>
      <footer className="site-footer text-center">&copy; Highscore</footer>
    </div>
  );
}

export default App;
