import { LessonOutputSchema, type LessonOutput, type LessonRequest } from '../types/neura.ts';

interface FallbackEntry {
  id: string;
  subject: 'Maths' | 'English/Reading' | 'Science';
  ageBand: '5-7' | '8-12';
  interestVariant: string;
  methodVariant: string;
  lesson: LessonOutput;
}

export const FALLBACK_LESSONS: FallbackEntry[] = [
  // 1. Maths | Age 5-7 (Grade 1-2) | Dinosaurs | Stories + Step-by-step
  {
    id: 'maths-young-dino-story',
    subject: 'Maths',
    ageBand: '5-7',
    interestVariant: 'Dinosaurs',
    methodVariant: 'Stories + Step-by-step',
    lesson: {
      title: "Nu's Dino Egg Counting & Tens",
      subject: 'Maths',
      topic: 'Addition within 20',
      grade: 'Grade 1',
      estimatedMinutes: 8,
      learningObjective: 'Group objects into a ten and extras to add two small numbers accurately.',
      story:
        'Mama Triceratops laid 8 speckled eggs in one sunny nest and 5 more eggs in the fern nest. Nu the owl wants to help count all the eggs by making a full nest of 10 first!',
      methodsUsed: ['Stories', 'Step-by-step'],
      interestsUsed: ['Dinosaurs'],
      steps: [
        {
          visual: 'Nest A: [🥚🥚🥚🥚🥚🥚🥚🥚] (8 eggs) | Nest B: [🥚🥚🥚🥚🥚] (5 eggs)',
          question: 'Worked Example: Look at Nest A with 8 eggs. How many eggs do we move from Nest B to make 10?',
          answerType: 'multiple_choice',
          choices: ['2 eggs', '4 eggs', '5 eggs'],
          correctAnswer: '2 eggs',
          hints: [
            'Count up from 8 to 10 on your fingers: 9, 10.',
            '8 + 2 makes a full group of 10!',
            'Example check: 8 eggs + 2 eggs = 10 eggs in Nest A.',
          ],
          explanation: 'Moving 2 eggs from 5 fills Nest A up to 10!',
          celebration: 'Roar-some! You filled a nest of 10!',
          skillTag: 'make-ten',
          isWorkedExample: true,
        },
        {
          visual: 'Nest A now has 10 eggs. Nest B had 5 eggs, and 2 flew over.',
          question: 'How many eggs are left in Nest B after 2 moved to Nest A?',
          answerType: 'number_input',
          choices: ['2', '3', '4'],
          correctAnswer: '3',
          hints: [
            'Start with 5 fingers up and tuck 2 away.',
            'Count the fingers still standing: 1, 2, 3.',
            'Example: 5 take away 2 leaves 3.',
          ],
          explanation: '5 minus 2 equals 3 eggs still waiting in Nest B.',
          celebration: 'Spot on! 3 little eggs left!',
          skillTag: 'decompose-number',
        },
        {
          visual: 'Nest A: 10 eggs + Nest B: 3 eggs',
          question: 'Now put 10 eggs and 3 eggs together. How many dino eggs in total?',
          answerType: 'number_input',
          choices: ['12', '13', '15'],
          correctAnswer: '13',
          hints: [
            'Say "ten" and count on 3 more: 11, 12, ...',
            'One ten and 3 ones is thirteen.',
            'Example: 10 + 3 = 13.',
          ],
          explanation: '10 and 3 make 13, so 8 + 5 = 13!',
          celebration: 'Brilliant thinking! You used 10 as a bridge!',
          skillTag: 'add-ten-plus-ones',
        },
        {
          visual: 'Another nest has 9 baby Stego eggs and 4 more nearby.',
          question: 'Use the same make-10 trick! What is 9 + 4?',
          answerType: 'multiple_choice',
          choices: ['12', '13', '14'],
          correctAnswer: '13',
          hints: [
            'How many does 9 need to turn into 10? Just 1!',
            'Take 1 from 4, leaving 3. Now add 10 + 3.',
            'Example: 9 + 1 = 10, then 10 + 3 = 13.',
          ],
          explanation: '9 borrows 1 from 4 to become 10, plus 3 left over equals 13!',
          celebration: 'You mastered the dino make-10 trick!',
          skillTag: 'make-ten-transfer',
          isChallenge: true,
        },
      ],
      recap: 'Making a friendly 10 first turns tricky addition into easy counting!',
      parentNote: 'Great bridge-to-ten reasoning. Practise splitting small snacks into 10 and extras at home.',
    },
  },
  // 2. Maths | Age 5-7 | Space | Games + Pictures
  {
    id: 'maths-young-space-game',
    subject: 'Maths',
    ageBand: '5-7',
    interestVariant: 'Space',
    methodVariant: 'Games and challenges + Pictures and diagrams',
    lesson: {
      title: 'Rocket Launch: Place Value Mission',
      subject: 'Maths',
      topic: 'Place value',
      grade: 'Grade 2',
      estimatedMinutes: 9,
      learningObjective: 'Identify tens and ones in two-digit numbers using visual fuel pods.',
      story:
        'Commander Nu is fuelling Moon Rocket 42! Big fuel tanks hold 10 stars each, and single fuel capsules hold 1 star.',
      methodsUsed: ['Games and challenges', 'Pictures and diagrams'],
      interestsUsed: ['Space'],
      steps: [
        {
          visual: 'Rocket Dial: [ 4 ][ 2 ]  |  Big Tank = 10 stars  |  Tiny Pod = 1 star',
          question: 'Level 1: How many big 10-star tanks does Rocket 42 need?',
          answerType: 'multiple_choice',
          choices: ['2 tanks', '4 tanks', '6 tanks'],
          correctAnswer: '4 tanks',
          hints: [
            'Look at the left digit in 42 — that is the tens place.',
            'Forty means four groups of ten.',
            'In 42, the 4 stands for 4 tens (40).',
          ],
          explanation: 'The 4 in 42 is in the tens place, so we load 4 big 10-star tanks!',
          celebration: 'Thrusters armed! +10 Mission Points!',
          skillTag: 'tens-place',
          prerequisiteStep: {
            visual: '10 stars = 1 big tank: [⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐]',
            question: 'Warm-up check: How many stars are inside 2 big tanks?',
            choices: ['12', '20', '2'],
            correctAnswer: '20',
            hint: 'Count by tens twice: 10, 20.',
            explanation: '2 tens equal 20 stars.',
          },
        },
        {
          visual: '4 Big Tanks loaded (40 stars). Target: 42 stars.',
          question: 'Level 2: How many single 1-star pods finish fuelling 42?',
          answerType: 'number_input',
          choices: ['2', '4', '10'],
          correctAnswer: '2',
          hints: [
            'Look at the right digit in 42 — the ones place.',
            'We already have 40 stars. Count up to 42.',
            '40 + 2 = 42.',
          ],
          explanation: 'The 2 in 42 means 2 single star pods.',
          celebration: 'Fuel locked! +15 Mission Points!',
          skillTag: 'ones-place',
        },
        {
          visual: 'Meteor Alert! Alien ship has 3 big tanks and 7 tiny pods.',
          question: 'Level 3: What number is 3 tens and 7 ones?',
          answerType: 'number_input',
          choices: ['37', '73', '10'],
          correctAnswer: '37',
          hints: [
            'Put the tens digit (3) on the left and ones digit (7) on the right.',
            'Count 10, 20, 30... then add 7.',
            '30 + 7 = 37.',
          ],
          explanation: '3 tens (30) plus 7 ones equals 37!',
          celebration: 'Meteor dodged! +20 Mission Points!',
          skillTag: 'compose-two-digit',
        },
        {
          visual: 'Boss Door Code: Two rockets — Rocket A (58) and Rocket B (85).',
          question: 'Boss Question: Which rocket actually holds MORE fuel, and why?',
          answerType: 'multiple_choice',
          choices: [
            'Rocket B (85) because 8 tens is more than 5 tens',
            'Rocket A (58) because 8 ones is bigger',
            'They hold the same amount',
          ],
          correctAnswer: 'Rocket B (85) because 8 tens is more than 5 tens',
          hints: [
            'Always compare the biggest place value (tens) first!',
            'Compare 5 tens (50) against 8 tens (80).',
            '80 is much larger than 50, so 85 > 58.',
          ],
          explanation: 'Tens carry 10 times more value than ones, so 85 is larger than 58!',
          celebration: 'Blast off! Mission Boss defeated!',
          skillTag: 'compare-place-value',
          isChallenge: true,
        },
      ],
      recap: 'Every digit has a home: the left spot counts tens, and the right spot counts ones!',
      parentNote: 'Check if your child distinguishes 58 vs 85 easily — place value order is the key skill here.',
    },
  },
  // 3. Maths | Age 8-12 (Grade 4) | Football | Games + Step-by-step
  {
    id: 'maths-older-football-games',
    subject: 'Maths',
    ageBand: '8-12',
    interestVariant: 'Football',
    methodVariant: 'Games and challenges + Step-by-step',
    lesson: {
      title: 'Matchday Fractions: Sharing Team Slices',
      subject: 'Maths',
      topic: 'Fractions',
      grade: 'Grade 4',
      estimatedMinutes: 11,
      learningObjective: 'Recognise and compare equivalent fractions using visual pitch & pizza models.',
      story:
        'After a 3-2 victory, Coach Nu brings two giant team pizzas to the football locker room. Half the squad wants big slices and half wants smaller slices — let us prove when two fractions are equal!',
      methodsUsed: ['Games and challenges', 'Step-by-step'],
      interestsUsed: ['Football'],
      steps: [
        {
          visual: 'Pizza 1 (cut in 2 halves): [ 🍕 |   ] = 1/2   |   Pizza 2 (cut in 4 quarters): [ 🍕🍕 |    ]',
          question: 'Worked Example: Striker Sam eats 1/2 of Pizza 1. How many quarter-slices from Pizza 2 equal the exact same amount?',
          answerType: 'multiple_choice',
          choices: ['1/4', '2/4', '3/4'],
          correctAnswer: '2/4',
          hints: [
            'Picture cutting a half-pizza down the middle once more.',
            '1 big half splits into 2 smaller quarters.',
            'Worked example: multiply top and bottom of 1/2 by 2 to get 2/4.',
          ],
          explanation: '2/4 covers the exact same half of the pizza as 1/2 — they are equivalent fractions!',
          celebration: 'Goal! Equivalent fraction unlocked! +10 pts',
          skillTag: 'equivalent-halves',
          isWorkedExample: true,
        },
        {
          visual: 'Football Pitch Progress: Midfielder ran 3/4 of the pitch. Winger ran 6/8 of an identical pitch.',
          question: 'Round 2: Who ran farther down the pitch?',
          answerType: 'multiple_choice',
          choices: [
            'They ran the exact same distance',
            'The winger ran farther because 8 is bigger',
            'The midfielder ran farther',
          ],
          correctAnswer: 'They ran the exact same distance',
          hints: [
            'Look at how 3/4 turns into eighths: multiply 4 by 2 to get 8.',
            'Do the same to the top: 3 x 2 = 6.',
            '3/4 = 6/8, so both players covered the exact same fraction of the pitch.',
          ],
          explanation: 'Cutting each quarter in half doubles both numerator and denominator: 3/4 = 6/8.',
          celebration: 'Clean pass! +15 pts',
          skillTag: 'equivalent-eighths',
        },
        {
          visual: 'Water Break: Keeper drank 2/3 of a bottle. Defender drank 5/6 of an identical bottle.',
          question: 'Round 3: To compare 2/3 and 5/6 fairly, convert 2/3 into sixths. What is 2/3 in sixths?',
          answerType: 'multiple_choice',
          choices: ['3/6', '4/6', '5/6'],
          correctAnswer: '4/6',
          hints: [
            'What do you multiply 3 by to get 6? (2!)',
            'Multiply the numerator 2 by the same number 2.',
            '2/3 = (2x2)/(3x2) = 4/6. Now 4/6 < 5/6!',
          ],
          explanation: '2/3 is 4/6, which makes it easy to see that 5/6 is 1/6 larger!',
          celebration: 'Top corner finish! +20 pts',
          skillTag: 'common-denominator-compare',
          prerequisiteStep: {
            visual: 'Bar A: [■■|  ] (2/3)  vs  Bar B: [■|■|■|■|  |  ] (4/6)',
            question: 'Quick check: If we split each third into 2 equal pieces, how many total pieces make the whole?',
            choices: ['5 pieces', '6 pieces', '8 pieces'],
            correctAnswer: '6 pieces',
            hint: '3 parts times 2 smaller parts each = 6.',
            explanation: 'Splitting each of the 3 thirds in half creates 6 equal sixths.',
          },
        },
        {
          visual: 'Penalty Shootout Score: Team A scored 6/10 penalties. Team B scored 3/5 penalties.',
          question: 'Boss Challenge: Coach says Team A won because 6 is bigger than 3. Is Coach right? Explain why!',
          answerType: 'multiple_choice',
          choices: [
            'No, it is a tie because 3/5 = 6/10',
            'Yes, because 6/10 has bigger numbers',
            'No, Team B scored more because fifths are larger',
          ],
          correctAnswer: 'No, it is a tie because 3/5 = 6/10',
          hints: [
            'Team A took 10 kicks while Team B took 5 kicks.',
            'Scale Team B up to 10 kicks: multiply top and bottom of 3/5 by 2.',
            '3/5 = 6/10, so both teams scored 60% of their kicks — a tie!',
          ],
          explanation: 'Both 3/5 and 6/10 represent the same proportion (60%), so it goes to extra time!',
          celebration: 'Championship trophy! Boss Challenge cleared!',
          skillTag: 'fraction-proportion-boss',
          isChallenge: true,
        },
      ],
      recap: 'Multiplying or dividing top and bottom by the same number changes slice size, never the total amount!',
      parentNote: 'Strong grasp of equivalent fractions. Next up: adding fractions with unlike denominators.',
    },
  },
  // 4. English/Reading | Age 5-7 (Grade 1) | Animals | Music and rhymes + Stories
  {
    id: 'reading-young-animals-rhyme',
    subject: 'English/Reading',
    ageBand: '5-7',
    interestVariant: 'Animals',
    methodVariant: 'Music and rhymes + Stories',
    lesson: {
      title: "Pip the Fox's Sound & Sentence Trail",
      subject: 'English/Reading',
      topic: 'Simple sentences',
      grade: 'Grade 1',
      estimatedMinutes: 8,
      learningObjective: 'Identify naming words (nouns), action words (verbs), and end punctuation in simple sentences.',
      story:
        'Little Pip the Red Fox lost three word tiles along the forest path. Let us sing a quick word beat with Nu to put Pip’s sentences back together!',
      methodsUsed: ['Music and rhymes', 'Stories'],
      interestsUsed: ['Animals'],
      rhymeOrChant:
        'A sentence needs a WHO to star, / And WHAT they do near or far! / Start it tall with a capital crown, / End with a dot so it settles down!',
      steps: [
        {
          visual: 'Tile Sign: [ The little frog ] [ ___ ] [ in the pond. ]',
          question: 'Which action word (verb) completes Pip’s sentence: "The little frog ___ in the pond."?',
          answerType: 'multiple_choice',
          choices: ['hops', 'yellow', 'basket'],
          correctAnswer: 'hops',
          hints: [
            'Read the sentence out loud and listen for what the frog DOES.',
            'Yellow is a colour and basket is a thing — we need an action!',
            '"The little frog hops in the pond" tells us the action.',
          ],
          explanation: '"Hops" is the action word telling us what the frog does!',
          celebration: 'Pip wags his tail! Great sentence ear!',
          skillTag: 'verb-in-sentence',
        },
        {
          visual: 'Words on logs:  [ sleepy ]   [ bear ]   [ climbs ]',
          question: 'Tap the naming word (noun) in "The sleepy bear climbs."',
          answerType: 'tap_words',
          choices: ['sleepy', 'bear', 'climbs'],
          correctAnswer: 'bear',
          hints: [
            'A noun names a person, animal, place, or thing.',
            '"Sleepy" describes how it feels; "climbs" is the action.',
            'The animal starring in the sentence is the bear!',
          ],
          explanation: '"Bear" is the noun — the animal doing the climbing!',
          celebration: 'Woohoo! You spotted the star noun!',
          skillTag: 'identify-noun',
        },
        {
          visual: 'Fox Ask: "Where did the owl hide __"',
          question: 'Pip is asking a question! Which mark goes at the end?',
          answerType: 'multiple_choice',
          choices: ['.', '?', '!'],
          correctAnswer: '?',
          hints: [
            'Notice the sentence begins with the asking word "Where".',
            'Asking sentences end with a curly question mark.',
            '"Where did the owl hide?" needs a ? at the end.',
          ],
          explanation: 'Questions always end with a question mark (?) so readers raise their voice.',
          celebration: 'Spot on! Punctuation champion!',
          skillTag: 'question-mark',
        },
        {
          visual: 'Scrambled rocks: [ swims / duck / The / fast. ]',
          question: 'Put Pip’s scrambled words in order to make a real sentence!',
          answerType: 'multiple_choice',
          choices: [
            'The duck swims fast.',
            'Swims fast the duck.',
            'Duck the fast swims.',
          ],
          correctAnswer: 'The duck swims fast.',
          hints: [
            'Find the word with the capital letter — it goes first!',
            'Put who ("The duck") before what it does ("swims fast").',
            '"The duck swims fast." ends with the period.',
          ],
          explanation: 'Start with the capital "The", name the duck, then add "swims fast."',
          celebration: 'You fixed Pip’s whole forest trail!',
          skillTag: 'sentence-order',
        },
      ],
      recap: 'Every sentence has a WHO, an action, a capital start, and an ending mark.',
      parentNote: 'Ask your child to point out the WHO and ACTION word in one bedtime picture-book sentence tonight.',
    },
  },
  // 5. English/Reading | Age 8-12 (Grade 4-5) | Superheroes | Stories + Talk it out
  {
    id: 'reading-older-superhero-story',
    subject: 'English/Reading',
    ageBand: '8-12',
    interestVariant: 'Superheroes',
    methodVariant: 'Stories + Talk it out',
    lesson: {
      title: 'Maya-Volt & The Bridge Teamwork Mission',
      subject: 'English/Reading',
      topic: 'Theme vs main idea',
      grade: 'Grade 4',
      estimatedMinutes: 10,
      learningObjective: 'Distinguish between a story’s plot summary (main idea) and its deeper life lesson (theme).',
      story:
        'Maya-Volt has lightning speed, yet when the city bridge cracks, she learns she cannot lift the steel beam alone and asks Slow-Turtle and Builder-Bot for help.',
      methodsUsed: ['Stories', 'Talk it out'],
      interestsUsed: ['Superheroes'],
      steps: [
      {
        visual: 'Story Panel 1: Maya-Volt tries 3 times alone -> beam slips. Together with 2 friends -> bridge locks safely!',
        question: 'First, what is the MAIN IDEA (what actually happens in the plot)?',
        answerType: 'multiple_choice',
        choices: [
          'Maya-Volt teams up with two friends to fix a cracked city bridge.',
          'Always be kind to turtles.',
          'Superheroes never need help.',
        ],
        correctAnswer: 'Maya-Volt teams up with two friends to fix a cracked city bridge.',
        hints: [
          'The main idea names the specific characters and events in THIS story.',
          'Look for the option that mentions Maya-Volt and the bridge.',
          'Main idea = what happens; Theme = the big message for anyone.',
        ],
        explanation: 'Right! The main idea summarises the specific story events.',
        celebration: 'Heroic reading! Clear plot summary!',
        skillTag: 'main-idea',
      },
      {
        visual: 'Story Panel 2: "Even the fastest hero needs a team."',
        question: 'Now, what is the THEME (the life lesson anyone can use)?',
        answerType: 'multiple_choice',
        choices: [
          'Working together solves problems we cannot handle alone.',
          'Lightning powers are stronger than turtle shields.',
          'Bridges are made of steel beams.',
        ],
        correctAnswer: 'Working together solves problems we cannot handle alone.',
        hints: [
          'A theme never names Maya-Volt — it applies to real life too!',
          'Ask: What did the hero learn that applies to us at school or home?',
          'The universal lesson is about teamwork.',
        ],
        explanation: 'A theme is a universal truth that stays true even outside the comic book!',
        celebration: 'Laser focus! You separated plot from theme!',
        skillTag: 'identify-theme',
      },
      {
        visual: 'Quote Check: A) "Maya-Volt zoomed past the clouds."  B) "I cannot carry this alone—will you hold the left side?"',
        question: 'Which quote from the story best proves the teamwork theme?',
        answerType: 'multiple_choice',
        choices: [
          'Quote B: "I cannot carry this alone—will you hold the left side?"',
          'Quote A: "Maya-Volt zoomed past the clouds."',
          'Neither quote shows teamwork',
        ],
        correctAnswer: 'Quote B: "I cannot carry this alone—will you hold the left side?"',
        hints: [
          'Look for dialogue where a character chooses collaboration.',
          'Quote A only shows solo speed.',
          'Quote B shows Maya-Volt asking for help.',
        ],
        explanation: 'Strong readers always back up a theme with an exact line of text evidence.',
        celebration: 'Evidence locked in!',
        skillTag: 'text-evidence',
      },
      {
        visual: 'Voice/Think Prompt: Think of a book or movie you love.',
        question: 'Explain why "Friendship takes patience" is a theme, whereas "Sam shared his lunch with Leo" is a plot detail.',
        answerType: 'voice_prompt',
        choices: [
          'Because "Friendship takes patience" is a general lesson for anyone, while Sam and Leo are specific story details.',
          'Because themes are always shorter than plot details.',
        ],
        correctAnswer:
          'Because "Friendship takes patience" is a general lesson for anyone, while Sam and Leo are specific story details.',
        hints: [
          'Who does "Friendship takes patience" apply to? Everyone!',
          'Who does "Sam shared his lunch with Leo" happen to? Just two characters.',
          'Universal message = theme; specific character event = plot.',
        ],
        explanation: 'Talking through your reasoning locks in the difference between theme and plot!',
        celebration: 'Superstar thinker!',
        skillTag: 'explain-theme-vs-plot',
      },
    ],
      recap: 'Main idea = what happens to the characters; Theme = the big life lesson for everyone.',
      parentNote: 'Ask your child to name the theme of their current chapter book in one sentence.',
    },
  },
  // 5b. Science | Age 5-7 (Grade 1) | Ocean | Pictures + Stories
  {
    id: 'science-young-ocean-pictures',
    subject: 'Science',
    ageBand: '5-7',
    interestVariant: 'Ocean',
    methodVariant: 'Pictures and diagrams + Stories',
    lesson: {
      title: 'Coral Reef Plant & Sun Lab',
      subject: 'Science',
      topic: 'What plants and animals need',
      grade: 'Grade 1',
      estimatedMinutes: 7,
      learningObjective: 'Observe what living plants need from sunlight and water to stay healthy.',
      story:
        'Deep in Sunny Bay, Sammy the Sea Turtle notices glowing sea plants growing tall near the bright top of the reef. Let us help Sammy test what keeps plants thriving!',
      methodsUsed: ['Pictures and diagrams', 'Stories'],
      interestsUsed: ['Ocean'],
      steps: [
        {
          visual: 'Sunny Reef: [ ☀️ -> 🌿 Tall green kelp ]  vs  Dark Cave: [ 🌑 -> 🥀 Droopy kelp ]',
          question: 'Look at the picture. Why does the kelp near the sunlit top look bright and tall?',
          answerType: 'multiple_choice',
          choices: ['Plants need light energy to make food', 'Fish painted it green', 'Dark water makes plants grow faster'],
          correctAnswer: 'Plants need light energy to make food',
          hints: [
            'Compare what is shining on the tall kelp vs the cave kelp.',
            'Sunlight powers leaves to make their own food.',
            'Plants need light to grow strong and green!',
          ],
          explanation: 'Sunlight gives green plants the energy they need to make food!',
          celebration: 'Splashy science thinking!',
          skillTag: 'plant-light-need',
        },
        {
          visual: 'Plant Pot A: 💧 Watered daily  |  Plant Pot B: 🏜️ Completely dry',
          question: 'Sammy compares two shore plants. What else does every plant need besides sunlight?',
          answerType: 'multiple_choice',
          choices: ['Water', 'Ice cream', 'Loud music'],
          correctAnswer: 'Water',
          hints: [
            'Look at the blue drops next to Plant Pot A.',
            'Roots drink this up from soil or sea.',
            'Water keeps stems upright and carries nutrients.',
          ],
          explanation: 'Roots soak up water so the whole plant stays firm and healthy!',
          celebration: 'Spot on! Sunlight and water!',
          skillTag: 'plant-water-need',
        },
        {
          visual: 'Sea Turtle Snack: 🐢 -> munching seagrass 🌿',
          question: 'Why does Sammy the Sea Turtle depend on healthy seagrass?',
          answerType: 'multiple_choice',
          choices: ['Seagrass gives him food and hiding spots', 'Seagrass drives submarines', 'Seagrass freezes the ocean'],
          correctAnswer: 'Seagrass gives him food and hiding spots',
          hints: [
            'Think about what animals eat and where little ocean creatures hide.',
            'Plants feed plant-eating animals in the reef.',
            'Healthy plants support the whole ocean neighbourhood!',
          ],
          explanation: 'Sea animals rely on plants for food, shelter, and oxygen.',
          celebration: 'Reef helper!',
          skillTag: 'plant-animal-link',
        },
        {
          visual: 'Your Window Test: ☀️ + 💧 + 🌬️ Air = Healthy Sprout!',
          question: 'If you plant a bean seed in a cup at home, where should you put it so it grows best?',
          answerType: 'multiple_choice',
          choices: ['By a sunny window with damp soil', 'Inside a dark closed shoebox with no water', 'In the freezer'],
          correctAnswer: 'By a sunny window with damp soil',
          hints: [
            'Combine the two big needs we just discovered!',
            'Sun + damp soil = happy sprout.',
            'A sunny windowsill gives light and warmth.',
          ],
          explanation: 'A sunny spot with gentle water gives your seed everything it needs!',
          celebration: 'Junior Ocean Botanist!',
          skillTag: 'apply-plant-needs',
        },
      ],
      recap: 'Living plants need light, water, and air to grow and feed ocean and land animals!',
      parentNote: 'Great concrete cause-and-effect science! Try sprouting a bean on a sunny windowsill together.',
    },
  },
  // 6. Science | Age 8-12 (Grade 3-5) | Building / Ocean | Hands-on + Pictures
  {
    id: 'science-older-building-handson',
    subject: 'Science',
    ageBand: '8-12',
    interestVariant: 'Building',
    methodVariant: 'Hands-on + Pictures and diagrams',
    lesson: {
      title: 'States of Matter: Lego & Ice Lab',
      subject: 'Science',
      topic: 'States of matter',
      grade: 'Grade 3',
      estimatedMinutes: 10,
      learningObjective: 'Compare solids, liquids, and gases by how tightly their tiny building-block particles pack and move.',
      story:
        'Imagine every drop of water and every brick in the world is built out of microscopic jittery marbles called particles. Let us see how heat changes how they lock together!',
      methodsUsed: ['Hands-on', 'Pictures and diagrams'],
      interestsUsed: ['Building'],
      handsOnTask:
        'Grab 1 ice cube in a bowl and 1 wooden spoon or block. Gently press both with a parent nearby: notice the block keeps its shape even when tipped, while melting ice starts flowing to match the bowl!',
      steps: [
        {
          visual: 'Solid Brick Diagram: [●-●-●-●] locked tight in neat rows, jiggling slightly in place.',
          question: 'Predict: If you move a solid wooden block from a round bowl into a square box, what happens to its shape?',
          answerType: 'multiple_choice',
          choices: [
            'It keeps its own shape because its particles are locked tightly',
            'It spreads out flat to fill the corners',
            'It floats away into the air',
          ],
          correctAnswer: 'It keeps its own shape because its particles are locked tightly',
          hints: [
            'Think of clicking building bricks tightly together.',
            'Locked particles cannot slide past one another.',
            'Solids have a definite shape and volume.',
          ],
          explanation: 'In a solid, particles hold tight like snapped bricks, so the shape stays fixed!',
          celebration: 'Solid observation, engineer!',
          skillTag: 'solid-particles',
        },
        {
          visual: 'Liquid Water Diagram: [● ~ ● ~ ●] touching, sliding past each other freely.',
          question: 'Now pour water from a tall cup into a wide bowl. What changes and what stays the same?',
          answerType: 'multiple_choice',
          choices: [
            'Shape changes to fit the bowl, but the amount of water stays the same',
            'Both shape and amount double in size',
            'Neither shape nor amount changes',
          ],
          correctAnswer: 'Shape changes to fit the bowl, but the amount of water stays the same',
          hints: [
            'Did any extra water appear when you poured it?',
            'Liquid particles stay close, yet slide around to match their container.',
            'Shape adapts; volume stays constant.',
          ],
          explanation: 'Liquids flow to take their container’s shape while keeping the exact same volume!',
          celebration: 'Smooth scientific thinking!',
          skillTag: 'liquid-particles',
        },
        {
          visual: 'Real-World Lab Check: Press the ice cube and wooden block in your bowl with a parent.',
          question: 'Hands-on Check: Did you test how the melting ice starts flowing while the solid block keeps its shape?',
          answerType: 'hands_on_confirm',
          choices: ['We tested it together!'],
          correctAnswer: 'We tested it together!',
          hints: [
            'Touch the ice cube edge — warmth from your hand melts solid ice into liquid water.',
            'Notice water pools at the bottom of the bowl.',
            'Click confirm once you and your parent observed both!',
          ],
          explanation: 'Adding heat energy gives locked particles enough wiggle to break free and flow as a liquid!',
          celebration: 'Lab badge earned!',
          skillTag: 'hands-on-matter-test',
        },
        {
          visual: 'Steam Diagram: [ ●     ●       ● ] zooming fast in every direction inside a kitchen.',
          question: 'Cause & Effect: Why does steam from a kettle spread through the whole kitchen instead of sitting in the pot?',
          answerType: 'multiple_choice',
          choices: [
            'Gas particles zoom freely far apart to fill all available space',
            'Gas particles are heavier than solid bricks',
            'Gas turns invisible so it disappears completely',
          ],
          correctAnswer: 'Gas particles zoom freely far apart to fill all available space',
          hints: [
            'With lots of heat energy, particles break apart completely.',
            'Nothing holds gas particles inside an open pot.',
            'Gases expand to fill whatever room or container holds them.',
          ],
          explanation: 'Gas particles have high energy and move independently, filling the entire kitchen!',
          celebration: 'Matter Master! All 3 states unlocked!',
          skillTag: 'gas-particles',
          isChallenge: true,
        },
      ],
      recap: 'Solids lock tight, liquids slide and flow, and gases zoom to fill every corner!',
      parentNote: 'Connecting particle spacing to everyday kitchen ice/steam helps kids reason about evaporation next.',
    },
  },
];

