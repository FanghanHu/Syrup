import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Button from "./components/Button";

function App() {
  return (
    <div className="App">
      <Router>
        <Route path="/" exact>
          <Button></Button>

          <div
            style={{
              backgroundColor: "black",
              borderRadius: "50%",
              height: "100px",
              width: "100px",
              color: "white",
              zIndex: -1,
            }}
          >
            here are some texts
          </div>
        </Route>
      </Router>
    </div>
  );
}

export default App;
