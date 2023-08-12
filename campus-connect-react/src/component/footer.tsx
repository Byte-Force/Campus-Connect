import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white-200 text-black text-center">
            <div className="container mx-auto">
                <p>
                    © {new Date().getFullYear()} Campus_Connect@RPI All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;