import { useState, useEffect, useRef } from "react";
// @ts-ignore
import confetti from "canvas-confetti";
import {
  LayoutDashboard,
  FolderKanban,
  Trophy,
  Users,
  Briefcase,
  Bell,
  UserCircle,
  ChevronRight,
  Plus,
  BookOpen,
  CalendarDays,
  Lightbulb,
  TrendingUp,
  Star,
  Clock,
  CheckCircle2,
  ArrowRight,
  Flame,
  Award,
  MessageSquare,
  FileText,
  Video,
  Zap,
  AlertCircle,
  X,
  GraduationCap,
  BadgeCheck,
  Layers,
  ThumbsUp,
  CalendarCheck,
  Milestone,
  Rocket,
  Search,
  Check,
  Send,
  MessageCircle,
  Share2,
  Download,
  Calendar,
  Sparkles,
  ChevronLeft,
  Building,
  MapPin,
  TrendingDown,
  Lock,
  ChevronDown,
  DollarSign,
  PieChart,
  RefreshCw,
  LogOut
} from "lucide-react";

// Types
interface Task {
  label: string;
  done: boolean;
}

interface Project {
  id: string;
  name: string;
  stage: string;
  mentor: string;
  progress: number;
  status: string;
  statusColor: string;
  domain: string;
  desc: string;
  tech: string;
  team: string;
  studentName: string;
  school: string;
  district: string;
  tasks: Task[];
  lastActivity: string;
  grantApproved?: boolean;
}

interface EventItem {
  id: string;
  title: string;
  date: string;
  location: string;
  tag: string;
  tagColor: string;
  icon: any;
  iconColor: string;
  daysLeft: number;
  registered: boolean;
  desc: string;
  prizes: string;
  rules: string;
}

interface Mentor {
  name: string;
  role: string;
  college: string;
  avatar: string;
  rating: number;
  sessionsBooked: number;
  bio: string;
  skills: string[];
  chatHistory: { sender: "mentor" | "student"; text: string; time: string }[];
}

interface DistrictScore {
  name: string;
  schools: number;
  projects: number;
  score: number;
}

// Initial Shared Data
const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-1",
    name: "AgroSense – Smart Irrigation Monitor",
    stage: "Prototype",
    mentor: "Dr. Anita Nair",
    progress: 68,
    status: "In Progress",
    statusColor: "bg-blue-100 text-blue-700",
    domain: "AgriTech",
    desc: "An IoT-enabled smart irrigation system that monitors soil moisture, ambient temperature, and humidity, and automates water supply to conserve resources.",
    tech: "ESP32, Capacitive Moisture Sensors, React Native, Firebase",
    team: "Ryan (Lead), Anjali (Hardware Engineering)",
    studentName: "Ryan Koshy",
    school: "GHSS Kochi",
    district: "Ernakulam",
    lastActivity: "2h ago",
    grantApproved: true,
    tasks: [
      { label: "Define problem statement and review literature", done: true },
      { label: "Conduct field survey with local farmers (120 responses)", done: true },
      { label: "Design circuit schematic and buy sensors", done: true },
      { label: "Assemble hardware prototype v1.0", done: true },
      { label: "Deploy ESP32 sleep-cycle firmware", done: true },
      { label: "Integrate dashboard with Firebase API", done: false },
      { label: "Field testing at Palakkad pilot farm", done: false },
      { label: "Compile final testing report & pitch presentation", done: false },
    ],
  },
  {
    id: "proj-2",
    name: "EduReach – Offline Learning App",
    stage: "Validation",
    mentor: "Mr. Ravi Menon",
    progress: 42,
    status: "Mentor Review",
    statusColor: "bg-amber-100 text-amber-700",
    domain: "EdTech",
    desc: "A localized learning platform running on Raspberry Pi local hotspots, allowing rural students to download educational videos and quizzes without internet.",
    tech: "Raspberry Pi 4, Node.js, SQLite, HTML5 Offline Manifest",
    team: "Ryan (Software Dev), Devika (Content Curation)",
    studentName: "Devika R.",
    school: "Model School Trivandrum",
    district: "Trivandrum",
    lastActivity: "Yesterday",
    grantApproved: true,
    tasks: [
      { label: "Perform field research at 3 village schools", done: true },
      { label: "Create wireframe UI in Figma", done: true },
      { label: "Configure Raspberry Pi local offline hotspot hosting", done: false },
      { label: "Load curriculum animations & interactive tests", done: false },
      { label: "Draft pilot report & feedback summary", done: false },
    ],
  },
  {
    id: "proj-3",
    name: "WasteMap – Community Waste Tracker",
    stage: "Idea",
    mentor: "Ms. Priya Suresh",
    progress: 18,
    status: "Ideation",
    statusColor: "bg-emerald-100 text-emerald-700",
    domain: "CleanTech",
    desc: "A crowdsourced mobile application that lets citizens pin trash dumps on a map, alerting local municipality drivers for garbage cleanup.",
    tech: "React Native, Google Maps SDK, Node.js Server",
    team: "Ryan (Backend/APIs), Joel (UI design)",
    studentName: "Joel Mathew",
    school: "St. Thomas Calicut",
    district: "Kozhikode",
    lastActivity: "3 days ago",
    grantApproved: false,
    tasks: [
      { label: "Define the waste management issues in Kochi", done: true },
      { label: "Outline app functional specifications and flowcharts", done: false },
      { label: "Design Figma mockups and database structure", done: false },
      { label: "Build MVP backend routing and maps overlays", done: false },
    ],
  },
];

const INITIAL_EVENTS: EventItem[] = [
  {
    id: "event-1",
    title: "Kerala Startup Hackathon 2025",
    date: "Jul 12–14, 2025",
    location: "Technopark, Trivandrum",
    tag: "Hackathon",
    tagColor: "bg-blue-100 text-blue-700",
    icon: Flame,
    iconColor: "text-blue-600",
    daysLeft: 5,
    registered: false,
    desc: "Kerala's largest high-school coding hackathon. Build innovative digital MVPs over 48 hours to solve critical local community challenges.",
    prizes: "🥇 ₹1,00,000 + Incubation | 🥈 ₹50,000 | 🥉 ₹25,000",
    rules: "Teams of 2-4 members. Must build a working software prototype or hardware schematic. No pre-built code allowed."
  },
  {
    id: "event-2",
    title: "Design Thinking Workshop",
    date: "Jul 16, 2025",
    location: "Online · Zoom",
    tag: "Workshop",
    tagColor: "bg-emerald-100 text-emerald-700",
    icon: BookOpen,
    iconColor: "text-emerald-600",
    daysLeft: 9,
    registered: false,
    desc: "Learn from industry experts how to prototype products that users love. Focuses on empathy mapping, problem framing, and fast wireframing.",
    prizes: "Certificate of Achievement for all active attendees + Figma premium kits.",
    rules: "Open to all students under KSSF. Individual registration. Duration: 3 hours."
  },
  {
    id: "event-3",
    title: "KSSF Innovation Cup – Q3",
    date: "Jul 22, 2025",
    location: "Calicut University",
    tag: "Competition",
    tagColor: "bg-violet-100 text-violet-700",
    icon: Award,
    iconColor: "text-violet-600",
    daysLeft: 15,
    registered: false,
    desc: "Quarterly pitch competition for shortlisted projects. Present to a jury of venture capitalists and state startup mentors.",
    prizes: "🥇 ₹2,00,000 startup grant | 🥈 ₹1,00,000 | 🥉 ₹50,000",
    rules: "Must have completed prototype or validation stage. Slides must follow standard 10-slide pitch guidelines."
  },
  {
    id: "event-4",
    title: "IP & Patent Filing Seminar",
    date: "Jul 28, 2025",
    location: "Online · Teams",
    tag: "Seminar",
    tagColor: "bg-amber-100 text-amber-700",
    icon: FileText,
    iconColor: "text-amber-600",
    daysLeft: 21,
    registered: false,
    desc: "A masterclass detailing the process of filing patents and provisional IPs for student engineering innovations in India.",
    prizes: "Free provisional IP filing support for top 5 drafted abstracts.",
    rules: "Free to join. Registration closes 1 day before the seminar."
  },
];

const INITIAL_MENTORS: Mentor[] = [
  {
    name: "Dr. Anita Nair",
    role: "Senior Researcher in IoT & AgriTech",
    college: "IIT Trivandrum",
    avatar: "AN",
    rating: 5.0,
    sessionsBooked: 14,
    bio: "Anita Nair has over 15 years of academic and industrial research experience in agricultural telemetry and smart sensor arrays. She advises multiple regional Agritech startups.",
    skills: ["AgriTech", "UI/UX", "Hardware/IoT", "Business Model", "Pitching"],
    chatHistory: [
      { sender: "mentor", text: "Hi Ryan, how is the power consumption validation going?", time: "2:10 PM" },
      { sender: "student", text: "Hi Dr. Anita! I am currently compiling the ESP32 sleep cycle tests. The average draw is down to 45mA.", time: "2:12 PM" },
      { sender: "mentor", text: "Excellent. Let's review the circuit diagram and sleep timings in our session on Thursday.", time: "2:15 PM" }
    ]
  },
  {
    name: "Mr. Ravi Menon",
    role: "EdTech Architect & Frontend Lead",
    college: "Technopark Incubator",
    avatar: "RM",
    rating: 4.8,
    sessionsBooked: 8,
    bio: "Ravi builds decentralized web solutions and has developed core education systems for public schools. Expert in offline web apps and offline-first databases.",
    skills: ["EdTech", "Web Development", "Node.js", "Offline Systems", "UI Design"],
    chatHistory: [
      { sender: "mentor", text: "Have you tested the SQLite sync scripts on low network configurations?", time: "Yesterday" },
      { sender: "student", text: "Yes, I simulated 2G throttle. The synchronization succeeds but takes around 40s.", time: "Yesterday" },
      { sender: "mentor", text: "We need compression or chunk-based sync. Let's research that.", time: "Yesterday" }
    ]
  },
  {
    name: "Ms. Priya Suresh",
    role: "Environmental Engineer & Product Lead",
    college: "CleanTech Hub Kerala",
    avatar: "PS",
    rating: 4.9,
    sessionsBooked: 5,
    bio: "Priya specializes in urban waste metrics and carbon offset modeling. She helps student innovators pivot tech ideas to fit municipal frameworks.",
    skills: ["CleanTech", "GIS Mapping", "Carbon Footprint", "Pitch Deck", "Product Strategy"],
    chatHistory: [
      { sender: "mentor", text: "WasteMap needs to address how you verify spam reports.", time: "3 days ago" },
      { sender: "student", text: "I was thinking of peer verification where nearby users vote on report validity.", time: "3 days ago" },
      { sender: "mentor", text: "Good idea. Add a reputation index to user profiles too.", time: "3 days ago" }
    ]
  }
];

const INITIAL_NOTIFICATIONS = [
  {
    id: "n-1",
    from: "Dr. Anita Nair",
    role: "Mentor",
    msg: "Your AgroSense prototype looks great! Please add power consumption metrics before Thursday.",
    time: "2h ago",
    icon: MessageSquare,
    unread: true,
  },
  {
    id: "n-2",
    from: "KSSF Admin",
    role: "System",
    msg: "Kerala Startup Hackathon 2025 registrations are now open. Deadline: Jul 10.",
    time: "5h ago",
    icon: Bell,
    unread: true,
  },
  {
    id: "n-3",
    from: "Mr. Ravi Menon",
    role: "Mentor",
    msg: "EduReach validation report submitted. Awaiting your response on the user research gaps.",
    time: "Yesterday",
    icon: FileText,
    unread: false,
  },
  {
    id: "n-4",
    from: "Class Teacher",
    role: "Teacher",
    msg: "Reminder: Innovation Score submissions close on Jul 15. Upload your progress report.",
    time: "2 days ago",
    icon: AlertCircle,
    unread: false,
  },
];

const INITIAL_DISTRICTS: DistrictScore[] = [
  { name: "Ernakulam", schools: 42, projects: 38, score: 92 },
  { name: "Trivandrum", schools: 38, projects: 32, score: 89 },
  { name: "Kozhikode", schools: 28, projects: 24, score: 85 },
  { name: "Palakkad", schools: 24, projects: 18, score: 78 },
  { name: "Kannur", schools: 20, projects: 15, score: 74 },
];

