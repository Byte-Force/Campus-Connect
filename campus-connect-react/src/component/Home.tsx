
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    function handlePost() {
        console.log("Post");
        navigate('/create-post');
    }

    return (
        <button onClick={handlePost} className='bg-blue-300'>
            Post
        </button>
    );
}