export function selectFallbackLesson(req: LessonRequest): LessonOutput {
  const ageBand = req.age <= 7 ? '5-7' : '8-12';
  const normalizedSubject =
    req.subject === 'Maths'
      ? 'Maths'
      : req.subject === 'Science'
        ? 'Science'
        : 'English/Reading';

  const exact = FALLBACK_LESSONS.find(
    (entry) =>
      entry.subject === normalizedSubject &&
      entry.ageBand === ageBand &&
      req.interests.includes(entry.interestVariant as any)
  );

  const bySubjectAndBand =
    exact ||
    FALLBACK_LESSONS.find(
      (entry) => entry.subject === normalizedSubject && entry.ageBand === ageBand
    ) ||
    FALLBACK_LESSONS.find((entry) => entry.subject === normalizedSubject) ||
    FALLBACK_LESSONS[0];

  const base = structuredClone(bySubjectAndBand.lesson);

  // Adapt metadata cleanly so subject, grade, topic, and method tags reflect the user's request
  base.subject = req.subject;
  base.grade = req.grade;
  base.topic = req.topic;
  base.methodsUsed = req.methods.slice(0, 2);
  base.interestsUsed = req.interests.slice(0, 2);

  // If the requested interest differs from the template's default, weave a clean intro bridge
  if (!bySubjectAndBand.lesson.interestsUsed.includes(req.interests[0])) {
    base.title = `${req.interests[0]} Quest: ${req.topic}`;
    base.story = `Nu packed your favourite ${req.interests[0].toLowerCase()} gear for today's ${req.topic} adventure! ${base.story}`;
  }

  if (req.methods.includes('Step-by-step') && !base.steps.some((s) => s.isWorkedExample)) {
    base.steps[0] = {
      ...base.steps[0],
      isWorkedExample: true,
      question: `Worked Example: ${base.steps[0].question}`,
    };
  }

  if (req.methods.includes('Games and challenges') && !base.steps.some((s) => s.isChallenge)) {
    const lastIdx = base.steps.length - 1;
    base.steps[lastIdx] = {
      ...base.steps[lastIdx],
      isChallenge: true,
      question: `Boss Challenge: ${base.steps[lastIdx].question}`,
    };
  }

  if (req.methods.includes('Music and rhymes') && !base.rhymeOrChant) {
    base.rhymeOrChant = `Think it through step by step with Nu, / Try a hint when you need a clue, / ${req.topic} makes sense to you!`;
  }

  if (req.methods.includes('Hands-on') && !base.handsOnTask) {
    base.handsOnTask = `Use 8 small household items (spoons, blocks, or coins) with a parent to model "${req.topic}" right on your table.`;
  }

  // Enforce age-band step count constraints (5-6 -> 4-5 steps; 7-12 -> 4-8 steps)
  if (req.age <= 6 && base.steps.length > 5) {
    base.steps = base.steps.slice(0, 5);
  }

  return LessonOutputSchema.parse(base);
}
