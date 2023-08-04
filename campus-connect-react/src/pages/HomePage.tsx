import Headers from '../component/header';
import Home from '../component/Home';
import Footer from "../component/footer";
import SideBar from '../component/sideBar';
import EventBoard from '../component/event';

export default function HomePage() {

  return (
    <div>
      <Headers />
      <div className="flex">
        {/* SideBar */}
        <div className="w-1/5">
          <SideBar />
        </div>

        {/* Home */}
        <div className="w-3/5">
          <Home />
        </div>

        {/* EventBoard */}
        <div className="w-1/5">
          <EventBoard />
        </div>
      </div>

      <Footer />


    </div>
  );
}
