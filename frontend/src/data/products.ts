// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

type LocalizedProductText = {
  en: string;
  uk: string;
};

export type CartProduct = {
  id: number;
  name: string;
  roast: string;
  roastColor: string;
  weight: string;
  price: number;
  description: LocalizedProductText;
  category: "single-origin" | "espresso" | "rare" | "decaf" | "drip";
  inStock: boolean;
  stock: number;
  image: string;
  // Firebase Storage — primary
  imageStoragePath?: string;
  // Cloudinary — fallback
  imagePublicId?: string;
  popularity: number;
};

// ----------------------------------------------------------------------
// INITIAL PRODUCTS
// ----------------------------------------------------------------------

export const initialProducts: CartProduct[] = [
  {
    id: 1,
    name: "Ethiopia Yirgacheffe",
    roast: "Light Roast",
    roastColor: "#D9A96E",
    weight: "250g",
    price: 450,
    description: {
      en: "Floral and citrus notes with a clean, tea-like body.",
      uk: "Квіткові та цитрусові ноти з чистим, чайним тілом.",
    },
    category: "single-origin",
    inStock: true,
    image: "",
    popularity: 2,
    stock: 10,
  },

  {
    id: 2,
    name: "Colombia El Paraíso",
    roast: "Medium Roast",
    roastColor: "#C96A4B",
    weight: "250g",
    price: 520,
    description: {
      en: "Sweet tropical fruit, caramel and chocolate notes.",
      uk: "Солодкі ноти тропічних фруктів, карамелі та шоколаду.",
    },
    category: "single-origin",
    inStock: true,
    image: "",
    popularity: 3,
    stock: 10,
  },

  {
    id: 3,
    name: "Kenya Gaturiri",
    roast: "Light Roast",
    roastColor: "#D9A96E",
    weight: "250g",
    price: 480,
    description: {
      en: "Bright berry acidity with juicy blackcurrant notes.",
      uk: "Яскрава ягідна кислотність із соковитими нотами чорної смородини.",
    },
    category: "single-origin",
    inStock: true,
    image: "",
    popularity: 4,
    stock: 10,
  },

  {
    id: 4,
    name: "Brazil Fazenda",
    roast: "Medium Roast",
    roastColor: "#C96A4B",
    weight: "250g",
    price: 490,
    description: {
      en: "Chocolate, roasted nuts and smooth caramel sweetness.",
      uk: "Шоколад, обсмажені горіхи та м’яка карамельна солодкість.",
    },
    category: "single-origin",
    inStock: true,
    image: "",
    popularity: 6,
    stock: 10,
  },

  {
    id: 5,
    name: "Rwanda Nyamasheke",
    roast: "Light Roast",
    roastColor: "#D9A96E",
    weight: "250g",
    price: 510,
    description: {
      en: "Red berries, tea and delicate floral notes.",
      uk: "Червоні ягоди, чай і ніжні квіткові ноти.",
    },
    category: "single-origin",
    inStock: true,
    image: "",
    popularity: 5,
    stock: 10,
  },

  {
    id: 6,
    name: "Harz Espresso Blend",
    roast: "Dark Roast",
    roastColor: "#7A4A2E",
    weight: "250g",
    price: 430,
    description: {
      en: "Rich chocolate body with caramel and roasted nut notes.",
      uk: "Насичене шоколадне тіло з нотами карамелі та обсмажених горіхів.",
    },
    category: "espresso",
    inStock: true,
    image: "",
    popularity: 1,
    stock: 10,
  },

  {
    id: 7,
    name: "Costa Rica Tarrazú",
    roast: "Light Roast",
    roastColor: "#D9A96E",
    weight: "250g",
    price: 540,
    description: {
      en: "Clean citrus acidity with honey and stone fruit.",
      uk: "Чиста цитрусова кислотність із нотами меду та кісточкових фруктів.",
    },
    category: "single-origin",
    inStock: true,
    image: "",
    popularity: 7,
    stock: 10,
  },

  {
    id: 8,
    name: "Guatemala Huehuetenango",
    roast: "Medium Roast",
    roastColor: "#C96A4B",
    weight: "250g",
    price: 500,
    description: {
      en: "Cocoa, orange peel and brown sugar sweetness.",
      uk: "Какао, апельсинова цедра та солодкість коричневого цукру.",
    },
    category: "single-origin",
    inStock: true,
    image: "",
    popularity: 10,
    stock: 10,
  },

  {
    id: 9,
    name: "Panama Geisha",
    roast: "Light Roast",
    roastColor: "#D9A96E",
    weight: "250g",
    price: 780,
    description: {
      en: "Jasmine, bergamot and tropical fruit with a silky body.",
      uk: "Жасмин, бергамот і тропічні фрукти з шовковистим тілом.",
    },
    category: "rare",
    inStock: true,
    image: "",
    popularity: 9,
    stock: 10,
  },

  {
    id: 10,
    name: "Sumatra Mandheling",
    roast: "Dark Roast",
    roastColor: "#7A4A2E",
    weight: "250g",
    price: 470,
    description: {
      en: "Earthy, spicy and full-bodied with dark chocolate.",
      uk: "Землистий, пряний і насичений смак із нотами темного шоколаду.",
    },
    category: "single-origin",
    inStock: true,
    image: "",
    popularity: 23,
    stock: 10,
  },

  {
    id: 11,
    name: "Peru Cajamarca",
    roast: "Medium Roast",
    roastColor: "#C96A4B",
    weight: "250g",
    price: 460,
    description: {
      en: "Milk chocolate, almond and gentle citrus sweetness.",
      uk: "Молочний шоколад, мигдаль і ніжна цитрусова солодкість.",
    },
    category: "single-origin",
    inStock: true,
    image: "",
    popularity: 56,
    stock: 10,
  },

  {
    id: 12,
    name: "Burundi Kayanza",
    roast: "Light Roast",
    roastColor: "#D9A96E",
    weight: "250g",
    price: 495,
    description: {
      en: "Stone fruit, red berries and black tea notes.",
      uk: "Ноти кісточкових фруктів, червоних ягід і чорного чаю.",
    },
    category: "single-origin",
    inStock: true,
    image: "",
    popularity: 3,
    stock: 10,
  },

  {
    id: 13,
    name: "Colombia Decaf",
    roast: "Medium Roast",
    roastColor: "#C96A4B",
    weight: "250g",
    price: 480,
    description: {
      en: "Swiss Water decaf with milk chocolate and caramel sweetness.",
      uk: "Кава без кофеїну (Swiss Water) з нотами молочного шоколаду та карамелі.",
    },
    category: "decaf",
    inStock: true,
    image: "",
    popularity: 8,
    stock: 10,
  },

  {
    id: 14,
    name: "Ethiopia Drip Bag",
    roast: "Light Roast",
    roastColor: "#D9A96E",
    weight: "10g",
    price: 45,
    description: {
      en: "Single-cup drip bag with floral and citrus notes. Just add hot water.",
      uk: "Дріп-пакет на одну чашку з квітковими та цитрусовими нотами. Просто залийте гарячою водою.",
    },
    category: "drip",
    inStock: true,
    image: "",
    popularity: 11,
    stock: 10,
  },

  {
    id: 15,
    name: "Kenya Nyeri Drip Bag",
    roast: "Light Roast",
    roastColor: "#D9A96E",
    weight: "10g",
    price: 50,
    description: {
      en: "Blackcurrant and grapefruit acidity in a single-cup drip bag.",
      uk: "Чорна смородина та грейпфрутова кислотність у дріп-пакеті на одну чашку.",
    },
    category: "drip",
    inStock: true,
    image: "",
    popularity: 14,
    stock: 30,
  },

  {
    id: 16,
    name: "Colombia Huila Drip Bag",
    roast: "Medium Roast",
    roastColor: "#C96A4B",
    weight: "10g",
    price: 45,
    description: {
      en: "Caramel, red apple and milk chocolate in a convenient drip bag.",
      uk: "Карамель, червоне яблуко та молочний шоколад у зручному дріп-пакеті.",
    },
    category: "drip",
    inStock: true,
    image: "",
    popularity: 12,
    stock: 30,
  },

  {
    id: 17,
    name: "Lviv Espresso Blend",
    roast: "Dark Roast",
    roastColor: "#7A4A2E",
    weight: "1kg",
    price: 1450,
    description: {
      en: "Dark chocolate, roasted hazelnut and a long sweet finish. Made for milk drinks.",
      uk: "Темний шоколад, обсмажений фундук і довгий солодкий післясмак. Створений для напоїв з молоком.",
    },
    category: "espresso",
    inStock: true,
    image: "",
    popularity: 31,
    stock: 8,
  },

  {
    id: 18,
    name: "Crema Espresso Blend",
    roast: "Medium Roast",
    roastColor: "#C96A4B",
    weight: "500g",
    price: 760,
    description: {
      en: "Balanced blend with cocoa, dried fruit and a thick crema.",
      uk: "Збалансована суміш із нотами какао, сухофруктів і щільною кремою.",
    },
    category: "espresso",
    inStock: true,
    image: "",
    popularity: 18,
    stock: 12,
  },

  {
    id: 19,
    name: "Ethiopia Gesha Village",
    roast: "Light Roast",
    roastColor: "#D9A96E",
    weight: "250g",
    price: 1250,
    description: {
      en: "Bergamot, jasmine and white peach. A rare micro-lot from the birthplace of Gesha.",
      uk: "Бергамот, жасмин і білий персик. Рідкісний мікролот з батьківщини сорту Гейша.",
    },
    category: "rare",
    inStock: true,
    image: "",
    popularity: 15,
    stock: 4,
  },

  {
    id: 20,
    name: "Colombia Pink Bourbon",
    roast: "Light Roast",
    roastColor: "#D9A96E",
    weight: "250g",
    price: 890,
    description: {
      en: "Raspberry, hibiscus and cane sugar with a juicy, sparkling acidity.",
      uk: "Малина, гібіскус і тростинний цукор із соковитою, яскравою кислотністю.",
    },
    category: "rare",
    inStock: true,
    image: "",
    popularity: 13,
    stock: 6,
  },

  {
    id: 21,
    name: "Brazil Decaf",
    roast: "Dark Roast",
    roastColor: "#7A4A2E",
    weight: "500g",
    price: 780,
    description: {
      en: "Sugarcane decaf with hazelnut and cocoa. Full flavour without caffeine.",
      uk: "Кава без кофеїну (метод цукрової тростини) з нотами фундука та какао.",
    },
    category: "decaf",
    inStock: true,
    image: "",
    popularity: 9,
    stock: 10,
  },

  {
    id: 22,
    name: "Honduras Santa Bárbara",
    roast: "Medium Roast",
    roastColor: "#C96A4B",
    weight: "250g",
    price: 495,
    description: {
      en: "Red apple, toffee and milk chocolate with a round body.",
      uk: "Червоне яблуко, ірис і молочний шоколад з округлим тілом.",
    },
    category: "single-origin",
    inStock: true,
    image: "",
    popularity: 21,
    stock: 10,
  },

  {
    id: 23,
    name: "El Salvador Pacamara",
    roast: "Light Roast",
    roastColor: "#D9A96E",
    weight: "250g",
    price: 560,
    description: {
      en: "Large-bean variety with notes of plum, cocoa nibs and orange zest.",
      uk: "Великозерний сорт з нотами сливи, какао-крупки та апельсинової цедри.",
    },
    category: "single-origin",
    inStock: true,
    image: "",
    popularity: 17,
    stock: 10,
  },

  {
    id: 24,
    name: "Yemen Haraz",
    roast: "Medium Roast",
    roastColor: "#C96A4B",
    weight: "250g",
    price: 1100,
    description: {
      en: "Dried fig, spices and dark chocolate from the historic terraces of Yemen.",
      uk: "Сушений інжир, спеції та темний шоколад з історичних терас Ємену.",
    },
    category: "rare",
    inStock: false,
    image: "",
    popularity: 7,
    stock: 0,
  },
];
