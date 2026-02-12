export interface ItineraryEvent {
  id: string;
  number: number;
  title: string;
  startTime: string;
  endTime: string;
  duration: string;
  location: string;
  lat: number;
  lng: number;
  type: "calendar" | "ai-generated";
  description?: string;
  attendees?: string[];
  reminders?: string[];
  notes?: string;
  category: "work" | "personal" | "fitness" | "food" | "errand" | "social";
}

export interface TravelSegment {
  method: "walking" | "car" | "transit" | "bike";
  duration: string;
  distance?: string;
}

export interface DayItinerary {
  date: string;
  label: string;
  events: ItineraryEvent[];
  travel: TravelSegment[]; // travel[i] = travel between events[i] and events[i+1]
}

const today = new Date();
const fmt = (d: Date) => d.toISOString().split("T")[0];
const addDays = (d: Date, n: number) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};

export const mockItineraries: DayItinerary[] = [
  {
    date: fmt(today),
    label: "Today",
    events: [
      {
        id: "e1",
        number: 1,
        title: "Morning Run",
        startTime: "7:00 AM",
        endTime: "7:45 AM",
        duration: "45 min",
        location: "Central Park West",
        lat: 40.7829,
        lng: -73.9654,
        type: "ai-generated",
        description: "AI suggested morning run based on your fitness goal. Route along the reservoir loop.",
        category: "fitness",
        notes: "Bring water bottle. Weather: 62°F, partly cloudy.",
      },
      {
        id: "e2",
        number: 2,
        title: "Team Standup",
        startTime: "9:00 AM",
        endTime: "9:30 AM",
        duration: "30 min",
        location: "WeWork, 5th Ave",
        lat: 40.7484,
        lng: -73.9857,
        type: "calendar",
        description: "Daily standup with engineering team. Discuss sprint progress and blockers.",
        attendees: ["Sarah Chen", "Mike Rivera", "Priya Patel"],
        reminders: ["15 min before"],
        category: "work",
      },
      {
        id: "e3",
        number: 3,
        title: "Coffee with Alex",
        startTime: "10:30 AM",
        endTime: "11:15 AM",
        duration: "45 min",
        location: "Blue Bottle, Bryant Park",
        lat: 40.7536,
        lng: -73.9832,
        type: "ai-generated",
        description: "Catch up with Alex about the new project opportunity. AI scheduled this during your free slot.",
        attendees: ["Alex Kim"],
        category: "social",
      },
      {
        id: "e4",
        number: 4,
        title: "Lunch Break",
        startTime: "12:30 PM",
        endTime: "1:15 PM",
        duration: "45 min",
        location: "Sweetgreen, Midtown",
        lat: 40.7549,
        lng: -73.9840,
        type: "ai-generated",
        description: "AI picked a healthy lunch spot near your next meeting. Try the Harvest Bowl!",
        category: "food",
      },
      {
        id: "e5",
        number: 5,
        title: "Client Presentation",
        startTime: "2:00 PM",
        endTime: "3:30 PM",
        duration: "1h 30m",
        location: "Acme Corp, Park Ave",
        lat: 40.7527,
        lng: -73.9772,
        type: "calendar",
        description: "Q1 results presentation for Acme Corp stakeholders. Slides finalized yesterday.",
        attendees: ["Jennifer Moss", "Tom Wang", "Client Team"],
        reminders: ["30 min before", "1 hour before"],
        category: "work",
        notes: "Bring printed handouts. Projector in Room 4B.",
      },
      {
        id: "e6",
        number: 6,
        title: "Pick up Dry Cleaning",
        startTime: "4:30 PM",
        endTime: "4:45 PM",
        duration: "15 min",
        location: "Quick Clean, Lexington",
        lat: 40.7505,
        lng: -73.9755,
        type: "ai-generated",
        description: "AI reminder: your suit has been ready since Tuesday. The shop closes at 6 PM.",
        category: "errand",
      },
      {
        id: "e7",
        number: 7,
        title: "Yoga Class",
        startTime: "6:00 PM",
        endTime: "7:00 PM",
        duration: "1 hr",
        location: "Y7 Studio, Flatiron",
        lat: 40.7401,
        lng: -73.9903,
        type: "calendar",
        description: "Hot yoga flow class. Bring mat and towel.",
        category: "fitness",
        reminders: ["30 min before"],
      },
    ],
    travel: [
      { method: "car", duration: "12 min", distance: "3.2 mi" },
      { method: "walking", duration: "8 min", distance: "0.4 mi" },
      { method: "walking", duration: "5 min", distance: "0.2 mi" },
      { method: "transit", duration: "10 min", distance: "1.1 mi" },
      { method: "walking", duration: "6 min", distance: "0.3 mi" },
      { method: "transit", duration: "15 min", distance: "1.8 mi" },
    ],
  },
  {
    date: fmt(addDays(today, 1)),
    label: "Tomorrow",
    events: [
      {
        id: "e8",
        number: 1,
        title: "Brunch with Mom",
        startTime: "10:00 AM",
        endTime: "11:30 AM",
        duration: "1h 30m",
        location: "Sarabeth's, UWS",
        lat: 40.7870,
        lng: -73.9754,
        type: "calendar",
        description: "Monthly brunch catch-up. She mentioned wanting to try the lemon ricotta pancakes.",
        attendees: ["Mom"],
        category: "personal",
      },
      {
        id: "e9",
        number: 2,
        title: "Grocery Shopping",
        startTime: "12:30 PM",
        endTime: "1:15 PM",
        duration: "45 min",
        location: "Trader Joe's, 72nd St",
        lat: 40.7785,
        lng: -73.9802,
        type: "ai-generated",
        description: "AI added based on your meal prep schedule. List: chicken, broccoli, rice, avocados.",
        category: "errand",
      },
      {
        id: "e10",
        number: 3,
        title: "Deep Work Session",
        startTime: "2:00 PM",
        endTime: "4:30 PM",
        duration: "2h 30m",
        location: "Home Office",
        lat: 40.7831,
        lng: -73.9712,
        type: "ai-generated",
        description: "AI blocked this time for focused work. No meetings scheduled.",
        category: "work",
        notes: "Work on the Q2 roadmap document.",
      },
      {
        id: "e11",
        number: 4,
        title: "Dinner Reservation",
        startTime: "7:30 PM",
        endTime: "9:00 PM",
        duration: "1h 30m",
        location: "Carbone, Greenwich Village",
        lat: 40.7264,
        lng: -73.9994,
        type: "calendar",
        description: "Anniversary dinner. Reservation for 2 under your name.",
        attendees: ["Jordan"],
        reminders: ["1 hour before"],
        category: "personal",
      },
    ],
    travel: [
      { method: "walking", duration: "10 min", distance: "0.5 mi" },
      { method: "car", duration: "8 min", distance: "1.2 mi" },
      { method: "transit", duration: "25 min", distance: "4.5 mi" },
    ],
  },
  {
    date: fmt(addDays(today, 2)),
    label: fmt(addDays(today, 2)).slice(5),
    events: [
      {
        id: "e12",
        number: 1,
        title: "Doctor's Appointment",
        startTime: "9:00 AM",
        endTime: "9:45 AM",
        duration: "45 min",
        location: "NYU Langone, 1st Ave",
        lat: 40.7421,
        lng: -73.9739,
        type: "calendar",
        description: "Annual checkup with Dr. Martinez. Bring insurance card.",
        reminders: ["1 day before", "1 hour before"],
        category: "personal",
      },
      {
        id: "e13",
        number: 2,
        title: "Sprint Planning",
        startTime: "11:00 AM",
        endTime: "12:30 PM",
        duration: "1h 30m",
        location: "WeWork, 5th Ave",
        lat: 40.7484,
        lng: -73.9857,
        type: "calendar",
        description: "Q2 sprint planning session. Review backlog and assign stories.",
        attendees: ["Full Engineering Team"],
        category: "work",
      },
      {
        id: "e14",
        number: 3,
        title: "Library Book Return",
        startTime: "1:30 PM",
        endTime: "1:45 PM",
        duration: "15 min",
        location: "NYPL, 42nd St",
        lat: 40.7532,
        lng: -73.9822,
        type: "ai-generated",
        description: "Books are due today. AI reminder to avoid late fees.",
        category: "errand",
      },
    ],
    travel: [
      { method: "transit", duration: "18 min", distance: "2.1 mi" },
      { method: "walking", duration: "12 min", distance: "0.6 mi" },
    ],
  },
];

export const getCategoryColor = (category: ItineraryEvent["category"]) => {
  switch (category) {
    case "work": return "hsl(220, 60%, 50%)";
    case "personal": return "hsl(280, 55%, 55%)";
    case "fitness": return "hsl(150, 60%, 45%)";
    case "food": return "hsl(35, 85%, 55%)";
    case "errand": return "hsl(190, 55%, 45%)";
    case "social": return "hsl(340, 65%, 55%)";
    default: return "hsl(220, 15%, 50%)";
  }
};

export const getCategoryIcon = (category: ItineraryEvent["category"]) => {
  switch (category) {
    case "work": return "💼";
    case "personal": return "🏠";
    case "fitness": return "🏃";
    case "food": return "🍽️";
    case "errand": return "📦";
    case "social": return "☕";
    default: return "📌";
  }
};

export const getTravelIcon = (method: TravelSegment["method"]) => {
  switch (method) {
    case "walking": return "🚶";
    case "car": return "🚗";
    case "transit": return "🚇";
    case "bike": return "🚲";
    default: return "🚶";
  }
};
