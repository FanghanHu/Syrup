import React from "react";
import { Toast, ToastBody, ToastProps } from "react-bootstrap";
import { BsPrefixRefForwardingComponent } from "react-bootstrap/esm/helpers";


export interface SimpleToastProps extends BsPrefixRefForwardingComponent<"div", ToastProps> {
    title: string,
    message: string,
    setMessage: React.Dispatch<React.SetStateAction<string>>
}

export default function SimpleToast({title, message, setMessage, ...restOfProp}) {
    return (
        <Toast style={{
            position:"absolute",
            top:"50%", left:"50%",
            transform:"translateX(-50%) translateY(-50%)",
            color: "red"
            }} show={message !== ""} onClose={() => {setMessage("")}} {...restOfProp}>
            <Toast.Header>
                <strong>{title}</strong>
            </Toast.Header>
            <ToastBody>
                {message}
            </ToastBody>
        </Toast>
    );
}