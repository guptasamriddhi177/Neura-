export type TryItAgeBand = '5-6' | '7-8' | '9-10' | '11-12';
export type TryItInterest =
  | 'Dinosaurs'
  | 'Space'
  | 'Football'
  | 'Animals'
  | 'Building';

export interface TryItOption {
  label: string;
  isCorrect: boolean;
  feedback: string;
}

export interface TryItScenario {
  topicTag: string;
  chalkSketch: string;
  prompt: string;
  options: [TryItOption, TryItOption, TryItOption];
}

export const TRY_IT_AGES: TryItAgeBand[] = ['5-6', '7-8', '9-10', '11-12'];
export const TRY_IT_INTERESTS: { id: TryItInterest; label: string }[] = [
  { id: 'Dinosaurs', label: 'Dinosaurs' },
  { id: 'Space', label: 'Space' },
  { id: 'Football', label: 'Football' },
  { id: 'Animals', label: 'Animals' },
  { id: 'Building', label: 'Minecraft-style building' },
];

export const TRY_IT_SCENARIOS: Record<TryItAgeBand, Record<TryItInterest, TryItScenario>> = {
  '5-6': {
    Dinosaurs: {
      topicTag: 'Counting & Making 5',
      chalkSketch: 'Nest 1: [ 🥚 🥚 🥚 ]   Nest 2: [ 🥚 🥚 ]',
      prompt: 'Little Rex sees 3 eggs in the left nest and 2 eggs in the right nest. How many eggs in total?',
      options: [
        {
          label: '4 eggs',
          isCorrect: false,
          feedback: 'Good try! Put up 3 fingers on one hand and 2 on the other. Let us count all 5 together.',
        },
        {
          label: '5 eggs',
          isCorrect: true,
          feedback: 'Great thinking! You counted 3, then 4, 5 — that makes 5 dinosaur eggs.',
        },
        {
          label: '6 eggs',
          isCorrect: false,
          feedback: 'Almost! Check if one egg got counted twice: 1, 2, 3... then 4, 5.',
        },
      ],
    },
    Space: {
      topicTag: 'One More, One Less',
      chalkSketch: 'Stars in view: ★ ★ ★ ★',
      prompt: 'Nu counts 4 glowing stars out the rocket window. One more star pops out! How many stars now?',
      options: [
        {
          label: '3 stars',
          isCorrect: false,
          feedback: 'Wait — a new star popped IN rather than away. Should the number go up or down?',
        },
        {
          label: '5 stars',
          isCorrect: true,
          feedback: 'Spot on! One more than 4 is always 5. Ready for liftoff!',
        },
        {
          label: '8 stars',
          isCorrect: false,
          feedback: 'Ooh, that would be adding 4 more stars! Just add 1 to 4: 4, 5.',
        },
      ],
    },
    Football: {
      topicTag: 'Comparing Groups',
      chalkSketch: 'Red Team: ⚽ ⚽   Blue Team: ⚽ ⚽ ⚽ ⚽',
      prompt: 'The Red Team has 2 balls and the Blue Team has 4 balls. Which team has MORE balls?',
      options: [
        {
          label: 'Red Team',
          isCorrect: false,
          feedback: 'Look closely at the two lines of balls. Which line stretches farther?',
        },
        {
          label: 'Blue Team',
          isCorrect: true,
          feedback: 'Goal! 4 is bigger than 2, so the Blue Team has 2 extra balls.',
        },
        {
          label: 'Same amount',
          isCorrect: false,
          feedback: 'Try pairing them up one by one — Blue Team still has 2 left over!',
        },
      ],
    },
    Animals: {
      topicTag: 'Beginning Sounds',
      chalkSketch: '🦊  F - O - X',
      prompt: 'Which animal starts with the same /f/ sound as "Fox"?',
      options: [
        {
          label: 'Frog',
          isCorrect: true,
          feedback: 'Nice ear! /f/ Fox and /f/ Frog both start with the breezy F sound!',
        },
        {
          label: 'Bear',
          isCorrect: false,
          feedback: 'Listen to your lips on "Bear" — that starts with /b/. Try saying "F-f-fox" and "F-f-frog"!',
        },
        {
          label: 'Cat',
          isCorrect: false,
          feedback: '"Cat" starts with a crisp /k/ sound. Which animal starts with /f/?',
        },
      ],
    },
    Building: {
      topicTag: 'Shapes & Corners',
      chalkSketch: '[ ■ ]  Square Block',
      prompt: 'You place a flat square block on your tower. How many corners does one square face have?',
      options: [
        {
          label: '3 corners',
          isCorrect: false,
          feedback: 'A triangle has 3 pointy corners! Trace around a square — count top-left, top-right, bottom-right, bottom-left.',
        },
        {
          label: '4 corners',
          isCorrect: true,
          feedback: 'Builder brain! Every square has 4 equal sides and 4 neat corners.',
        },
        {
          label: '5 corners',
          isCorrect: false,
          feedback: 'Let us touch each corner once and stop when we get back to the start: 1, 2, 3, 4!',
        },
      ],
    },
  },
  '7-8': {
    Dinosaurs: {
      topicTag: 'Halves & Quarters',
      chalkSketch: 'Nest: [ 🥚🥚 | 🥚🥚 | 🥚🥚 | 🥚🥚 ]  (8 eggs total)',
      prompt: '8 dino eggs are shared equally across 4 warm nests. How many eggs sit in ONE nest (1/4 of 8)?',
      options: [
        {
          label: '2 eggs',
          isCorrect: true,
          feedback: 'Great thinking! 2 + 2 + 2 + 2 = 8, so one quarter of 8 is 2 eggs.',
        },
        {
          label: '4 eggs',
          isCorrect: false,
          feedback: '4 eggs per nest is splitting between 2 nests (halves). Try sharing across 4 nests!',
        },
        {
          label: '1 egg',
          isCorrect: false,
          feedback: 'If each nest only got 1 egg, that would use 4 eggs. What happens if we deal a second round?',
        },
      ],
    },
    Space: {
      topicTag: 'Place Value (Tens & Ones)',
      chalkSketch: 'Fuel Pods: [10] [10] [10] + • • • • •',
      prompt: 'Your starship loads 3 ten-star pods and 5 single stars. What is your total fuel?',
      options: [
        {
          label: '8 stars',
          isCorrect: false,
          feedback: 'Careful! Each big pod holds 10 stars, not 1. Count by tens for the 3 pods: 10, 20, 30...',
        },
        {
          label: '35 stars',
          isCorrect: true,
          feedback: 'Mission ready! 3 tens (30) plus 5 ones makes 35 stars.',
        },
        {
          label: '53 stars',
          isCorrect: false,
          feedback: 'Wait — you flipped tens and ones! We have 3 tens and 5 ones, not 5 tens.',
        },
      ],
    },
    Football: {
      topicTag: 'Equal Groups',
      chalkSketch: 'Row 1: ⚽⚽⚽⚽  |  Row 2: ⚽⚽⚽⚽  |  Row 3: ⚽⚽⚽⚽',
      prompt: 'Coach lines up 3 rows with 4 footballs in each row. How could you count them faster than 1-by-1?',
      options: [
        {
          label: 'Skip-count by 4s: 4, 8, 12',
          isCorrect: true,
          feedback: 'Smart shortcut! 3 equal groups of 4 equals 12 footballs.',
        },
        {
          label: 'Add 3 + 4 = 7',
          isCorrect: false,
          feedback: '3 + 4 only counts one row plus the number 3. Remember each of the 3 rows holds 4 balls!',
        },
        {
          label: 'Skip-count by 3s twice: 3, 6',
          isCorrect: false,
          feedback: 'Close idea to skip-count, just check how many balls sit in each row: 4!',
        },
      ],
    },
    Animals: {
      topicTag: 'Habitats & Adaptation',
      chalkSketch: '🌵 Hot Desert  vs  ❄️ Snowy Arctic',
      prompt: 'Why does an Arctic fox grow thick white fur in winter while a desert fox has huge ears?',
      options: [
        {
          label: 'White fur hides & warms in snow; big ears release heat in the desert',
          isCorrect: true,
          feedback: 'Scientist mindset! Every body part helps an animal survive its exact habitat.',
        },
        {
          label: 'Because foxes pick their favourite winter coat style',
          isCorrect: false,
          feedback: 'Think about survival: what problem does cold snow create, and what problem does scorching heat create?',
        },
        {
          label: 'Big ears help the desert fox swim faster',
          isCorrect: false,
          feedback: 'Not much water in the desert! Hint: thin wide ears let warm body heat escape into the air.',
        },
      ],
    },
    Building: {
      topicTag: 'Perimeter Thinking',
      chalkSketch: 'Base: 5 blocks long × 3 blocks wide',
      prompt: 'You build a rectangular wall around a 5-by-3 garden patch. How many fence blocks go all the way around?',
      options: [
        {
          label: '8 blocks',
          isCorrect: false,
          feedback: '8 blocks only covers two sides (5 + 3)! Remember a rectangle has 4 sides to close.',
        },
        {
          label: '15 blocks',
          isCorrect: false,
          feedback: '5 × 3 = 15 fills the INSIDE floor (area). Here we want the outside border!',
        },
        {
          label: '16 blocks',
          isCorrect: true,
          feedback: 'Spot on! 5 + 3 + 5 + 3 = 16 blocks all the way around the perimeter.',
        },
      ],
    },
  },
  '9-10': {
    Dinosaurs: {
      topicTag: 'Equivalent Fractions',
      chalkSketch: 'Trail A: 2/3 done   |   Trail B: ?/6 done (same distance)',
      prompt: 'A Stegosaurus walks 2/3 of the canyon trail. How many sixths of the trail is that?',
      options: [
        {
          label: '3/6',
          isCorrect: false,
          feedback: '3/6 is exactly half (1/2). Is 2/3 equal to half, or bigger than half?',
        },
        {
          label: '4/6',
          isCorrect: true,
          feedback: 'Awesome reasoning! Doubling the parts from 3 to 6 doubles 2 parts into 4/6.',
        },
        {
          label: '5/6',
          isCorrect: false,
          feedback: 'Check your multiplier: 3 × 2 = 6 on the bottom, so do 2 × 2 on top!',
        },
      ],
    },
    Space: {
      topicTag: 'Solar System Scale',
      chalkSketch: '☀️ Sun  →  🌍 Earth (1 year)  →  🔴 Mars (longer orbit)',
      prompt: 'Why does Mars take nearly twice as long as Earth to finish one full orbit around the Sun?',
      options: [
        {
          label: 'Mars travels a much wider circle farther from the Sun and moves slower',
          isCorrect: true,
          feedback: 'Exact astronomy! Farther planets have bigger orbital paths and weaker solar pull.',
        },
        {
          label: 'Mars stops to spin backward every winter',
          isCorrect: false,
          feedback: 'Planets never stop orbiting! Think about running on the outside lane vs inside lane of a track.',
        },
        {
          label: 'Mars is heavier than the Sun',
          isCorrect: false,
          feedback: 'The Sun holds 99.8% of our solar system’s mass! Compare the track lengths around the Sun.',
        },
      ],
    },
    Football: {
      topicTag: 'Comparing Fractions',
      chalkSketch: 'Keeper saved 3/4 shots  vs  Backup saved 5/8 shots',
      prompt: 'Who saved a higher fraction of shots: 3/4 or 5/8?',
      options: [
        {
          label: '5/8 because 5 and 8 are bigger numbers',
          isCorrect: false,
          feedback: 'Careful! Eighths are smaller pieces than quarters. Try turning 3/4 into eighths first!',
        },
        {
          label: '3/4 because it equals 6/8, which beats 5/8',
          isCorrect: true,
          feedback: 'Match-winning logic! Converting 3/4 to 6/8 makes comparing fair.',
        },
        {
          label: 'They are equal',
          isCorrect: false,
          feedback: 'Check: 3/4 = 6/8. Compare 6/8 and 5/8 — one is 1/8 ahead!',
        },
      ],
    },
    Animals: {
      topicTag: 'Food Web Cause & Effect',
      chalkSketch: '🌿 Grass  →  🐇 Rabbits  →  🦉 Owls',
      prompt: 'If a dry summer cuts the meadow grass in half, what happens FIRST to the rabbit population?',
      options: [
        {
          label: 'Rabbits have less food, so fewer survive and owls must search wider',
          isCorrect: true,
          feedback: 'Great systems thinking! Changes at the producer level ripple up the whole web.',
        },
        {
          label: 'Grass grows back instantly because owls eat grass',
          isCorrect: false,
          feedback: 'Check the arrows: owls are predators, not plant-eaters. Start with what rabbits eat!',
        },
        {
          label: 'Nothing changes for any animal',
          isCorrect: false,
          feedback: 'Every consumer depends on energy from plants. Follow the arrow from grass to rabbits!',
        },
      ],
    },
    Building: {
      topicTag: 'Area vs Perimeter',
      chalkSketch: 'Room: 6 blocks × 4 blocks',
      prompt: 'You want to tile the entire 6 × 4 floor of your base. How many floor blocks do you need?',
      options: [
        {
          label: '20 blocks',
          isCorrect: false,
          feedback: '20 blocks (6+4+6+4) builds the outer walls. To cover the INSIDE floor, multiply rows × columns!',
        },
        {
          label: '24 blocks',
          isCorrect: true,
          feedback: 'Blueprint master! 6 columns of 4 blocks equals 24 square floor tiles.',
        },
        {
          label: '10 blocks',
          isCorrect: false,
          feedback: '6 + 4 only gives one L-shaped corner. Imagine 4 full rows of 6 blocks each!',
        },
      ],
    },
  },
  '11-12': {
    Dinosaurs: {
      topicTag: 'Ratios & Scaling',
      chalkSketch: 'T-Rex stride : Velociraptor stride = 5 : 2',
      prompt: 'For every 5 metres a T-Rex steps, a Raptor steps 2 metres. If the T-Rex moves 20 metres, how far does the Raptor move?',
      options: [
        {
          label: '8 metres',
          isCorrect: true,
          feedback: 'Sharp ratio thinking! 5 × 4 = 20, so multiply 2 × 4 to keep the ratio balanced: 8 metres.',
        },
        {
          label: '17 metres',
          isCorrect: false,
          feedback: 'Ratios multiply rather than add! Look at what factor scales 5 up to 20.',
        },
        {
          label: '10 metres',
          isCorrect: false,
          feedback: 'Check your scale factor: 20 ÷ 5 = 4, not 5! Multiply 2 by 4.',
        },
      ],
    },
    Space: {
      topicTag: 'Percentages & Gravity',
      chalkSketch: 'Earth weight: 50 kg  |  Moon gravity ≈ 16% of Earth',
      prompt: 'A rover weighs 50 kg on Earth. Moon gravity pulls with about 16% as much force. About how heavy does it feel on the Moon?',
      options: [
        {
          label: '8 kg',
          isCorrect: true,
          feedback: 'Astrophysics win! 16% of 100 is 16, so 16% of 50 (half of 100) is 8 kg!',
        },
        {
          label: '16 kg',
          isCorrect: false,
          feedback: '16 kg would be 16% of a 100 kg rover. Ours is 50 kg — half as heavy!',
        },
        {
          label: '34 kg',
          isCorrect: false,
          feedback: '34 kg is 50 minus 16, rather than 16% of 50. Hint: 16% per 100 means 8 per 50.',
        },
      ],
    },
    Football: {
      topicTag: 'Percentages & Shooting Accuracy',
      chalkSketch: 'Player A: 12 goals / 20 shots  |  Player B: 7 goals / 10 shots',
      prompt: 'Which striker has the better shooting percentage, and why?',
      options: [
        {
          label: 'Player B (70% vs 60%)',
          isCorrect: true,
          feedback: 'Clinical finish! 12/20 = 60/100 (60%), while 7/10 = 70/100 (70%).',
        },
        {
          label: 'Player A because 12 goals is more than 7',
          isCorrect: false,
          feedback: 'Player A also took twice as many shots! Convert both to shots out of 100 (or out of 20).',
        },
        {
          label: 'They have the same percentage',
          isCorrect: false,
          feedback: 'Scale Player B up to 20 shots: 7/10 = 14/20, compared to 12/20!',
        },
      ],
    },
    Animals: {
      topicTag: 'Claim, Evidence & Reasoning',
      chalkSketch: 'Data: Dolphin clicks bounce back in 0.02s from fish 15m away',
      prompt: 'Why is "Dolphins use sound echoes to measure distance underwater" a scientific claim backed by data?',
      options: [
        {
          label: 'Because timed echo delays directly correspond to how far away the fish is',
          isCorrect: true,
          feedback: 'Evidence-based reasoning! Linking measurable return time to distance proves echolocation.',
        },
        {
          label: 'Because dolphins look happy when they click',
          isCorrect: false,
          feedback: 'Mood is a guess, not measurable evidence! Look at the 0.02s and 15m numbers.',
        },
        {
          label: 'Because sound cannot travel in water',
          isCorrect: false,
          feedback: 'Actually sound travels 4× faster in water than air! Check how the echo timing proves distance.',
        },
      ],
    },
    Building: {
      topicTag: 'Volume of 3D Prisms',
      chalkSketch: 'Vault: 4 wide × 3 deep × 5 tall',
      prompt: 'You build a solid stone vault 4 blocks wide, 3 blocks deep, and 5 blocks tall. How many blocks total?',
      options: [
        {
          label: '12 blocks',
          isCorrect: false,
          feedback: '4 × 3 = 12 blocks is just the bottom 1-block layer! Now stack 5 of those layers.',
        },
        {
          label: '60 blocks',
          isCorrect: true,
          feedback: 'Master architect! 12 blocks per layer × 5 layers high = 60 blocks.',
        },
        {
          label: '35 blocks',
          isCorrect: false,
          feedback: 'Check the multiplication: (4 × 3) = 12, and 12 × 5 = 60.',
        },
      ],
    },
  },
};

