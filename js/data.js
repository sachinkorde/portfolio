// ============================================================
//  PORTFOLIO CONTENT — edit this file to update your site.
//  Everything shown on the page comes from here.
// ============================================================

const PORTFOLIO = {
  name: "Sachin Korde",
  role: "Unity 3D Developer",
  // Rotating titles typed out in the hero
  roles: ["Unity 3D Developer", "Game Developer", "AR / VR Developer", "Multiplayer Game Dev"],
  yearsExp: "5+",
  tagline:
    "I build engaging 2D & 3D games, real-time multiplayer card & casino games, AR experiences and interactive simulations with Unity and C#, from toddler learning games to industrial digital twins.",
  location: "Pune, India",
  email: "sachinkorde1993@gmail.com",
  resumeFile: "assets/Sachin_Korde_Resume.pdf?v=3",

  socials: [
    { label: "LinkedIn", url: "https://www.linkedin.com/in/sachinkorde/" },
    // { label: "GitHub", url: "https://github.com/your-username" },
  ],

  about: [
    "I'm a Unity game developer with 5+ years of experience creating engaging 2D and 3D experiences. I work mainly in Unity and C#, with a strong focus on game physics, animation, level design and clean object-oriented code.",
    "I've built mixed-reality games and AR apps, educational games that help toddlers with early literacy, Unity-based simulation software for the energy industry, and, as a freelancer, real-time multiplayer Rummy, Bingo, casino and card games. I enjoy working with cross-functional teams — integrating APIs, authentication and reporting — to ship polished products on mobile, web and desktop.",
  ],

  skills: {
    "Engine & Languages": ["Unity 3D", "Unity 2D", "C#", "JavaScript", "ReactJS"],
    Specialties: ["Multiplayer Games", "Card & Casino Games", "Game Design", "Game Physics", "Animation", "Level Design", "AR", "VR"],
    "Tools & Integration": ["Blender", "Spine","REST APIs", "Addressables", "Asset Bundles", "Localization", "Sockets", "Game Testing"],
    Web: ["HTML/CSS", "JavaScript", "jQuery", "WordPress", "PHP", "CodeIgniter"],
  },

  // tags, link, repo and image are optional.
  // Add links like:  link: "https://play.google.com/...",  repo: "https://github.com/..."
  projects: [
    {
      title: "The Real Bingo",
      company: "Freelance",
      org: "Freelance",
      description:
        "A live multiplayer number game with a new round every 60 seconds. Rounds run on the server clock so every player sees the same countdown and result at the same moment, and outcomes are provably fair using a SHA-256 commit-reveal scheme. Includes a wallet with a full transaction ledger, referrals and KYC-verified withdrawals.",
      tags: ["Multiplayer", "Real-time", "Android", "Backend"],
      link: "https://bingo-backend-bjqq.onrender.com/",
      linkLabel: "Website",
      repo: "",
    },
    {
      title: "Rummy & Multiplayer Card Games",
      company: "Freelance",
      org: "Freelance",
      description:
        "Real-time multiplayer card games for freelance clients, including Rummy and other casino-style card games, with live matchmaking, turn-based game flow and server-synced game state.",
      tags: ["Unity", "C#", "Multiplayer", "Sockets"],
      link: "",
      repo: "",
    },
    {
      title: "Digital Pressure Testing (DPT)",
      company: "Aquila",
      org: "Aquila Digital Energy Solutions",
      description:
        "A Unity-based platform that validates drilling-rig pressure tests in real time against API STD 53. Built exact 3D replicas of client Choke Manifolds, Blowout Preventer (BOP) stacks and MPD equipment from engineering schematics, modeling missing parts in Blender. Tested each configuration against real-time pressure data before release, and added new features including a Casing test workflow and automated PDF reports.",
      tags: ["Unity 3D", "C#", "Blender", "Real-time Data", "ReactJS"],
      image: "https://www.aquila-engineer.com/wp-content/uploads/2026/05/auto-line-up-1-scaled.jpeg",
      link: "https://www.aquila-engineer.com/digital-pressure-testing/",
      linkLabel: "Product page",
      repo: "",
    },
    {
      title: "Cadaviz — Virtual Dissection Table",
      company: "ImmersiveVision",
      org: "ImmersiveVision Technology",
      description:
        "Cadaviz is an advanced virtual human dissection table used by medical colleges for interactive 3D anatomy learning. Got up to speed on its large existing codebase on my own, then designed and built a new section in the Male Full Body module with a clean, modular class structure, integrating 3D models and medical content from the content team.",
      tags: ["Unity 3D", "C#", "OOP", "3D Integration"],
      image: "https://immersivelabz.com/wp-content/uploads/2024/10/cadaviz.png",
      link: "https://immersivelabz.com/cadaviz/",
      linkLabel: "Product page",
      repo: "",
    },
    {
      title: "TMKOC Playschool Kids Learning",
      company: "Neela Mediatech",
      org: "Neela Mediatech · TMKOC",
      description:
        "An e-learning app for kids based on Taarak Mehta Ka Ooltah Chashmah (TMKOC), India's No. 1 TV serial. Built from scratch: registration flow, student dashboard, API data fetch/display/update, server content downloads via Addressables, and localization. Also built the Paint, ABCD Tracing and Puzzle learning games inside the app.",
      tags: ["Unity", "C#", "REST API", "Addressables", "Localization"],
      icon: "https://play-lh.googleusercontent.com/CajKjdg47A8vXsTcdW5kgBCX90SGUQux5InYjiseWUJbhPKjUawjxmH04Ka3_e5FGAGqw4VV-Bei34GbTea0Hg=s256",
      link: "https://play.google.com/store/apps/details?id=com.neelamediatech.playschool",
      repo: "",
    },
    {
      title: "Run Jetha Run | TMKOC Game",
      company: "Neela Mediatech",
      org: "Neela Mediatech · TMKOC",
      description:
        "An endless runner starring Jethalal from TMKOC, India's No. 1 TV serial. Optimized performance to remove lag, made animations smoother, and worked alongside the 3D modeler to update and create new 3D models.",
      tags: ["Unity 3D", "C#", "Optimization", "Animation"],
      icon: "https://play-lh.googleusercontent.com/CaFU42VXHbxvxrNedzz7CBS-GvoNs7NV6l41ZQWGlGBZjJzCnVdGNhUTJeIBoCqU4FB0TvSOHWsd2txLqTWkHg=s256",
      link: "https://play.google.com/store/apps/details?id=com.tmkocplay.run.jetha.run",
      repo: "",
    },
    {
      title: "Match & Merge : TMKOC Puzzle",
      company: "Neela Mediatech",
      org: "Neela Mediatech · TMKOC",
      description:
        "A 2048-style match-and-merge puzzle game featuring TMKOC characters. Improved animations and optimized gameplay performance.",
      tags: ["Unity", "C#", "Optimization", "Animation"],
      icon: "https://play-lh.googleusercontent.com/53xrjab7Mz0wKNx4UaSmoYvPyP0c42GfHX1FiBGwV-RuSWlrpUQwIFpFu6z2aVIfQw17zimu4D_TtOSIhzLgTw=s256",
      link: "https://play.google.com/store/apps/details?id=com.neelamediatech.tmkoc2048matchpool",
      repo: "",
    },
    {
      title: "Hungry Goli | TMKOC Game",
      company: "Neela Mediatech",
      org: "Neela Mediatech · TMKOC",
      description:
        "A casual game starring Goli from TMKOC. Gave the game its final polish and performance optimization before release.",
      tags: ["Unity", "C#", "Optimization"],
      icon: "https://play-lh.googleusercontent.com/d7PAWehJb7xZjSB_0qELxIQpHziiVaplf7lOLjFScXj1CZenmIDzf82IHuEpLOkyrlS3BM_FkDzPEbyfRfy-DQU=s256",
      link: "https://play.google.com/store/apps/details?id=com.NeelaGames.HungryGoli",
      repo: "",
    },
    {
      title: "Cooking Super Star - Tasty City",
      company: "AppOn",
      org: "AppOn Innovate",
      description:
        "A live cooking-simulation game. Built a limited-time Diwali festival event and added new levels, working closely with the game designer to improve the player experience, and created animated popups for a more polished UI.",
      tags: ["Unity", "C#", "LiveOps", "UI Animation"],
      icon: "https://play-lh.googleusercontent.com/TzFRhSGgbEnxQlIvuOC4qbzf6hpKQ3P4FJckdlvYEdUm5l1d1iO0P47spy70yyUKgHAI0RHAVbGfqEHWrPEwWA=s256",
      link: "https://play.google.com/store/apps/details?id=com.appon.cookingstar",
      repo: "",
    },
    {
      title: "World Of Carrom : 3D Board Game",
      company: "AppOn",
      org: "AppOn Innovate",
      description:
        "A 3D carrom board game. Added a Diwali festival event and new content, worked with the game designer on gameplay improvements, and built animated popups for the UI.",
      tags: ["Unity 3D", "C#", "LiveOps", "UI Animation"],
      icon: "https://play-lh.googleusercontent.com/5nfNn2k_P88pYpvlbiAte8zUeIpRYZ4UFohUsVQqd5MPARGZJc-TAtUujcvsFUQgc-Sv5oEAUgLpCHlnK7NE=s256",
      link: "https://play.google.com/store/apps/details?id=com.appon.carrom",
      repo: "",
    },
    {
      title: "K-Man Flying",
      company: "Kiddopia",
      org: "Kiddopia",
      description:
        "An endless space-flying game inside Kiddopia, a popular e-learning app for toddlers. Built from scratch: gameplay, responsive controls and performance optimization, with character animations created in Spine for smooth, lively 2D motion.",
      tags: ["Unity 2D", "C#", "Spine", "Animation"],
      icon: "https://play-lh.googleusercontent.com/YpxTvsGH_q-7MEteIa7TtE-ETM0VpSd8lE0lntg5Aaz11fLRwnPzDV9IkPiY-_iozomGgWImI-xlI8_XNUq6UUE=s256",
      link: "https://play.google.com/store/apps/details?id=com.paperboatapps.google.kiddopia",
      repo: "",
    },
    {
      title: "PathPuzzle",
      company: "Kiddopia",
      org: "Kiddopia",
      description:
        "A new game for Kiddopia's Puzzles section. Kids replicate intricate paths to build strategic thinking and problem-solving, with animated hints to guide them.",
      tags: ["Unity 2D", "C#", "Animation"],
      icon: "https://play-lh.googleusercontent.com/YpxTvsGH_q-7MEteIa7TtE-ETM0VpSd8lE0lntg5Aaz11fLRwnPzDV9IkPiY-_iozomGgWImI-xlI8_XNUq6UUE=s256",
      link: "https://play.google.com/store/apps/details?id=com.paperboatapps.google.kiddopia",
      repo: "",
    },
    {
      title: "ABCD Tracing, Paint & Cooking Master",
      company: "Kiddopia",
      org: "Kiddopia",
      description:
        "More learning games for Kiddopia: letter tracing to build early literacy, a paint game for creative expression, and Cooking Master, a playful cooking game for toddlers.",
      tags: ["Unity 2D", "C#", "Game Design"],
      icon: "https://play-lh.googleusercontent.com/YpxTvsGH_q-7MEteIa7TtE-ETM0VpSd8lE0lntg5Aaz11fLRwnPzDV9IkPiY-_iozomGgWImI-xlI8_XNUq6UUE=s256",
      link: "https://play.google.com/store/apps/details?id=com.paperboatapps.google.kiddopia",
      repo: "",
    },
    {
      title: "Magic Joey — AR Learning Cards",
      company: "Augment Works",
      org: "Augment Works",
      description:
        "An AR-based 3D learning product for kids aged 1–10. Children scan printed Magic Cardz (alphabets, fruits, vehicles) and Magic Sketz (animals) and watch them come alive as interactive 3D models with audio, quizzes and activities. Worked on the Unity AR app.",
      tags: ["Unity", "AR", "C#", "3D"],
      icon: "https://magicjoeyapp.com/wp-content/uploads/2021/04/Magic-Joey_Logo-design_.png",
      link: "https://magicjoeyapp.com/#cardz",
      linkLabel: "Product page",
      repo: "",
    },
    {
      title: "Human Anatomy AR",
      company: "Augment Works",
      org: "Augment Works",
      description:
        "An interactive AR app that lets users explore the human body in 3D, with engaging interactions and visuals that make anatomy easy and enjoyable to learn.",
      tags: ["Unity", "AR", "C#"],
      link: "",
      repo: "",
    },
    {
      title: "Industrial VR Training",
      company: "Augment Works",
      org: "Augment Works",
      description:
        "An immersive VR experience for an industrial client, built in Unity to simulate a real-world industrial environment and its interactions in virtual reality.",
      tags: ["Unity", "VR", "C#"],
      link: "",
      repo: "",
    },
    {
      title: "Casino Game Suite",
      company: "Other",
      description:
        "Five casino games in one app — Roulette Fun, Roulette 100, Lucky7 Dice Roll, Sic Bo Dice Roll and Fun Target — with rich animations and real-time socket connections.",
      tags: ["Unity", "C#", "Sockets"],
      link: "",
      repo: "",
    },
    {
      title: "Coloring NoteBook",
      company: "Other",
      description:
        "An interactive coloring app for toddlers with vibrant colors and engaging designs that encourage artistic expression in a simple, kid-friendly interface.",
      tags: ["Unity 2D", "C#"],
      link: "",
      repo: "",
    },
  ],

  experience: [
    {
      title: "Freelance Game Developer",
      org: "Independent",
      period: "Freelance", // TODO: add years, e.g. "2023 — Present"
      points: [
        "Build real-time multiplayer games for clients, including Rummy, Bingo, casino and card games.",
        "Worked on The Real Bingo, a live 60-second-round number game with server-synced rounds and provably fair results.",
      ],
    },
    {
      title: "Unity 3D Developer",
      org: "Aquila Digital Energy Solutions Pvt Ltd",
      period: "Feb 2025 — Apr 2026",
      points: [
        "Developed Digital Pressure Testing (DPT), a Unity-based platform that validates drilling-rig BOP pressure tests in real time against API STD 53.",
        "Converted client Choke Manifold, BOP and MPD (Managed Pressure Drilling) schematics into exact interactive 3D replicas, building missing equipment models in Blender.",
        "Tested every new equipment configuration against real-time pressure data and shipped it into the product.",
        "Built new features, including a Casing test workflow and automated PDF report generation, and kept them in sync with the ReactJS web app.",
      ],
    },
    {
      title: "Unity Developer",
      org: "ImmersiveVision Technology Pvt. Ltd.",
      period: "Jul 2024 — Sep 2024",
      points: [
        "Worked on Cadaviz, an advanced virtual human dissection table used by medical colleges, with 90+ installations.",
        "Onboarded independently onto a large existing codebase, studying its architecture, code flow and conventions.",
        "Designed and implemented a new section in the Male Full Body module, using a clean, modular class structure and integrating 3D models and medical content from the content team.",
      ],
    },
    {
      title: "Game Developer",
      org: "Neela Mediatech / Neela Films Pvt. Ltd.",
      period: "Jan 2024 — Jul 2024",
      points: [
        "Worked on official mobile games for TMKOC (Taarak Mehta Ka Ooltah Chashmah), India's No. 1 TV serial.",
        "Built TMKOC Playschool from scratch: registration, student dashboard, REST API integration, Addressables content downloads and localization, plus Paint, ABCD Tracing and Puzzle games.",
        "Optimized and polished Run Jetha Run, Match & Merge and Hungry Goli: fixed lag, smoothed animations and updated 3D models with the art team.",
      ],
    },
    {
      title: "Unity Game Developer",
      org: "AppOn Software",
      period: "Sep 2023 — Nov 2023",
      points: [
        "Built a limited-time Diwali festival event and new levels for Cooking Super Star - Tasty City and World Of Carrom.",
        "Worked closely with the game designer to improve gameplay and the player experience.",
        "Created animated popups and optimized performance for smooth gameplay across devices.",
      ],
    },
    {
      title: "Game Developer",
      org: "Kiddopia",
      period: "Jul 2022 — Jun 2023",
      points: [
        "Developed Unity 2D games for Kiddopia, a popular e-learning app for toddlers.",
        "Built K-Man Flying, an endless space game, from scratch, with character animations in Spine.",
        "Added PathPuzzle to the Puzzles section, and built ABCD Tracing, Paint, Cooking Master, Balloon Pop and Find Correct Word.",
      ],
    },
    {
      title: "Web Developer → Unity AR/VR Developer",
      org: "Augment Works",
      period: "Dec 2019 — Jun 2022",
      points: [
        "Started my career building many client websites with WordPress, HTML, CSS, JavaScript and jQuery, plus PHP / CodeIgniter backends.",
        "Moved into Unity development on the company's AR/VR products: Magic Joey (AR learning cards for kids), a Human Anatomy AR app and an industrial VR project.",
        "Worked directly with clients to gather requirements and deliver tailored features.",
      ],
    },
    {
      title: "B.E. — Computer Science & Engineering",
      org: "MGM Jawaharlal Nehru Engineering College, Aurangabad",
      period: "2017",
      points: [],
    },
  ],
};
