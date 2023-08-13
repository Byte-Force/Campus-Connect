import React, { useEffect, useState } from 'react';
import Upcoming from '../image/upcoming.png';

interface Event {
  event: string;
  start_date: string;
  end_date: string;
  location: string;
}

// An event component that displays the upcoming event from our database 
const EventBoard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('http://localhost:3000/db/events');
        const data = await response.json();
        const sortedEvents = data.events.sort((a: Event, b: Event) => {
          const Timea = a.start_date;
          const Timeb = b.start_date;
          return Timea < Timeb ? -1 : Timea > Timeb ? 1 : 0;
        });
        setEvents(sortedEvents);
      } catch (error) {
        console.log(error);
      }
    }
    fetchEvents();
  }, []);

  return (
    <div className="border-white m-1 p-0.5 rounded-sm">
      <h1 className="text-2xl font-bold mb-4 text-center flex items-center justify-center">
        <img src={Upcoming} alt="Upcoming Icon" className="w-8 h-8 mr-2"></img>Upcoming Events
      </h1>
      <div className="rounded-sm grid grid-flow-row gap-3">
        {events.map((event, index) => (
          <div
            key={index}
            className="bg-pink-100 p-2 rounded-lg grid grid-flow-row grid-cols-1 gap-2 hover:bg-pink-200 shadow-md"
          >
            <div>
              {/* Event title */}
              <h2 className="text-md font-semibold text-center">{event.event}</h2>
            </div>
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
    </div>
  );
};

export default EventBoard;





