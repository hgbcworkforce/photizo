type Sessions = {
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
      name: "Miss Omolara Olaifa",
      title: "Event Anchor",
    },
    venue: "Main Auditorium",
  },
  {
    id: 4,
    day: "Day 1",
    time: "5:20 PM",
    endTime: "5:40 PM",
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
    time: "5:50 PM",
    endTime: "6:30 PM",
    title: "Session 1",
    type: "keynote",
    speaker: {
      name: "Mr. Seyi Ajamu",
      title: "Creative Visual Storyteller & Youth Leader",
      avatar:
      "https://media.hgbcinfluencers.org/bisum/Seyi Ajamu.jpeg",
    },
    venue: "Main Auditorium",
  },
  {
    id: 6,
    day: "Day 1",
    time: "6:30 PM",
    endTime: "7:00 PM",
    title: "Success Story",
    type: "story",
    speaker: {
      name: "Miss Comfort Oloyade",
      title: "Researcher & Entrepreneur",
      avatar:
      "https://media.hgbcinfluencers.org/bisum/oloyade comfort.jpg",
    },
    venue: "Main Auditorium",
  },
  {
    id: 7,
    day: "Day 1",
    time: "7:00 PM",
    endTime: "7:50 PM",
    title: "Session 2",
    type: "keynote",
    speaker: {
      name: "Mr. Taiwo Olaonipekun",
      title: "Founder & CEO Farmfixers",
      avatar:
      "https://media.hgbcinfluencers.org/bisum/Olaonipekun Taiwo.jpg",
    },
    venue: "Main Auditorium",
  },
  {
    id: 8,
    day: "Day 1",
    time: "7:50 PM",
    endTime: "8:00 PM",
    title: "Closing and Announcements",
    type: "closing",
    speaker: {
      name: "Miss Omolara Olaifa",
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
    endTime: "5:30 PM",
    title: "Welcome Remarks",
    type: "welcome",
    speaker: {
      name: "Mr Fadeyi Emmanuel",
      title: "Event Anchor",
    },
    venue: "Main Auditorium",
  },
  {
    id: 12,
    day: "Day 2",
    time: "5:30 PM",
    endTime: "6:20 PM",
    title: "Session 1",
    type: "keynote",
    speaker: {
      name: "Dr Adebayo Adekunle",
      title: "Consultant Obstetrician & Gynaecologist, Entrepreneur, Educator",
      avatar:
      "https://media.hgbcinfluencers.org/bisum/Dr Adebayo.jpg",
    },
    venue: "Main Auditorium",
  },
  {
    id: 13,
    day: "Day 2",
    time: "6:20 PM",
    endTime: "6:50 PM",
    title: "Success Story",
    type: "story",
    speaker: {
      name: "Mr Ifeoluwa Alade",
      title: "Photographer, Cinematographer & Media Entrepreneur",
      avatar:
      "https://media.hgbcinfluencers.org/bisum/Loveit Headshot.jpg",
    },
    venue: "Main Auditorium",
  },
  {
    id: 14,
    day: "Day 2",
    time: "6:50 PM",
    endTime: "7:50 PM",
    title: "Session 2",
    type: "keynote",
    speaker: {
      name: "Pastor Tunde Ebidero",
      title: "CEO, Olatunde Prestige Limited",
      avatar:
      "https://media.hgbcinfluencers.org/bisum/Tunde Ebidero.jpg",
    },
    venue: "Main Auditorium",
  },
  {
    id: 15,
    day: "Day 2",
    time: "7:50 PM",
    endTime: "8:00 PM",
    title: "Closing and Announcements",
    type: "closing",
    speaker: {
      name: "Mr Emmanuel Fadeyi",
      title: "Event Anchor",
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
    endTime: "10:25 AM",
    title: "Welcome Remarks",
    type: "welcome",
    speaker: {
      name: "Mr. OLuwatobi Ojua",
      title: "Event Anchor",
    },
    venue: "Main Auditorium",
  },
  {
    id: 18,
    day: "Day 3",
    time: "10:25 AM",
    endTime: "10:55 AM",
    title: "Session 1",
    type: "keynote",
    speaker: {
      name: "Pastor Tunde Ebidero",
      title: "Event Anchor",
      avatar:
      "https://media.hgbcinfluencers.org/bisum/Tunde Ebidero.jpg",
    },
    venue: "Main Auditorium",
  },
  {
    id: 19,
    day: "Day 3",
    time: "10:55 AM",
    endTime: "11:20 PM",
    title: "Interview Session",
    type: "panel",
    speaker: {
      name: "Pastor Samson Ayangoke",
      title: "Lead Pastor, Higher Ground Baptist Church",
      avatar:
      "https://media.hgbcinfluencers.org/bisum/samson ayangoke.png"
    },
    venue: "Main Auditorium",
  },

  {
    id: 20,
    day: "Day 3",
    time: "11:20 PM",
    endTime: "11:50 PM",
    title: "Success Story",
    type: "story",
    speaker: {
      name: "Mr. Iyanuoluwa Nelson Ojekanmi",
      title: "Image and Style Coach",
      avatar:
      "https://media.hgbcinfluencers.org/bisum/Nelson.jpg",
    },
    venue: "Main Auditorium",
  },

  {
    id: 21,
    day: "Day 3",
    time: "11:50 AM",
    endTime: "12:10 PM",
    title: "Break",
    type: "break",
    speaker: {
      name: "All Attendees",
    },
    venue: "Main Auditorium",
  },
  {
    id: 22,
    day: "Day 3",
    time: "12:10 PM",
    endTime: "1:00 PM",
    title: "Session 2",
    type: "keynote",
    speaker: {
      name: "Dr Adebayo Adekunle",
      title: "Consultant Obstetrician & Gynaecologist, Entrepreneur, Educator",
      avatar:
      "https://media.hgbcinfluencers.org/bisum/Dr Adebayo.jpg",
    },
    venue: "Main Auditorium",
  },
  {
    id: 23,
    day: "Day 3",
    time: "1:00 PM",
    endTime: "1:40 PM",
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
    time: "1:40 PM",
    endTime: "2:00 PM",
    title: "Impartation, Closing & Announcements",
    type: "closing",
    speaker: {
      name: "Pastor Samson Ayangoke",
      title: "Lead Pastor, Higher Ground Baptist Church",
      avatar:
      "https://media.hgbcinfluencers.org/bisum/samson ayangoke.png"
    },
    venue: "Main Auditorium",
  },
];
