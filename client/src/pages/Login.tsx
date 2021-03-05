import { Container } from "react-bootstrap";
import LoginPanel from "../components/login-panel";


export default function Login(): JSX.Element {
    return (
        <Container fluid>
            <LoginPanel/>
        </Container>
    )
}