import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Test from "./pages/test";

function App() {
  return (
    <div className="App">
      <Router>
        <Route path="/" exact component={Test}/>
      </Router>
    </div>
  );
}

export default App;
