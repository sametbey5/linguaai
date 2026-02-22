import React from 'react';

export type Exercise = {
  id: string;
  type: 'multiple-choice' | 'fill-in-blank';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
};

export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type LessonTranslation = {
  title: string;
  explanation: React.ReactNode;
};

export type Lesson = {
  id: string;
  level: Level;
  title: string;
  topic: string;
  explanation: React.ReactNode;
  rawExplanation?: string;
  exercises: Exercise[];
  translations?: Record<string, LessonTranslation>;
};

const createLesson = (
  id: string, 
  level: Level, 
  title: string, 
  topic: string, 
  desc: string, 
  q1: string, 
  a1: string, 
  opts1: string[],
  translations?: Record<string, { title: string; desc: string; rule: string }>
): Lesson => {
  const processedTranslations: Record<string, LessonTranslation> = {};
  
  if (translations) {
    Object.keys(translations).forEach(lang => {
      const t = translations[lang];
      processedTranslations[lang] = {
        title: t.title,
        explanation: (
          <div className="space-y-4 text-slate-700 text-lg">
            <p>{t.desc}</p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-4">
              <h4 className="font-bold text-slate-800 mb-2">Key Rule ({lang}):</h4>
              <p>{t.rule}</p>
            </div>
          </div>
        )
      };
    });
  }

  return {
    id,
    level,
    title,
    topic,
    rawExplanation: desc,
    explanation: (
      <div className="space-y-4 text-slate-700 text-lg">
        <p>{desc}</p>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-4">
          <h4 className="font-bold text-slate-800 mb-2">Key Rule:</h4>
          <p>Remember the pattern for {title}.</p>
        </div>
      </div>
    ),
    exercises: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: q1,
        options: opts1,
        correctAnswer: a1,
        explanation: `The correct answer is "${a1}".`
      },
      {
        id: 'q2',
        type: 'fill-in-blank',
        question: q1.replace('_____', '...'), // Simplified for bulk generation
        correctAnswer: a1,
        explanation: `The correct form is "${a1}".`
      }
    ],
    translations: processedTranslations
  };
};