function ProgressBar({ value, color = "bg-primary" }: { value: number; color?: string }) {
  return (
    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export default function App() {
  // Global Role state: gateway, student, mentor, admin
  const [role, setRole] = useState<"gateway" | "student" | "mentor" | "admin">("gateway");
  const [tourStep, setTourStep] = useState<number | null>(null);

  // Nav sub-item tabs per dashboard
  const [studentNav, setStudentNav] = useState("Dashboard");
  const [mentorNav, setMentorNav] = useState("Dashboard");
  const [adminNav, setAdminNav] = useState("Dashboard");

  const [notifOpen, setNotifOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" } | null>(null);

  // Unified Shared States
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [mentors, setMentors] = useState<Mentor[]>(INITIAL_MENTORS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [districts, setDistricts] = useState<DistrictScore[]>(INITIAL_DISTRICTS);
  const [sessions, setSessions] = useState([
    {
      id: "sess-1",
      date: "Jul 10, 2025",
      time: "10:00 AM – 11:00 AM",
      mode: "Google Meet",
      topic: "AgroSense Prototype Review",
      mentor: "Dr. Anita Nair",
      studentName: "Ryan Koshy",
    },
  ]);
  const [funds, setFunds] = useState({
    allocated: 4550000,
    csr: 1800000,
    startup: 1200000,
  });

  // Modal / Interaction States
  const [showIdeaModal, setShowIdeaModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [viewingCompetition, setViewingCompetition] = useState<EventItem | null>(null);
  const [viewingCertificate, setViewingCertificate] = useState<any | null>(null);
  const [activeMentorIdx, setActiveMentorIdx] = useState(0);

  // Stepper state for submitting idea
  const [wizardStep, setWizardStep] = useState(1);
  const [newProjTitle, setNewProjTitle] = useState("");
  const [newProjDomain, setNewProjDomain] = useState("AgriTech");
  const [newProjMentor, setNewProjMentor] = useState("Dr. Anita Nair");
  const [newProjDesc, setNewProjDesc] = useState("");
  const [newProjTeam, setNewProjTeam] = useState("Ryan (Lead)");
  const [newProjTech, setNewProjTech] = useState("");

  // Booking Meeting state
  const [bookingDate, setBookingDate] = useState("Jul 11, 2025");
  const [bookingTime, setBookingTime] = useState("10:00 AM");
  const [bookingTopic, setBookingTopic] = useState("");
  const [bookingMode, setBookingMode] = useState("Google Meet");
  const [bookingStudent, setBookingStudent] = useState("Ryan Koshy");

  // Chat message input
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Admin Launcher Form State
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventTag, setNewEventTag] = useState("Hackathon");
  const [newEventDate, setNewEventDate] = useState("Aug 12-14, 2025");
  const [newEventLoc, setNewEventLoc] = useState("Technopark, Trivandrum");
  const [newEventDesc, setNewEventDesc] = useState("");
  const [newEventPrizes, setNewEventPrizes] = useState("");
  const [newEventRules, setNewEventRules] = useState("");

  // Admin Allocate Mentor State
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [allocateProjId, setAllocateProjId] = useState("");
  const [allocateMentorName, setAllocateMentorName] = useState("Dr. Anita Nair");

  // Mentor Workspace: Change request state
  const [showRequestChangesModal, setShowRequestChangesModal] = useState(false);
  const [changeReqText, setChangeReqText] = useState("");
  const [changeReqProjId, setChangeReqProjId] = useState("");

  // Stats derived states
  const unreadNotifCount = notifications.filter((n) => n.unread).length;
  const activeProjectsCount = projects.length;
  const registeredEventsCount = events.filter((e) => e.registered).length;

  // Custom Toast helper
  const showToast = (message: string, type: "success" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mentors, isTyping, activeMentorIdx, role]);

  const markAllNotifRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
    showToast("All notifications marked as read");
  };

  // Trigger Confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 160,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#1a4fba", "#1a9e6e", "#f59e0b", "#7c3aed"],
      });
    } catch (e) {
      console.log("Confetti failed", e);
    }
  };

  // Toggle checklist task (cross-console synched)
  const toggleProjectTask = (projId: string, taskIndex: number) => {
    const updated = projects.map((p) => {
      if (p.id === projId) {
        const updatedTasks = p.tasks.map((t, idx) => (idx === taskIndex ? { ...t, done: !t.done } : t));
        const doneCount = updatedTasks.filter((t) => t.done).length;
        const progress = Math.round((doneCount / updatedTasks.length) * 100);

        let stage = p.stage;
        let status = p.status;
        let statusColor = p.statusColor;

        if (progress === 100) {
          status = "Completed";
          statusColor = "bg-green-100 text-green-700";
          stage = "Incubation";
        } else if (progress > 60) {
          status = "In Progress";
          statusColor = "bg-blue-100 text-blue-700";
        } else if (progress > 30) {
          status = "Mentor Review";
          statusColor = "bg-amber-100 text-amber-700";
        } else {
          status = "Ideation";
          statusColor = "bg-emerald-100 text-emerald-700";
        }

        const nextProj = { ...p, tasks: updatedTasks, progress, status, statusColor, stage, lastActivity: "Just now" };
        if (selectedProject?.id === projId) {
          setSelectedProject(nextProj);
        }
        return nextProj;
      }
      return p;
    });

    setProjects(updated);

    const proj = updated.find((p) => p.id === projId);
    if (proj && proj.progress === 100) {
      triggerConfetti();
      showToast(`🏆 Project "${proj.name}" completed and submitted for incubation!`);
      // Update district score
      setDistricts(districts.map(d => d.name === proj.district ? { ...d, score: Math.min(100, d.score + 2) } : d));
    }
  };

  // Submit new Idea Form (Student Console -> Mentor Console alert)
  const handleSubmitIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle.trim() || !newProjDesc.trim()) {
      showToast("Please fill in the project title and description", "info");
      return;
    }

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: newProjTitle,
      stage: "Idea",
      mentor: newProjMentor,
      progress: 0,
      status: "Ideation",
      statusColor: "bg-emerald-100 text-emerald-700",
      domain: newProjDomain,
      desc: newProjDesc,
      tech: newProjTech || "Not specified",
      team: newProjTeam || "Ryan (Lead)",
      studentName: "Ryan Koshy",
      school: "GHSS Kochi",
      district: "Ernakulam",
      lastActivity: "Just now",
      grantApproved: false,
      tasks: [
        { label: "Draft project proposal abstract", done: false },
        { label: "Seek mentor approval on requirements", done: false },
        { label: "Create initial architecture wireframes", done: false },
        { label: "Develop functional MVP draft", done: false },
      ],
    };

    setProjects([newProject, ...projects]);
    setShowIdeaModal(false);
    triggerConfetti();
    showToast(`💡 Idea "${newProject.name}" submitted! Review allocated to ${newProjMentor}.`);

    // Reset wizard
    setNewProjTitle("");
    setNewProjDesc("");
    setNewProjTech("");
    setNewProjTeam("Ryan (Lead)");
    setWizardStep(1);

    // Dynamic Notifications
    const newNotif = {
      id: `notif-${Date.now()}`,
      from: "KSSF Student Portal",
      role: "System Action",
      msg: `Ryan Koshy submitted a new proposal "${newProject.name}" for review.`,
      time: "Just now",
      icon: Lightbulb,
      unread: true,
    };
    setNotifications([newNotif, ...notifications]);

    // Update district metrics counts
    setDistricts(districts.map(d => d.name === "Ernakulam" ? { ...d, projects: d.projects + 1 } : d));
  };

  // Register Event/Hackathon
  const handleRegisterEvent = (eventId: string) => {
    setEvents(events.map((e) => {
      if (e.id === eventId) {
        if (e.registered) return e;
        triggerConfetti();
        showToast(`🎉 Successfully registered for ${e.title}!`);
        return { ...e, registered: true };
      }
      return e;
    }));
    if (viewingCompetition?.id === eventId) {
      setViewingCompetition({ ...viewingCompetition, registered: true });
    }

    const ev = events.find((e) => e.id === eventId);
    if (ev) {
      setNotifications([
        {
          id: `notif-${Date.now()}`,
          from: "KSSF Registrar",
          role: "Registration Verified",
          msg: `Ryan Koshy signed up for "${ev.title}". Schedule logs synced.`,
          time: "Just now",
          icon: BadgeCheck,
          unread: true,
        },
        ...notifications
      ]);
    }
  };

  // Book Meeting session (updates upcoming lists in both Student & Mentor)
  const handleBookSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingTopic.trim()) {
      showToast("Please enter a topic or questions for the meeting", "info");
      return;
    }

    const selectedMentor = mentors[activeMentorIdx];
    const newSession = {
      id: `sess-${Date.now()}`,
      date: bookingDate,
      time: bookingTime,
      mode: bookingMode,
      topic: bookingTopic,
      mentor: selectedMentor.name,
      studentName: role === "student" ? "Ryan Koshy" : bookingStudent,
    };

    setSessions([newSession, ...sessions]);
    showToast(`📅 Session scheduled successfully!`);
    setBookingTopic("");

    // Add to chat history
    setMentors(mentors.map((m, idx) => {
      if (idx === activeMentorIdx) {
        return {
          ...m,
          sessionsBooked: m.sessionsBooked + 1,
          chatHistory: [
            ...m.chatHistory,
            {
              sender: role === "student" ? ("student" as const) : ("mentor" as const),
              text: `📅 Scheduled a new session: "${bookingTopic}" on ${bookingDate} at ${bookingTime} via ${bookingMode}.`,
              time: "Just now",
            },
            {
              sender: role === "student" ? ("mentor" as const) : ("student" as const),
              text: `Confirmed. I will review the milestones on that date.`,
              time: "Just now",
            },
          ],
        };
      }
      return m;
    }));
  };

  // Chat message simulator (Student <-> Mentor interaction bot)
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    const activeMentor = mentors[activeMentorIdx];

    // Append sender text based on current viewport role
    setMentors(mentors.map((m, idx) => {
      if (idx === activeMentorIdx) {
        return {
          ...m,
          chatHistory: [
            ...m.chatHistory,
            {
              sender: role === "student" ? ("student" as const) : ("mentor" as const),
              text: userText,
              time: "Just now"
            }
          ],
        };
      }
      return m;
    }));
    setChatInput("");

    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let replyText = "Understood. Keep updating your logs so I can track the active changes.";
      const textLower = userText.toLowerCase();

      if (role === "student") {
        // Mentor replying to student
        if (textLower.includes("esp32") || textLower.includes("hardware") || textLower.includes("power")) {
          replyText = "For hardware power spikes, check your ESP32 Sleep API configurations. Ensure the analog sensor rails are disconnected during deep sleep to prevent leakage current.";
        } else if (textLower.includes("pitch") || textLower.includes("presentation") || textLower.includes("hackathon")) {
          replyText = "When pitch scripting, focus 70% of your slide time on validation metrics and community problem intensity. Keep the technical architecture concise.";
        } else if (textLower.includes("patent") || textLower.includes("ip") || textLower.includes("legal")) {
          replyText = "For patent filing, drafting a clear claims sheet is vital. Avoid publishing papers until we lodge the provisional abstract.";
        }
      } else {
        // Mock Student replying to mentor in chat
        if (textLower.includes("update") || textLower.includes("progress") || textLower.includes("status")) {
          replyText = "Hi Dr. Anita, I updated the power consumption checklist. We achieved a 45mA sleep draw. I am working on the Firebase upload code next!";
        } else if (textLower.includes("meet") || textLower.includes("session")) {
          replyText = "I have booked a Zoom slot using the booking panel. I will demonstrate the live sensor readings then!";
        }
      }

      setMentors(mentors.map((m, idx) => {
        if (idx === activeMentorIdx) {
          return {
            ...m,
            chatHistory: [
              ...m.chatHistory,
              {
                sender: role === "student" ? ("mentor" as const) : ("student" as const),
                text: replyText,
                time: "Just now"
              }
            ],
          };
        }
        return m;
      }));

      showToast(`💬 New reply received`);
    }, 1500);
  };

  // Mentor Dashboard: Approve Student Prototype (Confetti + notification + district score bump)
  const handleApprovePrototype = (projId: string) => {
    const updated = projects.map((p) => {
      if (p.id === projId) {
        return {
          ...p,
          progress: 100,
          stage: "Incubation",
          status: "Completed",
          statusColor: "bg-green-100 text-green-700",
          tasks: p.tasks.map((t) => ({ ...t, done: true })),
          lastActivity: "Just now",
        };
      }
      return p;
    });

    setProjects(updated);
    const approvedProj = updated.find((p) => p.id === projId);

    if (approvedProj) {
      triggerConfetti();
      showToast(`🏆 Approved "${approvedProj.name}"! Recommended for state incubation.`);

      // Notify student
      setNotifications([
        {
          id: `notif-${Date.now()}`,
          from: approvedProj.mentor,
          role: "Advisor Action",
          msg: `Congratulations! Dr. Anita Nair approved prototype for "${approvedProj.name}". Recommended for Incubation.`,
          time: "Just now",
          icon: Award,
          unread: true,
        },
        ...notifications
      ]);

      // Bump district score
      setDistricts(districts.map(d => d.name === approvedProj.district ? { ...d, score: Math.min(100, d.score + 5) } : d));
    }
  };

  // Mentor Dashboard: Request Changes Submission
  const handleSubmitRequestChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!changeReqText.trim()) return;

    setProjects(projects.map((p) => {
      if (p.id === changeReqProjId) {
        return {
          ...p,
          status: "Mentor Review",
          statusColor: "bg-amber-100 text-amber-700",
          lastActivity: "Just now",
          desc: `${p.desc} (Mentor request changes: ${changeReqText})`,
        };
      }
      return p;
    }));

    const proj = projects.find(p => p.id === changeReqProjId);
    if (proj) {
      setNotifications([
        {
          id: `notif-${Date.now()}`,
          from: proj.mentor,
          role: "Advisor Action",
          msg: `Changes requested on "${proj.name}": "${changeReqText}"`,
          time: "Just now",
          icon: FileText,
          unread: true,
        },
        ...notifications
      ]);

      // Add to chat history
      setMentors(mentors.map((m) => {
        if (m.name === proj.mentor) {
          return {
            ...m,
            chatHistory: [
              ...m.chatHistory,
              { sender: "mentor", text: `⚠️ Changes requested on "${proj.name}": ${changeReqText}`, time: "Just now" }
            ]
          };
        }
        return m;
      }));

      showToast("Changes requested and student notified.");
    }
    setShowRequestChangesModal(false);
    setChangeReqText("");
  };

  // Admin Dashboard: Approve startup grant (Bumps budget + moves status from Ideation -> Validation)
  const handleApproveGrant = (projId: string) => {
    setProjects(projects.map((p) => {
      if (p.id === projId) {
        return {
          ...p,
          grantApproved: true,
          status: "In Progress",
          statusColor: "bg-blue-100 text-blue-700",
          stage: "Validation",
          lastActivity: "Just now",
        };
      }
      return p;
    }));

    // Increment budget allocations
    setFunds({
      ...funds,
      allocated: funds.allocated + 50000,
    });

    const approvedProj = projects.find((p) => p.id === projId);
    if (approvedProj) {
      triggerConfetti();
      showToast(`💰 Grant of ₹50,000 approved for "${approvedProj.name}"!`);

      // Notify student
      setNotifications([
        {
          id: `notif-${Date.now()}`,
          from: "KSSF Admin Console",
          role: "Government Grant",
          msg: `State administration approved ₹50,000 development grant for "${approvedProj.name}". Funding allocated.`,
          time: "Just now",
          icon: DollarSign,
          unread: true,
        },
        ...notifications
      ]);
    }
  };

  // Admin Dashboard: Launch Competition Form Submit (Propagates new event/hackathon to all event lists)
  const handleLaunchCompetition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !newEventDesc.trim()) {
      showToast("Please fill in the title and description", "info");
      return;
    }

    const newEvent: EventItem = {
      id: `event-${Date.now()}`,
      title: newEventTitle,
      date: newEventDate,
      location: newEventLoc,
      tag: newEventTag,
      tagColor: newEventTag === "Hackathon" ? "bg-blue-100 text-blue-700" : newEventTag === "Competition" ? "bg-violet-100 text-violet-700" : "bg-emerald-100 text-emerald-700",
      icon: newEventTag === "Hackathon" ? Flame : newEventTag === "Competition" ? Award : BookOpen,
      iconColor: newEventTag === "Hackathon" ? "text-blue-600" : newEventTag === "Competition" ? "text-violet-600" : "text-emerald-600",
      daysLeft: 30,
      registered: false,
      desc: newEventDesc,
      prizes: newEventPrizes || "Trophy and Certificates",
      rules: newEventRules || "Teams of up to 4 members. Follow online guidelines."
    };

    setEvents([newEvent, ...events]);
    setShowLaunchModal(false);
    triggerConfetti();
    showToast(`📢 Launched state opportunity: "${newEvent.title}"!`);

    // Global alert notifications
    setNotifications([
      {
        id: `notif-${Date.now()}`,
        from: "KSSF Admin Console",
        role: "State Notification",
        msg: `State administration announced: "${newEvent.title}". Registrations are now open.`,
        time: "Just now",
        icon: Bell,
        unread: true,
      },
      ...notifications
    ]);

    // Reset fields
    setNewEventTitle("");
    setNewEventDesc("");
    setNewEventPrizes("");
    setNewEventRules("");
  };

  // Admin Dashboard: Allocate Mentor Submission
  const handleAllocateMentor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allocateProjId) return;

    setProjects(projects.map((p) => {
      if (p.id === allocateProjId) {
        return {
          ...p,
          mentor: allocateMentorName,
          lastActivity: "Just now",
        };
      }
      return p;
    }));

    const proj = projects.find(p => p.id === allocateProjId);
    if (proj) {
      showToast(`👨‍🏫 Assigned ${allocateMentorName} as primary mentor for ${proj.name}.`);

      setNotifications([
        {
          id: `notif-${Date.now()}`,
          from: "KSSF Admin Console",
          role: "Mentor Allocated",
          msg: `${allocateMentorName} has been assigned as primary supervisor for "${proj.name}".`,
          time: "Just now",
          icon: Users,
          unread: true,
        },
        ...notifications
      ]);
    }
    setShowAllocateModal(false);
  };

  const handleSharePortfolio = () => {
    const portfolioUrl = "https://kssf.gov.in/portfolio/ryan-koch-1049";
    navigator.clipboard.writeText(portfolioUrl).then(() => {
      showToast("📋 Portfolio link copied to clipboard!");
    }).catch(() => {
      showToast("Clipboard copy failed, URL: " + portfolioUrl, "info");
    });
  };

  const handleDownloadPDF = () => {
    showToast("💾 PDF download triggered! Generating student profile resume...");
    setTimeout(() => {
      window.print();
    }, 1000);
  };

  const startTour = () => {
    setTourStep(1);
    setRole("student");
    setStudentNav("Dashboard");
    setSelectedProject(null);
    showToast("🎬 Mockup Presentation Tour Launched! Follow the floating dock guidance.");
  };

  const handleNextTourStep = () => {
    if (tourStep === null) return;
    const next = tourStep + 1;
    if (next > 5) {
      setTourStep(null);
      setRole("gateway");
      showToast("✅ Tour finished! Returned to Gateway.");
    } else {
      setTourStep(next);
      if (next === 2) {
        setRole("mentor");
        setMentorNav("Projects");
        setSelectedProject(null);
      } else if (next === 3) {
        setRole("admin");
        setAdminNav("Funding");
      } else if (next === 4) {
        setRole("admin");
        setAdminNav("Events");
      } else if (next === 5) {
        setRole("student");
        setStudentNav("Competitions");
      }
    }
  };

  return (
    <div
      className="min-h-screen bg-[#f4f6fb] text-[#0f1c2e] selection:bg-[#1a4fba]/20 selection:text-[#1a4fba]"
      style={{ fontFamily: "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif" }}
    >
      {/* GLOBAL TOAST */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce shadow-2xl flex items-center gap-3 px-5 py-4 bg-white text-[#0f1c2e] rounded-2xl border border-blue-100/60 max-w-sm">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${toast.type === "success" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"}`}>
            {toast.type === "success" ? <Sparkles className="w-4 h-4" /> : <InfoIcon className="w-4 h-4" />}
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-[#0f1c2e] leading-snug">{toast.message}</p>
          </div>
          <button onClick={() => setToast(null)} className="text-muted-foreground hover:text-foreground">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* NAV HEADER WITH DYNAMIC INTERACTIVE ROLE SWITCHER */}
      {role !== "gateway" && (
        <header className="sticky top-0 z-40 bg-white border-b border-[#1a4fba]/10 shadow-sm">
          <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 h-16">
            <div className="flex items-center gap-3 select-none">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1a4fba] to-[#7c3aed] flex items-center justify-center shadow-md shadow-blue-200">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <div className="leading-none">
                <div className="text-[14px] font-bold text-[#1a4fba] tracking-tight">KSSF PORTAL</div>
                <div className="text-[9px] text-[#5a6a85] font-semibold leading-none uppercase tracking-wider mt-0.5">
                  Kerala School Startup Foundation
                </div>
              </div>
              <div className="hidden sm:block w-px h-6 bg-border mx-3" />
              {/* Role Indicator Badge */}
              <div className="flex items-center gap-1.5 bg-[#eef3fc] text-[#1a4fba] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-md">
                <span>Viewport:</span>
                <span className="underline">{role === "student" ? "Student Console" : role === "mentor" ? "Mentor Space" : "Admin Panel"}</span>
              </div>
            </div>

            {/* SHARED NAVIGATION SWITCHER IN DESKTOP NAVBAR FOR EASY TEST REVIEW */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-1.5 border border-dashed border-[#1a4fba]/30 rounded-xl px-2.5 py-1.5 bg-slate-50">
                <span className="text-[9px] uppercase font-bold text-muted-foreground">Test Switch:</span>
                <button
                  onClick={() => setRole("student")}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${role === "student" ? "bg-primary text-white" : "text-muted-foreground hover:bg-slate-200"}`}
                >
                  Student
                </button>
                <button
                  onClick={() => setRole("mentor")}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${role === "mentor" ? "bg-primary text-white" : "text-muted-foreground hover:bg-slate-200"}`}
                >
                  Mentor
                </button>
                <button
                  onClick={() => setRole("admin")}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${role === "admin" ? "bg-primary text-white" : "text-muted-foreground hover:bg-slate-200"}`}
                >
                  Govt Admin
                </button>
              </div>

              <button
                onClick={() => setRole("gateway")}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-red-100 hover:bg-red-50 text-red-600 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Exit Console
              </button>
            </div>
          </div>
        </header>
      )}

      {/* ========================================================== */}
      {/* 0. GATEWAY PORTAL SELECTOR */}
      {role === "gateway" && (
        <div className="min-h-screen flex flex-col justify-between py-12 px-6 bg-gradient-to-br from-[#1a4fba]/5 via-white to-[#7c3aed]/5">
          <div className="max-w-4xl mx-auto w-full text-center space-y-6 my-auto">
            {/* Header branding */}
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1a4fba] to-[#7c3aed] flex items-center justify-center mx-auto shadow-xl shadow-blue-100">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-black text-[#0f1c2e] tracking-tight">KSSF Unified Mockup Platform</h1>
                <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
                  Kerala School Startup Foundation - Connecting high-school innovators, academic advisors, and state government coordinators.
                </p>
              </div>
            </div>

            {/* Gateway Role Selector Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              {/* Student Portal Selector */}
              <div className="bg-white rounded-2xl border border-[#1a4fba]/10 p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between text-left space-y-6 group">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-[#1a4fba] group-hover:text-white transition-colors shadow-inner">
                    <UserCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#0f1c2e]">Student Portal</h3>
                    <p className="text-[11px] text-muted-foreground font-semibold uppercase mt-0.5">Ryan Koshy (XII)</p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Submit new ideas, manage milestone checkmarks, view opportunities, book mentoring sessions, and share certified credentials.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setRole("student");
                    setStudentNav("Dashboard");
                  }}
                  className="w-full py-2.5 bg-blue-50 text-primary group-hover:bg-[#1a4fba] group-hover:text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                >
                  Enter Console <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Mentor Workspace Selector */}
              <div className="bg-white rounded-2xl border border-[#1a4fba]/10 p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between text-left space-y-6 group">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-[#1a9e6e] group-hover:text-white transition-colors shadow-inner">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#0f1c2e]">Mentor Workspace</h3>
                    <p className="text-[11px] text-muted-foreground font-semibold uppercase mt-0.5">Dr. Anita Nair (IIT-T)</p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Vet student abstracts, approve prototypes for incubation, request revision iterations, and chat live with assigned student groups.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setRole("mentor");
                    setMentorNav("Dashboard");
                  }}
                  className="w-full py-2.5 bg-emerald-50 text-emerald-700 group-hover:bg-[#1a9e6e] group-hover:text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                >
                  Enter Workspace <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Government Admin Selector */}
              <div className="bg-white rounded-2xl border border-[#1a4fba]/10 p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between text-left space-y-6 group">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 group-hover:bg-[#7c3aed] group-hover:text-white transition-colors shadow-inner">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#0f1c2e]">Admin Command</h3>
                    <p className="text-[11px] text-muted-foreground font-semibold uppercase mt-0.5">State Administrator</p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Track district innovation score rankings, approve student startup grants, allocate advisors to new ideas, and publish state opportunities.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setRole("admin");
                    setAdminNav("Dashboard");
                  }}
                  className="w-full py-2.5 bg-violet-50 text-violet-700 group-hover:bg-[#7c3aed] group-hover:text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                >
                  Launch Console <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* State Synchronized Alert Box */}
            <div className="bg-slate-50 border border-[#1a4fba]/10 p-4 rounded-2xl max-w-lg mx-auto text-xs text-muted-foreground flex gap-3 text-left">
              <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#0f1c2e] block">Synched Prototype Engine Active</span>
                Actions taken inside any role dashboard (e.g. submitting an idea, booking slots, launching events) will dynamically propagate state metrics across all other roles instantly!
              </div>
            </div>
          </div>

          <footer className="text-center text-[10px] text-muted-foreground font-semibold mt-12">
            © 2025 Kerala School Startup Foundation (KSSF) · Government of Kerala
          </footer>
        </div>
      )}

      {/* ========================================================== */}
      {/* 1. STUDENT PORTAL DASHBOARD VIEW */}
      {role === "student" && (
        <div>
          {/* HEADER NAV REPLACEMENT SUB-ITEMS FOR STUDENT */}
          <div className="max-w-[1400px] mx-auto px-6 pt-5">
            <nav className="flex items-center gap-1 bg-white border border-[#1a4fba]/5 rounded-2xl p-1.5 shadow-sm max-w-fit">
              {[
                { id: "Dashboard", label: "Dashboard Overview", icon: LayoutDashboard },
                { id: "My Projects", label: "My Projects", icon: FolderKanban },
                { id: "Competitions", label: "Competitions & Events", icon: Trophy },
                { id: "Mentors", label: "Mentors Corner", icon: Users },
                { id: "Portfolio", label: "My Portfolio", icon: Briefcase },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    setStudentNav(id);
                    setSelectedProject(null);
                  }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 ${
                    studentNav === id
                      ? "bg-[#1a4fba] text-white shadow"
                      : "text-[#5a6a85] hover:text-[#0f1c2e] hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          <main className="max-w-[1400px] mx-auto px-6 py-6 space-y-6">
            {studentNav === "Dashboard" && (
              <div className="space-y-6">
                {/* WELCOME BAR */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#1a4fba]/5 shadow-sm">
                  <div>
                    <h1 className="text-xl font-extrabold text-[#0f1c2e] leading-tight">
                      Welcome back, Ryan 👋
                    </h1>
                    <p className="text-xs text-[#5a6a85] mt-1 font-medium">
                      Reviewing state dashboard updates. Next scheduled goal:{" "}
                      <span className="text-[#1a4fba] font-bold underline cursor-pointer hover:text-blue-700" onClick={() => {
                        setStudentNav("My Projects");
                        const agro = projects.find(p => p.id === "proj-1");
                        if (agro) setSelectedProject(agro);
                      }}>Prototype Live Testing</span> on AgroSense.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowIdeaModal(true)}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-[#1a4fba] text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Submit New Idea
                    </button>
                    <button
                      onClick={() => setStudentNav("Mentors")}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-white text-[#0f1c2e] border border-border rounded-xl text-xs font-semibold hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      <Video className="w-4 h-4 text-[#1a9e6e]" />
                      Schedule Mentor session
                    </button>
                  </div>
                </div>

                {/* SUMMARY STAT CARDS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div onClick={() => setStudentNav("My Projects")} className="bg-white rounded-2xl border border-[#1a4fba]/5 p-4 shadow-sm hover:shadow-md hover:border-[#1a4fba]/20 transition-all cursor-pointer group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 transition-colors group-hover:bg-[#1a4fba] group-hover:text-white">
                        <FolderKanban className="w-5 h-5" />
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#5a6a85] group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="text-[10px] text-[#5a6a85] uppercase tracking-wider font-bold">Active Projects</div>
                    <div className="text-2xl font-extrabold text-[#0f1c2e] mt-1">{projects.filter(p => p.studentName === "Ryan Koshy").length}</div>
                    <div className="text-[11px] text-[#5a6a85] font-medium mt-1">
                      {projects.filter(p => p.studentName === "Ryan Koshy" && p.status === "In Progress").length} in progress
                    </div>
                  </div>

                  <div onClick={() => setStudentNav("Mentors")} className="bg-white rounded-2xl border border-[#1a4fba]/5 p-4 shadow-sm hover:shadow-md hover:border-[#1a4fba]/20 transition-all cursor-pointer group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-[#1a9e6e] group-hover:text-white transition-colors">
                        <UserCircle className="w-5 h-5" />
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#5a6a85] group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="text-[10px] text-[#5a6a85] uppercase tracking-wider font-bold">Assigned Mentor</div>
                    <div className="text-[14px] font-extrabold text-[#0f1c2e] mt-1 leading-tight">Dr. Anita Nair</div>
                    <div className="text-[11px] text-[#5a6a85] font-medium mt-1">IIT Trivandrum · AgriTech</div>
                  </div>

                  <div onClick={() => {
                    setStudentNav("My Projects");
                    const agro = projects.find(p => p.id === "proj-1");
                    if (agro) setSelectedProject(agro);
                  }} className="bg-white rounded-2xl border border-[#1a4fba]/5 p-4 shadow-sm hover:shadow-md hover:border-[#1a4fba]/20 transition-all cursor-pointer group">
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 group-hover:bg-[#7c3aed] group-hover:text-white transition-colors">
                        <Zap className="w-5 h-5" />
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#5a6a85] group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="text-[10px] text-[#5a6a85] uppercase tracking-wider font-bold">AgroSense Journey</div>
                    <div className="text-[14px] font-extrabold text-[#0f1c2e] mt-1">Stage: {projects.find(p => p.id === "proj-1")?.stage}</div>
                    <div className="text-[11px] text-[#5a6a85] font-medium mt-1">
                      Prototype · {projects.find(p => p.id === "proj-1")?.progress}% completed
                    </div>
                  </div>

                  <div onClick={() => setStudentNav("Competitions")} className="bg-white rounded-2xl border border-[#1a4fba]/5 p-4 shadow-sm hover:shadow-md hover:border-[#1a4fba]/20 transition-all cursor-pointer group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#5a6a85] group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="text-[10px] text-[#5a6a85] uppercase tracking-wider font-bold">Upcoming Opportunities</div>
                    <div className="text-2xl font-extrabold text-[#0f1c2e] mt-1">{events.filter(e => !e.registered).length} open</div>
                    <div className="text-[11px] text-[#5a6a85] font-medium mt-1">
                      {registeredEventsCount} registered active entries
                    </div>
                  </div>
                </div>

                {/* DYNAMIC INNOVATION SCORE BREAKDOWN */}
                <div className="bg-white rounded-2xl border border-[#1a4fba]/5 shadow-sm p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-border pb-3">
                    <div>
                      <h2 className="text-xs font-bold text-[#0f1c2e] flex items-center gap-2">
                        <Award className="w-4 h-4 text-primary" />
                        Innovation Score & Competency Vetting
                      </h2>
                      <p className="text-[10px] text-[#5a6a85] font-semibold mt-0.5">
                        Multi-dimensional progress index and advisor-verified accomplishments
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-[#1a9e6e] bg-emerald-50 px-2.5 py-0.5 rounded-full">
                        ● State Vetted: Term 2024–25
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    {/* Left: Radial Score Gauge */}
                    <div className="flex flex-col items-center justify-center p-4 border-r border-[#1a4fba]/10">
                      <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          {/* Background circle */}
                          <circle cx="64" cy="64" r="50" stroke="#f0f2f6" strokeWidth="10" fill="transparent" />
                          {/* Foreground progress circle */}
                          <circle
                            cx="64"
                            cy="64"
                            r="50"
                            stroke="url(#gauge-grad)"
                            strokeWidth="10"
                            fill="transparent"
                            strokeDasharray={2 * Math.PI * 50}
                            strokeDashoffset={2 * Math.PI * 50 * (1 - 0.94)}
                            strokeLinecap="round"
                          />
                          <defs>
                            <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#1a4fba" />
                              <stop offset="100%" stopColor="#1a9e6e" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute text-center">
                          <span className="text-3xl font-black text-[#0f1c2e] block leading-none">94</span>
                          <span className="text-[8px] uppercase tracking-wider font-extrabold text-muted-foreground block mt-1">Score Index</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-[#1a4fba] bg-[#eef3fc] px-3 py-1 rounded-lg mt-3 block">
                        Top 12% statewide
                      </span>
                    </div>

                    {/* Center: Dimensions progress */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase block border-b border-border pb-1">Verified Dimensions</span>
                      {[
                        { label: "Ideation Vetting", score: 100, color: "bg-emerald-600" },
                        { label: "Technical Feasibility", score: 95, color: "bg-blue-600" },
                        { label: "Prototype Implementations", score: 88, color: "bg-[#7c3aed]" },
                        { label: "User validation studies", score: 92, color: "bg-amber-500" },
                      ].map((dim, idx) => (
                        <div key={idx} className="space-y-1 text-xs">
                          <div className="flex justify-between font-semibold text-[#5a6a85]">
                            <span>{dim.label}</span>
                            <span className="font-bold text-[#0f1c2e]">{dim.score}/100</span>
                          </div>
                          <ProgressBar value={dim.score} color={dim.color} />
                        </div>
                      ))}
                    </div>

                    {/* Right: Mentor Validations Timeline */}
                    <div className="space-y-3 p-3 bg-slate-50/50 rounded-2xl border border-border/40 h-full flex flex-col justify-between">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase block border-b border-border pb-1">Recent Vettings</span>
                      <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[140px] pt-1">
                        <div className="flex gap-2.5 items-start">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <div className="leading-tight">
                            <span className="text-[10px] font-bold text-[#0f1c2e] block">AgroSense Power draw vetted</span>
                            <span className="text-[9px] text-muted-foreground font-semibold block">By Dr. Anita Nair · 2h ago</span>
                          </div>
                        </div>
                        <div className="flex gap-2.5 items-start">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <div className="leading-tight">
                            <span className="text-[10px] font-bold text-[#0f1c2e] block">EduReach validation report approved</span>
                            <span className="text-[9px] text-muted-foreground font-semibold block">By Mr. Ravi Menon · Yesterday</span>
                          </div>
                        </div>
                        <div className="flex gap-2.5 items-start">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <div className="leading-tight">
                            <span className="text-[10px] font-bold text-[#0f1c2e] block">WasteMap abstract vetted</span>
                            <span className="text-[9px] text-muted-foreground font-semibold block">By Ms. Priya Suresh · 3 days ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PROJECTS TABLE & RECENT OPPORTUNITIES */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    {/* Projects list */}
                    <div className="bg-white rounded-2xl border border-[#1a4fba]/5 shadow-sm overflow-hidden">
                      <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-[#f4f6fb]/25">
                        <span className="font-extrabold text-xs text-[#0f1c2e]">Recent Innovation Submissions</span>
                        <button onClick={() => setStudentNav("My Projects")} className="text-xs text-primary font-bold hover:underline">
                          View details
                        </button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-[#f4f6fb]/30 border-b border-border text-[9px] uppercase tracking-wider text-muted-foreground font-bold">
                              <th className="px-5 py-3">Project Title</th>
                              <th className="px-4 py-3">Category</th>
                              <th className="px-4 py-3">Mentor</th>
                              <th className="px-4 py-3">Progress</th>
                              <th className="px-5 py-3 text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#1a4fba]/5">
                            {projects.filter(p => p.studentName === "Ryan Koshy").map((proj) => (
                              <tr key={proj.id} onClick={() => {
                                setStudentNav("My Projects");
                                setSelectedProject(proj);
                              }} className="hover:bg-blue-50/20 cursor-pointer transition-colors">
                                <td className="px-5 py-4">
                                  <span className="text-xs font-bold text-[#0f1c2e] block leading-snug">{proj.name}</span>
                                  <span className="text-[9px] text-muted-foreground block mt-0.5">{proj.stage} phase</span>
                                </td>
                                <td className="px-4 py-4">
                                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-100 text-muted-foreground">{proj.domain}</span>
                                </td>
                                <td className="px-4 py-4 text-xs font-semibold text-muted-foreground">{proj.mentor}</td>
                                <td className="px-4 py-4 min-w-[120px]">
                                  <div className="flex items-center gap-2">
                                    <ProgressBar value={proj.progress} color="bg-primary" />
                                    <span className="text-[10px] font-bold text-muted-foreground">{proj.progress}%</span>
                                  </div>
                                </td>
                                <td className="px-5 py-4 text-right">
                                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${proj.statusColor}`}>{proj.status}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Competitions */}
                    <div className="bg-white rounded-2xl border border-[#1a4fba]/5 shadow-sm overflow-hidden">
                      <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-[#f4f6fb]/25">
                        <span className="font-extrabold text-xs text-[#0f1c2e]">Featured Contests</span>
                        <button onClick={() => setStudentNav("Competitions")} className="text-xs text-primary font-bold hover:underline">
                          Open Opportunities
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
                        {events.slice(0, 2).map((ev) => (
                          <div key={ev.id} onClick={() => setViewingCompetition(ev)} className="p-5 hover:bg-slate-50/50 cursor-pointer flex flex-col justify-between">
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-primary">
                                <ev.icon className="w-5 h-5" />
                              </div>
                              <div>
                                <span className="text-[9px] font-bold text-primary uppercase">{ev.tag}</span>
                                <h3 className="text-xs font-bold text-[#0f1c2e] leading-snug mt-0.5">{ev.title}</h3>
                                <p className="text-[10px] text-muted-foreground mt-1">📅 {ev.date}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between border-t border-border/40 pt-3 mt-4">
                              <span className="text-[10px] text-muted-foreground font-semibold">{ev.daysLeft}d left</span>
                              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${ev.registered ? "bg-emerald-100 text-emerald-800" : "bg-blue-50 text-primary"}`}>
                                {ev.registered ? "Registered" : "Register Seat"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sidebar stats/sessions */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-[#1a4fba]/5 shadow-sm p-4 space-y-4">
                      <span className="text-xs font-extrabold text-[#0f1c2e] block pb-2 border-b border-border">Advisor Corner</span>
                      {mentors.slice(0, 2).map((m, idx) => (
                        <div key={idx} onClick={() => { setActiveMentorIdx(idx); setStudentNav("Mentors"); }} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-all">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-xs">{m.avatar}</div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-[#0f1c2e] truncate">{m.name}</h4>
                            <p className="text-[10px] text-muted-foreground truncate">{m.role}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      ))}
                    </div>

                    <div className="bg-white rounded-2xl border border-[#1a4fba]/5 shadow-sm p-4 space-y-3.5">
                      <span className="text-xs font-extrabold text-[#0f1c2e] block pb-2 border-b border-border">Meeting Slots</span>
                      {sessions.filter(s => s.studentName === "Ryan Koshy").map((sess) => (
                        <div key={sess.id} className="bg-blue-50/50 border border-blue-100/20 rounded-xl p-3">
                          <div className="flex justify-between items-center text-[9px] font-bold text-primary">
                            <span>{sess.mode}</span>
                            <span>{sess.date}</span>
                          </div>
                          <h4 className="text-xs font-extrabold text-[#0f1c2e] mt-2 leading-snug">{sess.topic}</h4>
                          <span className="text-[10px] text-muted-foreground block mt-1">Advisor: {sess.mentor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-PAGES OF STUDENT DASHBOARD */}
            {studentNav === "My Projects" && (
              <div className="space-y-6">
                {/* Same projects template */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-4">
                    {projects.filter(p => p.studentName === "Ryan Koshy").map((proj) => (
                      <div key={proj.id} onClick={() => setSelectedProject(proj)} className={`bg-white rounded-2xl border p-5 shadow-sm transition-all cursor-pointer ${selectedProject?.id === proj.id ? "border-primary ring-2 ring-blue-100" : "border-[#1a4fba]/5 hover:shadow-md"}`}>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-[#eef1f7] text-[#5a6a85] mr-2">{proj.domain}</span>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-blue-50 text-primary">Stage: {proj.stage}</span>
                            <h3 className="text-sm font-extrabold text-[#0f1c2e] mt-2">{proj.name}</h3>
                            <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{proj.desc}</p>
                          </div>
                          <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full ${proj.statusColor}`}>{proj.status}</span>
                        </div>
                        <div className="mt-5 space-y-2">
                          <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
                            <span>Milestone Progress</span>
                            <span>{proj.progress}%</span>
                          </div>
                          <ProgressBar value={proj.progress} color="bg-primary" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white rounded-2xl border border-[#1a4fba]/5 p-5 shadow-sm h-fit">
                    {selectedProject ? (
                      <div className="space-y-5">
                        <div className="flex justify-between items-start border-b border-border pb-3">
                          <div>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-blue-50 text-primary">{selectedProject.domain}</span>
                            <h3 className="text-sm font-extrabold text-[#0f1c2e] mt-1.5 leading-snug">{selectedProject.name}</h3>
                          </div>
                          <button onClick={() => setSelectedProject(null)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="space-y-3.5 text-xs">
                          <div>
                            <span className="font-bold text-[#0f1c2e] block">Abstract Scope</span>
                            <p className="text-muted-foreground leading-relaxed mt-1">{selectedProject.desc}</p>
                          </div>
                          <div className="bg-[#f4f6fb]/50 p-2.5 rounded-xl border border-border">
                            <span className="text-[9px] font-bold text-muted-foreground uppercase">Tech Stack Frameworks</span>
                            <span className="font-mono text-[10px] block mt-1 font-bold">🛠️ {selectedProject.tech}</span>
                          </div>
                        </div>

                        {/* Interactive checklist */}
                        <div className="space-y-3 pt-3 border-t border-border">
                          <span className="font-bold text-xs text-[#0f1c2e] block">Innovation Milestone Checklist</span>
                          <div className="space-y-2">
                            {selectedProject.tasks.map((task, idx) => (
                              <div key={idx} onClick={() => toggleProjectTask(selectedProject.id, idx)} className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-[#1a4fba]/5 transition-all">
                                <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${task.done ? "bg-[#1a4fba] border-[#1a4fba] text-white" : "border-[#1a4fba]/30 bg-white"}`}>
                                  {task.done && <Check className="w-3 h-3 font-bold" />}
                                </div>
                                <span className={`text-[11px] leading-snug font-medium ${task.done ? "line-through text-muted-foreground" : "text-[#0f1c2e]"}`}>{task.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="py-12 text-center text-muted-foreground">
                        <FolderKanban className="w-10 h-10 mx-auto text-slate-300" />
                        <h4 className="text-xs font-bold text-[#0f1c2e] mt-3">Select Project Submission</h4>
                        <p className="text-[10px] mt-1">Select an active card to edit checklists and review mentor details.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {studentNav === "Competitions" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.map((ev) => (
                  <div key={ev.id} className="bg-white rounded-2xl border border-[#1a4fba]/5 p-5 shadow-sm hover:shadow flex flex-col justify-between relative">
                    {ev.registered && (
                      <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                        <Check className="w-3 h-3" /> Registered
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-primary"><ev.icon className="w-5 h-5" /></div>
                        <div>
                          <span className="text-[9px] font-bold text-primary uppercase">{ev.tag}</span>
                          <h3 className="text-xs font-bold text-[#0f1c2e] mt-0.5">{ev.title}</h3>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-2">{ev.desc}</p>
                      <div className="border-t border-border mt-4 pt-3 space-y-1.5 text-xs text-muted-foreground">
                        <div>📅 Date: <span className="font-semibold text-[#0f1c2e]">{ev.date}</span></div>
                        <div>📍 Venue: <span className="font-semibold text-[#0f1c2e]">{ev.location}</span></div>
                        <div>🏆 Award Pool: <span className="font-bold text-[#1a9e6e]">{ev.prizes}</span></div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-5">
                      <button onClick={() => setViewingCompetition(ev)} className="flex-1 py-2 px-3 border border-border hover:bg-slate-100 rounded-xl text-xs font-bold cursor-pointer text-[#0f1c2e]">Vet Guidelines</button>
                      <button onClick={() => handleRegisterEvent(ev.id)} disabled={ev.registered} className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold cursor-pointer shadow-sm ${ev.registered ? "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-not-allowed" : "bg-primary hover:bg-blue-700 text-white"}`}>
                        {ev.registered ? "Seat Booked ✓" : "Register Seat"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {studentNav === "Mentors" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <span className="text-xs font-bold text-[#0f1c2e] block">Select Advisor Chatroom</span>
                  {mentors.map((m, idx) => (
                    <div key={idx} onClick={() => setActiveMentorIdx(idx)} className={`bg-white rounded-2xl border p-4 shadow-sm hover:shadow cursor-pointer flex items-center justify-between ${idx === activeMentorIdx ? "border-primary ring-2 ring-blue-100" : "border-[#1a4fba]/5"}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1a9e6e] to-[#1a4fba] text-white flex items-center justify-center font-bold text-xs">{m.avatar}</div>
                        <div>
                          <h4 className="text-xs font-extrabold text-[#0f1c2e] flex items-center gap-1.5">{m.name}{idx === 0 && <span className="text-[8px] bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded font-bold">Primary</span>}</h4>
                          <span className="text-[10px] text-muted-foreground font-semibold block mt-0.5 truncate max-w-[150px]">{m.role}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#5a6a85]" />
                    </div>
                  ))}

                  {/* Meeting Booking Calendar Widget */}
                  <div className="bg-white rounded-2xl border border-[#1a4fba]/5 p-4 shadow-sm space-y-4">
                    <span className="text-xs font-bold text-[#0f1c2e] block">Book Live Call Slot ({mentors[activeMentorIdx].name})</span>
                    <form onSubmit={handleBookSession} className="space-y-3">
                      <div>
                        <label className="text-[9px] uppercase font-bold text-muted-foreground block mb-1">Select Date</label>
                        <select value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} className="w-full text-xs border border-border bg-white rounded-lg p-2 cursor-pointer">
                          <option value="Jul 11, 2025">Jul 11, 2025 (Fri)</option>
                          <option value="Jul 14, 2025">Jul 14, 2025 (Mon)</option>
                          <option value="Jul 15, 2025">Jul 15, 2025 (Tue)</option>
                          <option value="Jul 17, 2025">Jul 17, 2025 (Thu)</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] uppercase font-bold text-muted-foreground block mb-1">Time</label>
                          <select value={bookingTime} onChange={(e) => setBookingTime(e.target.value)} className="w-full text-xs border border-border bg-white rounded-lg p-2 cursor-pointer">
                            <option value="10:00 AM">10:00 AM</option>
                            <option value="11:30 AM">11:30 AM</option>
                            <option value="02:00 PM">02:00 PM</option>
                            <option value="04:00 PM">04:00 PM</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[9px] uppercase font-bold text-muted-foreground block mb-1">Mode</label>
                          <select value={bookingMode} onChange={(e) => setBookingMode(e.target.value)} className="w-full text-xs border border-border bg-white rounded-lg p-2 cursor-pointer">
                            <option value="Google Meet">Google Meet</option>
                            <option value="Zoom Link">Zoom Link</option>
                            <option value="MS Teams">MS Teams</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-[9px] uppercase font-bold text-muted-foreground block mb-1">Agenda / Topic</label>
                        <input type="text" value={bookingTopic} onChange={(e) => setBookingTopic(e.target.value)} placeholder="e.g. ESP32 sleep drawing issues" className="w-full text-xs border border-border rounded-lg px-2.5 py-2" />
                      </div>
                      <button type="submit" className="w-full py-2 bg-primary hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow cursor-pointer">Confirm Booking Slot</button>
                    </form>
                  </div>
                </div>

                {/* Chat window */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-[#1a4fba]/5 shadow-sm flex flex-col justify-between h-[520px]">
                  <div className="px-5 py-3 border-b border-border bg-[#f4f6fb]/25 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">{mentors[activeMentorIdx].avatar}</div>
                      <div>
                        <h4 className="text-xs font-bold text-[#0f1c2e]">{mentors[activeMentorIdx].name}</h4>
                        <span className="text-[9px] text-emerald-600 font-bold block">Online</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/30">
                    <div className="bg-[#eef3fc]/60 p-3 rounded-xl border border-blue-100 text-xs text-center max-w-sm mx-auto text-muted-foreground">
                      <span className="font-bold text-[#0f1c2e] block mb-1">About {mentors[activeMentorIdx].name}</span>
                      {mentors[activeMentorIdx].bio}
                    </div>
                    {mentors[activeMentorIdx].chatHistory.map((ch, idx) => (
                      <div key={idx} className={`flex ${ch.sender === "student" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[70%] p-3 rounded-2xl text-xs leading-relaxed ${ch.sender === "student" ? "bg-primary text-white rounded-br-none" : "bg-white text-[#0f1c2e] rounded-bl-none shadow border border-slate-100"}`}>
                          <p>{ch.text}</p>
                          <span className={`text-[8px] block mt-1 text-right ${ch.sender === "student" ? "text-white/60" : "text-muted-foreground"}`}>{ch.time}</span>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow border border-slate-100 flex items-center gap-1 text-[9px] font-bold text-muted-foreground">
                          <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" />
                          <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
                          <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.4s]" />
                          <span>Adviser is typing...</span>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                  <form onSubmit={handleSendMessage} className="p-3 border-t border-border flex gap-2 bg-[#f4f6fb]/20">
                    <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Type a message (e.g. esp32 power draw, pitch help)..." className="flex-1 text-xs border border-border bg-white rounded-xl px-3 py-2.5" />
                    <button type="submit" className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow cursor-pointer"><Send className="w-4 h-4" /></button>
                  </form>
                </div>
              </div>
            )}

            {studentNav === "Portfolio" && (
              <div className="space-y-6">
                {/* PAGE HEADER */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-extrabold text-[#0f1c2e]">Student Showcase Portfolio</h2>
                    <p className="text-[10px] text-muted-foreground font-semibold">Publicly shareable profile verified by KSSF coordinators</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleSharePortfolio} className="flex items-center gap-1.5 px-3 py-2 bg-white border border-border hover:bg-slate-50 text-[#0f1c2e] text-xs font-bold rounded-xl cursor-pointer shadow-sm">
                      <Share2 className="w-4 h-4 text-[#1a4fba]" /> Share URL
                    </button>
                    <button onClick={handleDownloadPDF} className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm">
                      <Download className="w-4 h-4" /> Export Resume
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* LEFT SIDEBAR: PROFILE & BADGES */}
                  <div className="space-y-6">
                    {/* Profile Card */}
                    <div className="bg-white rounded-2xl border border-[#1a4fba]/5 shadow-sm overflow-hidden text-center pb-6">
                      {/* Decorative banner */}
                      <div className="h-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
                      {/* Avatar */}
                      <div className="relative -mt-10 mb-3 inline-block">
                        <div className="w-20 h-20 bg-gradient-to-tr from-primary to-[#7c3aed] text-white flex items-center justify-center font-black text-2xl rounded-full border-4 border-white shadow-md mx-auto">
                          RY
                        </div>
                        <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-[9px] text-white font-bold" title="Verified Innovator">
                          ✓
                        </span>
                      </div>
                      <div className="px-5">
                        <h3 className="text-sm font-black text-[#0f1c2e] flex items-center justify-center gap-1">
                          Ryan Koshy
                          <span className="text-blue-600">●</span>
                        </h3>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase mt-0.5">High School Innovator</p>
                        <p className="text-xs text-muted-foreground bg-slate-50 p-3.5 rounded-xl leading-relaxed mt-4">
                          "Developing agricultural IoT telemetry nodes and edge servers for village sensor networks."
                        </p>
                        
                        {/* Meta grid */}
                        <div className="grid grid-cols-2 gap-2 text-left text-xs pt-4 border-t border-border mt-4 text-[#5a6a85] font-semibold">
                          <div>
                            <span className="text-[8px] text-muted-foreground uppercase block font-extrabold">School</span>
                            <span className="text-[#0f1c2e] text-[11px] truncate block">GHSS Kochi</span>
                          </div>
                          <div>
                            <span className="text-[8px] text-muted-foreground uppercase block font-extrabold">District</span>
                            <span className="text-[#0f1c2e] text-[11px] block">Ernakulam</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Badge cabinet */}
                    <div className="bg-white rounded-2xl border border-[#1a4fba]/5 p-5 shadow-sm space-y-4">
                      <span className="text-xs font-bold text-[#0f1c2e] block border-b border-border pb-2">Academic & Innovation Badges</span>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-amber-50/70 border border-amber-100/60 p-3 rounded-xl flex flex-col items-center text-center gap-1 hover:bg-amber-50 transition-colors">
                          <Lightbulb className="w-5 h-5 text-amber-500" />
                          <span className="font-bold text-[#0f1c2e]">Ideator</span>
                          <span className="text-[8px] text-muted-foreground">Submit 3+ Abstracts</span>
                        </div>
                        <div className="bg-blue-50/70 border border-blue-100/60 p-3 rounded-xl flex flex-col items-center text-center gap-1 hover:bg-blue-50 transition-colors">
                          <Rocket className="w-5 h-5 text-blue-500" />
                          <span className="font-bold text-[#0f1c2e]">Builder</span>
                          <span className="text-[8px] text-muted-foreground">MVP Validated</span>
                        </div>
                        <div className="bg-violet-50/70 border border-violet-100/60 p-3 rounded-xl flex flex-col items-center text-center gap-1 hover:bg-violet-50 transition-colors">
                          <Milestone className="w-5 h-5 text-violet-500" />
                          <span className="font-bold text-[#0f1c2e]">Pioneer</span>
                          <span className="text-[8px] text-muted-foreground">Incubation Ready</span>
                        </div>
                        <div className="bg-emerald-50/70 border border-emerald-100/60 p-3 rounded-xl flex flex-col items-center text-center gap-1 hover:bg-emerald-50 transition-colors">
                          <Award className="w-5 h-5 text-emerald-600" />
                          <span className="font-bold text-[#0f1c2e]">Pitcher</span>
                          <span className="text-[8px] text-muted-foreground">State Finalist</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT CONTENT AREA */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Strengths & Endorsements */}
                    <div className="bg-white rounded-2xl border border-[#1a4fba]/5 p-5 shadow-sm space-y-4">
                      <span className="text-xs font-bold text-[#0f1c2e] block border-b border-border pb-2">Advisor-Endorsed Competencies</span>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-xs text-muted-foreground font-semibold mb-1">
                            <span>IoT Circuit Prototyping (Arduino / ESP32)</span>
                            <span className="text-[#0f1c2e] font-bold">90%</span>
                          </div>
                          <ProgressBar value={90} color="bg-blue-600" />
                          <span className="text-[8px] text-muted-foreground block mt-1">✓ Endorsed by primary advisor: <strong>Dr. Anita Nair (IIT-T)</strong></span>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs text-[#5a6a85] font-semibold mb-1">
                            <span>JS App Development (React / Tailwind)</span>
                            <span className="text-[#0f1c2e] font-bold">82%</span>
                          </div>
                          <ProgressBar value={82} color="bg-primary" />
                          <span className="text-[8px] text-muted-foreground block mt-1">✓ Endorsed by coding coach: <strong>Mr. Ravi Menon</strong></span>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs text-[#5a6a85] font-semibold mb-1">
                            <span>User Need Analysis & Prototyping</span>
                            <span className="text-[#0f1c2e] font-bold">94%</span>
                          </div>
                          <ProgressBar value={94} color="bg-emerald-600" />
                          <span className="text-[8px] text-muted-foreground block mt-1">✓ Vetted by State Vetting Board: <strong>Incubation Ready</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Projects Showcase Cards */}
                    <div className="bg-white rounded-2xl border border-[#1a4fba]/5 p-5 shadow-sm space-y-4">
                      <span className="text-xs font-bold text-[#0f1c2e] block border-b border-border pb-2">Vetted Innovation Projects</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {projects.filter(p => p.studentName === "Ryan Koshy").map((proj) => (
                          <div key={proj.id} className="border border-border/80 rounded-2xl p-4 flex flex-col justify-between hover:shadow-sm hover:border-[#1a4fba]/10 transition-all bg-slate-50/20">
                            <div>
                              <div className="flex justify-between items-start gap-2">
                                <span className="text-[9px] font-bold px-2 py-0.5 bg-blue-50 text-[#1a4fba] rounded-full uppercase">{proj.domain}</span>
                                <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${proj.statusColor}`}>{proj.status}</span>
                              </div>
                              <h4 className="text-xs font-extrabold text-[#0f1c2e] mt-2 leading-snug">{proj.name}</h4>
                              <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{proj.desc}</p>
                            </div>
                            <div className="border-t border-slate-100/60 pt-3 mt-4 flex items-center justify-between text-[9px] font-bold text-muted-foreground">
                              <span>Advisor: {proj.mentor}</span>
                              <span className="text-[#0f1c2e]">{proj.progress}% Done</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Verified Digital Credentials */}
                    <div className="bg-white rounded-2xl border border-[#1a4fba]/5 p-5 shadow-sm space-y-4">
                      <span className="text-xs font-bold text-[#0f1c2e] block border-b border-border pb-2">Verified KSSF Digital Credentials</span>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[
                          { title: "State AgriTech Ideation Award", issuer: "Kerala Startup Mission (KSUM)", date: "May 2025" },
                          { title: "Micro-Controller System Design", issuer: "IIT Trivandrum Research Lab", date: "Jun 2025" },
                          { title: "CleanTech Challenge Winner", issuer: "KSSF State Board", date: "Jul 2025" }
                        ].map((cert, idx) => (
                          <div key={idx} className="border border-[#1a4fba]/5 rounded-xl p-3 bg-slate-50/30 flex flex-col justify-between text-left space-y-3">
                            <div>
                              <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-2">
                                <Award className="w-4 h-4" />
                              </div>
                              <h4 className="text-[10px] font-extrabold text-[#0f1c2e] leading-snug">{cert.title}</h4>
                              <span className="text-[8px] text-muted-foreground block mt-1">{cert.issuer}</span>
                            </div>
                            <button
                              onClick={() => setViewingCertificate({ title: cert.title, issuer: cert.issuer })}
                              className="w-full py-1.5 bg-white border border-border hover:bg-slate-50 rounded-lg text-[9px] font-bold text-primary transition-all flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <span>View Certificate</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>
      )}

      {/* ========================================================== */}
      {/* 2. MENTOR WORKSPACE VIEW */}
      {role === "mentor" && (
        <div>
          {/* HEADER NAV REPLACEMENT FOR MENTOR */}
          <div className="max-w-[1400px] mx-auto px-6 pt-5">
            <nav className="flex items-center gap-1 bg-white border border-[#1a4fba]/5 rounded-2xl p-1.5 shadow-sm max-w-fit">
              {[
                { id: "Dashboard", label: "Overview Console", icon: LayoutDashboard },
                { id: "Students", label: "My Students", icon: Users },
                { id: "Projects", label: "Project Reviews", icon: FolderKanban },
                { id: "Meetings", label: "Scheduled Calls", icon: CalendarDays },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    setMentorNav(id);
                    setSelectedProject(null);
                  }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 ${
                    mentorNav === id
                      ? "bg-[#1a9e6e] text-white shadow"
                      : "text-[#5a6a85] hover:text-[#0f1c2e] hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          <main className="max-w-[1400px] mx-auto px-6 py-6 space-y-6">
            {mentorNav === "Dashboard" && (
              <div className="space-y-6">
                {/* MENTOR WELCOME CARD */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#1a4fba]/5 shadow-sm">
                  <div>
                    <h1 className="text-xl font-extrabold text-[#0f1c2e] leading-tight">
                      Welcome, Dr. Anita Nair 👨‍🏫
                    </h1>
                    <p className="text-xs text-[#5a6a85] mt-1 font-medium">
                      Manage innovation projects at GHSS Kochi and IIT Trivandrum incubator hubs.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setMentorNav("Meetings")}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-[#1a9e6e] text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Allocate Meeting Slot
                    </button>
                  </div>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div onClick={() => setMentorNav("Students")} className="bg-white rounded-2xl border border-[#1a4fba]/5 p-4 shadow-sm hover:shadow hover:border-emerald-500/20 cursor-pointer transition-all">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Assigned Students</span>
                    <h3 className="text-2xl font-black text-[#0f1c2e] mt-1">4</h3>
                    <p className="text-[10px] text-muted-foreground mt-1">Active from GHSS Kochi</p>
                  </div>

                  <div onClick={() => setMentorNav("Projects")} className="bg-white rounded-2xl border border-[#1a4fba]/5 p-4 shadow-sm hover:shadow hover:border-emerald-500/20 cursor-pointer transition-all">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Active Projects</span>
                    <h3 className="text-2xl font-black text-[#0f1c2e] mt-1">{projects.filter(p => p.mentor === "Dr. Anita Nair").length}</h3>
                    <p className="text-[10px] text-muted-foreground mt-1">IoT Telemetry & AgriTech</p>
                  </div>

                  <div onClick={() => setMentorNav("Meetings")} className="bg-white rounded-2xl border border-[#1a4fba]/5 p-4 shadow-sm hover:shadow hover:border-emerald-500/20 cursor-pointer transition-all">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Upcoming Sessions</span>
                    <h3 className="text-2xl font-black text-[#0f1c2e] mt-1">
                      {sessions.filter(s => s.mentor === "Dr. Anita Nair").length}
                    </h3>
                    <p className="text-[10px] text-muted-foreground mt-1">Next session: Thursday</p>
                  </div>

                  <div onClick={() => setMentorNav("Projects")} className="bg-white rounded-2xl border border-[#1a4fba]/5 p-4 shadow-sm hover:shadow hover:border-emerald-500/20 cursor-pointer transition-all animate-pulse">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Pending Vettings</span>
                    <h3 className="text-2xl font-black text-red-600 mt-1">
                      {projects.filter(p => p.mentor === "Dr. Anita Nair" && p.status === "Mentor Review").length}
                    </h3>
                    <p className="text-[10px] text-muted-foreground mt-1">Awaiting changes check</p>
                  </div>
                </div>

                {/* Main sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Assigned Students */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border border-[#1a4fba]/5 shadow-sm overflow-hidden">
                      <div className="px-5 py-4 border-b border-border bg-[#f4f6fb]/25 flex items-center justify-between">
                        <span className="font-extrabold text-xs text-[#0f1c2e]">Assigned Innovators Directory</span>
                        <button onClick={() => setMentorNav("Students")} className="text-xs text-emerald-700 font-bold hover:underline">View profiles</button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-[#f4f6fb]/30 border-b border-border text-[9px] uppercase tracking-wider text-muted-foreground font-bold">
                              <th className="px-5 py-3">Student</th>
                              <th className="px-4 py-3">Project Title</th>
                              <th className="px-4 py-3">Stage</th>
                              <th className="px-4 py-3">Progress</th>
                              <th className="px-5 py-3 text-right">Last Activity</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#1a4fba]/5">
                            {projects.filter(p => p.mentor === "Dr. Anita Nair").map((proj) => (
                              <tr key={proj.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-5 py-4">
                                  <span className="text-xs font-bold text-[#0f1c2e] block">{proj.studentName}</span>
                                  <span className="text-[9px] text-muted-foreground block">{proj.school}</span>
                                </td>
                                <td className="px-4 py-4 text-xs font-semibold text-[#0f1c2e]">{proj.name}</td>
                                <td className="px-4 py-4"><span className="text-[9px] font-bold px-2 py-0.5 rounded bg-blue-50 text-primary">{proj.stage}</span></td>
                                <td className="px-4 py-4 min-w-[120px]">
                                  <div className="flex items-center gap-2">
                                    <ProgressBar value={proj.progress} color="bg-emerald-600" />
                                    <span className="text-[10px] font-bold text-muted-foreground">{proj.progress}%</span>
                                  </div>
                                </td>
                                <td className="px-5 py-4 text-right text-xs text-muted-foreground">{proj.lastActivity}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Progress Analytics Chart */}
                    <div className="bg-white rounded-2xl border border-[#1a4fba]/5 p-5 shadow-sm space-y-4">
                      <span className="text-xs font-bold text-[#0f1c2e] block border-b border-border pb-2">Student Innovation Analytics</span>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-[#f4f6fb] p-4 rounded-xl border border-border">
                          <span className="text-2xl font-black text-primary">12</span>
                          <span className="text-[10px] text-muted-foreground font-bold block uppercase mt-1">Ideas Submitted</span>
                        </div>
                        <div className="bg-[#f4f6fb] p-4 rounded-xl border border-border">
                          <span className="text-2xl font-black text-emerald-600">58%</span>
                          <span className="text-[10px] text-muted-foreground font-bold block uppercase mt-1">Avg. Prototype Progress</span>
                        </div>
                        <div className="bg-[#f4f6fb] p-4 rounded-xl border border-border">
                          <span className="text-2xl font-black text-violet-600">8</span>
                          <span className="text-[10px] text-muted-foreground font-bold block uppercase mt-1">Contest Participants</span>
                        </div>
                      </div>

                      {/* Custom SVG Bar Graph Mockup */}
                      <div className="pt-4 space-y-2">
                        <span className="text-[10px] font-bold text-muted-foreground block uppercase">Regional Prototype Completion Rates</span>
                        <div className="h-28 flex items-end gap-5 px-6 pt-4 border-b border-l border-border/60">
                          <div className="flex-1 flex flex-col items-center gap-1.5">
                            <div className="w-full bg-[#1a4fba]/80 rounded-t-md transition-all hover:opacity-80" style={{ height: "68%" }} />
                            <span className="text-[9px] text-muted-foreground font-bold">Ernakulam</span>
                          </div>
                          <div className="flex-1 flex flex-col items-center gap-1.5">
                            <div className="w-full bg-emerald-600/80 rounded-t-md transition-all hover:opacity-80" style={{ height: "42%" }} />
                            <span className="text-[9px] text-muted-foreground font-bold">Trivandrum</span>
                          </div>
                          <div className="flex-1 flex flex-col items-center gap-1.5">
                            <div className="w-full bg-violet-600/80 rounded-t-md transition-all hover:opacity-80" style={{ height: "18%" }} />
                            <span className="text-[9px] text-muted-foreground font-bold">Kozhikode</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar quick actions & reviews */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-[#1a4fba]/5 shadow-sm p-4 space-y-3.5">
                      <span className="text-xs font-extrabold text-[#0f1c2e] block pb-2 border-b border-border">Upcoming Mentor Calls</span>
                      {sessions.filter(s => s.mentor === "Dr. Anita Nair").map((sess) => (
                        <div key={sess.id} className="bg-emerald-50/40 border border-emerald-100/20 rounded-xl p-3">
                          <div className="flex justify-between items-center text-[9px] font-bold text-emerald-700">
                            <span>{sess.mode}</span>
                            <span>{sess.date}</span>
                          </div>
                          <h4 className="text-xs font-extrabold text-[#0f1c2e] mt-2 leading-snug">{sess.topic}</h4>
                          <span className="text-[10px] text-muted-foreground block mt-1">Student: {sess.studentName}</span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-white rounded-2xl border border-[#1a4fba]/5 p-4 space-y-3">
                      <span className="text-xs font-bold text-[#0f1c2e] block pb-2 border-b border-border">Quick Actions</span>
                      <div className="space-y-2">
                        <button onClick={() => setMentorNav("Meetings")} className="w-full py-2.5 bg-slate-50 border border-border text-[#0f1c2e] text-xs font-bold rounded-xl hover:bg-slate-100 transition-colors text-left px-3.5 flex items-center gap-2">
                          📅 Allocate Session
                        </button>
                        <button onClick={() => setMentorNav("Projects")} className="w-full py-2.5 bg-slate-50 border border-border text-[#0f1c2e] text-xs font-bold rounded-xl hover:bg-slate-100 transition-colors text-left px-3.5 flex items-center gap-2">
                          📂 Review Student Abstracts
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {mentorNav === "Students" && (
              <div className="space-y-6">
                <h2 className="text-sm font-extrabold text-[#0f1c2e]">Assigned Students Directory</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.filter(p => p.mentor === "Dr. Anita Nair").map((proj) => (
                    <div key={proj.id} className="bg-white rounded-2xl border border-[#1a4fba]/5 p-5 shadow-sm space-y-4 hover:shadow transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black text-sm">{proj.studentName.split(" ").map(w=>w[0]).join("")}</div>
                        <div>
                          <h3 className="text-xs font-black text-[#0f1c2e]">{proj.studentName}</h3>
                          <span className="text-[10px] text-muted-foreground block font-semibold">{proj.school}</span>
                        </div>
                      </div>
                      <div className="border-t border-border/60 pt-3 text-xs text-muted-foreground space-y-1.5">
                        <div>Active Project: <strong className="text-[#0f1c2e]">{proj.name}</strong></div>
                        <div>Framework Domain: <span className="font-bold px-2 py-0.5 rounded bg-slate-100 text-muted-foreground">{proj.domain}</span></div>
                        <div className="space-y-1 pt-2">
                          <div className="flex justify-between text-[10px] font-bold">
                            <span>Prototype Milestones Completed</span>
                            <span>{proj.progress}%</span>
                          </div>
                          <ProgressBar value={proj.progress} color="bg-emerald-600" />
                        </div>
                      </div>
                      <div className="pt-2 flex gap-2">
                        <button onClick={() => { setMentorNav("Projects"); setSelectedProject(proj); }} className="flex-1 py-1.5 border border-border hover:bg-slate-50 text-[10px] font-bold rounded-lg text-center text-[#0f1c2e] cursor-pointer">Vet Checklist</button>
                        <button onClick={() => {
                          const mIdx = mentors.findIndex(m => m.name === "Dr. Anita Nair");
                          if (mIdx !== -1) setActiveMentorIdx(mIdx);
                          setMentorNav("Meetings");
                        }} className="flex-1 py-1.5 bg-primary text-white text-[10px] font-bold rounded-lg text-center cursor-pointer shadow-sm">Send message</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {mentorNav === "Projects" && (
              <div className="space-y-6">
                <h2 className="text-sm font-extrabold text-[#0f1c2e]">Vet Pending Submissions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-4">
                    {projects.filter(p => p.mentor === "Dr. Anita Nair").map((proj) => (
                      <div key={proj.id} onClick={() => setSelectedProject(proj)} className={`bg-white rounded-2xl border p-5 shadow-sm transition-all cursor-pointer ${selectedProject?.id === proj.id ? "border-[#1a9e6e] ring-2 ring-emerald-100" : "border-[#1a4fba]/5 hover:shadow-md"}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-blue-50 text-primary">{proj.domain}</span>
                            <h3 className="text-sm font-black text-[#0f1c2e] mt-2">{proj.name}</h3>
                            <p className="text-[10px] text-[#5a6a85] font-semibold mt-1">Student: {proj.studentName} · {proj.school}</p>
                          </div>
                          <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full ${proj.statusColor}`}>{proj.status}</span>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <button onClick={(e) => { e.stopPropagation(); handleApprovePrototype(proj.id); }} className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg cursor-pointer shadow-sm">Approve Prototype</button>
                          <button onClick={(e) => { e.stopPropagation(); setChangeReqProjId(proj.id); setShowRequestChangesModal(true); }} className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold rounded-lg cursor-pointer shadow-sm">Request Changes</button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white rounded-2xl border border-[#1a4fba]/5 p-5 shadow-sm h-fit">
                    {selectedProject ? (
                      <div className="space-y-4">
                        <span className="text-xs font-bold text-[#0f1c2e] block pb-2 border-b border-border">Vetting Checklist Review</span>
                        <p className="text-[10px] text-muted-foreground">Vetted student: <strong>{selectedProject.studentName}</strong></p>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                          {selectedProject.tasks.map((task, idx) => (
                            <div key={idx} className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg">
                              <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${task.done ? "bg-emerald-600 border-emerald-600 text-white" : "border-border bg-white"}`}>
                                {task.done && <Check className="w-3 h-3 text-white font-bold" />}
                              </div>
                              <span className="text-[10px] font-medium leading-tight text-[#0f1c2e]">{task.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="py-12 text-center text-muted-foreground">
                        <FolderKanban className="w-10 h-10 mx-auto text-slate-300" />
                        <h4 className="text-xs font-bold text-[#0f1c2e] mt-3">Select Project Abstract</h4>
                        <p className="text-[10px] mt-1">Review the checklist tasks to approve or request changes.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {mentorNav === "Meetings" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl border border-[#1a4fba]/5 p-5 shadow-sm space-y-4">
                  <span className="text-xs font-bold text-[#0f1c2e] block">Book Live Call Slot</span>
                  <form onSubmit={handleBookSession} className="space-y-3">
                    <div>
                      <label className="text-[9px] uppercase font-bold text-muted-foreground block mb-1">Select Student</label>
                      <select value={bookingStudent} onChange={(e) => setBookingStudent(e.target.value)} className="w-full text-xs border border-border bg-white rounded-lg p-2 cursor-pointer">
                        {projects.filter(p => p.mentor === "Dr. Anita Nair").map((p, idx) => (
                          <option key={idx} value={p.studentName}>{p.studentName} ({p.name})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] uppercase font-bold text-muted-foreground block mb-1">Select Date</label>
                      <select value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} className="w-full text-xs border border-border bg-white rounded-lg p-2 cursor-pointer">
                        <option value="Jul 11, 2025">Jul 11, 2025 (Fri)</option>
                        <option value="Jul 14, 2025">Jul 14, 2025 (Mon)</option>
                        <option value="Jul 15, 2025">Jul 15, 2025 (Tue)</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] uppercase font-bold text-muted-foreground block mb-1">Time</label>
                        <select value={bookingTime} onChange={(e) => setBookingTime(e.target.value)} className="w-full text-xs border border-border bg-white rounded-lg p-2 cursor-pointer">
                          <option value="10:00 AM">10:00 AM</option>
                          <option value="11:30 AM">11:30 AM</option>
                          <option value="02:00 PM">02:00 PM</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] uppercase font-bold text-muted-foreground block mb-1">Mode</label>
                        <select value={bookingMode} onChange={(e) => setBookingMode(e.target.value)} className="w-full text-xs border border-border bg-white rounded-lg p-2 cursor-pointer">
                          <option value="Google Meet">Google Meet</option>
                          <option value="Zoom Link">Zoom Link</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-[9px] uppercase font-bold text-muted-foreground block mb-1">Agenda / Target</label>
                      <input type="text" value={bookingTopic} onChange={(e) => setBookingTopic(e.target.value)} placeholder="e.g. Vetting circuit schematics" className="w-full text-xs border border-border rounded-lg px-2.5 py-2" />
                    </div>
                    <button type="submit" className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow cursor-pointer">Request Session Link</button>
                  </form>
                </div>

                {/* Messaging bot window */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-[#1a4fba]/5 shadow-sm flex flex-col justify-between h-[500px]">
                  <div className="px-5 py-3.5 border-b border-border bg-[#f4f6fb]/25 flex items-center justify-between">
                    <span className="text-xs font-bold">Advising Chatroom: Ryan Koshy</span>
                  </div>
                  <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/40">
                    {mentors[0].chatHistory.map((ch, idx) => (
                      <div key={idx} className={`flex ${ch.sender === "mentor" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[70%] p-3 rounded-2xl text-xs leading-relaxed ${ch.sender === "mentor" ? "bg-emerald-600 text-white rounded-br-none" : "bg-white text-[#0f1c2e] rounded-bl-none shadow border border-slate-100"}`}>
                          <p>{ch.text}</p>
                          <span className={`text-[8px] block mt-1 text-right ${ch.sender === "mentor" ? "text-white/60" : "text-muted-foreground"}`}>{ch.time}</span>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow border border-slate-100 flex items-center gap-1 text-[9px] font-bold text-muted-foreground">
                          <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" />
                          <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
                          <span>Student is typing...</span>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                  <form onSubmit={handleSendMessage} className="p-3 border-t border-border flex gap-2 bg-[#f4f6fb]/20">
                    <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Type a message (e.g. check updates, confirm meeting)..." className="flex-1 text-xs border border-border bg-white rounded-xl px-3 py-2.5" />
                    <button type="submit" className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow cursor-pointer"><Send className="w-4 h-4" /></button>
                  </form>
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {/* ========================================================== */}
      {/* 3. GOVERNMENT ADMINISTRATION DASHBOARD VIEW */}
      {role === "admin" && (
        <div>
          {/* HEADER NAV REPLACEMENT FOR ADMIN */}
          <div className="max-w-[1400px] mx-auto px-6 pt-5">
            <nav className="flex items-center gap-1 bg-white border border-[#1a4fba]/5 rounded-2xl p-1.5 shadow-sm max-w-fit">
              {[
                { id: "Dashboard", label: "State Command Overview", icon: LayoutDashboard },
                { id: "Districts", label: "Districts Performance", icon: MapPin },
                { id: "Funding", label: "Startup Grants Vetting", icon: DollarSign },
                { id: "Events", label: "Opportunities Launcher", icon: Trophy },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    setAdminNav(id);
                    setSelectedProject(null);
                  }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 ${
                    adminNav === id
                      ? "bg-[#7c3aed] text-white shadow"
                      : "text-[#5a6a85] hover:text-[#0f1c2e] hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          <main className="max-w-[1400px] mx-auto px-6 py-6 space-y-6">
            {adminNav === "Dashboard" && (
              <div className="space-y-6">
                {/* ADMIN WELCOME ROW */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#1a4fba]/5 shadow-sm">
                  <div>
                    <h1 className="text-xl font-extrabold text-[#0f1c2e] leading-tight">
                      KSSF State Command Board 🏛️
                    </h1>
                    <p className="text-xs text-[#5a6a85] mt-1 font-medium">
                      Kerala School Startup Foundation - Department of General Education & Startup Mission.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowLaunchModal(true)}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-[#7c3aed] text-white rounded-xl text-xs font-bold hover:bg-violet-700 transition-colors shadow-sm cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Launch Opportunity
                    </button>
                    <button
                      onClick={() => setShowAllocateModal(true)}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-border text-[#0f1c2e] rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
                    >
                      Allocate Mentor
                    </button>
                  </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-2xl border border-[#1a4fba]/5 p-4 shadow-sm">
                    <span className="text-[10px] font-bold text-[#5a6a85] uppercase block">Registered Schools</span>
                    <h3 className="text-2xl font-black text-[#0f1c2e] mt-1">482</h3>
                    <p className="text-[10px] text-muted-foreground mt-1">Across 14 districts</p>
                  </div>
                  <div className="bg-white rounded-2xl border border-[#1a4fba]/5 p-4 shadow-sm">
                    <span className="text-[10px] font-bold text-[#5a6a85] uppercase block">Total Active Innovators</span>
                    <h3 className="text-2xl font-black text-[#0f1c2e] mt-1">1,280</h3>
                    <p className="text-[10px] text-muted-foreground mt-1">Standard VIII to XII</p>
                  </div>
                  <div className="bg-white rounded-2xl border border-[#1a4fba]/5 p-4 shadow-sm">
                    <span className="text-[10px] font-bold text-[#5a6a85] uppercase block">Innovation Projects</span>
                    <h3 className="text-2xl font-black text-[#0f1c2e] mt-1">{projects.length}</h3>
                    <p className="text-[10px] text-muted-foreground mt-1">3 active in current viewport</p>
                  </div>
                  <div className="bg-white rounded-2xl border border-[#1a4fba]/5 p-4 shadow-sm">
                    <span className="text-[10px] font-bold text-[#5a6a85] uppercase block">Incubated Startups</span>
                    <h3 className="text-2xl font-black text-emerald-600 mt-1">18</h3>
                    <p className="text-[10px] text-muted-foreground mt-1">Technopark & Calicut hubs</p>
                  </div>
                </div>

                {/* Main sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column Tables */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* District Rankings Table */}
                    <div className="bg-white rounded-2xl border border-[#1a4fba]/5 shadow-sm overflow-hidden">
                      <div className="px-5 py-4 border-b border-border bg-[#f4f6fb]/25 flex items-center justify-between">
                        <span className="font-extrabold text-xs text-[#0f1c2e]">District Innovation Index (DII)</span>
                        <button onClick={() => setAdminNav("Districts")} className="text-xs text-primary font-bold hover:underline">View map indices</button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-[#f4f6fb]/30 border-b border-border text-[9px] uppercase tracking-wider text-muted-foreground font-bold">
                              <th className="px-5 py-3">District</th>
                              <th className="px-4 py-3 text-center">Schools Active</th>
                              <th className="px-4 py-3 text-center">Projects Tracked</th>
                              <th className="px-5 py-3 text-right">Performance Score</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#1a4fba]/5 text-xs">
                            {districts.map((d, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/50">
                                <td className="px-5 py-4 font-bold text-[#0f1c2e]">{d.name}</td>
                                <td className="px-4 py-4 text-center font-medium text-[#5a6a85]">{d.schools}</td>
                                <td className="px-4 py-4 text-center font-medium text-[#5a6a85]">{d.projects}</td>
                                <td className="px-5 py-4 text-right font-black text-primary">{d.score} / 100</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Pending grant approvals */}
                    <div className="bg-white rounded-2xl border border-[#1a4fba]/5 shadow-sm overflow-hidden">
                      <div className="px-5 py-4 border-b border-border bg-[#f4f6fb]/25 flex items-center justify-between">
                        <span className="font-extrabold text-xs text-[#0f1c2e]">Recent Funding Applications</span>
                        <button onClick={() => setAdminNav("Funding")} className="text-xs text-primary font-bold hover:underline">Vet budgets</button>
                      </div>
                      <div className="divide-y divide-[#1a4fba]/5">
                        {projects.filter(p => !p.grantApproved).map((p) => (
                          <div key={p.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div>
                              <span className="text-[9px] font-bold text-primary uppercase bg-[#eef3fc] px-2 py-0.5 rounded">{p.domain}</span>
                              <h4 className="text-xs font-black text-[#0f1c2e] mt-1">{p.name}</h4>
                              <p className="text-[10px] text-muted-foreground">Student: {p.studentName} · {p.school}</p>
                            </div>
                            <button onClick={() => handleApproveGrant(p.id)} className="py-1.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg cursor-pointer shadow-sm">
                              Approve grant (₹50K)
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sidebar Budget trackers */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-[#1a4fba]/5 shadow-sm p-4 space-y-4">
                      <span className="text-xs font-bold text-[#0f1c2e] block pb-2 border-b border-border">State Funding Vetting</span>
                      <div className="space-y-3.5 text-xs text-muted-foreground font-semibold">
                        <div className="flex justify-between items-center bg-[#f4f6fb] p-3 rounded-xl border border-border">
                          <span>Grants Allocated</span>
                          <strong className="text-primary text-sm font-black">₹{funds.allocated.toLocaleString()}</strong>
                        </div>
                        <div className="flex justify-between items-center bg-[#f4f6fb] p-3 rounded-xl border border-border">
                          <span>CSR Funding Secured</span>
                          <strong className="text-[#0f1c2e] text-sm font-black">₹{funds.csr.toLocaleString()}</strong>
                        </div>
                        <div className="flex justify-between items-center bg-[#f4f6fb] p-3 rounded-xl border border-border">
                          <span>Incubator Seed Allocation</span>
                          <strong className="text-emerald-700 text-sm font-black">₹{funds.startup.toLocaleString()}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-[#1a4fba]/5 shadow-sm p-4 space-y-3.5">
                      <span className="text-xs font-bold text-[#0f1c2e] block pb-2 border-b border-border">Admin Notifications</span>
                      <div className="space-y-3 text-[11px] text-muted-foreground leading-snug">
                        <div className="flex gap-2">
                          <AlertCircle className="w-4 h-4 text-violet-500 flex-shrink-0" />
                          <span>Government allocated new patent expert to Ernakulam cohort.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ADMIN SUB VIEWS */}
            {adminNav === "Districts" && (
              <div className="space-y-6">
                <h2 className="text-sm font-extrabold text-[#0f1c2e]">District Score Index Board</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {districts.map((d, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-[#1a4fba]/5 p-5 shadow-sm space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xs font-black text-[#0f1c2e] flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary" /> {d.name}</h3>
                        <span className="text-[10px] font-bold bg-[#eef3fc] text-primary px-2.5 py-0.5 rounded-full">Index: {d.score}/100</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-center border-t border-border pt-3">
                        <div>
                          <span className="text-[10px] text-muted-foreground font-bold uppercase">Schools Vetted</span>
                          <strong className="text-base font-black block text-[#0f1c2e]">{d.schools}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-muted-foreground font-bold uppercase">Active Projects</span>
                          <strong className="text-base font-black block text-[#0f1c2e]">{d.projects}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {adminNav === "Funding" && (
              <div className="space-y-6">
                <h2 className="text-sm font-extrabold text-[#0f1c2e]">State Startup Grants Allocation</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-4">
                    {projects.map((proj) => (
                      <div key={proj.id} className="bg-white rounded-2xl border border-[#1a4fba]/5 p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-blue-50 text-primary">{proj.domain}</span>
                          <h3 className="text-xs font-black text-[#0f1c2e] mt-1.5">{proj.name}</h3>
                          <p className="text-[10px] text-muted-foreground mt-1">Student: {proj.studentName} · {proj.school}</p>
                        </div>
                        <div>
                          {proj.grantApproved ? (
                            <span className="text-[10px] font-bold px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg block text-center">
                              Grant Allocated (₹50,000) ✓
                            </span>
                          ) : (
                            <button onClick={() => handleApproveGrant(proj.id)} className="w-full py-1.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg cursor-pointer shadow-sm">
                              Approve Seed Grant (₹50K)
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white rounded-2xl border border-[#1a4fba]/5 p-5 shadow-sm h-fit space-y-4">
                    <span className="text-xs font-bold text-[#0f1c2e] block pb-2 border-b border-border">Total Grant Pool Summary</span>
                    <div className="space-y-3.5">
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs text-muted-foreground">Total Budget Allocated</span>
                        <strong className="text-xs font-bold">₹5,000,000</strong>
                      </div>
                      <ProgressBar value={(funds.allocated / 5000000) * 100} color="bg-primary" />
                      <span className="text-[10px] text-muted-foreground block text-right font-semibold">
                        {((funds.allocated / 5000000) * 100).toFixed(1)}% of total pool deployed
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {adminNav === "Events" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-sm font-extrabold text-[#0f1c2e]">Opportunity Launcher Board</h2>
                  <button onClick={() => setShowLaunchModal(true)} className="flex items-center gap-1.5 px-4 py-2 bg-[#7c3aed] text-white rounded-xl text-xs font-bold hover:bg-violet-700 transition-colors shadow shadow-indigo-100 cursor-pointer">
                    <Plus className="w-4 h-4" /> Launch Opportunity
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {events.map((ev) => (
                    <div key={ev.id} className="bg-white rounded-2xl border border-[#1a4fba]/5 p-5 shadow-sm space-y-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50/50 flex items-center justify-center text-primary"><ev.icon className="w-5 h-5" /></div>
                          <div>
                            <span className="text-[9px] font-bold text-primary uppercase">{ev.tag}</span>
                            <h3 className="text-xs font-black text-[#0f1c2e] mt-0.5">{ev.title}</h3>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{ev.desc}</p>
                      </div>
                      <div className="border-t border-border pt-3 text-[10px] text-muted-foreground flex justify-between">
                        <span>Venue: <strong>{ev.location}</strong></span>
                        <span>Date: <strong>{ev.date}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODALS & PORTALS */}

      {/* 1. STUDENT IDEA SUBMISSION MODAL */}
      {showIdeaModal && (
        <div className="fixed inset-0 bg-[#0f1c2e]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-blue-100 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col justify-between max-h-[90vh]">
            <div className="px-5 py-4 border-b border-border bg-[#f4f6fb]/50 flex items-center justify-between">
              <span className="font-extrabold text-xs text-[#0f1c2e] uppercase tracking-wide">
                Submit New Startup Idea (Step {wizardStep} of 3)
              </span>
              <button onClick={() => setShowIdeaModal(false)} className="text-[#5a6a85] hover:text-[#0f1c2e] cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex border-b border-border text-center">
              {[1, 2, 3].map((step) => (
                <div key={step} className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-wider ${wizardStep === step ? "text-[#1a4fba] border-b-2 border-[#1a4fba]" : "text-muted-foreground bg-slate-50/20"}`}>{step === 1 ? "Basic Info" : step === 2 ? "Description" : "Adviser Allocation"}</div>
              ))}
            </div>
            <form onSubmit={handleSubmitIdea} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Project Idea Title</label>
                    <input type="text" required placeholder="e.g. SolarWater IoT dispenser" value={newProjTitle} onChange={(e) => setNewProjTitle(e.target.value)} className="w-full text-xs border border-border bg-white rounded-lg px-2.5 py-2.5 focus:ring-1 focus:ring-primary focus:outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Category Domain</label>
                      <select value={newProjDomain} onChange={(e) => setNewProjDomain(e.target.value)} className="w-full text-xs border border-border bg-white rounded-lg p-2 cursor-pointer focus:ring-1 focus:ring-primary">
                        <option value="AgriTech">AgriTech</option>
                        <option value="EdTech">EdTech</option>
                        <option value="CleanTech">CleanTech</option>
                        <option value="FinTech">FinTech</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Team Members</label>
                      <input type="text" placeholder="Ryan, Devin" value={newProjTeam} onChange={(e) => setNewProjTeam(e.target.value)} className="w-full text-xs border border-border bg-white rounded-lg px-2.5 py-2" />
                    </div>
                  </div>
                </div>
              )}
              {wizardStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Solution Abstract Abstract</label>
                    <textarea required rows={4} placeholder="Vet the problem statement scope..." value={newProjDesc} onChange={(e) => setNewProjDesc(e.target.value)} className="w-full text-xs border border-border bg-white rounded-lg px-2.5 py-2 focus:ring-1 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Framework Stack</label>
                    <input type="text" placeholder="e.g. ESP32, Python" value={newProjTech} onChange={(e) => setNewProjTech(e.target.value)} className="w-full text-xs border border-border bg-white rounded-lg px-2.5 py-2" />
                  </div>
                </div>
              )}
              {wizardStep === 3 && (
                <div className="space-y-4">
                  <div className="bg-[#eef3fc]/60 p-3 rounded-xl text-muted-foreground">Select advisor supervisor:</div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Mentor Advisor</label>
                    <select value={newProjMentor} onChange={(e) => setNewProjMentor(e.target.value)} className="w-full text-xs border border-border bg-white rounded-lg p-2.5 cursor-pointer">
                      {mentors.map((m, idx) => (
                        <option key={idx} value={m.name}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
              <div className="border-t border-border pt-4 flex gap-2">
                {wizardStep > 1 && <button type="button" onClick={() => setWizardStep(wizardStep - 1)} className="flex-1 py-2 border border-border rounded-xl font-bold cursor-pointer text-[#0f1c2e]">Back</button>}
                {wizardStep < 3 ? (
                  <button type="button" onClick={() => setWizardStep(wizardStep + 1)} className="flex-1 py-2 bg-primary text-white rounded-xl font-bold cursor-pointer hover:bg-blue-700">Continue</button>
                ) : (
                  <button type="submit" className="flex-1 py-2 bg-emerald-600 text-white rounded-xl font-bold cursor-pointer hover:bg-emerald-700">Submit abstract</button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. COMPETITION SPECS MODAL */}
      {viewingCompetition && (
        <div className="fixed inset-0 bg-[#0f1c2e]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-blue-100 shadow-2xl max-w-md w-full overflow-hidden">
            <div className="px-5 py-4 border-b border-border bg-[#f4f6fb]/50 flex items-center justify-between">
              <span className="font-extrabold text-xs text-[#0f1c2e] uppercase">Guidelines Vetting</span>
              <button onClick={() => setViewingCompetition(null)} className="text-[#5a6a85] hover:text-[#0f1c2e] cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <h3 className="font-black text-[#0f1c2e]">{viewingCompetition.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{viewingCompetition.desc}</p>
              <div>
                <span className="font-bold text-[#0f1c2e] block mb-1">Prizes:</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">{viewingCompetition.prizes}</span>
              </div>
            </div>
            <div className="px-5 py-3.5 bg-slate-50 border-t border-border flex justify-end gap-2">
              <button onClick={() => setViewingCompetition(null)} className="px-4 py-2 border border-border rounded-xl text-xs font-bold cursor-pointer text-[#0f1c2e]">Dismiss</button>
              <button onClick={() => handleRegisterEvent(viewingCompetition.id)} disabled={viewingCompetition.registered} className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer shadow ${viewingCompetition.registered ? "bg-emerald-50 text-emerald-700 cursor-not-allowed border border-emerald-200" : "bg-primary hover:bg-blue-700 text-white"}`}>
                {viewingCompetition.registered ? "Reserved ✓" : "Register Seat"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. MENTOR WORKSPACE: REQUEST CHANGES MODAL */}
      {showRequestChangesModal && (
        <div className="fixed inset-0 bg-[#0f1c2e]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-blue-100 shadow-2xl max-w-md w-full overflow-hidden">
            <div className="px-5 py-4 border-b border-border bg-[#f4f6fb]/50 flex items-center justify-between">
              <span className="font-extrabold text-xs text-[#0f1c2e] uppercase">Submit Feedback Request</span>
              <button onClick={() => setShowRequestChangesModal(false)} className="text-[#5a6a85] hover:text-[#0f1c2e] cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmitRequestChanges} className="p-5 space-y-4 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Feedback / Requested Changes</label>
                <textarea required rows={4} value={changeReqText} onChange={(e) => setChangeReqText(e.target.value)} placeholder="Type changes student needs to address..." className="w-full text-xs border border-border bg-white rounded-lg px-2.5 py-2 focus:ring-1 focus:ring-[#1a9e6e] focus:outline-none" />
              </div>
              <div className="flex gap-2 justify-end border-t border-border pt-4">
                <button type="button" onClick={() => setShowRequestChangesModal(false)} className="px-4 py-2 border border-border rounded-xl text-xs font-bold text-[#0f1c2e]">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow cursor-pointer">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. ADMIN LAUNCH EVENT MODAL */}
      {showLaunchModal && (
        <div className="fixed inset-0 bg-[#0f1c2e]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-blue-100 shadow-2xl max-w-md w-full overflow-hidden">
            <div className="px-5 py-4 border-b border-border bg-[#f4f6fb]/50 flex items-center justify-between">
              <span className="font-extrabold text-xs text-[#0f1c2e] uppercase">Launch State Opportunity</span>
              <button onClick={() => setShowLaunchModal(false)} className="text-[#5a6a85] hover:text-[#0f1c2e] cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleLaunchCompetition} className="p-5 space-y-3 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Event / Opportunity Title</label>
                <input type="text" required placeholder="e.g. State AgriTech Challenge 2025" value={newEventTitle} onChange={(e) => setNewEventTitle(e.target.value)} className="w-full text-xs border border-border bg-white rounded-lg p-2 focus:ring-1 focus:ring-violet-500 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Type Tag</label>
                  <select value={newEventTag} onChange={(e) => setNewEventTag(e.target.value)} className="w-full text-xs border border-border bg-white rounded-lg p-2 cursor-pointer">
                    <option value="Hackathon">Hackathon</option>
                    <option value="Competition">Competition</option>
                    <option value="Workshop">Workshop</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Deadline Date</label>
                  <input type="text" required placeholder="e.g. Aug 15, 2025" value={newEventDate} onChange={(e) => setNewEventDate(e.target.value)} className="w-full text-xs border border-border bg-white rounded-lg p-2" />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Abstract Description</label>
                <textarea required rows={3} placeholder="Provide details..." value={newEventDesc} onChange={(e) => setNewEventDesc(e.target.value)} className="w-full text-xs border border-border bg-white rounded-lg p-2 focus:ring-1 focus:ring-violet-500" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Award Pool</label>
                  <input type="text" placeholder="🥇 ₹1,00,000" value={newEventPrizes} onChange={(e) => setNewEventPrizes(e.target.value)} className="w-full text-xs border border-border bg-white rounded-lg p-2" />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Venue Venue</label>
                  <input type="text" value={newEventLoc} onChange={(e) => setNewEventLoc(e.target.value)} className="w-full text-xs border border-border bg-white rounded-lg p-2" />
                </div>
              </div>
              <div className="flex gap-2 justify-end border-t border-border pt-4">
                <button type="button" onClick={() => setShowLaunchModal(false)} className="px-4 py-2 border border-border rounded-xl text-xs font-bold text-[#0f1c2e]">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#7c3aed] text-white rounded-xl text-xs font-bold shadow cursor-pointer">Launch Opportunity</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. ADMIN ALLOCATE MENTOR MODAL */}
      {showAllocateModal && (
        <div className="fixed inset-0 bg-[#0f1c2e]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-blue-100 shadow-2xl max-w-md w-full overflow-hidden">
            <div className="px-5 py-4 border-b border-border bg-[#f4f6fb]/50 flex items-center justify-between">
              <span className="font-extrabold text-xs text-[#0f1c2e] uppercase">Allocate Advisor Supervisor</span>
              <button onClick={() => setShowAllocateModal(false)} className="text-[#5a6a85] hover:text-[#0f1c2e] cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAllocateMentor} className="p-5 space-y-4 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Select Project</label>
                <select value={allocateProjId} onChange={(e) => setAllocateProjId(e.target.value)} className="w-full text-xs border border-border bg-white rounded-lg p-2.5 cursor-pointer">
                  <option value="">-- Choose student project --</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.studentName}: {p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Allocate Advisor</label>
                <select value={allocateMentorName} onChange={(e) => setAllocateMentorName(e.target.value)} className="w-full text-xs border border-border bg-white rounded-lg p-2.5 cursor-pointer">
                  {mentors.map((m, idx) => (
                    <option key={idx} value={m.name}>{m.name} ({m.role})</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 justify-end border-t border-border pt-4">
                <button type="button" onClick={() => setShowAllocateModal(false)} className="px-4 py-2 border border-border rounded-xl text-xs font-bold text-[#0f1c2e]">Cancel</button>
                <button type="submit" disabled={!allocateProjId} className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold shadow cursor-pointer disabled:opacity-50">Assign Advisor</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. CERTIFICATE POPUP */}
      {viewingCertificate && (
        <div className="fixed inset-0 bg-[#0f1c2e]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-blue-100 shadow-2xl max-w-md w-full overflow-hidden">
            <div className="px-5 py-4 border-b border-border bg-[#f4f6fb]/50 flex items-center justify-between">
              <span className="font-extrabold text-xs text-[#0f1c2e] uppercase">Digital Verified Credential</span>
              <button onClick={() => setViewingCertificate(null)} className="text-[#5a6a85] hover:text-[#0f1c2e] cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 bg-amber-50/20 flex justify-center">
              <div className="border-4 border-double border-amber-800 bg-white p-5 max-w-sm text-center space-y-4 shadow">
                <div className="text-[8px] text-muted-foreground uppercase tracking-widest">Kerala School Startup Foundation</div>
                <h4 className="text-xs font-serif font-black text-amber-900 border-b border-amber-900/30 pb-2">Certificate of Competence</h4>
                <p className="text-[10px] font-serif text-[#0f1c2e] font-bold">RYAN KOSHY</p>
                <p className="text-[9px] text-muted-foreground leading-relaxed">{viewingCertificate.title} issued by {viewingCertificate.issuer}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}
