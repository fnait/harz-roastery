// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

type LocalizedText = {
  en: string;
  uk: string;
};

export type Course = {
  id: number;
  title: LocalizedText;
  description: LocalizedText;
  duration: LocalizedText;
  price: number;
  active: boolean;
};

// ----------------------------------------------------------------------
// INITIAL COURSES
// ----------------------------------------------------------------------

export const initialCourses: Course[] = [
  {
    id: 1,
    title: {
      en: "Introduction to Coffee",
      uk: "Вступ до світу кави",
    },
    description: {
      en: "Learn the basics of specialty coffee, beans, processing and brewing.",
      uk: "Дізнайтеся основи спешелті кави, зерна, обробки та заварювання.",
    },
    duration: {
      en: "1 day",
      uk: "1 день",
    },
    price: 1200,
    active: true,
  },

  {
    id: 2,
    title: {
      en: "Home Brewing",
      uk: "Домашнє заварювання",
    },
    description: {
      en: "Learn how to brew better coffee at home using popular brewing methods: V60, AeroPress, French press and moka pot. We cover grind size, water temperature and ratios, and you leave with simple recipes you can repeat every morning.",
      uk: "Навчіться краще заварювати каву вдома за допомогою популярних методів: V60, аеропрес, френч-прес і гейзерна кавоварка. Розберемо помел, температуру води та пропорції, і ви підете з простими рецептами, які легко повторювати щоранку.",
    },
    duration: {
      en: "1 day",
      uk: "1 день",
    },
    price: 1500,
    active: true,
  },

  {
    id: 3,
    title: {
      en: "Barista Basics",
      uk: "Основи бариста",
    },
    description: {
      en: "A two-day hands-on course for those who want to work behind the bar. You will learn how an espresso machine and a grinder work, how to dose, distribute and tamp, and how to pull a balanced shot. The second day is about milk: steaming, texture and pouring cappuccino, flat white and latte. You will also practise a clean and efficient barista workflow.",
      uk: "Дводенний практичний курс для тих, хто хоче працювати за баром. Ви дізнаєтеся, як влаштовані еспресо-машина та кавомолка, як правильно дозувати, розподіляти й темперувати каву та як приготувати збалансований шот. Другий день присвячений молоку: збивання, текстура та подача капучино, флет вайту й лате. Також відпрацюєте чистий та ефективний робочий процес бариста.",
    },
    duration: {
      en: "2 days",
      uk: "2 дні",
    },
    price: 2400,
    active: true,
  },

  {
    id: 4,
    title: {
      en: "Latte Art",
      uk: "Лате-арт",
    },
    description: {
      en: "Practice milk texture and learn the foundations of latte art.",
      uk: "Практикуйте текстуру молока та вивчайте основи лате-арту.",
    },
    duration: {
      en: "1 day",
      uk: "1 день",
    },
    price: 1800,
    active: true,
  },

  {
    id: 5,
    title: {
      en: "Advanced Espresso",
      uk: "Просунутий еспресо",
    },
    description: {
      en: "An in-depth course for working baristas who want to understand espresso instead of just following a recipe. We start with extraction theory: what dissolves from ground coffee and when, how brew ratio, contact time and temperature change the taste, and why the same recipe tastes different with another coffee. You will learn to measure extraction with a refractometer, build recipes for different roast levels and dial in a grinder quickly and consistently during a busy shift. The second day is about consistency: workflow, distribution tools, water quality, grinder temperature and how to keep every shot within the target range. We finish with a blind tasting of espressos made with different recipes, so you can link the numbers to flavour. Recommended after the Barista Basics course or with at least six months of experience behind the bar.",
      uk: "Поглиблений курс для практикуючих бариста, які хочуть розуміти еспресо, а не просто виконувати рецепт. Почнемо з теорії екстракції: що і коли розчиняється з меленої кави, як співвідношення, час контакту та температура змінюють смак і чому той самий рецепт інакше працює з іншою кавою. Ви навчитеся вимірювати екстракцію рефрактометром, складати рецепти для різних ступенів обсмаження та швидко й стабільно налаштовувати помел під час напруженої зміни. Другий день присвячений стабільності: робочий процес, інструменти для розподілу, якість води, температура кавомолки та те, як утримувати кожен шот у цільовому діапазоні. Завершимо сліпою дегустацією еспресо, приготованих за різними рецептами, щоб пов’язати цифри зі смаком. Рекомендуємо після курсу «Основи бариста» або маючи щонайменше пів року досвіду за баром.",
    },
    duration: {
      en: "2 days",
      uk: "2 дні",
    },
    price: 2800,
    active: true,
  },

  {
    id: 6,
    title: {
      en: "Coffee Roasting",
      uk: "Обсмажування кави",
    },
    description: {
      en: "A three-day introduction to roasting on a professional drum roaster. You will learn how green coffee changes during roasting: drying, the Maillard reaction, first crack and development time, and how each stage affects acidity, sweetness and body. We cover heat transfer, airflow and drum speed, and how to read and plan a roast curve in profiling software. Every day includes practice: you will roast the same green coffee to different profiles and taste the results side by side. We also talk about green coffee quality and storage, roast defects and how to avoid them, and how to keep notes so a good roast can be repeated. At the end of the course you will create your own profile for a chosen coffee and present it at a group cupping.",
      uk: "Триденний вступ до обсмажування на професійному барабанному ростері. Ви дізнаєтеся, як змінюється зелене зерно під час обсмажування: сушіння, реакція Маяра, перший крек і час розвитку, і як кожен етап впливає на кислотність, солодкість і тіло. Розберемо теплопередачу, повітряний потік і швидкість барабана, а також як читати й планувати криву обсмажування у програмі для профілювання. Щодня — практика: ви обсмажите одне й те саме зерно за різними профілями та порівняєте результати на смак. Також поговоримо про якість і зберігання зеленої кави, дефекти обсмажування та способи їх уникнути, і про те, як вести нотатки, щоб вдале обсмажування можна було повторити. Наприкінці курсу ви створите власний профіль для обраної кави та представите його на спільному капінгу.",
    },
    duration: {
      en: "3 days",
      uk: "3 дні",
    },
    price: 3600,
    active: true,
  },
];
