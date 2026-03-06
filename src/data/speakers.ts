export type Speaker = {
  id: number;
  name: string;
  title: string;
  company: string;
  bio: string;
  image: string;
  expertise: string[];
  category: string[];
  experience: string;
  achievements: string[];
  social: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    website?: string;
  };
  quote?: string;
  featured?: boolean;
  session?: {
    title: string;
    time: string;
    venue: string;
  };
};

export const speakersData: Speaker[] = [
  {
    id: 1,
    name: "Pastor Samson Ayangoke",
    title: "Lead Pastor",
    company: "Higher Ground Baptist Church",
    bio: "Samson Oluwaseun Ayangoke was born to the family of Mr. & Mrs. Johnson Olufunke Ayangoke at Ilasamaja, Lagos State. He is the second born in a family of three, and the first of two males. He attended the University of Lagos, Akoka, from 2010–2015, where he obtained his B.Sc in Business Administration. He also holds a diploma in Computer Engineering and is a member of the Nigerian Institute of Management.\n\nHe gave his life to Christ in August 2008 during a BSF program at Surulere Baptist Church, Ojuelegba, and has remained steadfast in faith. Over the years, he has served in various ministry capacities within the R.A, BSF, Youth Fellowship, and NCCF. After his university education, he worked in the financial sector with FCMB for three years before answering the call into full-time ministry in May 2020.\n\nHe is married to his beautiful wife, Victory Tolulope Ayangoke, and their union is blessed with a lovely son, Judah Ireti-Ogo Ayangoke. Samson is currently a student at the Nigerian Baptist Theological Seminary, Ogbomoso, studying Missions in Theology. He is also an entrepreneur, and a technology and fashion enthusiast. A lover of God, prayer, and His Word, he is passionate about raising a generation that will advance God’s kingdom and walk in divine power in their spheres of influence.",
    image: "https://media.hgbcinfluencers.org/bisum/samson ayangoke.png",
    expertise: [
      "Missions",
      "Leadership",
      "Faith Development",
      "Entrepreneurship",
      "Technology & Innovation"
    ],
    category: ["keynote"],
    experience: "Former FCMB staff, now full-time missionary and entrepreneur with strong leadership and ministry experience.",
    achievements: [
      "Served in leadership roles across BSF, NCCF, and Youth Fellowship.",
      "Transitioned from the financial sector to full-time ministry in 2020.",
      "Founder of faith-driven initiatives combining technology and missions.",
      "Actively training to advance global missions through theological education."
    ],
    social: {
      linkedin: "https://linkedin.com/in/samson-ayangoke",
      facebook: "https://facebook.com/samson.ayangoke",
      instagram: "https://instagram.com/samsonayangoke"
    },
    quote: "I believe in raising a generation that will march with power for the Lord in every sphere of influence and will not break rank."
  },
  {
    id: 2,
    name: "Dr Adebayo Adekunle",
    title: "Consultant Obstetrician & Gynaecologist, Entrepreneur, Educator",
    company: "Adebayo Healthcare Limited",
    bio: "Dr. Adebayo Adekunle is an exemplary leader in medicine, business, and education. He became the first consultant in his class, rising to the position of Consultant Obstetrician and Gynaecologist within just four and a half years of commencing residency. Currently, he serves as Head of Clinical Services at the Nigerian Police Hospital, Falomo, Ikoyi, Lagos, and Chairman of the Medical Advisory Council. He is the CEO of Adebayo Healthcare Limited, owning multiple hospitals and diagnostic centers across Lagos and Oyo State, and is also the founder of Abisola Foods, reflecting his passion for food security and sustainable entrepreneurship. As a lecturer at LAUTECH’s College of Health Sciences, he mentors the next generation of doctors. Dr. Adebayo is also a global speaker, certified in Leadership and Management in Health from the University of Washington, and has earned over 40 professional and community awards. In 2022, he established the Adebayo Dream Humanitarian Foundation (ADHF), which has provided free healthcare to over 5,000 people. Beyond his professional pursuits, he is a devoted husband to Mrs. Abisola Adekunle and father of two children.",
    image: "https://media.hgbcinfluencers.org/bisum/Dr Adebayo.jpg",
    expertise: [
      "Healthcare Leadership",
      "Entrepreneurship",
      "Obstetrics & Gynaecology",
      "Medical Education",
      "Public Speaking",
      "Community Development"
    ],
    category: ["keynote"],
    experience: "15+ years in medicine, healthcare leadership, and entrepreneurship",
    achievements: [
      "First in his class to become Consultant Obstetrician & Gynaecologist",
      "Head of Clinical Services, Nigerian Police Hospital Falomo",
      "CEO of Adebayo Healthcare Limited and multiple specialist hospitals",
      "Founder of Abisola Foods, promoting food security",
      "Lecturer at LAUTECH’s College of Health Sciences",
      "Over 40 professional and community awards, including Leadership Award by the Office of the Wife of the Vice President of Nigeria",
      "Founder of Adebayo Dream Humanitarian Foundation (ADHF), impacting 5,000+ people"
    ],
    social: {
      linkedin: "https://www.linkedin.com/in/thedradebayo1/",
      twitter: "https://x.com/thedradebayo",
      instagram: "https://instagram.com/thedradebayo",
      facebook: "https://facebook.com/thedradebayo"
    },
    quote: "Purpose drives innovation. When faith meets technology, impact becomes inevitable."

  },
  {
    id: 3,
    name: "Temilola Okedigba",
    title: "Product Manager & CEO of Mannara Foods",
    company: "Mannara Foods",
    bio: "Temilola Okedigba is a dynamic Product Manager with a strong background in technology, strategy, and innovation.\n\nHer journey into tech began while lecturing at Bowen University, where she led the transition from manual processes to automated systems — an experience that sparked her passion for building impactful digital products.\n\nShe has managed and contributed to products across academia, fintech, AI, healthtech, and lifestyle — driving user-centered solutions that deliver real value.\n\nShe is also the CEO of Mannara Foods, a brand committed to making groceries affordable and accessible to everyone.\n\nBeyond tech and business, she is a drama minister who loves the stage more than the screen.\n\nShe holds degrees in Computer Science from Bowen University (B.Sc) and Coventry University (M.Sc), and is currently pursuing her PhD at LAUTECH.\n\nShe is happily married with two children, and continues to blend innovation, leadership, and purpose — inspiring others as a woman thriving at the intersection of faith, technology, and impact.",
    image: "https://media.hgbcinfluencers.org/bisum/Temilola Okedigba.jpg",
    expertise: [
      "Product Management",
      "Digital Innovation",
      "Leadership",
      "Technology Strategy",
      "Business Growth"
    ],
    category: ["breakout"],
    experience: "Over a decade of experience spanning technology, academia, and entrepreneurship; currently pursuing a PhD in Computer Science.",
    achievements: [
      "Led digital transformation projects at Bowen University.",
      "Built and managed tech products across multiple industries including fintech and healthtech.",
      "Founded Mannara Foods, making groceries affordable and accessible.",
      "Mentored aspiring women in tech and entrepreneurship.",
      "Speaker at leadership and business events."
    ],
    social: {
      linkedin: "https://www.linkedin.com/in/temilola-okedigba-a869b573/",
      facebook: "https://web.facebook.com/temilolao"
    },
    quote: "Purpose drives innovation. When faith meets technology, impact becomes inevitable."
  }
];

