import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Button from "./components/Button";
import Panel from "./components/Panel";
import PanelBody from "./components/PanelBody";
import { Color } from "./util/Color";
import LabelBar from "./components/LabelBar";
import PanelHeader from "./components/PanelHeader";
import InputGroup from "./components/InputGroup";
import Label from "./components/Label";
import TextInput from "./components/TextInput";

function App() {
  return (
    <div className="App">
      <Router>
        <Route path="/" exact>
          <Panel>
            <PanelHeader>The Header</PanelHeader>
            <PanelBody>
              <InputGroup>
                <Label htmlFor="#input1">some name</Label>
                <TextInput placeholder="some text" id="input1"/>
              </InputGroup>
              <Button themeColor={Color.kiwi_green} style={{fontSize:"2rem"}}>Button</Button>
            </PanelBody>
            <LabelBar>The Label Bar</LabelBar>
          </Panel>
        </Route>
      </Router>
    </div>
  );
}

export default App;