export const LESSONS: Lesson[] = [
  // --- A1 Beginner ---
  createLesson('a1-1', 'A1', 'Present Simple (To Be)', 'Verbs', 'Use "am", "is", or "are".', 'I _____ happy.', 'am', ['am', 'is', 'are'], {
    'Turkish': { title: 'Geniş Zaman (Olmak)', desc: '"am", "is" veya "are" kullanın.', rule: 'Özneye göre fiil çekimini unutmayın.' },
    'Spanish': { title: 'Presente Simple (Ser/Estar)', desc: 'Usa "am", "is", o "are".', rule: 'Recuerda la conjugación según el sujeto.' },
    'French': { title: 'Présent Simple (Être)', desc: 'Utilisez "am", "is" ou "are".', rule: 'N\'oubliez pas la conjugaison selon le sujet.' },
    'German': { title: 'Präsens (Sein)', desc: 'Verwenden Sie "am", "is" oder "are".', rule: 'Denken Sie an die Konjugation je nach Subjekt.' },
    'Italian': { title: 'Presente Semplice (Essere)', desc: 'Usa "am", "is" o "are".', rule: 'Ricorda la coniugazione in base al soggetto.' },
    'Portuguese': { title: 'Presente Simples (Ser/Estar)', desc: 'Use "am", "is" ou "are".', rule: 'Lembre-se da conjugação de acordo com o sujeito.' },
    'Russian': { title: 'Настоящее простое время (Быть)', desc: 'Используйте "am", "is" или "are".', rule: 'Помните спряжение в зависимости от подлежащего.' },
    'Chinese': { title: '一般现在时 (To Be)', desc: '使用 "am", "is" 或 "are".', rule: '记住根据主语变位。' },
    'Japanese': { title: '現在形 (Be動詞)', desc: '"am", "is", "are" を使います。', rule: '主語に応じた活用を覚えてください。' },
    'Korean': { title: '현재 시제 (Be 동사)', desc: '"am", "is", "are"를 사용하세요.', rule: '주어에 따른 활용을 기억하세요.' },
    'Arabic': { title: 'المضارع البسيط (يكون)', desc: 'استخدم "am" أو "is" أو "are".', rule: 'تذكر التصريف حسب الفاعل.' },
    'Hindi': { title: 'सामान्य वर्तमान (To Be)', desc: '"am", "is", या "are" का प्रयोग करें।', rule: 'कर्ता के अनुसार क्रिया रूप याद रखें।' }
  }),
  createLesson('a1-2', 'A1', 'Present Simple (Verbs)', 'Verbs', 'Add -s for He/She/It.', 'She _____ tennis.', 'plays', ['play', 'plays', 'playing'], {
    'Turkish': { title: 'Geniş Zaman (Fiiller)', desc: 'He/She/It için -s takısı ekleyin.', rule: 'Üçüncü tekil şahıslarda fiile -s eklenir.' }
  }),
  createLesson('a1-3', 'A1', 'Subject Pronouns', 'Pronouns', 'I, You, He, She, It, We, They.', '_____ is my friend.', 'He', ['He', 'Him', 'His'], {
    'Turkish': { title: 'Özne Zamirleri', desc: 'Ben, Sen, O, Biz, Onlar.', rule: 'Cümlenin başında özne olarak kullanılır.' }
  }),
  createLesson('a1-4', 'A1', 'Object Pronouns', 'Pronouns', 'Me, You, Him, Her, It, Us, Them.', 'Listen to _____.', 'me', ['me', 'I', 'my']),
  createLesson('a1-5', 'A1', 'Possessive Adjectives', 'Adjectives', 'My, Your, His, Her, Its, Our, Their.', 'This is _____ car.', 'my', ['my', 'me', 'I']),
  createLesson('a1-6', 'A1', 'Plural Nouns', 'Nouns', 'Add -s or -es.', 'Two _____ are on the table.', 'boxes', ['boxes', 'boxs', 'box']),
  createLesson('a1-7', 'A1', 'Demonstratives', 'Determiners', 'This, That, These, Those.', '_____ is my book here.', 'This', ['This', 'Those', 'These']),
  createLesson('a1-8', 'A1', 'There is / There are', 'Structure', 'Singular vs Plural existence.', 'There _____ a cat.', 'is', ['is', 'are', 'be']),
  createLesson('a1-9', 'A1', 'Countable Nouns', 'Nouns', 'Things you can count.', 'I have three _____.', 'apples', ['apples', 'water', 'rice']),
  createLesson('a1-10', 'A1', 'Some / Any', 'Quantifiers', 'Some for positive, Any for negative.', 'I don\'t have _____ money.', 'any', ['any', 'some', 'a']),
  createLesson('a1-11', 'A1', 'Articles', 'Articles', 'A, An, The.', 'It is _____ apple.', 'an', ['an', 'a', 'the']),
  createLesson('a1-12', 'A1', 'Prepositions of Place', 'Prepositions', 'In, On, At.', 'The book is _____ the table.', 'on', ['on', 'in', 'at']),
  createLesson('a1-13', 'A1', 'Prepositions of Time', 'Prepositions', 'In, On, At.', 'See you _____ Monday.', 'on', ['on', 'in', 'at']),
  createLesson('a1-14', 'A1', 'Can / Can\'t', 'Modals', 'Ability.', 'I _____ swim.', 'can', ['can', 'cans', 'to can']),
  createLesson('a1-15', 'A1', 'Present Continuous', 'Tenses', 'Action happening now.', 'He is _____ now.', 'sleeping', ['sleeping', 'sleeps', 'sleep']),
  createLesson('a1-16', 'A1', 'Past Simple (To Be)', 'Verbs', 'Was / Were.', 'I _____ tired yesterday.', 'was', ['was', 'were', 'am']),
  createLesson('a1-17', 'A1', 'Past Simple (Regular)', 'Verbs', 'Add -ed.', 'We _____ football.', 'played', ['played', 'play', 'playing']),
  createLesson('a1-18', 'A1', 'Past Simple (Irregular)', 'Verbs', 'Memorize forms.', 'She _____ to the shop.', 'went', ['went', 'go', 'goed']),
  createLesson('a1-19', 'A1', 'Question Words', 'Questions', 'Who, What, Where, When.', '_____ is your name?', 'What', ['What', 'Who', 'Where']),
  createLesson('a1-20', 'A1', 'Adverbs of Frequency', 'Adverbs', 'Always, Usually, Never.', 'I _____ drink coffee.', 'always', ['always', 'yesterday', 'tomorrow']),
  createLesson('a1-21', 'A1', 'Imperatives', 'Verbs', 'Commands.', '_____ the door!', 'Open', ['Open', 'Opens', 'Opening']),
  createLesson('a1-22', 'A1', 'Like + -ing', 'Verbs', 'Preferences.', 'I like _____ TV.', 'watching', ['watching', 'watch', 'watches']),
  createLesson('a1-23', 'A1', 'Want / Would like', 'Verbs', 'Desires.', 'I would like _____ tea.', 'some', ['some', 'a', 'any']),
  createLesson('a1-24', 'A1', 'How much / How many', 'Questions', 'Quantity.', '_____ water do you need?', 'How much', ['How much', 'How many', 'What']),
  createLesson('a1-25', 'A1', 'Comparatives', 'Adjectives', 'Add -er or more.', 'He is _____ than me.', 'taller', ['taller', 'tall', 'more tall']),
  createLesson('a1-26', 'A1', 'Superlatives', 'Adjectives', 'Add -est or most.', 'She is the _____ girl.', 'smartest', ['smartest', 'smarter', 'smart']),
  createLesson('a1-27', 'A1', 'Going to', 'Future', 'Plans.', 'I am _____ to buy a car.', 'going', ['going', 'go', 'will']),
  createLesson('a1-28', 'A1', 'Conjunctions', 'Structure', 'And, But, Or.', 'I like tea _____ coffee.', 'and', ['and', 'but', 'so']),
  createLesson('a1-29', 'A1', 'Possessive \'s', 'Nouns', 'Ownership.', 'This is _____ bag.', 'John\'s', ['John\'s', 'Johns', 'John']),
  {
    id: 'a1-exam',
    level: 'A1',
    title: 'A1 Final Exam',
    topic: 'Exam',
    explanation: <div className="text-center font-bold text-xl">Pass this to unlock A2!</div>,
    exercises: [
        { id: 'ex1', type: 'multiple-choice', question: 'She _____ in London.', options: ['lives', 'live', 'living'], correctAnswer: 'lives', explanation: 'Present Simple' },
        { id: 'ex2', type: 'multiple-choice', question: '_____ you like pizza?', options: ['Do', 'Does', 'Are'], correctAnswer: 'Do', explanation: 'Question form' },
        { id: 'ex3', type: 'multiple-choice', question: 'I _____ a doctor.', options: ['am', 'is', 'are'], correctAnswer: 'am', explanation: 'Verb to be' }
    ]
  },

  // --- A2 Elementary ---
  createLesson('a2-1', 'A2', 'Past Continuous', 'Tenses', 'Was/Were + -ing.', 'I was _____ when you called.', 'sleeping', ['sleeping', 'slept', 'sleep']),
  createLesson('a2-2', 'A2', 'Present Perfect (Exp)', 'Tenses', 'Have/Has + V3.', 'I have _____ to Paris.', 'been', ['been', 'was', 'go']),
  createLesson('a2-3', 'A2', 'Present Perfect vs Past', 'Tenses', 'Unfinished vs Finished time.', 'I _____ him yesterday.', 'saw', ['saw', 'have seen', 'seen']),
  createLesson('a2-4', 'A2', 'Will (Future)', 'Future', 'Predictions.', 'It _____ rain.', 'will', ['will', 'is', 'going']),
  createLesson('a2-5', 'A2', 'Going to vs Will', 'Future', 'Plans vs Decisions.', 'I _____ visit my mom (plan).', 'am going to', ['am going to', 'will', 'shall']),
  createLesson('a2-6', 'A2', 'First Conditional', 'Conditionals', 'If + Present, Will.', 'If it rains, I _____ stay home.', 'will', ['will', 'would', 'am']),
  createLesson('a2-7', 'A2', 'Should / Shouldn\'t', 'Modals', 'Advice.', 'You _____ study more.', 'should', ['should', 'must', 'can']),
  createLesson('a2-8', 'A2', 'Must / Have to', 'Modals', 'Obligation.', 'You _____ wear a uniform.', 'must', ['must', 'should', 'can']),
  createLesson('a2-9', 'A2', 'Adverbs of Manner', 'Adverbs', 'How you do something.', 'He runs _____.', 'quickly', ['quickly', 'quick', 'fastly']),
  createLesson('a2-10', 'A2', 'Relative Clauses', 'Structure', 'Who, Which, That.', 'The man _____ called me.', 'who', ['who', 'which', 'where']),
  createLesson('a2-11', 'A2', 'Too / Enough', 'Quantifiers', 'Excess / Sufficiency.', 'It is _____ hot.', 'too', ['too', 'enough', 'very']),
  createLesson('a2-12', 'A2', 'Gerunds vs Infinitives', 'Verbs', 'Verb patterns.', 'I enjoy _____.', 'swimming', ['swimming', 'to swim', 'swim']),
  createLesson('a2-13', 'A2', 'Phrasal Verbs (Basic)', 'Verbs', 'Verbs with particles.', 'Please _____ on the light.', 'turn', ['turn', 'get', 'make']),
  createLesson('a2-14', 'A2', 'Used to', 'Past', 'Past habits.', 'I _____ play tennis.', 'used to', ['used to', 'use to', 'usually']),
  createLesson('a2-15', 'A2', 'So / Neither', 'Structure', 'Agreeing.', 'So _____ I.', 'do', ['do', 'am', 'have']),
  createLesson('a2-16', 'A2', 'Indefinite Pronouns', 'Pronouns', 'Someone, Anyone.', 'Is there _____ here?', 'anyone', ['anyone', 'someone', 'no one']),
  createLesson('a2-17', 'A2', 'Present Cont. Future', 'Future', 'Arrangements.', 'I am _____ him tonight.', 'meeting', ['meeting', 'meet', 'will meet']),
  createLesson('a2-18', 'A2', 'Past Perfect (Intro)', 'Tenses', 'Had + V3.', 'When I arrived, he _____ left.', 'had', ['had', 'has', 'was']),
  createLesson('a2-19', 'A2', 'Reported Speech', 'Structure', 'He said that...', 'He said he _____ busy.', 'was', ['was', 'is', 'were']),
  createLesson('a2-20', 'A2', 'Passive (Present)', 'Voice', 'Is/Are + V3.', 'English _____ spoken here.', 'is', ['is', 'are', 'was']),
  createLesson('a2-21', 'A2', 'Passive (Past)', 'Voice', 'Was/Were + V3.', 'The car _____ stolen.', 'was', ['was', 'is', 'were']),
  createLesson('a2-22', 'A2', 'Comparatives (as...as)', 'Adjectives', 'Equality.', 'He is as _____ as me.', 'tall', ['tall', 'taller', 'tallest']),
  createLesson('a2-23', 'A2', 'Superlatives (Irreg)', 'Adjectives', 'Best, Worst.', 'This is the _____ movie.', 'best', ['best', 'goodest', 'better']),
  createLesson('a2-24', 'A2', 'Preps of Movement', 'Prepositions', 'Into, Out of, Through.', 'Walk _____ the door.', 'through', ['through', 'on', 'at']),
  createLesson('a2-25', 'A2', 'Time Clauses', 'Structure', 'When, While.', '_____ I was sleeping, the phone rang.', 'While', ['While', 'During', 'For']),
  {
    id: 'a2-exam',
    level: 'A2',
    title: 'A2 Final Exam',
    topic: 'Exam',
    explanation: <div className="text-center font-bold text-xl">Pass this to unlock B1!</div>,
    exercises: [
        { id: 'ex1', type: 'multiple-choice', question: 'I _____ working when you called.', options: ['was', 'were', 'am'], correctAnswer: 'was', explanation: 'Past Continuous' },
        { id: 'ex2', type: 'multiple-choice', question: 'If I go, I _____ buy it.', options: ['will', 'would', 'am'], correctAnswer: 'will', explanation: 'First Conditional' },
        { id: 'ex3', type: 'multiple-choice', question: 'This house _____ built in 1990.', options: ['was', 'is', 'has'], correctAnswer: 'was', explanation: 'Passive Voice' }
    ]
  },

  // --- B1 Intermediate ---
  createLesson('b1-1', 'B1', 'Present Perfect Cont.', 'Tenses', 'Have been + -ing.', 'I have been _____ for 2 hours.', 'waiting', ['waiting', 'waited', 'wait']),
  createLesson('b1-2', 'B1', 'Past Perfect Simple', 'Tenses', 'Had + V3.', 'She _____ already eaten.', 'had', ['had', 'has', 'have']),
  createLesson('b1-3', 'B1', 'Future Continuous', 'Future', 'Will be + -ing.', 'I will be _____ at 8pm.', 'working', ['working', 'work', 'worked']),
  createLesson('b1-4', 'B1', 'Second Conditional', 'Conditionals', 'If + Past, Would.', 'If I _____ rich, I would travel.', 'were', ['were', 'am', 'was']),
  createLesson('b1-5', 'B1', 'Third Conditional', 'Conditionals', 'If + Past Perf, Would Have.', 'If I had known, I _____ have come.', 'would', ['would', 'will', 'can']),
  createLesson('b1-6', 'B1', 'Mixed Conditionals', 'Conditionals', 'Past cause, present result.', 'If I had studied, I _____ be smart now.', 'would', ['would', 'will', 'can']),
  createLesson('b1-7', 'B1', 'Modals of Deduction', 'Modals', 'Must, Might, Can\'t.', 'He _____ be at home.', 'must', ['must', 'should', 'can']),
  createLesson('b1-8', 'B1', 'Modals of Obligation', 'Modals', 'Had to.', 'I _____ leave early yesterday.', 'had to', ['had to', 'must', 'should']),
  createLesson('b1-9', 'B1', 'Passive (All Tenses)', 'Voice', 'Be + V3.', 'The work is _____ done.', 'being', ['being', 'been', 'be']),
  createLesson('b1-10', 'B1', 'Reported Questions', 'Structure', 'He asked if...', 'He asked _____ I was ok.', 'if', ['if', 'that', 'what']),
  createLesson('b1-11', 'B1', 'Reported Commands', 'Structure', 'Told to...', 'He told me _____ stop.', 'to', ['to', 'that', 'if']),
  createLesson('b1-12', 'B1', 'Relative Clauses (Non)', 'Structure', 'Commas.', 'My mom, _____ is 50, works here.', 'who', ['who', 'that', 'which']),
  createLesson('b1-13', 'B1', 'Quantifiers', 'Quantifiers', 'A few, A little.', 'I have _____ time.', 'a little', ['a little', 'a few', 'many']),
  createLesson('b1-14', 'B1', 'Connectors', 'Structure', 'Although, However.', '_____ it rained, we went out.', 'Although', ['Although', 'However', 'But']),
  createLesson('b1-15', 'B1', 'Question Tags', 'Questions', 'Isn\'t it?', 'You are happy, _____?', 'aren\'t you', ['aren\'t you', 'don\'t you', 'isn\'t it']),
  createLesson('b1-16', 'B1', 'Phrasal Verbs (Int)', 'Verbs', 'Look after, Take off.', 'Please _____ off your shoes.', 'take', ['take', 'put', 'get']),
  createLesson('b1-17', 'B1', 'Future Forms Review', 'Future', 'Will, Going to, Present.', 'The train _____ at 9.', 'leaves', ['leaves', 'will leave', 'leaving']),
  createLesson('b1-18', 'B1', 'Used to / Be used to', 'Structure', 'Habits vs Familiarity.', 'I am used to _____ early.', 'waking', ['waking', 'wake', 'woke']),
  createLesson('b1-19', 'B1', 'Wishes', 'Mood', 'I wish + Past.', 'I wish I _____ rich.', 'were', ['were', 'am', 'will be']),
  createLesson('b1-20', 'B1', 'Causative', 'Structure', 'Have something done.', 'I had my hair _____.', 'cut', ['cut', 'cutting', 'to cut']),
  {
    id: 'b1-exam',
    level: 'B1',
    title: 'B1 Final Exam',
    topic: 'Exam',
    explanation: <div className="text-center font-bold text-xl">Pass this to unlock B2!</div>,
    exercises: [
        { id: 'ex1', type: 'multiple-choice', question: 'If I _____ you, I would go.', options: ['were', 'was', 'am'], correctAnswer: 'were', explanation: 'Second Conditional' },
        { id: 'ex2', type: 'multiple-choice', question: 'I wish I _____ more time.', options: ['had', 'have', 'will have'], correctAnswer: 'had', explanation: 'Wishes' },
        { id: 'ex3', type: 'multiple-choice', question: 'He asked me _____ I lived.', options: ['where', 'that', 'if'], correctAnswer: 'where', explanation: 'Reported Question' }
    ]
  },

  // --- B2 Upper Intermediate ---
  createLesson('b2-1', 'B2', 'Future Perfect', 'Future', 'Will have + V3.', 'I will have _____ by 5pm.', 'finished', ['finished', 'finish', 'finishing']),
  createLesson('b2-2', 'B2', 'Future Perfect Cont.', 'Future', 'Will have been + -ing.', 'I will have been _____ for 10 years.', 'working', ['working', 'worked', 'work']),
  createLesson('b2-3', 'B2', 'Third Conditional', 'Conditionals', 'Regrets.', 'If I had seen you, I _____ said hello.', 'would have', ['would have', 'will have', 'had']),
  createLesson('b2-4', 'B2', 'Mixed Conditionals', 'Conditionals', 'Complex time.', 'If I were you, I _____ done it.', 'would have', ['would have', 'will have', 'would']),
  createLesson('b2-5', 'B2', 'Modals of Deduction', 'Modals', 'Past.', 'He must _____ been tired.', 'have', ['have', 'has', 'had']),
  createLesson('b2-6', 'B2', 'Passive Reporting', 'Voice', 'It is said that...', 'He is said _____ rich.', 'to be', ['to be', 'being', 'is']),
  createLesson('b2-7', 'B2', 'Cleft Sentences', 'Emphasis', 'It was X that...', 'It was John _____ called.', 'who', ['who', 'what', 'which']),
  createLesson('b2-8', 'B2', 'Inversion', 'Emphasis', 'Never have I...', 'Never _____ I seen this.', 'have', ['have', 'had', 'did']),
  createLesson('b2-9', 'B2', 'Subjunctive', 'Mood', 'I suggest he...', 'I suggest he _____ there.', 'go', ['go', 'goes', 'went']),
  createLesson('b2-10', 'B2', 'Discourse Markers', 'Structure', 'Mind you, Actually.', '_____, I don\'t agree.', 'Actually', ['Actually', 'But', 'And']),
  createLesson('b2-11', 'B2', 'Participle Clauses', 'Structure', 'Walking down the street...', '_____ the news, he cried.', 'Hearing', ['Hearing', 'Heard', 'Hear']),
  createLesson('b2-12', 'B2', 'Phrasal Verbs (Adv)', 'Verbs', 'Complex meanings.', 'I can\'t put _____ with this.', 'up', ['up', 'on', 'in']),
  createLesson('b2-13', 'B2', 'Idioms', 'Vocabulary', 'Fixed phrases.', 'It\'s raining cats and _____.', 'dogs', ['dogs', 'cows', 'birds']),
  createLesson('b2-14', 'B2', 'Narrative Tenses', 'Tenses', 'Storytelling.', 'The sun _____ shining.', 'was', ['was', 'is', 'were']),
  createLesson('b2-15', 'B2', 'Future in the Past', 'Future', 'Was going to.', 'I _____ going to call you.', 'was', ['was', 'am', 'were']),
  createLesson('b2-16', 'B2', 'Whatever / Whoever', 'Pronouns', 'Any person/thing.', '_____ calls, say I\'m out.', 'Whoever', ['Whoever', 'Whatever', 'However']),
  createLesson('b2-17', 'B2', 'Verbs of Perception', 'Verbs', 'See him do/doing.', 'I saw him _____ the road.', 'cross', ['cross', 'crossed', 'to cross']),
  createLesson('b2-18', 'B2', 'Adjective Order', 'Adjectives', 'OSASCOMP.', 'A _____ red car.', 'big', ['big', 'red', 'car']),
  createLesson('b2-19', 'B2', 'Gradable Adjectives', 'Adjectives', 'Very vs Absolutely.', 'It is _____ freezing.', 'absolutely', ['absolutely', 'very', 'a bit']),
  createLesson('b2-20', 'B2', 'Adverbs of Degree', 'Adverbs', 'Quite, Rather.', 'It\'s _____ cold today.', 'quite', ['quite', 'much', 'many']),
  {
    id: 'b2-exam',
    level: 'B2',
    title: 'B2 Final Exam',
    topic: 'Exam',
    explanation: <div className="text-center font-bold text-xl">Pass this to unlock C1!</div>,
    exercises: [
        { id: 'ex1', type: 'multiple-choice', question: 'Never _____ I seen such a thing.', options: ['have', 'had', 'did'], correctAnswer: 'have', explanation: 'Inversion' },
        { id: 'ex2', type: 'multiple-choice', question: 'It is essential that he _____ on time.', options: ['be', 'is', 'was'], correctAnswer: 'be', explanation: 'Subjunctive' },
        { id: 'ex3', type: 'multiple-choice', question: 'I saw him _____ the money.', options: ['take', 'took', 'taken'], correctAnswer: 'take', explanation: 'Verb of perception' }
    ]
  },

  // --- C1 Advanced ---
  createLesson('c1-1', 'C1', 'Inversion (Complex)', 'Structure', 'Little did he know.', 'Little _____ he know.', 'did', ['did', 'does', 'do']),
  createLesson('c1-2', 'C1', 'Cleft (It was...)', 'Emphasis', 'Focusing.', 'It was John _____ did it.', 'who', ['who', 'what', 'that']),
  createLesson('c1-3', 'C1', 'Cleft (What...)', 'Emphasis', 'Focusing.', 'What I need _____ money.', 'is', ['is', 'are', 'was']),
  createLesson('c1-4', 'C1', 'Subjunctive (Formal)', 'Mood', 'Mandatory.', 'It is mandatory that she _____ .', 'sign', ['sign', 'signs', 'signed']),
  createLesson('c1-5', 'C1', 'Unreal Past', 'Mood', 'It\'s time...', 'It\'s time we _____.', 'left', ['left', 'leave', 'go']),
  createLesson('c1-6', 'C1', 'Advanced Conditionals', 'Conditionals', 'Should you see him...', '_____ you see him, call me.', 'Should', ['Should', 'If', 'When']),
  createLesson('c1-7', 'C1', 'Participle Phrases', 'Structure', 'Reduced clauses.', '_____ by the noise, he woke up.', 'Disturbed', ['Disturbed', 'Disturbing', 'Disturb']),
  createLesson('c1-8', 'C1', 'Absolute Phrases', 'Structure', 'Noun + Participle.', 'Weather _____, we will go.', 'permitting', ['permitting', 'permitted', 'permit']),
  createLesson('c1-9', 'C1', 'Nominalization', 'Style', 'Verbs to Nouns.', 'The _____ of the data.', 'analysis', ['analysis', 'analyze', 'analyzing']),
  createLesson('c1-10', 'C1', 'Hedging', 'Style', 'Softening.', 'It _____ appear that...', 'would', ['would', 'will', 'can']),
  createLesson('c1-11', 'C1', 'Fronting', 'Emphasis', 'Moving to front.', 'Strange _____ it seems.', 'as', ['as', 'though', 'if']),
  createLesson('c1-12', 'C1', 'Discourse Markers', 'Structure', 'Furthermore.', '_____, we must consider...', 'Furthermore', ['Furthermore', 'But', 'So']),
  createLesson('c1-13', 'C1', 'Adv Phrasal Verbs', 'Verbs', 'Nuance.', 'The deal fell _____.', 'through', ['through', 'out', 'off']),
  createLesson('c1-14', 'C1', 'Collocations (Adj)', 'Vocabulary', 'Heavy rain.', '_____ rain.', 'Heavy', ['Heavy', 'Strong', 'Big']),
  createLesson('c1-15', 'C1', 'Collocations (Verb)', 'Vocabulary', 'Make a decision.', '_____ a decision.', 'Make', ['Make', 'Do', 'Have']),
  createLesson('c1-16', 'C1', 'Idioms', 'Vocabulary', 'Advanced.', 'Once in a _____ moon.', 'blue', ['blue', 'red', 'green']),
  createLesson('c1-17', 'C1', 'Stylistic Inversion', 'Style', 'Literary.', 'Down _____ the rain.', 'came', ['came', 'come', 'coming']),
  createLesson('c1-18', 'C1', 'Passive (Adv)', 'Voice', 'Get passive.', 'He got _____ by the police.', 'caught', ['caught', 'catch', 'catching']),
  createLesson('c1-19', 'C1', 'Future in Past', 'Future', 'Was to have...', 'He was to _____ arrived.', 'have', ['have', 'had', 'has']),
  createLesson('c1-20', 'C1', 'Modals (Nuance)', 'Modals', 'Dare / Need.', 'How dare you _____ that!', 'say', ['say', 'said', 'saying']),
  {
    id: 'c1-exam',
    level: 'C1',
    title: 'C1 Final Exam',
    topic: 'Exam',
    explanation: <div className="text-center font-bold text-xl">Pass this to unlock C2!</div>,
    exercises: [
        { id: 'ex1', type: 'multiple-choice', question: '_____ you require assistance, call us.', options: ['Should', 'If', 'When'], correctAnswer: 'Should', explanation: 'Inverted conditional' },
        { id: 'ex2', type: 'multiple-choice', question: 'It\'s high time we _____.', options: ['left', 'leave', 'go'], correctAnswer: 'left', explanation: 'Unreal Past' },
        { id: 'ex3', type: 'multiple-choice', question: 'Strange _____ it may seem.', options: ['as', 'though', 'if'], correctAnswer: 'as', explanation: 'Fronting' }
    ]
  },

  // --- C2 Proficiency ---
  createLesson('c2-1', 'C2', 'Archaic Forms', 'Style', 'Old English.', '_____ thou happy?', 'Art', ['Art', 'Are', 'Is']),
  createLesson('c2-2', 'C2', 'Literary Devices', 'Style', 'Metaphor.', 'Time is a _____.', 'thief', ['thief', 'bird', 'car']),
  createLesson('c2-3', 'C2', 'Complex Inversion', 'Structure', 'No sooner...', 'No sooner _____ I arrived.', 'had', ['had', 'have', 'did']),
  createLesson('c2-4', 'C2', 'Subjunctive (Rare)', 'Mood', 'Be that as it may.', 'Be that as it _____.', 'may', ['may', 'might', 'can']),
  createLesson('c2-5', 'C2', 'Adv Collocations', 'Vocabulary', 'Mitigating circumstances.', '_____ circumstances.', 'Mitigating', ['Mitigating', 'Reducing', 'Lowering']),
  createLesson('c2-6', 'C2', 'Fixed Expressions', 'Vocabulary', 'By and large.', 'By and _____.', 'large', ['large', 'big', 'wide']),
  createLesson('c2-7', 'C2', 'Neologisms', 'Vocabulary', 'New words.', 'Selfie is a _____.', 'neologism', ['neologism', 'word', 'verb']),
  createLesson('c2-8', 'C2', 'Dialectal Variations', 'Vocabulary', 'Regional.', 'Wee means _____.', 'small', ['small', 'big', 'fast']),
  createLesson('c2-9', 'C2', 'Register Shifting', 'Style', 'Tone.', 'Kindly _____ the door.', 'shut', ['shut', 'close', 'slam']),
  createLesson('c2-10', 'C2', 'Irony', 'Style', 'Meaning opposite.', 'Great weather! (It\'s raining).', 'Irony', ['Irony', 'Simile', 'Metaphor']),
  createLesson('c2-11', 'C2', 'Metaphor', 'Style', 'Comparison.', 'He is a _____.', 'lion', ['lion', 'man', 'boy']),
  createLesson('c2-12', 'C2', 'Hyperbole', 'Style', 'Exaggeration.', 'I told you a _____ times.', 'million', ['million', 'few', 'some']),
  createLesson('c2-13', 'C2', 'Euphemisms', 'Style', 'Polite terms.', 'Passed away means _____.', 'died', ['died', 'slept', 'left']),
  createLesson('c2-14', 'C2', 'Ambiguity', 'Style', 'Double meaning.', 'The bank (river or money).', 'Ambiguity', ['Ambiguity', 'Irony', 'Pun']),
  createLesson('c2-15', 'C2', 'Syntactic Complexity', 'Structure', 'Long sentences.', 'Despite the fact that...', 'Although', ['Although', 'But', 'So']),
  createLesson('c2-16', 'C2', 'Discourse Analysis', 'Structure', 'Text flow.', 'Cohesion.', 'Cohesion', ['Cohesion', 'Glue', 'Stick']),
  createLesson('c2-17', 'C2', 'Textual Cohesion', 'Structure', 'Linking.', 'Therefore.', 'Therefore', ['Therefore', 'So', 'And']),
  createLesson('c2-18', 'C2', 'Style and Tone', 'Style', 'Formal/Informal.', 'Greetings vs Hi.', 'Register', ['Register', 'Tone', 'Style']),
  createLesson('c2-19', 'C2', 'Connotation', 'Vocabulary', 'Feeling.', 'Home vs House.', 'Connotation', ['Connotation', 'Meaning', 'Sense']),
  createLesson('c2-20', 'C2', 'Sound Symbolism', 'Style', 'Phonaesthetics.', 'Slither.', 'Snake', ['Snake', 'Dog', 'Cat']),
  {
    id: 'c2-exam',
    level: 'C2',
    title: 'C2 Final Exam',
    topic: 'Exam',
    explanation: <div className="text-center font-bold text-xl">You are a Legend!</div>,
    exercises: [
        { id: 'ex1', type: 'multiple-choice', question: 'No sooner _____ we left than it rained.', options: ['had', 'did', 'have'], correctAnswer: 'had', explanation: 'Inversion' },
        { id: 'ex2', type: 'multiple-choice', question: 'Suffice it to _____ that...', options: ['say', 'tell', 'speak'], correctAnswer: 'say', explanation: 'Fixed expression' },
        { id: 'ex3', type: 'multiple-choice', question: 'He is a wolf in sheep\'s _____.', options: ['clothing', 'clothes', 'coat'], correctAnswer: 'clothing', explanation: 'Idiom' }
    ]
  }
];
