import React, { useState } from "react";


const categories = ["Home", "IT", "Computer Science", "Events"];

export default function SideBar() {

    return (
        <div className="flex h-screen">
            <div className="w-64 h-981 flex-shrink-0 bg-gray-200 p-4">
                <img
                    src="home-icon.png"
                    alt="Home Icon"
                    className="w-6 h-6 mb-2"
                />
                <span className="text-lg font-bold mb-4">Home</span>
                <ul className="space-y-2">
                    {categories.map((category) => (
                        <li
                            key={category}
                            className="text-blue-600 cursor-pointer hover:text-blue-800"
                            onClick={() => console.log(`Clicked on ${category}`)}
                        >
                            {category}
                        </li>
                    ))}
                </ul>
            </div>
            {/* Your main content goes here */}
        </div>
    );
}