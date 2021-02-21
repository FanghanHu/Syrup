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
          <Panel>
            <PanelHeader>The Header</PanelHeader>
            <PanelBody>
              <Button color={Color.kiwi_green} style={{fontSize:"2rem"}}>Button</Button>
            </PanelBody>
            <LabelBar>The Label</LabelBar>
          </Panel>
        </Route>
      </Router>
    </div>
  );
}

export default App;