export const LANDING_CONTENT = {
  brand: {
    name: 'Neura',
    tagline: 'Homework help that teaches your child to think, not just the answer.',
    subhead:
      'Neura learns who your child is, their interests, how they think, where they struggle, then builds a lesson just for them.',
    primaryCta: 'Start free, no credit card',
    secondaryCta: 'Watch a 30-second demo',
    trustStrip: [
      'Child-safe by design',
      'No open chat',
      'Progress stays in your browser',
      'Free to start',
    ],
  },
  navLinks: [
    { label: 'Why Neura', href: '#why-neura' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Parents say', href: '#parents-say' },
    { label: 'Safety', href: '#safety' },
    { label: 'FAQ', href: '#faq' },
  ],
  problem: {
    headline: 'Does homework end in tears?',
    cards: [
      {
        title: 'They say "I\'m just bad at math"',
        body: 'One confusing worksheet makes bright kids assume they are simply "not a math person" — when nobody explained it in a way that fits their brain.',
        icon: 'heart-crack',
      },
      {
        title: 'Videos and apps give answers, but they forget by tomorrow',
        body: 'Passive videos and answer-bots hand over the final number. Nothing clicks because your child never had to reason it through.',
        icon: 'fast-forward',
      },
      {
        title: "You don't know where they're really stuck",
        body: 'Seeing "65%" on a quiz does not tell you whether they struggled with the concept, misread the wording, or skipped a prerequisite.',
        icon: 'compass',
      },
    ],
    closing: 'Neura fixes the real problem: understanding.',
  },
  whyNeura: {
    headline: 'Built around your child, not a rigid syllabus.',
    subhead: 'Every lesson adapts across five choices — age, grade, subject, interest, and learning method.',
    cards: [
      {
        title: 'Adapts to your child',
        body: 'Lessons built around age, interests, and learning style. A dinosaur fan learns fractions with dino eggs; a football fan learns with matchday scores.',
        highlight: '5 personalisation inputs per lesson',
        span: 'md:col-span-2',
        accent: 'sunny',
      },
      {
        title: 'Socratic, never preachy',
        body: 'Guiding questions, three gentle hint levels, and celebrating thinking — never just dumping answers.',
        highlight: 'Ask, hint, guide, celebrate',
        span: 'md:col-span-1',
        accent: 'sky',
      },
      {
        title: 'Safe by design',
        body: 'No open-ended chatbot. Every generated lesson passes both a child-safety check and a grade-curriculum check before your child sees a single word.',
        highlight: 'Double-checked before display',
        span: 'md:col-span-1',
        accent: 'coral',
      },
      {
        title: 'Progress you can see',
        body: 'Plain-language insights for parents showing what is clicking, where they need a gentle replay, and which learning methods help them fastest.',
        highlight: 'Zero jargon parent reports',
        span: 'md:col-span-2',
        accent: 'chalkboard',
      },
    ],
  },
  howItWorks: {
    headline: 'From homework struggle to an "aha!" in two minutes',
    steps: [
      {
        num: '01',
        title: 'Tell us who they are',
        body: '60-second setup: name (stored locally only), age, grade & curriculum, up to 3 interests, and how they learn best.',
      },
      {
        num: '02',
        title: 'Pick subject & describe the struggle',
        body: 'Choose a curriculum topic or add a quick note like "mixes up 6 and 9" or "my son can\'t do fractions". Neura builds the lesson.',
      },
      {
        num: '03',
        title: 'They learn and grow',
        body: 'Interactive Socratic questions, optional read-aloud prompts, 3-level hints, and quiet celebrations when they reason it out.',
      },
    ],
    workedExample: {
      kicker: 'Worked Lesson Example',
      routeText: 'Topic: Fractions  →  Interest: Dinosaurs  →  Lesson: "Nu\'s Dino Egg Nest"',
      description:
        'Your child splits 8 eggs between 2 nests, then 4, discovering halves and quarters by reasoning, not memorizing.',
    },
  },
  results: {
    headline: 'What happens when lessons speak their language',
    footnote: '* Figures shown are editable placeholders from early pilot sessions with families.',
    stats: [
      { value: 92, suffix: '%', label: 'of kids finished their lesson' },
      { value: 4, suffix: ' out of 5', label: 'parents saw more confidence within 2 weeks' },
      { value: 12, suffix: ' min', label: 'average lesson length' },
      { value: 60, suffix: ' sec', label: 'setup time' },
    ],
    confidenceChart: {
      title: 'Confidence before vs after (self-reported by parents)',
      beforeLabel: 'Before Neura',
      beforeValue: 38,
      afterLabel: 'After 2 weeks with Neura',
      afterValue: 84,
    },
  },
  testimonials: {
    headline: 'Trusted by curious kids and relieved parents',
    caption: 'Early family feedback',
    items: [
      {
        quote:
          'My daughter went from crying over math homework to asking for another lesson. The dinosaur fractions were genius.',
        author: 'Sarah M.',
        role: 'Parent of a 7-year-old',
        initials: 'SM',
        color: '#FF6B57',
      },
      {
        quote:
          "I'm a teacher, and this actually uses the Socratic method properly. It asks instead of telling.",
        author: 'James K.',
        role: 'Grade 4 teacher',
        initials: 'JK',
        color: '#5CB8FF',
      },
      {
        quote:
          "The chalkboard animation holds my son's attention better than YouTube. He thinks it's a game.",
        author: 'Priya R.',
        role: 'Parent of a 9-year-old',
        initials: 'PR',
        color: '#FFC83D',
      },
      {
        quote:
          'I finally know exactly where my child is stuck. The parent view is clear, with no jargon.',
        author: 'Daniel O.',
        role: 'Parent of an 8-year-old',
        initials: 'DO',
        color: '#14342B',
      },
      {
        quote:
          'She wanted to explain the answer to me afterwards. That never happened with worksheets.',
        author: 'Amara T.',
        role: 'Parent of a 6-year-old',
        initials: 'AT',
        color: '#FF6B57',
      },
      {
        quote:
          'Setup took a minute and the lesson felt like it was written just for him.',
        author: 'Lucía F.',
        role: 'Parent of a 10-year-old',
        initials: 'LF',
        color: '#5CB8FF',
      },
    ],
  },
  safety: {
    headline: 'Child-safe by architecture, not an afterthought',
    subhead:
      'Parents should never have to hover over a screen worrying where a conversation might wander.',
    checklist: [
      'No open-ended chat. Kids can’t talk to a free-roaming bot',
      'Every lesson checked by a safety model before a child sees it',
      'Profiles and progress stay in your browser',
      'No ads, no selling data',
      'Parents are always in control',
    ],
    privacyNoteLink: 'Read our full privacy note',
    privacyModal: {
      title: 'Neura Plain-Language Privacy Note',
      paragraphs: [
        '1. Your child’s name, age profile, and lesson history live strictly inside your own browser storage. We do not maintain a cloud database of children’s profiles.',
        '2. When generating a custom lesson, Neura sends only anonymous learning parameters (age band, grade, curriculum, subject, topic, interests, and learning methods). We never send names, emails, or personal identifiers to the AI model.',
        '3. Every generated lesson passes a strict schema check, safety/age-appropriateness screen, and grade-level alignment check before it appears on your child’s chalkboard.',
        '4. You can edit or clear your browser’s local profile at any moment from Parent Settings.',
      ],
    },
  },
  dashboardPreview: {
    headline: 'A parent view that speaks plain English',
    subhead:
      'Know what is clicking, spot where a quick replay helps, and see which learning method fits your child best.',
    childName: 'Maya',
    streakDays: 6,
    alertNote: 'Maya struggled at step 3 of fractions, try a replay',
    topics: [
      { subject: 'Maths', topic: 'Fractions', status: 'Needs help', methodInsight: 'Learns fastest with Games + Pictures' },
      { subject: 'Maths', topic: 'Place value', status: 'Clicking', methodInsight: 'Mastered with Step-by-step' },
      { subject: 'Science', topic: 'States of matter', status: 'Getting there', methodInsight: 'Great with Hands-on' },
    ],
  },
  pricing: {
    headline: "Free while we're in early access.",
    subhead: 'Build unlimited personalised Socratic lessons while we refine Neura with early families.',
    planName: 'Early Access Family Plan',
    price: '$0',
    period: 'Free during early access',
    features: [
      'Full 5-dimension lesson personalisation (Age, Grade, Subject, Interests, Methods)',
      'All 7 subjects across Pre-K to Grade 6 (US, UK, Nigeria, India CBSE, General)',
      'Adaptive scaffolding & 3-level Socratic hints',
      'Plain-language Parent Insights stored privately in your browser',
    ],
    waitlistPrompt: 'Get notified when paid plans launch, and lock in early-family perks.',
  },
  faqs: [
    {
      question: 'What ages is Neura for?',
      answer:
        'Neura is designed specifically for children ages 5 to 12 (Pre-K through Grade 6). Younger learners (5–6) get 4–5 short, picture-heavy steps with read-aloud turned on automatically, while older learners (9–12) tackle multi-step reasoning and "explain why" challenges.',
    },
    {
      question: 'Is it safe for my child to use alone?',
      answer:
        'Yes. Unlike open chatbots, kids cannot free-chat with an unguided AI. Every lesson is structured as interactive steps and passes both a safety check and a grade-curriculum alignment check before your child sees it.',
    },
    {
      question: 'What subjects does it cover?',
      answer:
        'Neura covers Maths, English/Reading, Phonics, Science, Social Studies, Coding basics, and Life skills—with 8+ structured topics per subject for every grade from Pre-K through Grade 6.',
    },
    {
      question: 'Does my child need an account?',
      answer:
        'No child account, password, or email is needed. Parents set up a local profile in about 60 seconds and hand the tablet or laptop straight to their child.',
    },
    {
      question: "Where is my child's data stored?",
      answer:
        'Your child’s profile, interests, and progress history stay right in your browser (localStorage). When building a lesson, only anonymous academic parameters (grade, topic, interests, methods) are used—never names or emails.',
    },
    {
      question: 'Does Neura replace a teacher or tutor?',
      answer:
        'No. Neura works alongside school teachers and parents as a patient daily thinking partner—helping your child build genuine understanding rather than copying answers.',
    },
    {
      question: 'How is this different from ChatGPT or YouTube?',
      answer:
        'YouTube is passive watching, and general chatbots give away answers or drift off-topic. Neura uses strict Socratic scaffolding (ask, 3 progressive hints, worked example), adaptive prerequisite steps, and your child’s exact school grade.',
    },
  ],
  finalCta: {
    headline: 'Ready to see your child light up about learning?',
    buttonText: 'Start free today',
    subtext: 'Two minutes to a lesson built around their world. No credit card.',
  },
  footer: {
    links: [
      { label: 'Why Neura', href: '#why-neura' },
      { label: 'How it works', href: '#how-it-works' },
      { label: 'Safety', href: '#safety' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Privacy', href: '#safety' },
      { label: 'Contact', href: 'mailto:hello@neura-tutor.example' },
    ],
    credit: 'Made with care for kids and parents.',
  },
};
