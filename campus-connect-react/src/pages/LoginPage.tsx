import Login from "../component/Login";
import Headers from '../component/header';
import Footer from "../component/footer";

/*
The login Page structure 
If ever want to change login page change it in the login component in component folder
*/

export default function Signin() {
    return (
        <div>

            <Headers />
            <Login />
            <Footer />

        </div>
    )
}
