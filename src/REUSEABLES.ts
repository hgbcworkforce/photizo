/**
 * REUSEABLES.ts
 * 
 * Centralized repository of all static text content, headings, labels, 
 * button copies, placeholders, and messaging across pages and components
 * (excluding dynamic/item dataset records in /src/data).
 */

// ============================================================================
// 1. NAVIGATION & FOOTER (COMMON LAYOUT)
// ============================================================================

export const NAVBAR_TEXT = {
  brandAlt: "BISUM Conference",
  links: [
    { id: "schedule", label: "Schedule", path: "/schedule", isRoute: true },
    { id: "speakers", label: "Speakers", path: "/speakers", isRoute: true },
    { id: "merchandise", label: "Merchandise", path: "/merchandise", isRoute: true },
    { id: "register", label: "Register", path: "/register", isCTA: true, isRoute: true },
  ],
  mobileMenuAriaLabel: "Toggle mobile menu",
} as const;

export const FOOTER_TEXT = {
  brandAlt: "BISUM Conference",
  aboutText:
    "Join us to experience an atmosphere of learning, connection, and transformation. Gain practical insights, meet inspiring leaders, and take bold steps toward your future.",
  quickLinksHeading: "Quick Links",
  quickLinks: [
    { name: "Home", href: "/" },
    { name: "Schedule", href: "/schedule" },
    { name: "Speakers", href: "/speakers" },
    { name: "Register", href: "/register" },
  ],
  contactHeading: "Contact Info",
  contactInfo: [
    { text: "Ogbomoso, Nigeria" },
    { text: "photizo@hgbcinfluencers.org" },
    { text: "+234 (0) 123 456 7890" },
  ],
  socialHeading: "Follow Us",
  socialLinks: [
    { name: "Facebook", href: "https://facebook.com/hgbcinfluencers" },
    { name: "Instagram", href: "https://instagram.com/hgbcinfluencers" },
    { name: "YouTube", href: "https://youtube.com/@hgbcinfluencers" },
  ],
  copyright: (year: number) => `© ${year} Photizo Conference. All rights reserved.`,
} as const;

// ============================================================================
// 2. HOME PAGE & HOMEPAGE SECTIONS
// ============================================================================

export const HERO_TEXT = {
  badge: "Photizo 2026",
  headline: "EMERGE",
  subtitlePre: "An atmosphere of ",
  subtitleHighlight: "radical transformation",
  subtitlePost: "Join visionary leaders and discover the insights that will shape your next decade.",
  countdownTitle: "Conference starts in",
  countdownLabels: {
    days: "Days",
    hours: "Hours",
    minutes: "Mins",
    seconds: "Secs",
  },
  conferenceDate: "May 21, 2026 17:00:00",
  dateLocationInfo: [
    { label: "May 21st – 23rd, 2026" },
    { label: "Ogbomoso, Nigeria" },
  ],
  primaryCta: "Secure Your Seat",
  secondaryCta: "Purchase Merchandise",
} as const;

export const ABOUT_TEXT = {
  badge: "The Experience",
  titlePrefix: "About ",
  titleHighlight: "Photizo",
  paragraph1:
    "Photizo is a purpose-driven platform dedicated to raising and empowering individuals to become influential leaders in their spheres of impact. The vision of Photizo is centered on building men and women who are equipped to create meaningful change in society through both personal growth and strategic engagement.",
  paragraph2:
    "Photizo challenges individuals to move beyond limitations, grow intentionally, and expand their influence. It promotes a balanced approach to impact, combining personal and spiritual development with active social and professional engagement, so individuals are transformed within and empowered to make meaningful contributions in their communities.",
  features: {
    purposeDriven: {
      title: "Purpose Driven",
      description: "Building impact-focused futures.",
    },
    expertInsights: {
      title: "Expert Insights",
      description: "Learn from industry veterans.",
    },
  },
  cta: "Meet Our Speakers",
} as const;

export const SCHEDULE_SECTION_TEXT = {
  badge: "Happening Soon",
  headingPre: "Don’t Miss the ",
  headingHighlight: "Highlights",
  viewFullScheduleCta: "View Full Schedule",
  fullAgendaCta: "Full Agenda",
  defaultVenue: "Main Hall",
} as const;

export const SPEAKERS_SECTION_TEXT = {
  headingPre: "World-Class ",
  headingHighlight: "Speakers",
  description:
    "Join industry leaders and visionaries as they share insights on the future of innovation at Photizo 2026.",
  seeAllCta: "See All Speakers",
} as const;

