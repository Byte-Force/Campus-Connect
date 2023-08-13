import React, { useState } from 'react';
import Upcoming from '../image/upcoming.png';
import axios from 'axios';

interface Event {
  event: string;
  start_date: string;
  end_date: string;
  location: string;
}

const EventBoard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [displayEvents, setDisplayEvents] = useState(false); // State to track whether events should be displayed

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:3000/db/events');
      const data = response.data;
      const sortedEvents = data.events.sort((a: Event, b: Event) => {
        const Timea = a.start_date;
        const Timeb = b.start_date;
        return Timea < Timeb ? -1 : Timea > Timeb ? 1 : 0;
      });
      setEvents(sortedEvents);
    } catch (error) {
      console.log(error);
    }
  };

  const handleButtonClick = () => {
    if (!displayEvents) {
      fetchEvents();
    }
    setDisplayEvents(!displayEvents);
  };

  return (
    <div className="border-white m-1 p-0.5 rounded-sm">
      <button
        onClick={handleButtonClick}
        className={`text-2xl font-bold mb-4 text-center flex items-center justify-center p-2 rounded-lg 
                    transition-transform duration-300 hover:scale-125 transform ${displayEvents ? '' : ' '}`}
      >
        <img src={Upcoming} alt="Upcoming Icon" className="w-8 h-8 mr-2" />
        {displayEvents ? 'Upcoming Events' : 'Upcoming Events'}
      </button>

      {displayEvents && (
        <div className="rounded-sm grid grid-flow-row gap-3">
          {events.map((event, index) => (
            <div
              key={index}
              className="bg-pink-100 p-2 rounded-lg grid grid-flow-row grid-cols-1 gap-2 hover:bg-pink-200 shadow-md"
            >
              {/* Event title */}
              <h2 className="text-md font-semibold text-center">{event.event}</h2>
              <div className="flex flex-col">
                {/* Location */}
                <p className="text-sm font-semibold text-center">Location: {event.location}</p>
                {/* Start Date */}
                <p className="text-sm font-semibold text-center">Start Date: {event.start_date}</p>
                {/* End Date */}
                <p className="text-sm font-semibold text-center">End Date: {event.end_date}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventBoard;
