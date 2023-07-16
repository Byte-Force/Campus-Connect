import React, { useState } from "react";




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
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    const handleTitleChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setTitle(e.target.value);
    };

    const handleBodyChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setBody(e.target.value);
    };

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        // Here, you can implement the logic to post the data to your backend or do anything you need with the title and body values.
        console.log('Title:', title);
        console.log('Body:', body);

        // Reset the form after submission
        setTitle('');
        setBody('');
    };

    return (
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
            <div className="flex justify-end">
                <button
                    type="submit"
                    className="bg-blue-500 text-white font-bold px-4 py-2 rounded hover:bg-blue-600"
                >
                    Post
                </button>
            </div>
        </form>
    );
};





export default function CreatePostForm() {

    return (


        <div className="grid grid-cols-12 gap-4 m-20">
            {/* Larger column */}
            <div className="col-span-8 p-4">
                <PostForm />
            </div>

            {/* Smaller column */}
            <div className="col-span-4 p-4">

                <Tag />
            </div>
        </div>
    );



}