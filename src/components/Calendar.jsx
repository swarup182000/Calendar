import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./Calendar.css"; // External CSS for extra responsiveness

// Function to retrieve stored data from localStorage
const getStoredData = (key, defaultValue) => {
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : defaultValue;
};

// Generate resources from A to K
const generateResources = () => {
  return [...Array(11)].map((_, i) => ({
    id: String.fromCharCode(97 + i), // Generates 'a' to 'k'
    title: `Room ${String.fromCharCode(65 + i)}`, // 'A' to 'K'
  }));
};

const Calendar = () => {
  // State to manage events, initialized with stored data or an empty array
  const [events, setEvents] = useState(() => getStoredData("events", []));

  // State to manage resources (Rooms A to K)
  const [resources] = useState(() => getStoredData("resources", generateResources()));

  // Effect to store events in localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  // Handle event drag-and-drop functionality
  const handleEventDrop = (info) => {
    const updatedEvents = events.map((event) =>
      event.id === info.event.id
        ? {
            ...event,
            start: info.event.start.toISOString(), // Update start time
            resourceId: info.event.getResources()[0]?.id, // Update assigned resource
          }
        : event
    );
    setEvents(updatedEvents); // Update state with modified events
  };

  // Handle event deletion when clicked
  const handleEventClick = (info) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter((event) => event.id !== info.event.id));
    }
  };

  // Handle new event creation when a time slot is selected
  const handleSelect = (info) => {
    const title = prompt("Enter event title:"); // Prompt user for event title
    if (title) {
      const newEvent = {
        id: String(events.length + 1), // Assign unique ID
        title,
        start: info.startStr, // Start time
        end: info.endStr, // End time
        resourceId: info.resource?.id || "a", // Assign to selected resource (default: "a")
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Random event color
      };
      setEvents([...events, newEvent]); // Add new event to state
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-100 min-h-screen">
      {/* Page Title */}
      

      {/* Responsive Calendar Container */}
      <div className="bg-white shadow-md rounded-lg p-2 md:p-4 overflow-x-auto">
        <FullCalendar
          plugins={[resourceTimelinePlugin, interactionPlugin, dayGridPlugin]}
          initialView="resourceTimelineMonth" // Default view
          editable={true} // Enable drag-and-drop for events
          selectable={true} // Allow users to select time slots
          selectMirror={true} // Show a preview of selected event
          select={handleSelect} // Handle event creation on selection
          droppable={true} // Allow events to be dragged and dropped
          eventDrop={handleEventDrop} // Handle event drop updates
          eventClick={handleEventClick} // Handle event deletion on click
          events={events} // Load event data
          resources={resources} // Load Room A to K
          nowIndicator={true} // Show current time indicator
          height="auto" // Make calendar adjust dynamically
          aspectRatio={2} // Adjust for responsiveness
          headerToolbar={{
            right: "prev today next", // Navigation buttons
            left: "title", // Display current month/year
            // right: "resourceTimelineMonth,dayGridMonth", // View options
          }}
        />
      </div>
    </div>
  );
};

export default Calendar; // Export the Calendar component
