import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="text-center bg-gray-800 min-h-screen flex flex-col items-center justify-center text-xl text-white">
      <header className="flex flex-col items-center justify-center min-h-screen text-xl text-white">
        <img src={logo} className="h-40 pointer-events-none motion-safe:animate-spin-slow" alt="logo" />
        <p>
          Edit <code className="font-mono">src/App.js</code> and save to reload.
        </p>
        <a
          className="text-cyan-400"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
