import Headers from "../component/header";
import SignUp from "../component/Signup";
import Footer from "../component/footer";


// The SignupPage that builds from the signup component and the header and footer components
export default function SignupPage() {
    return (
        <div>

            <Headers />
            <SignUp />
            <Footer />

        </div>
    )
}