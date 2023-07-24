import React, { useEffect, useState } from 'react';

interface Event {
  title: string;
  date: string;
  location: string;
  time: string;
}

const EventBoard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('http://localhost:3000/db/events');
        const data = await response.json();
        const sortedEvents = data.events.sort((a, b) => {
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
    <div className="border-white m-1 p-0.5 bg-gray-200 rounded-sm">
      <h1 className="text-2xl font-bold mb-4">Upcoming Events</h1>
      <div className="grid grid-cols-1 gap-2">
        {events.map((event, index) => (
          <div key={index} className="bg-pink-100 p-4 rounded-sm grid grid-cols-2 ">
            {/* Event date */}
            <div>
              <p className="text-black font-semibold text-center">{event.start_date}</p>
            </div>
            {/* Event title, location, and time */}
            <div>
              <h2 className="text-xl font-semibold text-center">{event.event}</h2>
              <p className="text-xl  text-center">Location: {event.location}</p>
              {/* <p>Time: {event.time}</p> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventBoard;
