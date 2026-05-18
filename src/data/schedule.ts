export type Sessions = {
    id: number;
    day: string;
    time: string;
    endTime: string;
    title: string;
    type: string;
    speaker: {
        name: string;
        title?: string;
        avatar?: string;
    };
    venue: string;
            description?: string;

}

import gloria from "/speakers/gloria.jpeg";
import pov from "/speakers/pov.jpeg";
import oladipo from "/speakers/oladipo.jpeg";
// import ogunleye from "/speakers/ogunleye.jpeg";
// import opajobi from "/speakers/opajobi.jpg";




export const sessions:Sessions[] = [
  {
    id: 1,
    day: "Day 1",
    time: "04:00 PM",
    endTime: "04:50 PM",
    title: "Onsite Registration",
    type: "registration",
    speaker: {
      name: "Conference Team",
      title: "Registration Team",
    },
    venue: "Main Entrance",
  },
  {
    id: 2,
    day: "Day 1",
    time: "05:00 PM",
    endTime: "05:15 PM",
    title: "Worship Session",
    type: "Worship",
    speaker: {
      name: "Praise Team",
      title: "City of Refuge Choir",
    },
    venue: "Main Auditorium",
  },
  {
    id: 3,
    day: "Day 1",
    time: "5:15 PM",
    endTime: "5:20 PM",
    title: "Welcome Remarks",
    type: "welcome",
    speaker: {
      name: "Mr. Theophilus Olatunji",
      title: "Event Anchor",
    },
    venue: "Main Auditorium",
  },
  {
    id: 4,
    day: "Day 1",
    time: "5:20 PM",
    endTime: "5:50 PM",
    title: "Theme Interpretation",
    type: "keynote",
    speaker: {
      name: "Pastor Samson Ayangoke",
      title: "Lead Pastor, Higher Ground Baptist Church",
      avatar:
        "https://media.hgbcinfluencers.org/bisum/samson ayangoke.png",
    },
    venue: "Main Auditorium",
    description:
      "Connect with fellow attendees, speakers, and sponsors over refreshments.",
  },
  {
    id: 5,
    day: "Day 1",
    time: "6:00 PM",
    endTime: "7:00 PM",
    title: "Session 1",
    type: "keynote",
    speaker: {
      name: "Rev'd Taiwo Opajobi",
      title: "Creative Visual Storyteller & Youth Leader",
      // avatar:
      // opajobi,
    },
    venue: "Main Auditorium",
  },
  {
    id: 7,
    day: "Day 1",
    time: "7:10 PM",
    endTime: "8:10 PM",
    title: "Session 2",
    type: "keynote",
    speaker: {
      name: "Mr. Taiwo Olaonipekun",
      title: "Founder & CEO Farmfixers",
      // avatar:
      // ogunleye,
    },
    venue: "Main Auditorium",
  },
  {
    id: 8,
    day: "Day 1",
    time: "8:10 PM",
    endTime: "8:30 PM",
    title: "Closing and Announcements",
    type: "closing",
    speaker: {
      name: "Mr. Theophilus Olatunji",
      title: "Event Anchor",
    },
    venue: "Main Auditorium",
  },

  // Day 2
  {
    id: 9,
    day: "Day 2",
    time: "04:30 PM",
    endTime: "04:50 PM",
    title: "Onsite Registration",
    type: "registration",
    speaker: {
      name: "Conference Team",
      title: "Registration Team",
    },
    venue: "Main Entrance",
  },
  {
    id: 10,
    day: "Day 2",
    time: "05:00 PM",
    endTime: "05:15 PM",
    title: "Worship Session",
    type: "Worship",
    speaker: {
      name: "Praise Team",
      title: "City of Refuge Choir",
    },
    venue: "Main Auditorium",
  },
  {
    id: 11,
    day: "Day 2",
    time: "5:15 PM",
    endTime: "5:25 PM",
    title: "Welcome Remarks",
    type: "welcome",
    speaker: {
      name: "Miss Gloria Olayiwola",
      title: "Event Anchor",
      avatar: gloria,
    },
    venue: "Main Auditorium",
  },
  {
    id: 12,
    day: "Day 2",
    time: "5:30 PM",
    endTime: "6:30 PM",
    title: "Session 1",
    type: "keynote",
    speaker: {
      name: "Pst. Samson Ayangoke",
      title: "Consultant Obstetrician & Gynaecologist, Entrepreneur, Educator",
      avatar:
      "https://media.hgbcinfluencers.org/bisum/samson ayangoke.png",
    },
    venue: "Main Auditorium",
  },
  {
    id: 14,
    day: "Day 2",
    time: "6:40 PM",
    endTime: "7:40 PM",
    title: "Session 2",
    type: "keynote",
    speaker: {
      name: "Pst. Victor Olukoju",
      title: "Photographer, Cinematographer & Media Entrepreneur",
      avatar:
      pov,
    },
    venue: "Main Auditorium",
  },
  {
    id: 15,
    day: "Day 2",
    time: "7:40 PM",
    endTime: "8:00 PM",
    title: "Closing and Announcements",
    type: "closing",
    speaker: {
      name: "Miss Gloria Olayiwola",
      title: "Event Anchor",
      avatar:
      gloria,
    },
    venue: "Main Auditorium",
  },

  // Day 3
  {
    id: 16,
    day: "Day 3",
    time: "10:00 AM",
    endTime: "10:15 AM",
    title: "Worship Session",
    type: "Worship",
    speaker: {
      name: "Praise Team",
      title: "City of Refuge Choir",
    },
    venue: "Main Auditorium",
  },
  {
    id: 17,
    day: "Day 3",
    time: "10:15 AM",
    endTime: "10:35 AM",
    title: "Welcome Remarks",
    type: "welcome",
    speaker: {
      name: "Miss Gloria Olayiwola",
      title: "Event Anchor",
      avatar:
      gloria,
    },
    venue: "Main Auditorium",
  },
  {
    id: 19,
    day: "Day 3",
    time: "10:55 AM",
    endTime: "11:20 AM",
    title: "Session 1",
    type: "keynote",
    speaker: {
      name: "Dr. Kolawole Olapipo",
      title: "Consultant Obstetrician & Gynaecologist, Entrepreneur, Educator",
      avatar:
      oladipo,
    },
    venue: "Main Auditorium",
  },

  {
    id: 20,
    day: "Day 3",
    time: "11:50 AM",
    endTime: "12:50 PM",
    title: "Session 2",
    type: "keynote",
    speaker: {
      name: "Pst. Victor Olukoju",
      title: "Photographer, Cinematographer & Media Entrepreneur",
      avatar:
      "/speakers/pov.jpeg",
    },
    venue: "Main Auditorium",
  },
  {
    id: 20,
    day: "Day 3",
    time: "12:50 PM",
    endTime: "1:20 PM",
    title: "Q/A Session",
    type: "keynote",
    speaker: {
      name: "Miss Gloria Olayiwola",
      title: "Event Anchor",
      avatar:
      gloria,
    },
    venue: "Main Auditorium",
  },

  {
    id: 21,
    day: "Day 3",
    time: "1:20 AM",
    endTime: "1:40 PM",
    title: "Break",
    type: "break",
    speaker: {
      name: "All Attendees",
    },
    venue: "Main Auditorium",
  },
  {
    id: 23,
    day: "Day 3",
    time: "1:40 PM",
    endTime: "2:30 PM",
    title: "Breakout Session",
    type: "breakout",
    speaker: {
      name: "All Speakers & Attendees",
    },
    venue: "Breakout Room",
  },
  {
    id: 24,
    day: "Day 3",
    time: "2:50 PM",
    endTime: "3:50 PM",
    title: "Impartation Session",
    type: "closing",
    speaker: {
      name: "Pastor Samson Ayangoke",
      title: "Lead Pastor, Higher Ground Baptist Church",
      avatar:
      "https://media.hgbcinfluencers.org/bisum/samson ayangoke.png"
    },
    venue: "Main Auditorium",
  },
  {
    id: 24,
    day: "Day 3",
    time: "3:50 PM",
    endTime: "4:00 PM",
    title: "Closing & Announcements",
    type: "closing",
    speaker: {
      name: "Miss Gloria Olayiwola",
      title: "Event Anchor",
      avatar:
      gloria,
    },
    venue: "Main Auditorium",
  },
];
