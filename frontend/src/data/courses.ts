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
      en: "Learn how to brew better coffee at home using popular brewing methods.",
      uk: "Навчіться краще заварювати каву вдома за допомогою популярних методів.",
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
      en: "Learn espresso preparation, milk steaming and basic barista workflow.",
      uk: "Навчіться готувати еспресо, збивати молоко та працювати за базовим бариста-процесом.",
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
      en: "Work with extraction, recipes, dialing in and espresso consistency.",
      uk: "Працюйте з екстракцією, рецептами, налаштуванням помелу та стабільністю еспресо.",
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
      en: "Learn the fundamentals of roasting, heat control and roast development.",
      uk: "Вивчіть основи обсмажування, контролю температури та розвитку профілю обсмажування.",
    },
    duration: {
      en: "3 days",
      uk: "3 дні",
    },
    price: 3600,
    active: true,
  },
];
