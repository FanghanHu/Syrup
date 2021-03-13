import { Container } from "react-bootstrap";
import { useHistory } from "react-router";
import LoginPanel from "../components/login-panel";

export default function Login(): JSX.Element {
    const history = useHistory();
    const onLogin = () => {
        history.push("/main-menu");
    }

    return (
        <Container fluid>
            <LoginPanel onLogin={onLogin}/>
        </Container>
    )
}