import React from 'react';
import logo from './symbol.png';
import './App.css';
import MenuComponent from "./components/menu";

const App: React.FC = () => {
  return (
    <div className="App">
      <div className="App-menu">
        <MenuComponent></MenuComponent>
      </div>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
};

export default App;