export const MERCHANDISE_SECTION_TEXT = {
  badge: "THE SHOP",
  headingPre: "Exclusive ",
  headingHighlight: "Swag",
  availabilityLabel: "Availability",
  orderNowButton: "Order Now",
} as const;

// ============================================================================
// 3. SPEAKERS PAGE & COMPONENTS
// ============================================================================

export const SPEAKERS_PAGE_TEXT = {
  hero: {
    tag: "Speakers",
    title: "Meet Our Speakers",
    description:
      "Discover the inspiring individuals who will be sharing their expertise at Photizo'26",
  },
  allCategoryLabel: "All Speakers",
  searchPlaceholder: "Search speakers, topics, or companies...",
  showingCount: (showing: number, total: number, term?: string) =>
    `Showing ${showing} of ${total} speakers${term ? ` for "${term}"` : ""}`,
  emptyState: {
    title: "No speakers found",
    description: "Try adjusting your search criteria or filter selection",
    clearFilters: "Clear Filters",
  },
  ctaBanner: {
    heading: "Don't Miss These Amazing Speakers",
    description:
      "Register now to secure your spot and learn from the best minds in technology",
    buttonText: "Register for BISUM 2025",
  },
} as const;

export const SPEAKER_CARD_TEXT = {
  defaultCategory: "Main Stage",
  viewProfile: "View Profile",
} as const;

export const SPEAKER_MODAL_TEXT = {
  featuredBadge: "Featured",
  sections: {
    biography: "Biography",
    onStage: "On Stage",
    expertise: "Expertise",
    experience: "Experience",
  },
  footerTag: "EMERGE - Photizo'26",
  returnButton: "Return to Speakers",
} as const;

// ============================================================================
// 4. SCHEDULE PAGE & COMPONENTS
// ============================================================================

export const SCHEDULE_PAGE_TEXT = {
  hero: {
    tag: "Schedule",
    title: "Event Schedule",
    description:
      "Explore the full schedule of Photizo'26 and plan your experience with us",
  },
  days: ["Day 1", "Day 2", "Day 3"] as const,
  dateMap: {
    "Day 1": "Thursday, MAY 21",
    "Day 2": "Friday, MAY 22",
    "Day 3": "Saturday, MAY 23",
  } as Record<string, string>,
  defaultVenue: "Main Hall",
  detailsButton: "DETAILS",
} as const;

// ============================================================================
// 5. MERCHANDISE PAGES
// ============================================================================

export const MERCHANDISE_PAGE_TEXT = {
  hero: {
    tag: "Merchandise",
    title: "Official Merchandise",
    description:
      "Check out our exclusive Photizo'26 merchandise and show your support for the event!",
  },
  colorLabel: "Color:",
  orderNowButton: "Order now",
} as const;

export const MERCHANDISE_DETAILS_TEXT = {
  breadcrumbRoot: "Merchandise",
  placeholders: {
    fullName: "Full Name",
    email: "Email Address",
    phoneNumber: "Phone Number",
  },
  labels: {
    selectedColor: "Selected Color",
    subtotal: "Subtotal",
    charges: "Charges (2.5%)",
    total: "Total",
  },
  buttons: {
    orderNow: "Order Now",
    payWithPaystack: "Pay with Paystack",
    initializingPayment: "Initializing Payment...",
  },
  messages: {
    validationError: "Please fill in all required fields",
    popupClosed: "Payment popup closed",
    paystackInitError: "Failed to initialize payment. Please try again.",
    paystackNotLoaded:
      "Payment service (Paystack) is not loaded. Please refresh the page and try again.",
    genericError: "Could not process order. Please try again.",
  },
} as const;

export const MERCHANDISE_SUCCESS_TEXT = {
  title: "Merchandise Purchase Complete!",
  description:
    "Your order has been received and payment was successful. We will process your merchandise and contact you with shipping details.",
  nextSteps: {
    heading: "What happens next?",
    orderRefTitle: "Order Reference",
    orderRefFallback: "Not available",
    confirmationTitle: "Order Confirmation",
    confirmationDescription:
      "We will email you an order summary and delivery details shortly.",
  },
  buttons: {
    continueShopping: "Continue Shopping",
    returnHome: "Return Home",
  },
} as const;

// ============================================================================
// 6. REGISTRATION PAGES
// ============================================================================

