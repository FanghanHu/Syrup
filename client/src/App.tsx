import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Button from "./components/Button";
import Panel from "./components/Panel";
import PanelBody from "./components/PanelBody";
import { Color } from "./util/Color";
import LabelBar from "./components/LabelBar";
import PanelHeader from "./components/PanelHeader";

function App() {
  return (
    <div className="App">
      <Router>
        <Route path="/" exact>
          <Panel style={{position:"absolute", top:"0", padding: "3px"}}>
            <PanelHeader>The Header</PanelHeader>
            <PanelBody style={{padding:"10px"}}>
              <Button color={Color.kiwi_green} style={{fontSize:"2rem"}}>Button</Button>
            </PanelBody>
            <LabelBar style={{padding: "5px 50px", margin: "2px", color: "white"} }>The Label</LabelBar>
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
