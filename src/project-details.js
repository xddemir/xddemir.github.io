// Stories are written from the supplied CV and user clarifications. Keep outcomes distinct
// from responsibilities, and keep figure captions honest about what is illustrative.
// Each chapter is one beat of the story: the setting, the hard part, the decision, the result.
export const profile = {
  summary:
    "I’m a software engineer in Germany. My work sits behind the screen, Go and C#/.NET backends, distributed services, cloud infrastructure — and, more and more, at the edge, where software has to talk to real hardware. Over 4+ years I’ve taken systems from architecture to production in enterprise software, applied XR research, and early-stage products.",
  personal:
    "Games sparked my curiosity about software. Shipping my own game taught me to connect individual systems into a complete experience. Today, that same curiosity takes me from hardware-connected backends to interactive research environments.",
  education:
    "I hold a B.Sc. in Computer Engineering from Düzce University and I’m completing an M.Sc. in Computer Science at RPTU Kaiserslautern-Landau, with a minor in Data Visualization. In 2026 I spent an Erasmus+ semester at Universitat Autònoma de Barcelona, studying Cloud Computing and Smart Industry.",
};
export const education = [
  [
    "2023 — now",
    "M.Sc. Computer Science",
    "RPTU Kaiserslautern-Landau · minor in Data Visualization",
    "rptu",
  ],
  [
    "2026",
    "Erasmus+ exchange semester",
    "Universitat Autònoma de Barcelona · Cloud Computing, Smart Industry",
    "uab",
  ],
  [
    "2019 — 2023",
    "B.Sc. Computer Engineering",
    "Düzce University · Türkiye",
    "duzce",
  ],
];
export const skills = [
  ["Languages", "Go · C# · Python · TypeScript · JavaScript · SQL"],
  [
    "Backend",
    ".NET / ASP.NET Core · Entity Framework Core · Go net/http · Node.js · REST · Microservices · RabbitMQ · MQTT",
  ],
  [
    "Cloud & delivery",
    "AWS · Azure · Docker · Kubernetes · GitHub Actions · CI/CD · nginx · Cloudflare · Linux",
  ],
  [
    "Data",
    "PostgreSQL · MySQL · MongoDB · Redis · Cosmos DB · DynamoDB · Elasticsearch · TimescaleDB · Grafana",
  ],
  [
    "AI & interaction",
    "AWS Bedrock · Whisper · Piper · Unity · Unreal Engine · React · React Native",
  ],
];
// The specialty certification leads; fundamentals and AWS Academy credentials support it.
// Add a `url` to any entry to show a verification link (Credly or Microsoft Learn).
export const featuredCertification = {
  name: "Azure Cosmos DB Developer Specialty",
  code: "DP-420",
  issuer: "Microsoft Certified",
  level: "Specialty",
  year: "2024",
  note: "Designing and building cloud-native applications on Azure Cosmos DB. I earned it while helping move an enterprise CRM platform onto Azure and Cosmos DB at NTT DATA.",
};
export const certifications = [
  {
    group: "Microsoft Azure",
    level: "Fundamentals",
    items: [
      { code: "AZ-900", name: "Azure Fundamentals", year: "2023", url: "https://www.credly.com/badges/7695b851-36a5-4ae2-8317-793e1e474594" },
      { code: "AI-900", name: "Azure AI Fundamentals", year: "2022", url: "https://www.credly.com/badges/ce96b7d7-83f8-4a2f-a5bd-5e0794723d69" },
      { code: "DP-900", name: "Azure Data Fundamentals", year: "2022", url: "https://www.credly.com/badges/77f45768-708f-467e-b6b5-77daece96ff8" },
    ],
  },
  {
    group: "AWS Academy",
    level: "Graduate training badges",
    items: [
      { code: "ML", name: "Machine Learning Foundations", year: "2025", url: "https://www.credly.com/badges/616cfc61-a4bc-4ca8-adc9-1a3a60681e8c" },
      { code: "NLP", name: "Machine Learning for NLP", year: "2025", url: "https://www.credly.com/badges/56d4b9a6-b23f-4e54-887b-939336cb0921" },
    ],
  },
];
export const details = {
  rush: {
    subtitle:
      "The software behind an autonomous drinks kiosk — from the payment terminal to the pump, and the fleet above them.",
    period: "Feb 2026 — Present",
    role: "Software Team Lead · Part-time",
    place: "Remote · RUSH at ODTÜ Teknokent, Ankara",
    hook: "At a festival bar, the queue is the competition. From the moment a guest scans the machine to the moment the cup is full, every second runs through software I lead.",
    intro:
      "RUSH Automated Systems builds RUSH-DESK, an autonomous drinks kiosk for festivals, stadiums, hotels and events, engineered at ODTÜ Teknokent in Ankara. As Software Team Lead, I architected the Go backend from the ground up and lead the software around it: the customer kiosk, admin and machine control panels, payments and POS integration, the AI voice — and a TÜBİTAK 1507-funded service for soft sensing and predictive maintenance.",
    metrics: [
      ["< 30 s", "From scan to drink"],
      ["TÜBİTAK 1507", "Funded R&D: predictive maintenance"],
      ["Edge + cloud", "Voice, payments & fleet telemetry"],
    ],
    chapters: [
      {
        kicker: "The setting",
        title: "A bar with no bartender",
        body: "A guest scans a QR code on the machine — no app to install — picks a signature drink, mixes their own or takes an AI recommendation, pays contactless, and RUSH-DESK pours across seven channels with ±0.5 ml precision. RUSH promises all of that in under thirty seconds. Behind every step is the backend I designed: the REST API, the data model and the service boundaries that let guests, operators and the machine agree on what an order is.",
      },
      {
        kicker: "What I built",
        title: "Every screen around the machine",
        body: "Guests order at the kiosk. Operators run the business from admin panels, where menus, prices and recipes change remotely and stock, sales and fills arrive per machine in real time. Machine control panels operate the hardware itself, and a content system keeps what guests see up to date. All of it runs on one Go backend, which drives the dispensing hardware over MQTT and recognises returning customers by NFC.",
      },
      {
        kicker: "Payments",
        title: "A pour starts with a payment",
        body: "No cash, no bartender — so the payment path has to be as reliable as the pump. I integrated a physical POS terminal into the machine and built the payment services behind it, so guests can pay by card, phone wallet or NFC and the order moves on to the pour.",
      },
      {
        kicker: "The hard part",
        title: "Where should the voice run?",
        body: "Guests can also talk to the kiosk, and we gave its AI assistant voices of its own. The obvious design sends everything to the cloud: audio up, speech recognition, a language model, synthesised speech back down. I benchmarked that version first. Every turn of the conversation carried audio across the network twice — and the guest waited for all of it.",
      },
      {
        kicker: "The decision",
        title: "Split it at the words",
        body: "I moved speech-to-text (Whisper) and text-to-speech (Piper) onto a Raspberry Pi 5 at the kiosk, and kept only the language model in the cloud, on AWS Bedrock. Audio now stays on the device; only text crosses the network. That cut end-to-end response latency and the cost of every request — without asking a small board to run a large model.",
      },
      {
        kicker: "Shipping it",
        title: "From a repository to the field",
        body: "The stack runs on AWS EC2 with Docker Compose. I set up nginx routing across subdomains, TLS termination through Cloudflare, and build-and-release automation with GitHub Actions. As team lead, I own both the architecture and the path it takes to production. The first machines running this stack went into the field in July 2026, in Antalya and Bodrum; since then RUSH-DESK has worked resort shifts, a golf tournament in Ankara and stadium match days — where, by RUSH’s own count, a single station served 124 drinks, each in about five seconds, without an error.",
      },
      {
        kicker: "What’s next",
        title: "From one machine to a fleet",
        body: "RUSH is funded under TÜBİTAK 1507, the SME R&D Start-Up Support Programme, for soft sensing and predictive maintenance — and I’m building the service that does it. Soft sensing means estimating what a machine doesn’t measure directly from the signals it does. Predictive maintenance means seeing wear before it turns into a failure in the middle of an event. With many machines in the field, that service is what lets a small team keep a whole fleet pouring.",
      },
    ],
    figures: [
      { kind: "voice", after: 4 },
      { kind: "maintenance", after: 6 },
    ],
    takeaway:
      "The interesting decisions in edge systems are rarely about which model to use. They are about where each piece runs, and what has to cross the network.",
    stack: [
      "Go",
      "REST APIs",
      "MQTT",
      "NFC",
      "POS terminal integration",
      "Payment services",
      "Raspberry Pi 5",
      "Whisper",
      "Piper",
      "AWS Bedrock",
      "AWS EC2",
      "Docker Compose",
      "nginx",
      "Cloudflare",
      "GitHub Actions",
      "Soft sensing",
      "Predictive maintenance",
    ],
  },
  campus: {
    subtitle:
      "Rebuilding a university platform for two campuses — and for the moment everyone signs up at once.",
    period: "Jan 2026 — Present",
    role: "Backend Developer",
    place: "RPTU · Kaiserslautern & Landau",
    hook: "Registration is the one thing every student does, and they tend to do it all at once. That was exactly where the old system gave out.",
    intro:
      "RPTU Campus Games serves more than 1,000 students across the Kaiserslautern and Landau campuses. I re-engineered the legacy application and rewrote its backend in Go, and I’m responsible both for how it is built and for keeping it running in production.",
    metrics: [
      ["1,000+", "Students on two campuses"],
      ["700 → 150 ms", "Registration response time"],
      ["≈79%", "Faster registration API"],
    ],
    chapters: [
      {
        kicker: "The setting",
        title: "A legacy system, two campuses",
        body: "I inherited a legacy application with a clear goal: make it maintainable, faster, and ready to scale. I restructured the codebase and the service architecture, and rewrote the core backend in Go, with MongoDB and MySQL for persistence.",
      },
      {
        kicker: "The hard part",
        title: "Everyone arrives at once",
        body: "Onboarding comes in waves: students register in bursts, and every registration passes through the university’s single sign-on. The old integration took about 700 ms to answer, and at peak onboarding, requests timed out.",
      },
      {
        kicker: "The fix",
        title: "Refactoring the sign-on path",
        body: "I refactored the SSO integration end to end. Registration now answers in about 150 ms — roughly 79% faster — and the peak-time timeouts are gone. For students who sign in by phone, I added one-time-password authentication with Firebase.",
      },
      {
        kicker: "Owning it",
        title: "Build it, run it",
        body: "I also built the announcement services, containerised the services with Docker, and own deployment, monitoring, debugging and incident response. When something breaks, fixing it is my job too.",
      },
    ],
    figures: [{ kind: "latency", after: 2 }],
    takeaway:
      "The fix that matters most is usually on the path every user takes. For this platform, that path ran through sign-on.",
    stack: [
      "Go",
      "MongoDB",
      "MySQL",
      "Firebase OTP",
      "SSO",
      "Docker",
      "Production monitoring",
    ],
  },
  "master-xr": {
    subtitle:
      "Gaze interaction you can reuse, VR training for the factory floor, and a study to test both.",
    period: "Jan 2025 — Jan 2026",
    role: "Student Research Assistant",
    place: "DFKI · Interactive Machine Learning · Saarbrücken",
    hook: "In a headset, your eyes reach the part before your hand does. The question is how far the software should trust them.",
    intro:
      "At the German Research Center for Artificial Intelligence, I worked on two connected things: GTK, an open-source Unity toolkit for gaze-based interaction in XR, and MASTER XR, an EU-funded project that uses virtual reality to train people for manufacturing work.",
    metrics: [
      ["3", "VR training scenarios"],
      ["20", "Study participants"],
      ["Open source", "Gaze Interaction Toolkit"],
    ],
    chapters: [
      {
        kicker: "The setting",
        title: "Eyes are fast, and never still",
        body: "Eye tracking tells you where someone is looking, and it tells you quickly. But eyes are never still. If looking were the same as choosing, everything you glanced at would be selected — the problem XR researchers call the Midas touch. Useful gaze interaction needs a second, deliberate signal.",
      },
      {
        kicker: "What I built",
        title: "A toolkit, not a demo",
        body: "I co-developed GTK, a modular Unity framework that extends the XR Interaction Toolkit with gaze-based interaction and passive attention monitoring. I implemented reusable components for gaze selection, draggable objects and hybrid gaze-and-controller interaction, and refactored the toolkit’s dependency modules and class structure so that other XR applications could extend it.",
      },
      {
        kicker: "Training for the factory",
        title: "Three scenarios for MASTER XR",
        body: "For MASTER XR I developed three VR manufacturing-training scenarios, among them direct robot control and gaze-enhanced human–robot interaction. I also replaced manual logging with automated pipelines that capture and process interaction telemetry, so every session produced data ready for analysis.",
      },
      {
        kicker: "The study",
        title: "Twenty people, one sorting task",
        body: "I ran a user study with 20 participants in an industrial sorting scenario, with guided onboarding. It compared two ways of picking an object — look at it and confirm with the controller, or point and confirm with the controller alone — and measured selection and task completion times. The data fed back into the toolkit’s usability and the study protocol. GTK was later presented at IEEE VRW 2026; my role was research engineering and scene development, and I am not a listed author of those papers.",
      },
    ],
    figures: [{ kind: "gaze", after: 3 }],
    takeaway:
      "Research code is judged twice: once by whether the study works, and again by whether the next person can build on it. I tried to write for the second judge.",
    stack: [
      "Unity",
      "C#",
      "XR Interaction Toolkit",
      "Gaze interaction",
      "Telemetry",
      "MASTER XR",
    ],
    resources: [
      [
        "GTK: An Open-Source Toolkit for Gaze-based Interaction in XR",
        "https://www.dfki.de/en/web/research/projects-and-publications/publication/17190",
      ],
      [
        "GTK: A Gaze-Based Interaction Toolkit in XR",
        "https://www.dfki.de/en/web/research/projects-and-publications/publication/17191",
      ],
    ],
  },
  ntt: {
    subtitle:
      "Fifty services, two tenants, twelve roles — and the transactions that run across all of them.",
    period: "Sep 2022 — Jan 2025",
    role: "Software Engineer",
    place: "Istanbul, Türkiye",
    hook: "In a system of fifty services, one business transaction can succeed in three of them and fail in the fourth. Somebody has to decide what happens next.",
    intro:
      "At NTT DATA I worked on a multi-tenant enterprise CRM platform made of more than fifty services, and delivered mobile commerce apps alongside it. I joined in September 2022, in the final months of my bachelor’s degree.",
    metrics: [
      ["50+", "Services contributed to"],
      ["12", "Authorization tiers"],
      ["3", "Production mobile apps"],
    ],
    chapters: [
      {
        kicker: "The setting",
        title: "One platform, many owners",
        body: "The CRM served two enterprise tenants with twelve role-based authorization tiers. In C#/.NET I designed REST APIs, service boundaries, business workflows and the communication between services — and every piece of business logic had to know whose data it was touching, and who was allowed to touch it.",
      },
      {
        kicker: "The hard part",
        title: "No transaction spans fifty services",
        body: "A long-running business process can touch several independently deployed services. No database transaction covers all of them, so a failure halfway through can leave the system half-changed. I implemented these workflows with the Saga pattern and Event Sourcing: each step records what it did as an event, and if a later step fails, compensating steps undo the earlier ones in reverse. Redis caching and asynchronous messaging cut the synchronous dependencies between services, which made the platform faster and more resilient under load.",
      },
      {
        kicker: "Moving to the cloud",
        title: "From servers to Azure",
        body: "I helped move the platform from traditional infrastructure to Azure, Azure Cosmos DB, Docker and CI/CD pipelines, and worked on deployment, monitoring, debugging and production incidents with backend, DevOps, QA and client teams. Along the way I earned the Azure Cosmos DB Developer Specialty (DP-420).",
      },
      {
        kicker: "Beyond the CRM",
        title: "A chatbot and three shops",
        body: "I implemented a production chatbot service for Mercedes-Benz and integrated it into the enterprise service ecosystem. I also delivered three React Native and TypeScript e-commerce apps for the Kuwaiti market, with five payment providers, SAP SDKs, Google and Apple Maps, location-based filtering and single sign-on.",
      },
    ],
    figures: [{ kind: "saga", after: 1 }],
    takeaway:
      "Distributed systems taught me to design for the failure first. The happy path is the easy part; the compensations are the architecture.",
    stack: [
      "C# / .NET",
      "Azure",
      "Cosmos DB",
      "Saga",
      "Event Sourcing",
      "Redis",
      "Docker",
      "React Native",
      "TypeScript",
    ],
  },
  "dead-inside": {
    subtitle: "From a personal idea to a commercial horror game on Steam.",
    period: "Jan 2019 — Mar 2023",
    role: "Solo developer",
    place: "Independent project",
    hook: "A game is a hundred small systems that only matter once they work together. This one took four years to get there — and then it shipped.",
    intro:
      "Dead Inside is a first-person horror game that I built and released on Steam on my own. I started it in January 2019, before my degree, and released it in March 2023, two months after graduating. It is the project that made me an engineer.",
    metrics: [
      ["Solo", "Design, code & release"],
      ["4 years", "From first build to Steam"],
      ["Unity / C#", "Engine & language"],
    ],
    chapters: [
      {
        kicker: "The start",
        title: "Curiosity, then a project",
        body: "Games were what first made me wonder how software works. Dead Inside was the attempt to find out properly: not a prototype or a tutorial, but a complete game that someone could buy and play from start to finish.",
      },
      {
        kicker: "The enemy",
        title: "Behaviour as a state machine",
        body: "The enemy AI runs on a state machine. Each behaviour is an explicit state, and each change of behaviour is an explicit transition with a reason. That structure kept the AI easy to debug, and let it react to the player without turning into a knot of special cases.",
      },
      {
        kicker: "The systems",
        title: "Making the pieces agree",
        body: "Around the AI sit a weapon and inventory system and kinematic animation blending. The hard part was not any single system but the seams between them: making mechanics, animation and AI behave like parts of one first-person experience.",
      },
      {
        kicker: "The release",
        title: "Finishing is its own skill",
        body: "Shipping meant carrying the idea through the unglamorous parts — integration, polish, the store page, the release itself — alone. It taught me to take responsibility for a complete result, not just the interesting parts of it.",
      },
    ],
    figures: [{ kind: "fsm", after: 1 }],
    takeaway:
      "Nearly everything I’ve built since has the same shape: separate systems, and the work of making them into one product.",
    stack: [
      "Unity",
      "C#",
      "State-machine AI",
      "Animation blending",
      "Inventory systems",
      "Steam",
    ],
  },
  agriculture: {
    subtitle: "A simulation environment for autonomous agricultural machinery.",
    period: "Sep 2024 — Jan 2025",
    role: "Software architect · Developer · Project manager",
    place: "M.Sc. capstone · with Fraunhofer IESE & John Deere",
    hook: "You don’t test an autonomous tractor on a real field first. First, you build the field.",
    intro:
      "For my master’s capstone, our team built a simulation environment for autonomous agricultural machinery, in collaboration with Fraunhofer IESE and John Deere. I held three roles at once: software architect, developer and project manager.",
    metrics: [
      ["CARLA", "On Unreal Engine"],
      ["2 weeks", "Sprint cycle"],
      ["3 roles", "Architect · developer · PM"],
    ],
    chapters: [
      {
        kicker: "The setting",
        title: "Why simulate a farm",
        body: "Autonomous machines have to be tested long before they are trusted with real equipment in a real field. A simulator lets you repeat a scenario, change one thing, and run it again — safely and cheaply.",
      },
      {
        kicker: "What I built",
        title: "A field inside a driving simulator",
        body: "We built the environment on CARLA and Unreal Engine, with Python and Pygame around it. CARLA was designed for city driving — roads, lanes, traffic lights — and a field has none of those. My part covered the software architecture and the implementation of the simulation environment for agricultural machinery.",
      },
      {
        kicker: "Running the team",
        title: "Design and delivery in one loop",
        body: "Alongside the code, I ran the project in two-week agile sprints. Holding both the architecture and the plan meant design decisions and the sprint plan could change together, in the same conversation.",
      },
    ],
    figures: [{ kind: "field", after: 1 }],
    takeaway:
      "Simulation is where software meets the physical world before it is allowed to touch it.",
    stack: ["CARLA", "Unreal Engine", "Python", "Pygame", "Agile / Scrum"],
  },
  rptu: {
    subtitle: "A master’s in Computer Science, taken alongside real work.",
    period: "Apr 2023 — Present",
    role: "M.Sc. Computer Science",
    place: "RPTU Kaiserslautern-Landau",
    hook: "In April 2023, three months after my bachelor’s, I started a master’s in Germany. Most of what I’ve built since was built alongside it.",
    intro:
      "I’m completing an M.Sc. in Computer Science at RPTU Kaiserslautern-Landau, with a minor in Data Visualization. The degree has run in parallel with almost everything else on this page: enterprise work, research at DFKI, a capstone with industry partners, and a semester in Barcelona.",
    metrics: [
      ["M.Sc.", "Computer Science"],
      ["Minor", "Data Visualization"],
      ["Erasmus+", "UAB Barcelona, 2026"],
    ],
    chapters: [
      {
        kicker: "The degree",
        title: "Computer science, with a picture",
        body: "Next to the core of computer science, my minor is Data Visualization: how to show data so that people can actually reason with it. The work graph on this site is a small, personal application of it.",
      },
      {
        kicker: "Applied work",
        title: "With industry, not just about it",
        body: "My capstone was an autonomous farming simulator built with Fraunhofer IESE and John Deere. On campus, I rebuilt the backend of RPTU Campus Games for more than 1,000 students.",
      },
      {
        kicker: "Abroad",
        title: "A semester in Barcelona",
        body: "From January to July 2026 I studied at Universitat Autònoma de Barcelona through Erasmus+, with coursework including Cloud Computing and Smart Industry.",
      },
    ],
    stack: [
      "Computer Science",
      "Data Visualization",
      "Cloud Computing",
      "Smart Industry",
    ],
  },
  duzce: {
    subtitle: "Where the fundamentals came from.",
    period: "Sep 2019 — Jan 2023",
    role: "B.Sc. Computer Engineering",
    place: "Düzce University · Düzce, Türkiye",
    hook: "I started my degree with a game already in progress. A little over three years later, both were finished.",
    intro:
      "I studied Computer Engineering at Düzce University in Türkiye from September 2019 to January 2023. It is where I learned the fundamentals that everything else on this page stands on.",
    metrics: [
      ["B.Sc.", "Computer Engineering"],
      ["2019 — 2023", "Düzce, Türkiye"],
      ["2022", "First Azure certifications"],
    ],
    chapters: [
      {
        kicker: "The degree",
        title: "The foundation",
        body: "A bachelor’s in Computer Engineering: the theory behind software, and the hardware it runs on. It gave me the vocabulary for the questions I had been asking since I first opened a game engine.",
      },
      {
        kicker: "Alongside it",
        title: "A game in parallel",
        body: "I had started Dead Inside in January 2019, a few months before the degree began. I kept building it through my studies and released it on Steam in March 2023, two months after graduating.",
      },
      {
        kicker: "Into industry",
        title: "Work before graduation",
        body: "In September 2022, in my final months at Düzce, I joined NTT DATA as a software engineer. The same year, I earned my first Microsoft certifications: Azure AI Fundamentals and Azure Data Fundamentals.",
      },
    ],
    stack: [
      "Computer Engineering",
      "Azure AI Fundamentals",
      "Azure Data Fundamentals",
    ],
  },
  uab: {
    subtitle:
      "An Erasmus+ semester in Barcelona, studying cloud computing and smart industry.",
    period: "Jan 2026 — Jul 2026",
    role: "Erasmus+ exchange student",
    place: "Universitat Autònoma de Barcelona · Spain",
    hook: "Six months in Barcelona, studying where software meets industry: the cloud underneath, and the factories it increasingly runs.",
    intro:
      "From January to July 2026 I studied at Universitat Autònoma de Barcelona through the Erasmus+ programme, as part of my master’s at RPTU.",
    metrics: [
      ["Erasmus+", "Exchange semester"],
      ["Jan — Jul 2026", "Barcelona, Spain"],
      ["Cloud · Industry", "Coursework focus"],
    ],
    chapters: [
      {
        kicker: "The courses",
        title: "Cloud Computing and Smart Industry",
        body: "My coursework included Cloud Computing and Smart Industry: the infrastructure modern software runs on, and the connected, data-driven side of manufacturing.",
      },
      {
        kicker: "Why it fits",
        title: "The same questions, from the other side",
        body: "Both subjects sit right next to my work — the AWS deployment behind the RUSH kiosks, the hardware that has to talk to software reliably, and the VR training built for manufacturing at DFKI.",
      },
    ],
    stack: ["Cloud Computing", "Smart Industry", "Erasmus+"],
  },
};
