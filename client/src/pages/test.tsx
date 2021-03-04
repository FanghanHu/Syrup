import React from "react";
import Button from "../components/Button";
import InputGroup from "../components/InputGroup";
import KeyboardButton from "../components/KeyboardButton";
import Label from "../components/Label";
import LabelBar from "../components/LabelBar";
import Panel from "../components/Panel";
import PanelBody from "../components/PanelBody";
import PanelHeader from "../components/PanelHeader";
import TextInput from "../components/TextInput";
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
