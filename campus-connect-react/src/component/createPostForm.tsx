import { SetStateAction, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';




const Tag = () => {
    return (
        <div className="flex flex-wrap justify-center bg-slate-200  p-5  pt-5  rounded-lg ">
            <h2 className="text-2xl font-bold">Things to remember</h2>
            <div className="flex flex-wrap justify-center">
                1. Respect each other <br></br>
                2. Behave like you would in
                the real world<br></br>
                3. Remember your a human<br></br>
            </div>

        </div>
    );

}

// ------------ implement Label funcationality  ------

const PostForm = () => {
    const navigate = useNavigate();

    const location = useLocation();

    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    //const [isSubmitting, setIsSubmitting] = useState(false); // Add this state

    const [selectedCategory, setSelectedCategory] = useState('');

    const handleCategoryChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setSelectedCategory(e.target.value);
    };

    const handleTitleChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setTitle(e.target.value);
    };

    const handleBodyChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setBody(e.target.value);
    };



    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        //setIsSubmitting(true); // Set the isSubmitting state to true

        try {
            const response = await fetch('http://localhost:3000/db/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, body, selectedCategory }),
            });

            // Handle the response here (e.g., show success message, redirect, etc.)
            if (response.ok) {
                console.log('Post created successfully!');

                // const sessionData = location.state?.sessionData;
                // console.log('Session Data:', sessionData);
                navigate('/home', { state: { user_id: location.state?.user_id } });
                // Additional logic here, e.g., redirect to another page
            } else {
                console.error('Failed to create post.');
            }
        } catch (error) {
            console.error('Error creating post:', error);
        }
        // Here, you can implement the logic to post the data to your backend or do anything you need with the title and body values.
        console.log('Title:', title);
        console.log('Body:', body);

        setTitle('');
        setBody('');

    };


    return (
        <div>
            <h1 className="text-2xl font-bold"> Create a Post</h1>
            <form onSubmit={handleSubmit} className="p-5 bg-gray-200 rounded-md">
                <div className="mb-4">
                    <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        value={title}
                        onChange={handleTitleChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="body" className="block text-gray-700 font-bold mb-2">
                        Body
                    </label>
                    <textarea
                        id="body"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        rows={8}
                        value={body}
                        onChange={handleBodyChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="category" className="block text-gray-700 font-bold mb-2">
                        Choose Category
                    </label>
                    <select
                        id="category"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        required
                    >
                        <option value="">Select a category</option>
                        <option value="category1">Category 1</option>
                        <option value="category2">Category 2</option>
                        <option value="category3">Category 3</option>
                        {/* Add more categories as needed */}
                    </select>
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white font-bold px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Post
                    </button>
                </div>
            </form>
        </div>

    );
};





export default function CreatePostForm() {
    const navigate = useNavigate();

    const location = useLocation();

    return (


        <div className="grid grid-cols-12 gap-4 m-20 bg-white rounded-lg shadow-md">
            {/* Larger column */}
            <div className="col-span-8 p-4">
                <PostForm />
            </div>



            <div className="col-span-4 p-4">
                <Tag />
                <div className="flex justify-end mt-4">

                    <button
                        onClick={() => navigate('/home', { state: { user_id: location.state?.user_id } })}
                        className="w-full bg-blue-500 text-white font-bold px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Back
                    </button>
                </div>
            </div>
        </div>
    );



}