import React from "react";
import Button from "../components/button";
import InputGroup from "../components/input-group";
import KeyboardButton from "../components/keybord-button";
import Label from "../components/label";
import LabelBar from "../components/label-bar";
import Panel from "../components/panel";
import PanelBody from "../components/panel-body";
import PanelHeader from "../components/panel-header";
import TextInput from "../components/text-input";
import { Color } from "../util/Color";

export default function Test(): JSX.Element {
  return (
    <div>
      <Panel>
        <PanelHeader>The Header</PanelHeader>
        <PanelBody>
          <InputGroup>
            <Label htmlFor="#input1">some name</Label>
            <TextInput placeholder="some text" id="input1" />
          </InputGroup>
          <Button themeColor={Color.kiwi_green} style={{ fontSize: "2rem" }}>
            Button
          </Button>
          <KeyboardButton>
            Enter
          </KeyboardButton>
        </PanelBody>
        <LabelBar>The Label Bar</LabelBar>
      </Panel>
    </div>
  );
}
