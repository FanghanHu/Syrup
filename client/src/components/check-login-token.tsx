import { useHistory } from "react-router-dom";
import { useLoginToken } from "../contexts/login-context";

/**
 * This component renders nothing,
 * it checks if the user is logged in, and redirect user to login page if not
 */
export default function CheckLoginToken() {
    const loginToken = useLoginToken();
    const history = useHistory();
    if(loginToken.userId === undefined || loginToken.userId === null) {
        //using setTimeout because react doesn't like people messing with it during render.
        setTimeout(() => {
            history.push("/");
        }, 1);
    }
    return null;
}