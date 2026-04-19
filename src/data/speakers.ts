import pvo from '/speakers/pov.jpeg';
import pts from '/speakers/sobowale.jpeg';
import vta from '/speakers/victory.jpeg';
import ok from '/speakers/oladipo.jpeg';



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
    category: ["keynote", "breakout"],
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
  "id": 2,
  name: "Pastor Victor Olukoju",
  title: "Ministry Leader, Gospel Filmmaker, Author, Sexual Purity Advocate",
  company: "Sexual Purity Academy (SPA) & Parables Film Productions",
  bio: "Pastor Victor Olukoju (PVO) is a multi-talented ministry leader, gospel filmmaker, author, and renowned advocate for sexual purity, dedicated to empowering believers and young people worldwide to live purpose-driven lives for Christ. He is the Founder and President of the Sexual Purity Academy (SPA), an international commission raising Sexual Purity Ambassadors for Christ across Nigeria, the USA, Canada, the UK, Ghana, and Ireland, with impactful programs such as SONDA DAY, Walk for Sexual Purity, and SPA Experience. As the Founding President of Parables Film Productions, he has used storytelling to proclaim the gospel, acting, writing, directing, and producing numerous films including Games, Akobi Laaroye, Oosa, The One I Love, Fourthman, The Peep, Marriage Committee, and Mohuru, a unique full-length gospel film set in a single location and filmed in Ibadan in 2023. He has also featured in Mount Zion Films such as Abattoir and Under Siege. A graduate of the Mount Zion Institute, he holds Ordinary, Advanced, Diploma, and Post-Graduate Diploma certificates in Christian Drama Arts (affiliated with Redeemer’s University and Ajayi Crowther University). He is also a prolific author of over 20 books including Letter to My Son, Letter to My Daughter, Letter to Courting Couples, Maintaining Sexual Purity as a Student, 33 Reasons You Must Say No to Sex Before Marriage, and Zip Up. PVO hosts the Beyond Entertainment Show, blending gospel truth with creative media. He is married to Pastor Mrs. Franca Olukoju, and they are blessed with children and grandchildren. His visionary leadership and creative ministry continue to inspire and transform lives across generations and nations.",
  image: pvo,
  expertise: [
    "Christian Leadership",
    "Gospel Filmmaking",
    "Sexual Purity Advocacy",
    "Public Speaking",
    "Youth Mentorship",
    "Content Creation"
  ],
  category: ["keynote","breakout"],
  experience: "Over a decade of impact in ministry, filmmaking, and youth development",
  achievements: [
    "Founder and President of Sexual Purity Academy (SPA) with global reach",
    "Founder of Parables Film Productions",
    "Produced and featured in multiple gospel films across Nigeria",
    "Featured in Mount Zion Films productions",
    "Author of over 20 books on sexual purity and relationships",
    "Creator of impactful programs like SONDA DAY and Walk for Sexual Purity",
    "Host of Beyond Entertainment Show"
  ],
  social: {
    linkedin: "",
    twitter: "",
    instagram: "",
    facebook: ""
  },
  quote: "A life of purpose is a life committed to truth, purity, and impact for Christ."
},
{
  id: 3,
  name: "Tayo Sobowale",
  title: "Business Leader, Pastor, Community Builder, Youth Mentor",
  company: "The Pitch Business Community & STHRIM Initiative",
  bio: "Tayo Sobowale, fondly known as PTS, is a leader passionate about building people, businesses, and communities that last. He is the Founder and CEO of The Pitch Business Community, a platform dedicated to business training, branding, marketing, and consulting, helping individuals turn ideas into structured and sustainable ventures. He also leads STHRIM (Survive, Thrive, Multiply Initiative), through which he has impacted over 5,000 young people and supported the growth of more than 60 businesses across industries such as food, fashion, media, and tech. His influence extends into sectors like real estate, telecommunications, music, branding, and interior design, where he provides strategic direction and support. Beyond business, he serves as a leader at Hilltop Kingdom Ministries and as Pastor in Charge of Area at RCCG Watchtower, with a strong focus on raising people with the right values, mindset, and direction. He is also the Director of Hill City Football Academy, where he has trained over 170 young athletes, with about 85 still actively developing, and one currently playing professionally in Italy. He is a certified member of the Nigerian Football Coaches Association. He studied Pure and Applied Physics at Ladoke Akintola University of Technology and holds certifications in Leadership, Theology, and Executive Project Management. Across every space he operates in, whether consulting entrepreneurs, mentoring young footballers, or leading his congregation, his focus remains consistent: grooming young people and positioning them for the futures they deserve. At his core, he believes strongly in execution, emphasizing that beyond ideas, structure, discipline, and consistent action are what truly make the difference.",
  image: pts,
  expertise: [
    "Business Strategy",
    "Entrepreneurship",
    "Leadership Development",
    "Branding & Marketing",
    "Youth Mentorship",
    "Community Building"
  ],
  category: ["keynote", "breakout"],
  experience: "Over a decade of experience in business development, ministry leadership, and youth empowerment",
  achievements: [
    "Founder and CEO of The Pitch Business Community",
    "Led STHRIM initiative impacting 5,000+ young people",
    "Supported growth of 60+ businesses across multiple industries",
    "Pastor in Charge of Area at RCCG Watchtower",
    "Director of Hill City Football Academy, training 170+ athletes",
    "Certified member of the Nigerian Football Coaches Association",
    "Mentored individuals across business, ministry, and sports sectors"
  ],
  social: {
    linkedin: "",
    twitter: "",
    instagram: "",
    facebook: ""
  },
  quote: "Execution is the bridge between ideas and results. Structure, discipline, and action make the difference."
},
{
  id: 4,
  name: "Pastor Mrs. Victory Tolulope Ayangoke",
  title: "Growth Strategist, Business Development Manager, Mentor",
  company: "GlobalX",
  bio: "Pastor Mrs. Victory Tolulope Ayangoke is a Growth Strategist, Business Development Manager, and Mentor passionate about driving growth across businesses, creators, and women. She currently serves as Business Development Manager at GlobalX, where she focuses on building strategic partnerships and unlocking market opportunities that drive business expansion. With a strong background in business development and strategy, she has supported the growth of brands such as Petrong Software Solutions, Niyisuk, and Doxaroyale, helping them translate ideas into structured, sustainable growth through product development, marketing, and execution. As a creative strategist and video editor, she also helps content creators build visibility and grow impactful platforms through intentional content. Beyond the corporate and creative space, she is deeply committed to purpose and personal development. She mentors young women through her Total Woman Mentorship Program, emphasizing that true growth is not just about doing more, but becoming more. She is married to Samson Oluwaseun Ayangoke, the Lead Pastor at Higher Ground Baptist Church, Ogbomosho, Oyo State, and they are blessed with their children, Judah Ireti-Ogo and Anna Ireti-Ayo Ayangoke.",
  image: vta,
  expertise: [
    "Business Development",
    "Growth Strategy",
    "Brand Strategy",
    "Content Creation",
    "Mentorship",
    "Women Development"
  ],
  category: ["breakout"],
  experience: "Extensive experience in business development, strategic growth, and mentorship across corporate and creative sectors",
  achievements: [
    "Business Development Manager at GlobalX",
    "Contributed to the growth of brands like Petrong Software Solutions, Niyisuk, and Doxaroyale",
    "Founder of Total Woman Mentorship Program",
    "Mentor to young women in personal and professional development",
    "Creative strategist supporting content creators and digital platforms"
  ],
  social: {
    linkedin: "",
    twitter: "",
    instagram: "",
    facebook: ""
  },
  quote: "True growth is not just about doing more, but becoming more."
},
{
  id: 5,
  name: "Dr. Oladipo Kolawole",
  title: "Associate Professor, Infectious Diseases Expert, Molecular Virologist, Scienpreneur",
  company: "Adeleke University & Helix Biogen Institute",
  bio: "Dr. Oladipo Kolawole is a distinguished infectious diseases expert, molecular virologist, and innovator from Ogbomoso, Oyo State, Nigeria. He holds a B.Tech in Microbiology, an M.Sc. in Medical Microbiology and Parasitology (Virology Option), and a Ph.D. in Microbiology (Medical Virology/Immunology Option) from Ladoke Akintola University of Technology (LAUTECH). He currently serves as an Associate Professor of Infectious Diseases, Molecular Virology, and Genomics at Adeleke University, Ede, Osun State, and was appointed Honorary Associate Professor at the University of Birmingham, UK, in 2023. Dr. Kolawole is an International Fellow of the Indian Council of Medical Research/African Union-STRC and a seasoned science entrepreneur. His research focuses on infectious diseases caused by RNA viruses, exploring molecular epidemiology, pathogenesis, diagnosis, antiviral resistance, and interspecies transmission using molecular biology, bioinformatics, and immunoinformatics. He has published over 120 research articles, authored books and book chapters, and contributed extensively to global scientific conferences. As Co-founder and Director of Helix Biogen Institute, a leading genomic hub in Ogbomoso, he leads groundbreaking initiatives including a COVID-19 candidate vaccine recognized by WHO, making it one of the few in Africa. Helix Biogen Institute has collaborated with top scientists across Africa and is part of the Africa CDC Diagnostics Advisory Committee, representing West Africa in advancing diagnostic solutions. He also holds a patent for a unique microorganism and has received numerous international grants and recognitions from prestigious organizations including the African Union, Bill and Melinda Gates Foundation, UNESCO, Wellcome Trust, NIH, and others. Beyond research, he is a passionate mentor who has supervised numerous students and is committed to advancing biomedical education and innovation in Africa. Dr. Kolawole is also actively involved in his faith community and is a devoted family man.",
  image: ok,
  expertise: [
    "Infectious Diseases",
    "Molecular Virology",
    "Genomics & Bioinformatics",
    "Biomedical Research",
    "Vaccine Development",
    "Scientific Innovation"
  ],
  category: ["keynote"],
  experience: "Over 15 years of experience in infectious disease research, academia, and scientific innovation",
  achievements: [
    "Associate Professor at Adeleke University and Honorary Associate Professor at University of Birmingham, UK",
    "Published 120+ peer-reviewed research articles",
    "Co-founder and Director of Helix Biogen Institute",
    "Led COVID-19 candidate vaccine project recognized by WHO",
    "Member of Africa CDC Diagnostics Advisory Committee (DAC)",
    "Recipient of multiple international grants from organizations including AU, Gates Foundation, UNESCO, NIH, and Wellcome Trust",
    "Patent holder for a novel microorganism",
    "Mentored numerous undergraduate and postgraduate students"
  ],
  social: {
    linkedin: "",
    twitter: "",
    instagram: "",
    facebook: ""
  },
  quote: "Innovation, research, and mentorship are powerful tools for transforming lives and advancing global health."
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
