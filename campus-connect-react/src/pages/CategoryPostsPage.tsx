import Headers from '../component/header';

import SideBar from '../component/sideBar';
import CategoryPosts from '../component/categoryPosts';
import Footer from '../component/footer';


export default function CategoryPage() {

    return (
        <div>
            <Headers />
            <div className="flex">
                {/* SideBar */}
                <div className="w-1/5">
                    <SideBar />
                </div>

                {/* CategoryPosts */}
                <div className="w-3/5">
                    <CategoryPosts />
                </div>

            </div>

            <Footer />
        </div>
    );
}