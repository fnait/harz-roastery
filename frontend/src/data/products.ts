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
  category: "single-origin" | "espresso" | "rare" | "decaf";
  inStock: boolean;
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
  },
];
