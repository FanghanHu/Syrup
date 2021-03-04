import React from "react";

interface NumberPadProp {
    text: string;
    setText(text: string): void;
}

export default function NumberPad({text, setText}: NumberPadProp) {
    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr"
        }}>
            


        </div>
    );
}