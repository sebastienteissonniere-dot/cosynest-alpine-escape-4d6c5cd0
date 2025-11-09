import { createContext, useContext, useState, ReactNode } from "react";

type Language = "fr" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<Language>("fr");

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

const translations = {
  fr: {
    nav: {
      experience: "L'Expérience",
      chalet: "Le Chalet",
      weather: "Météo Vars",
      services: "Services",
      contact: "Contact",
      book: "Réserver",
    },
    hero: {
      title: "Votre refuge de luxe",
      subtitle: "dans les Alpes",
      description: "Découvrez l'expérience Cosynest à Vars 2000 : le parfait équilibre entre confort absolu et nature préservée",
      bookStay: "Réserver votre séjour",
      discover: "Découvrir le chalet",
      scrollDown: "Défiler vers le bas",
    },
    experience: {
      title: "L'Expérience Cosynest",
      subtitle: "Un chalet pensé pour votre confort, où chaque détail compte pour créer des souvenirs inoubliables",
      suites: {
        title: "Suites spacieuses",
        description: "Chambres élégantes avec salle de bain privative, literie premium et vue sur les montagnes",
      },
      wellness: {
        title: "Espace bien-être",
        description: "Salle de sport équipée et sauna privatif pour votre détente après une journée de ski",
      },
      living: {
        title: "Espace de vie",
        description: "Grand salon avec cheminée centrale et cuisine ouverte tout équipée pour des moments conviviaux",
      },
      cocooning: "Pour skieurs et non-skieurs : une expérience cocooning et relaxante",
    },
    services: {
      allInclusive: "Tout Inclus",
      title: "Un service premium clé en main",
      subtitle: "Arrivez et profitez, nous nous occupons de tout pour que vos vacances soient parfaites",
      items: {
        welcome: "Accueil personnalisé à votre arrivée",
        linen: "Linge de maison et de toilette fourni",
        cleaning: "Ménage en cours de séjour",
        finalCleaning: "Ménage de fin de séjour inclus",
        essentials: "Essentiels de cuisine offerts (huile, café, épices...)",
        products: "Produits d'accueil premium",
        concierge: "Conciergerie disponible",
        wifi: "Connexion Wi-Fi haut débit",
        evCharger: "Borne de recharge véhicule électrique à disposition",
      },
      commitment: {
        title: "Notre engagement qualité",
        description: "Chez Cosynest, votre satisfaction est notre priorité. Nous sélectionnons avec soin chaque produit et service pour vous offrir une expérience d'exception du début à la fin de votre séjour.",
      },
    },
    chalet: {
      title: "Le Chalet Cosynest",
      description1: "Niché au cœur de Vars 2000, station prisée des Alpes du Sud, Cosynest vous accueille dans un écrin de luxe et de modernité. Notre chalet allie design contemporain et chaleur alpine pour créer une atmosphère unique où confort rime avec élégance.",
      description2: "Que vous soyez passionné de ski ou amateur de randonnées estivales, Cosynest est le point de départ idéal pour explorer les sommets. Profitez d'un cadre exceptionnel où chaque saison révèle sa magie.",
      location: {
        label: "Localisation",
        value: "Vars 05560, Hautes-Alpes",
      },
      capacity: {
        label: "Capacité",
        value: "Jusqu'à 12 personnes",
      },
      bedrooms: {
        label: "Chambres",
        value: "4 suites avec SDB privative\net 1 dortoir avec SDB privative",
      },
      availability: {
        label: "Disponibilité",
        value: "Été & Hiver",
      },
      contactUs: "Contactez-nous",
    },
    weather: {
      title: "Météo & Conditions",
      subtitle: "Conditions actuelles à Vars 2000",
      current: "Maintenant",
      temperature: "Température",
      precipitation: "Précipitations",
      wind: "Vent",
      webcams: "Webcams en direct",
      snowReport: "Bulletin Neige",
      viewWebcam: "Voir la webcam",
      loading: "Chargement...",
      error: "Impossible de charger les données météo",
    },
    contact: {
      title: "Réservez votre séjour",
      subtitle: "Contactez-nous pour planifier vos prochaines vacances de rêve à Cosynest",
      email: "Email",
      phone: "Téléphone",
      instagram: "Instagram",
      bookNow: "Demander une réservation",
      platforms: "Retrouvez-nous également sur Booking, Abritel et Airbnb",
    },
    footer: {
      description: "Votre chalet de luxe à Vars pour des vacances inoubliables dans les Alpes.",
      contact: "Contact",
      followUs: "Suivez-nous",
      rights: "Tous droits réservés.",
    },
  },
  en: {
    nav: {
      experience: "The Experience",
      chalet: "The Chalet",
      weather: "Weather Vars",
      services: "Services",
      contact: "Contact",
      book: "Book",
    },
    hero: {
      title: "Your luxury retreat",
      subtitle: "in the Alps",
      description: "Discover the Cosynest experience in Vars 2000: the perfect balance between absolute comfort and preserved nature",
      bookStay: "Book your stay",
      discover: "Discover the chalet",
      scrollDown: "Scroll down",
    },
    experience: {
      title: "The Cosynest Experience",
      subtitle: "A chalet designed for your comfort, where every detail counts to create unforgettable memories",
      suites: {
        title: "Spacious suites",
        description: "Elegant rooms with private bathroom, premium bedding and mountain views",
      },
      wellness: {
        title: "Wellness area",
        description: "Equipped gym and private sauna for your relaxation after a day of skiing",
      },
      living: {
        title: "Living space",
        description: "Large living room with central fireplace and fully equipped open kitchen for convivial moments",
      },
      cocooning: "For skiers and non-skiers: a cocooning and relaxing experience",
    },
    services: {
      allInclusive: "All Inclusive",
      title: "A turnkey premium service",
      subtitle: "Arrive and enjoy, we take care of everything to make your vacation perfect",
      items: {
        welcome: "Personalized welcome upon arrival",
        linen: "House and bath linen provided",
        cleaning: "Mid-stay cleaning",
        finalCleaning: "End-of-stay cleaning included",
        essentials: "Kitchen essentials provided (oil, coffee, spices...)",
        products: "Premium welcome products",
        concierge: "Concierge service available",
        wifi: "High-speed Wi-Fi connection",
        evCharger: "Electric vehicle charging station available",
      },
      commitment: {
        title: "Our quality commitment",
        description: "At Cosynest, your satisfaction is our priority. We carefully select each product and service to offer you an exceptional experience from start to finish of your stay.",
      },
    },
    chalet: {
      title: "The Cosynest Chalet",
      description1: "Nestled in the heart of Vars 2000, a popular resort in the Southern Alps, Cosynest welcomes you in a setting of luxury and modernity. Our chalet combines contemporary design and alpine warmth to create a unique atmosphere where comfort rhymes with elegance.",
      description2: "Whether you are a ski enthusiast or summer hiker, Cosynest is the ideal starting point to explore the peaks. Enjoy an exceptional setting where each season reveals its magic.",
      location: {
        label: "Location",
        value: "Vars 05560, Hautes-Alpes",
      },
      capacity: {
        label: "Capacity",
        value: "Up to 12 people",
      },
      bedrooms: {
        label: "Bedrooms",
        value: "4 suites with private bathroom\nand 1 dormitory with private bathroom",
      },
      availability: {
        label: "Availability",
        value: "Summer & Winter",
      },
      contactUs: "Contact us",
    },
    weather: {
      title: "Weather & Conditions",
      subtitle: "Current conditions at Vars 2000",
      current: "Now",
      temperature: "Temperature",
      precipitation: "Precipitation",
      wind: "Wind",
      webcams: "Live Webcams",
      snowReport: "Snow Report",
      viewWebcam: "View webcam",
      loading: "Loading...",
      error: "Unable to load weather data",
    },
    contact: {
      title: "Book your stay",
      subtitle: "Contact us to plan your next dream vacation at Cosynest",
      email: "Email",
      phone: "Phone",
      instagram: "Instagram",
      bookNow: "Request a booking",
      platforms: "Also find us on Booking, Abritel and Airbnb",
    },
    footer: {
      description: "Your luxury chalet in Vars for unforgettable holidays in the Alps.",
      contact: "Contact",
      followUs: "Follow us",
      rights: "All rights reserved.",
    },
  },
};