export const REGISTRATION_PAGE_TEXT = {
  hero: {
    tag: "Register",
    title: "Secure your Spot at Photizo'25",
    description:
      "Join us for an inspiring experience of innovation, learning, and networking",
  },
  formHeading: "Registration Form",
  formSubtitle: "Please fill out all required information to secure your spot.",
  sectionPersonal: "Personal Information",
  fields: {
    firstName: {
      label: "First Name *",
      placeholder: "First Name",
    },
    lastName: {
      label: "Last Name *",
      placeholder: "Last Name",
    },
    email: {
      label: "Email *",
      placeholder: "email@example.com",
    },
    phone: {
      label: "Phone *",
      placeholder: "+234...",
    },
    attendanceMode: {
      label: "Select Attendance Mode *",
      placeholder: "Select Attendance Mode",
      options: [
        { value: "physical", label: "Physical (On Site)" },
        { value: "virtual", label: "Virtual (Online)" },
      ],
    },
    breakoutSession: {
      label: "Breakout Session *",
      placeholder: "Select Breakout Session",
      options: [
        { value: "art", label: "Art" },
        { value: "business", label: "Business" },
        { value: "education", label: "Education" },
        { value: "family", label: "Family" },
        { value: "media", label: "Media" },
        { value: "politics", label: "Politics" },
        { value: "religion", label: "Religion" },
      ],
    },
    referralSource: {
      label: "How did you hear about us? *",
      placeholder: "How did you hear about us?",
      options: [
        { value: "church", label: "Church" },
        { value: "instagram", label: "Instagram" },
        { value: "recommendation_from_friend", label: "Recommendation from a friend" },
        { value: "whatsapp", label: "WhatsApp" },
        { value: "facebook", label: "Facebook" },
        { value: "flyer", label: "Flyer" },
      ],
    },
    expectations: {
      label: "Expectations (Optional)",
      placeholder: "Expectations (Optional)",
      fallbackValue: "No specific expectations",
    },
  },
  pricingSummary: {
    registrationFee: "Registration Fee",
    processingFee: "Processing Fee (2.5%)",
    totalAmount: "Total Amount",
  },
  buttons: {
    submit: "Register & Pay Now",
    processing: "Processing...",
  },
  messages: {
    paymentClosedAlert:
      "Payment window closed. Please complete payment to secure your spot.",
    paymentInitFailed: "Payment initialization failed: no access code received",
    paystackInitError: "Failed to initialize payment. Please try again.",
    paystackNotLoaded:
      "Payment service (Paystack) is not loaded. Please refresh the page and try again.",
    genericError: "An error occurred. Please try again.",
  },
} as const;

export const REGISTRATION_SUCCESS_TEXT = {
  title: "Registration Successful!",
  descriptionPre: "Thank you for registering for ",
  eventHighlight: "Photizo'25",
  descriptionPost: ". We've received your payment and your spot is now secured.",
  nextSteps: {
    heading: "What Happens Next?",
    emailSection: {
      title: "Check your Email",
      description: "We've sent a confirmation receipt and your e-ticket to your inbox.",
    },
    calendarSection: {
      title: "Mark your Calendar",
      description: "Photizo'25 is happening soon! Stay tuned for the event schedule.",
    },
    transactionRefTitle: "Transaction Reference",
  },
  buttons: {
    returnHome: "Return to Homepage",
  },
} as const;

// ============================================================================
// 7. LOGIN & ADMIN DASHBOARD
// ============================================================================

export const LOGIN_PAGE_TEXT = {
  logo: {
    icon: "⚡",
    textPrefix: "Photo",
    textSuffix: "izo",
  },
  tagline: "Admin Dashboard — sign in to manage registrations, merchandise, and analytics.",
  fields: {
    email: {
      label: "Email Address",
      placeholder: "admin@example.com",
    },
    password: {
      label: "Password",
      placeholder: "••••••••",
    },
  },
  buttons: {
    signIn: "Sign In",
    signingIn: "Signing in...",
  },
  errors: {
    requiredFields: "Please fill in all fields.",
    noToken: "No token returned",
    defaultError: "Invalid credentials or server error.",
  },
} as const;