// Available speaker categories for filtering
export const speakerCategories = [
  "all",
  "keynote",
  "breakout",
  "story",
];

// Helper function to get speakers by category
export const getSpeakersByCategory = (category:string) => {
  if (category === "all") return speakersData;
  return speakersData.filter((speaker) => {
    if (Array.isArray(speaker.category)) {
      return speaker.category.includes(category);
    }
    return speaker.category === category;
  });
};

// Helper function to search speakers
export const searchSpeakers = (searchTerm:string) => {
  if (!searchTerm) return speakersData;

  const term = searchTerm.toLowerCase();
  return speakersData.filter(
    (speaker) =>
      speaker.name.toLowerCase().includes(term) ||
      speaker.title.toLowerCase().includes(term) ||
      speaker.company.toLowerCase().includes(term) ||
      speaker.expertise.some((exp) => exp.toLowerCase().includes(term)),
  );
};

// Helper function to filter and search speakers
export const filterAndSearchSpeakers = (category = "all", searchTerm = "") => {
  let filtered = getSpeakersByCategory(category);

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (speaker) =>
        speaker.name.toLowerCase().includes(term) ||
        speaker.title.toLowerCase().includes(term) ||
        speaker.company.toLowerCase().includes(term) ||
        speaker.expertise.some((exp) => exp.toLowerCase().includes(term)),
    );
  }

  return filtered;
};
