// ============================================================
//  GAME LANDING PAGES (GameFusion Studio)
//  Edit here, then run:  node tools/build-blog.js
//  Pages are generated at /games/<slug>.html
//  Short share links (/play/<slug>) are in vercel.json
// ============================================================

const PLAY = (id) => `https://play.google.com/store/apps/details?id=${id}`;

module.exports = [
  {
    slug: "block-puzzle",
    name: "Block Puzzle",
    packageId: "studio.gamefusion.blockpuzzle",
    play: PLAY("studio.gamefusion.blockpuzzle"),
    studio: "GameFusion Studio",
    genre: "Puzzle",
    tagline: "A relaxing block puzzle brain game for all ages",
    seoTitle: "Block Puzzle Game for Android: Free, Offline Brain Puzzle | GameFusion Studio",
    description: "Block Puzzle is a free, relaxing block puzzle game for Android. Drag blocks onto a 10x10 grid, clear rows and columns, and train your brain across hundreds of levels. Plays offline, no time limits.",
    keywords: ["block puzzle game", "block puzzle offline", "free puzzle game android", "brain puzzle game", "10x10 block puzzle", "puzzle game for all ages", "GameFusion Studio"],
    facts: { price: "Free", offline: true, rating: "Rated 3+", extras: "Contains ads · In-app purchases" },
    intro: [
      "**Block Puzzle** is a simple, satisfying puzzle game you can pick up in seconds and play for hours. Drag colorful block shapes onto a **10x10 grid**, complete full rows and columns to clear them, and keep the board open as long as you can.",
      "There's **no timer**, so you can play at your own pace, whether you've got two minutes on a break or a whole evening to relax. And because it **works offline**, it's perfect for travel or anywhere without Wi-Fi.",
    ],
    howTo: [
      "Drag a block shape from the tray onto the 10x10 grid.",
      "Fill a complete row or column to clear it and score points.",
      "Plan ahead: every shape has to fit somewhere, so leave space for big pieces.",
      "Clear multiple lines at once for bigger scores and progress through the levels.",
    ],
    features: [
      "**Hundreds of levels** that get more challenging as you go",
      "**No time limits**: play relaxed, at your own pace",
      "**Offline play**: no internet needed",
      "**Daily challenges** with fresh puzzles and rewards",
      "**Leaderboards** to compete with friends and players worldwide",
      "**Themes and skins** to personalise the look",
      "**Clean, minimal design** that's easy on the eyes",
      "**For all ages**, from kids to grandparents",
    ],
    tips: [
      "**Keep a 3x3 space free.** The biggest square piece is the one that usually ends a game.",
      "**Build along the edges first** and keep the middle of the board open for awkward shapes.",
      "**Look at all the pieces before placing one.** The order you place them matters as much as where.",
      "**Aim for combos.** Clearing a row and a column in one move frees up much more space.",
    ],
    whyPlay: "Puzzle games like this are a fun way to practise **focus, spatial thinking and planning**. If you enjoy classic falling-block games, Sudoku or jigsaw puzzles, Block Puzzle gives you that same \"one more round\" feeling, with no stress.",
    faq: [
      ["Is Block Puzzle free?", "Yes, Block Puzzle is free to download and play on Android. It contains ads and optional in-app purchases."],
      ["Can I play Block Puzzle offline?", "Yes. You can play without an internet connection, so it's great for travel or short breaks anywhere."],
      ["Is there a time limit?", "No. There's no timer, so you can think through every move and play at your own pace."],
      ["Is it suitable for kids?", "Yes. Block Puzzle is rated 3+ on Google Play and designed for players of all ages."],
      ["Where can I download Block Puzzle?", "Block Puzzle is available on the Google Play Store for Android phones and tablets."],
    ],
  },

  {
    slug: "sweet-swirl-saga",
    name: "Sweet Swirl Saga",
    packageId: "studio.gamefusionstudio.sweetswirlsaga",
    play: PLAY("studio.gamefusionstudio.sweetswirlsaga"),
    studio: "GameFusion Studio",
    genre: "Match 3 Puzzle",
    tagline: "A colorful match 3 candy puzzle adventure",
    seoTitle: "Sweet Swirl Saga: Free Match 3 Candy Puzzle Game (Offline) | GameFusion Studio",
    description: "Sweet Swirl Saga is a free match 3 candy puzzle game for Android. Swap and match colorful candies, unlock boosters and special combos, and play hundreds of levels, even offline.",
    keywords: ["match 3 game", "candy match game", "match 3 puzzle offline", "free candy puzzle game", "Sweet Swirl Saga", "casual puzzle game android", "GameFusion Studio"],
    facts: { price: "Free", offline: true, rating: "Rated 3+", extras: "Contains ads · In-app purchases" },
    intro: [
      "**Sweet Swirl Saga** is a bright, cheerful **match 3 puzzle game** full of colorful candies, satisfying combos and hundreds of levels to beat. Swap candies, line up three or more of the same color and watch the board burst with sweet chain reactions.",
      "It's easy to learn but keeps getting more interesting, with **special candies, boosters and daily rewards** along the way. And yes, it **plays offline**, so your candy adventure goes wherever you go.",
    ],
    howTo: [
      "Swap two neighbouring candies to line up 3 or more of the same color.",
      "Complete each level's objective to move on to the next one.",
      "Match 4 or 5 candies at once to create powerful special candies.",
      "Combine special candies to trigger huge chain reactions and big scores.",
    ],
    features: [
      "**Hundreds of match 3 levels** with growing challenges",
      "**Special candies and powerful boosters** for massive combos",
      "**Daily rewards** and bonus prizes",
      "**Offline play**: no Wi-Fi needed",
      "**Easy controls** and smooth gameplay",
      "**Colorful graphics** and fun visual effects",
      "**Free to download and play**",
      "**For kids, teens and adults**",
    ],
    tips: [
      "**Make matches near the bottom of the board.** New candies fall in and can create free chain reactions.",
      "**Save your special candies** for when you can combine two of them. Combos are far stronger than single blasts.",
      "**Always check the level objective first**, so every move works toward the goal, not just points.",
      "**Look for 4- and 5-candy matches** before taking an easy 3-match.",
    ],
    whyPlay: "Match 3 games are a classic for a reason: **quick to start, relaxing to play and rewarding to master**. Sweet Swirl Saga adds bright candy visuals, satisfying combos and steady rewards, perfect for short breaks or a cosy evening.",
    faq: [
      ["Is Sweet Swirl Saga free?", "Yes, it's free to download and play on Android. It contains ads and optional in-app purchases."],
      ["Can I play Sweet Swirl Saga offline?", "Yes. You can play without an internet connection."],
      ["What kind of game is Sweet Swirl Saga?", "It's a match 3 puzzle game: you swap candies to make lines of three or more matching colors and complete level goals."],
      ["Is it suitable for kids?", "Yes. Sweet Swirl Saga is rated 3+ on Google Play and is made for players of all ages."],
      ["Where can I download it?", "Sweet Swirl Saga is available on the Google Play Store for Android."],
    ],
  },

  {
    slug: "screw-puzzle",
    name: "Screw Puzzle",
    altName: "Screw Master Puzzle",
    packageId: "studio.gamefusion.screwpuzzle",
    play: PLAY("studio.gamefusion.screwpuzzle"),
    studio: "GameFusion Studio",
    genre: "Logic Puzzle",
    tagline: "A satisfying screw and bolt brain teaser",
    seoTitle: "Screw Puzzle: Free Unscrew & Bolt Brain Game for Android | GameFusion Studio",
    description: "Screw Puzzle (Screw Master Puzzle) is a free screw and bolt removal brain game for Android. Unscrew bolts in the right order to free wooden pieces, across hundreds of logic puzzle levels.",
    keywords: ["screw puzzle", "screw puzzle game", "unscrew puzzle", "nuts and bolts puzzle", "screw master puzzle", "brain teaser game android", "logic puzzle game free"],
    facts: { price: "Free", offline: false, rating: "Rated 3+", extras: "Contains ads · In-app purchases" },
    intro: [
      "**Screw Puzzle** (also called **Screw Master Puzzle**) is a satisfying logic game where you **unscrew bolts in the right order** to free wooden pieces from the board. It looks simple, but one wrong move can lock a piece in place, so every level is a real brain teaser.",
      "With a relaxing **wooden puzzle theme**, easy tap controls and **hundreds of levels** that get trickier as you go, it's perfect for quick breaks or longer puzzle sessions.",
    ],
    howTo: [
      "Look carefully at how the wooden pieces, screws and bolts overlap.",
      "Tap a screw to remove it and move it to a free hole.",
      "Remove screws in the correct order so pieces can fall away.",
      "Avoid moves that block other pieces, and clear the whole board to win.",
    ],
    features: [
      "**Unique screw and bolt removal** puzzle mechanics",
      "**Hundreds of brain-teasing levels**",
      "**Easy, satisfying tap controls**",
      "**Relaxing wooden puzzle theme**",
      "**Difficulty that grows** as you improve",
      "**Regular updates** with new levels",
      "**Great for logic and critical thinking**",
      "**Suitable for all ages**",
    ],
    tips: [
      "**Start with the top layer.** Pieces on top often hold everything below them in place.",
      "**Don't fill your free holes too fast.** Keeping empty spots gives you room to fix mistakes.",
      "**Trace each piece before tapping**: which screws actually hold it, and which are decoys?",
      "**Stuck? Restart and change your first few moves.** The opening order usually decides the level.",
    ],
    whyPlay: "Screw puzzles combine the **satisfaction of a mechanical puzzle** with real strategy. They're quick to understand, oddly relaxing to play, and give you a genuine \"aha!\" moment when a tricky board finally clears.",
    faq: [
      ["Is Screw Puzzle free?", "Yes, Screw Puzzle is free to download and play on Android. It contains ads and optional in-app purchases."],
      ["How do you play a screw puzzle game?", "Tap screws to remove them in the right order so the wooden pieces they hold can fall off the board. Clear every piece to finish the level."],
      ["Is Screw Puzzle hard?", "Early levels are easy to learn, and the puzzles get more complex as you progress, so it suits both beginners and puzzle fans."],
      ["Is it suitable for kids?", "Yes. Screw Puzzle is rated 3+ on Google Play."],
      ["Where can I download Screw Puzzle?", "Screw Puzzle is available on the Google Play Store for Android."],
    ],
  },
];
