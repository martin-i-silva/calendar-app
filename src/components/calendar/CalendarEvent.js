import React from "react";

export const CalendarEvent = ({ event }) => {
  //console.log(event);
  return (
    <div>
      <strong>{event.title} </strong>
      <span>- {event.user.name}</span>
    </div>
  );
};
