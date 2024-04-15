import logo from "./logo.svg";
import "./App.css";
import Home from "./components/Home";

function App() {
  return (
    <div className="app">
      <Home />
      <img src={logo} alt="logo" />
      <a
        href="https://docs.clerk.dev/reference/clerk-react"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn more
      </a>
    </div>
  );
}

export default App;