export const ADMIN_PAGE_TEXT = {
  loading: "Loading...",
  actions: {
    refresh: "Refresh",
    viewSite: "View Site",
    logout: "Logout",
  },
  statCards: {
    totalRegistrations: {
      label: "Total Registrations",
      sub: "Event attendees",
    },
    regRevenue: {
      label: "Reg. Revenue",
      sub: "₦2,000 per head",
    },
    merchOrders: {
      label: "Merch Orders",
      sub: "Orders received",
    },
    merchRevenue: {
      label: "Merch Revenue",
      sub: "Total sales value",
    },
  },
  tabs: {
    registrations: "Registrations",
    merchandiseOrders: "Merchandise Orders",
  },
  errors: {
    fetchFailed: "Failed to fetch dashboard data",
  },
} as const;

export const REGISTRATIONS_TAB_TEXT = {
  charts: {
    attendanceModeTitle: "By Attendance Mode",
    breakoutSessionsTitle: "Top Breakout Sessions",
  },
  searchPlaceholder: "Search name, email, phone...",
  filterModes: {
    all: "All Modes",
    physical: "Physical",
    virtual: "Virtual",
  },
  filterStatus: {
    all: "All Status",
    complete: "Paid",
    pending: "Pending",
  },
  filterSessionAll: "All Sessions",
  allSessionsList: [
    "Business",
    "Education",
    "Family",
    "Media",
    "Politics",
    "Religion",
  ],
  buttons: {
    refresh: "Refresh",
    exportCsv: "Export CSV",
    delete: "Delete",
    deleting: "Deleting",
    previous: "Previous",
    next: "Next",
  },
  tableHeaders: [
    "Name",
    "Email",
    "Phone",
    "Mode",
    "Session",
    "Status",
    "Date",
    "Actions",
  ],
  messages: {
    loading: "Loading...",
    empty: "No records found.",
    confirmDelete: "Delete this registration? This action cannot be undone.",
    notAuthenticated: "Not authenticated",
    deleteError: "Failed to delete registration",
  },
} as const;

export const MERCHANDISE_TAB_TEXT = {
  charts: {
    merchandiseTypeTitle: "Type of Merchandise Ordered",
    popularColorsTitle: "Most Popular Colors",
  },
  searchPlaceholder: "Search name, email, city...",
  filterCategories: {
    all: "All Categories",
  },
  buttons: {
    refresh: "Refresh",
    exportCsv: "Export CSV",
    delete: "Delete",
    deleting: "Deleting",
    previous: "Previous",
    next: "Next",
  },
  tableHeaders: [
    "Name",
    "Email",
    "Phone",
    "Product",
    "Color",
    "Size",
    "Qty",
    "Total",
    "Action",
  ],
  messages: {
    loading: "Loading...",
    empty: "No records found.",
    confirmDelete: "Delete this merchandise order? This action cannot be undone.",
    notAuthenticated: "Not authenticated",
    deleteError: "Failed to delete merchandise order",
  },
} as const;

// ============================================================================
// 8. NOT FOUND (404) PAGE
// ============================================================================

export const NOT_FOUND_TEXT = {
  code: "404",
  title: "Page Not Found",
  buttonText: "Go Back Home",
} as const;

// ============================================================================
// UNIFIED EXPORT / AGGREGATION
// ============================================================================

export const REUSEABLES = {
  navbar: NAVBAR_TEXT,
  footer: FOOTER_TEXT,
  hero: HERO_TEXT,
  about: ABOUT_TEXT,
  scheduleSection: SCHEDULE_SECTION_TEXT,
  speakersSection: SPEAKERS_SECTION_TEXT,
  merchandiseSection: MERCHANDISE_SECTION_TEXT,
  speakersPage: SPEAKERS_PAGE_TEXT,
  speakerCard: SPEAKER_CARD_TEXT,
  speakerModal: SPEAKER_MODAL_TEXT,
  schedulePage: SCHEDULE_PAGE_TEXT,
  merchandisePage: MERCHANDISE_PAGE_TEXT,
  merchandiseDetails: MERCHANDISE_DETAILS_TEXT,
  merchandiseSuccess: MERCHANDISE_SUCCESS_TEXT,
  registrationPage: REGISTRATION_PAGE_TEXT,
  registrationSuccess: REGISTRATION_SUCCESS_TEXT,
  loginPage: LOGIN_PAGE_TEXT,
  adminPage: ADMIN_PAGE_TEXT,
  registrationsTab: REGISTRATIONS_TAB_TEXT,
  merchandiseTab: MERCHANDISE_TAB_TEXT,
  notFound: NOT_FOUND_TEXT,
} as const;

export default REUSEABLES;
