/**
 * ============================================================
 *  PORTFOLIO DATA CONFIG — data.js
 *  Edit THIS FILE ONLY to update your portfolio content.
 * ============================================================
 */

const PORTFOLIO_DATA = {

    // ── Personal Info ─────────────────────────────────────
    personal: {
        name: "Tharindu Dilshan",
        initials: "TD",
        tagline: "BSc. Physical Science graduate passionate about Full Stack Development, Quality Assurance, and building innovative software solutions.",
        roles: [
            "Full Stack Developer",
            "Quality Assurance Engineer",
            "Graduate Officer",
            "Software Engineer"
        ],
        email: "djtdtharindudilshan@gmail.com",
        phone: "0704473073 / 0786877226",
        location: "Weligampitiya, Ja-ela",
        linkedin: "https://www.linkedin.com/in/Tharindu-dilshan-Jayakody",
        cvFile: "Tharindu Dilshan cv.pdf"
    },

    // ── Education ─────────────────────────────────────────
    education: [
        {
            degree: "MSc Information Technology",
            institution: "SLIIT University",
            period: "2025 - Present"
        },
        {
            degree: "BSc. Physical Science",
            institution: "University of Sri Jayewardenepura",
            period: "2020 - 2024"
        },
        {
            degree: "Trainee — Full Stack Developer",
            institution: "University of Moratuwa (Open Course)",
            period: "2024 - Present"
        }
    ],

    // ── Skills ────────────────────────────────────────────
    technicalSkills: ["Java", "Python", "C / C++", "JavaScript", "SQL", "HTML / CSS", "Oracle", "Selenium"],
    tools: ["IntelliJ IDEA", "PyCharm", "CodeBlocks", "Jira", "Arduino", "phpMyAdmin"],

    // ── Experience ────────────────────────────────────────
    experience: [
        {
            title: "Graduate Officer",
            company: "SLSI (Materials Laboratory)",
            period: "Dec 2024 - Present"
        },
        {
            title: "Intern Resource Management",
            company: "Axiata Digital Labs",
            period: "Nov 2024 - Jan 2025"
        },
        {
            title: "Intern Quality Assurance",
            company: "MAS ACTIVE INTIMO",
            period: "Aug 2024 - Nov 2024"
        }
    ],

    // ── Projects ──────────────────────────────────────────
    // To ADD a project: copy one block and append it to this array.
    // icon: any Lucide icon name → https://lucide.dev/icons/
    // demoType: "terminal" | "browser" | "none"
    // sourceFile: relative path to the source file, or a full URL like "https://..."
    // liveUrl: (optional) a URL to open directly in the browser demo

    projects: [
        {
            id: "railway",
            icon: "train-front",
            title: "Railway Reservation System",
            description: "Automated train ticket booking application with full database transaction management to prevent double-booking using SQL.",
            tags: ["Java", "SQL", "JDBC"],
            sourceFile: "RailwayReservationSystem/src/RailwaySystem.java",
            demoType: "terminal",
            demo: [
                { type: "command", text: "java RailwaySystem" },
                { type: "output",  text: "========================================" },
                { type: "output",  text: "  ONLINE RAILWAY RESERVATION SYSTEM     " },
                { type: "output",  text: "========================================" },
                { type: "success", text: ">> Database connected successfully!" },
                { type: "output",  text: "1. View Available Trains" },
                { type: "output",  text: "2. Book a Ticket  3. Cancel Ticket" },
                { type: "input",   text: "Enter choice: 1" },
                { type: "output",  text: "--- Available Trains ---" },
                { type: "output",  text: "ID:101 | Express A  | Colombo → Kandy | Seats: 45" },
                { type: "output",  text: "ID:102 | Intercity B| Colombo → Galle | Seats: 12" },
                { type: "input",   text: "Enter choice: 2" },
                { type: "input",   text: "Enter Train ID: 101" },
                { type: "input",   text: "Enter Passenger Name: Tharindu Dilshan" },
                { type: "success", text: ">> Ticket booked successfully for Tharindu Dilshan!" }
            ]
        },
        {
            id: "hydroponic",
            icon: "leaf",
            title: "Hydroponic Farming & Sensor Monitor",
            description: "OOP-based Java system that monitors pH and water-level sensors and triggers automatic corrective actions when abnormal levels are detected.",
            tags: ["Java", "OOP", "IoT"],
            sourceFile: "HydroponicFarmingSystem/src/HydroponicFarming.java",
            demoType: "terminal",
            demo: [
                { type: "command", text: "java HydroponicFarming" },
                { type: "output",  text: "==========================================" },
                { type: "output",  text: "  HYDROPONIC FARMING SENSOR MONITOR       " },
                { type: "output",  text: "==========================================" },
                { type: "output",  text: "Cycle 1:" },
                { type: "output",  text: "[pH Sensor]         Reading: 6.20 ✓" },
                { type: "output",  text: "[Water Level Sensor] Reading: 85.3% ✓" },
                { type: "output",  text: "--- Diagnostics Complete ---" },
                { type: "output",  text: "Cycle 2:" },
                { type: "output",  text: "[pH Sensor]         Reading: 5.10" },
                { type: "error",   text: ">> ALERT: pH Sensor — abnormal level detected!" },
                { type: "success", text: ">> Activating pH correction pump..." },
                { type: "success", text: ">> System stabilized." }
            ]
        },
        {
            id: "library",
            icon: "library",
            title: "Library Management System",
            description: "Full-featured digital library system that manages book inventory, borrowing, and return workflows using Java OOP principles.",
            tags: ["Java", "OOP"],
            sourceFile: "LibraryManagementSystem/src/LibraryManagementSystem.java",
            liveUrl: "library-manager/index.html",
            demoType: "terminal",
            demo: [
                { type: "command", text: "java LibraryManagementSystem" },
                { type: "output",  text: "==========================================" },
                { type: "output",  text: "        LIBRARY MANAGEMENT SYSTEM         " },
                { type: "output",  text: "==========================================" },
                { type: "output",  text: "1. Java Programming by John Doe | ✓ Available" },
                { type: "output",  text: "2. Clean Code by Robert C. Martin | ✓ Available" },
                { type: "output",  text: "3. Design Patterns by GoF | ✓ Available" },
                { type: "input",   text: "Option: 1  |  Book: 2" },
                { type: "success", text: ">> Successfully borrowed: Clean Code" },
                { type: "output",  text: "2. Clean Code by Robert C. Martin | ✗ Borrowed" }
            ]
        },
        {
            id: "selenium",
            icon: "bot",
            title: "Selenium eBay Automation",
            description: "Headless browser automation bot using Selenium WebDriver to search and add mobile phones to cart on eBay with robust explicit waits.",
            tags: ["Java", "Selenium", "WebDriver"],
            sourceFile: "SeleniumEbayAutomation/src/EbayPurchaseBot.java",
            liveUrl: "selenium-demo/index.html",
            demoType: "terminal",
            demo: [
                { type: "command", text: "java EbayPurchaseBot" },
                { type: "output",  text: ">> Launching Chrome WebDriver..." },
                { type: "output",  text: ">> Navigating to ebay.com..." },
                { type: "output",  text: ">> Typing 'Mobile Phone' into search bar..." },
                { type: "output",  text: ">> Waiting for results page to load..." },
                { type: "output",  text: ">> Clicking first listing: Samsung Galaxy..." },
                { type: "output",  text: ">> Locating 'Add to Cart' button..." },
                { type: "success", text: ">> SUCCESS: Item added to cart!" },
                { type: "output",  text: ">> Closing browser session." }
            ]
        },
        {
            id: "sales",
            icon: "shopping-cart",
            title: "Sales Management System",
            description: "C-based console application to manage inventory stock loading, unloading, and sales records with file-based persistence and a revenue ledger.",
            tags: ["C", "File I/O"],
            sourceFile: "SalesSystem/main.c",
            liveUrl: "sales-manager/index.html",
            demoType: "terminal",
            demo: [
                { type: "command", text: "./SalesSystem" },
                { type: "output",  text: "========================================" },
                { type: "output",  text: "        SALES MANAGEMENT SYSTEM         " },
                { type: "output",  text: "========================================" },
                { type: "input",   text: "Choice: 1  (View Inventory)" },
                { type: "output",  text: "ID:1 | Laptop   | Qty:10 | LKR 150,000.00" },
                { type: "output",  text: "ID:2 | Mouse    | Qty:50 | LKR   2,500.00" },
                { type: "input",   text: "Choice: 3  (Record Sale)" },
                { type: "input",   text: "Product ID: 1  |  Qty: 2" },
                { type: "success", text: ">> Sale recorded! Total: LKR 300,000.00" }
            ]
        },
        {
            id: "tts",
            icon: "mic",
            title: "Nova Text-to-Speech App",
            description: "Feature-rich browser TTS app using the Web Speech API with real-time pitch/speed controls, voice selection, and script export — all in a glassmorphic UI.",
            tags: ["HTML", "JavaScript", "Web Speech API"],
            sourceFile: "tts-web-app/index.html",
            liveUrl: "tts-web-app/index.html",
            demoType: "terminal",
            demo: [
                { type: "command", text: "open tts-web-app/index.html" },
                { type: "output",  text: ">> Loading Web Speech API engine..." },
                { type: "output",  text: ">> Available voices: 24 found" },
                { type: "output",  text: ">> Selected voice: Google UK English Male" },
                { type: "input",   text: "Text: 'Hello, I am Tharindu Dilshan.'" },
                { type: "output",  text: ">> Speed: 1.0x | Pitch: 1.0 | Volume: 100%" },
                { type: "success", text: ">> Speaking... (real-time playback active)" },
                { type: "output",  text: ">> Export script: complete." }
            ]
        },
        {
            id: "lyrics",
            icon: "music",
            title: "Nova Lyrics Video Studio",
            description: "High-performance lyric video creator with 10 animation engines, waveform sync, glassmorphic editor UI, and a 15Mbps WebM 1080p export pipeline.",
            tags: ["HTML", "JavaScript", "Canvas API", "WebCodecs"],
            sourceFile: "nova-studio-ultimate.html",
            liveUrl: "nova-studio-ultimate.html",
            demoType: "terminal",
            demo: [
                { type: "command", text: "open nova-studio-ultimate.html" },
                { type: "output",  text: ">> Initializing Canvas rendering engine..." },
                { type: "output",  text: ">> Loading audio: track.mp3 (3:42)" },
                { type: "output",  text: ">> Waveform analysis complete." },
                { type: "output",  text: ">> Animation Engine: Neon Pulse selected" },
                { type: "input",   text: "Add lyric: '00:05 → Hello world'" },
                { type: "success", text: ">> Lyric synced at 00:05.00" },
                { type: "output",  text: ">> Exporting 1080p WebM @ 15Mbps..." },
                { type: "success", text: ">> Export complete: nova_output.webm" }
            ]
        }
    ],

    // ── Extracurriculars ──────────────────────────────────
    activities: [
        "Astronomy Club of UOSJ (2022 – Present)",
        "Japura LEO's Club (2020 – Present)",
        "Computer Science & Physics Society Member",
        "Japura Flames | Aviation Society Member"
    ]
};
