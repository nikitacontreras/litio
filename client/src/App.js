import React from "react"
import logo from './logo.svg';
import './App.css';

function App() {
  const [data, setData] = React.useState(null)

  React.useEffect(() => {
    fetch("/api/is_running")
      .then((res) => res.json())
      .then((data) => setData(data))
  }, [])
  console.log(data)
  return (
    <div className="app-loader">
      <header className="app-header">
        <img src={logo} className="app-logo" alt="logo" />
        <p>
          {!data ? "Loading..." : data.is_open}
        </p>
      </header>
    </div>
  );
}

export default App;
