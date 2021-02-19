import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Button from "./components/Button";
import Panel from "./components/Panel";

function App() {
  return (
    <div className="App">
      <Router>
        <Route path="/" exact>
          <Panel style={{color: "blue", position:"absolute", top:"0"}}>
            <h1>Hi this is rex</h1>
          </Panel>

          

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

          <Button>Button</Button>
        </Route>
      </Router>
    </div>
  );
}

export default App;
