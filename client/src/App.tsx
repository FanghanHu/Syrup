import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Button from "./components/Button";
import Panel from "./components/Panel";
import PanelBody from "./components/PanelBody";
import { Color } from "./util/Color";

function App() {
  return (
    <div className="App">
      <Router>
        <Route path="/" exact>
          <Panel style={{color: "blue", position:"absolute", top:"0"}}>
            <PanelBody style={{margin:"1.5rem 3px 3px 3px", padding:"10px"}}>
              <Button color={Color.kiwi_green} style={{fontSize:"2rem"}}>Button</Button>
            </PanelBody>
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

          
        </Route>
      </Router>
    </div>
  );
}

export default App;
