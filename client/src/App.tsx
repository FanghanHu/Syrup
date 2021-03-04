import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Test from "./pages/test";
import Setup from "./pages/setup";
import Login from "./pages/Login";

function App() {
  return (
    <div className="App">
      <Router>
        <Route path="/" exact component={Test}/>
        <Route path="/setup" exact component={Setup}/>
        <Route path="/login" exact component={Login}/>
      </Router>
    </div>
  );
}

export default App;
