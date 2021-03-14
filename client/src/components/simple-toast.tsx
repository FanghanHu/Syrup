import React, { CSSProperties } from "react";
import { Toast, ToastBody, ToastProps } from "react-bootstrap";


export interface SimpleToastProps extends ToastProps {
    title: string,
    message: string,
    setMessage: React.Dispatch<React.SetStateAction<string>>,
    style?: CSSProperties
}

export default function SimpleToast({title, message, setMessage, style, ...restOfProp}: SimpleToastProps) {
    return (
        <Toast style={{
            position:"absolute",
            top:"50%", left:"50%",
            transform:"translateX(-50%) translateY(-50%)",
            ...style
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