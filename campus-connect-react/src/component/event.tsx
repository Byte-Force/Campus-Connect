import * as React from 'react';




interface Event {
  title: string;
  date: string;
  location: string;
  time: string;
}

// const staticEventData: Event[] = [
//   {
//     title: "Event 1",
//     date: "2023-07-21",
//     location: "DCC",
//     time: "7:00pm",
//   },
//   {
//     title: "Event 2",
//     date: "2023-07-28",
//     location: "Sage",
//     time: "3:00PM",
//   },
// ];

const EventBoard:React.FC = () => {
  const [events,setEvents] = React.useState<Event[]>([]);
  React.useEffect(() => {
    async function fetchEvents() {
      try{
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
  },[]);
  return (
    <ul className="border-white m-1 p-0.5 bg-gray-200 rounded-sm ">
      <h1 className="text-2xl font-bold mb-4">Upcoming Events</h1>
      {events.map((event, index) => (
        <li key={index} className="mb-4 p-2  grid grid-cols-6 flex items-center gap-12">
          {/* Left column: Event date */}
          <div className="col-span-1 bg-pink-100 p-2 rounded-sm flex items-center grid grid-cols-1 gap-2">
            <p className="text-black font-semibold text-center">{event.start_date}</p>
          </div>
          {/* Right column: Event title, location, and time */}
          <div className="col-span-0.5 bg-pink-100 p-1 rounded-sm">
            <h2 className="text-xl font-semibold">{event.event}</h2>
            <p>Location: {event.location}</p>
            {/* <p>Time: {event.}</p> */}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default EventBoard;