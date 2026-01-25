
import heroImage from "@/assets/hero-chalet.jpg";
import summerImage from "@/assets/living.jpg"; // Placeholder for summer

export interface BlogPost {
    id: string;
    slug: string;
    date: string;
    category: "Event" | "News" | "Lifestyle" | "Activity";
    image: string;
    title: {
        fr: string;
        en: string;
    };
    excerpt: {
        fr: string;
        en: string;
    };
    content: {
        fr: string;
        en: string;
    };
}

export const blogPosts: BlogPost[] = [
    {
        id: "1",
        slug: "ouverture-saison-hiver-2026",
        date: "2025-11-15",
        category: "News",
        image: heroImage,
        title: {
            fr: "Ouverture de la Saison Hiver 2026",
            en: "Winter 2026 Season Opening",
        },
        excerpt: {
            fr: "Préparez vos skis ! La station de Vars annonce une ouverture anticipée avec des conditions d'enneigement exceptionnelles.",
            en: "Get your skis ready! Vars resort announces an early opening with exceptional snow conditions.",
        },
        content: {
            fr: `
        <p>L'hiver s'installe doucement sur les Hautes-Alpes et les premières chutes de neige ont déjà blanchi les sommets. Cette année, la station de Vars met les petits plats dans les grands pour vous accueillir.</p>
        <h3>Nouveautés sur le domaine</h3>
        <p>Le domaine de la Forêt Blanche s'enrichit de deux nouvelles pistes rouges et d'un espace ludique agrandi pour les enfants. Le télésiège de la Mayt a été modernisé pour plus de confort et de rapidité.</p>
        <h3>Au Chalet Cosynest</h3>
        <p>Nous avons profité de l'intersaison pour rénover l'espace bien-être. Venez découvrir notre nouveau hammam encore plus spacieux après une bonne journée de glisse.</p>
        <p>Les réservations sont ouvertes, ne tardez pas à bloquer vos dates pour les vacances de février !</p>
      `,
            en: `
        <p>Winter is slowly settling over the Hautes-Alpes and the first snowfalls have already whitened the peaks. This year, Vars resort is pulling out all the stops to welcome you.</p>
        <h3>New on the ski area</h3>
        <p>The Forêt Blanche area is enriched with two new red runs and an expanded play area for children. The Mayt chairlift has been modernized for more comfort and speed.</p>
        <h3>At Chalet Cosynest</h3>
        <p>We took advantage of the off-season to renovate the wellness area. Come and discover our new, even more spacious hammam after a good day of skiing.</p>
        <p>Bookings are open, don't delay in blocking your dates for the February holidays!</p>
      `,
        },
    },
    {
        id: "2",
        slug: "ete-indien-vars",
        date: "2025-09-10",
        category: "Lifestyle",
        image: summerImage,
        title: {
            fr: "L'Été Indien à Vars : Une parenthèse enchantée",
            en: "Indian Summer in Vars: An Enchanted Interlude",
        },
        excerpt: {
            fr: "Découvrez la montagne autrement. Les couleurs d'automne transforment la vallée en un tableau vivant.",
            en: "Discover the mountain differently. Autumn colors transform the valley into a living painting.",
        },
        content: {
            fr: `
        <p>Septembre et octobre sont souvent les mois préférés des locaux. L'agitation de l'été est retombée, l'air devient plus croustillant, et les mélèzes commencent à revêtir leur habit d'or.</p>
        <h3>Randonnées contemplatives</h3>
        <p>C'est le moment idéal pour arpenter le Val d'Escreins. La faune est plus visible, et les lumières rasantes du soleil offrent des contrastes saisissants pour les amateurs de photographie.</p>
        <h3>Soirées au coin du feu</h3>
        <p>Les soirées commencent à rafraîchir, justifiant la première flambée dans la cheminée du chalet. Profitez de nos offres spéciales "Automne" pour un week-end prolongé de déconnexion totale.</p>
      `,
            en: `
        <p>September and October are often the locals' favorite months. The bustle of summer has subsided, the air becomes crisper, and the larches begin to put on their golden coat.</p>
        <h3>Contemplative hikes</h3>
        <p>It's the ideal time to roam the Val d'Escreins. Wildlife is more visible, and the low sunlight offers striking contrasts for photography enthusiasts.</p>
        <h3>Evenings by the fire</h3>
        <p>Evenings are starting to cool down, justifying the first blaze in the chalet's fireplace. Take advantage of our special "Autumn" offers for a long weekend of total disconnection.</p>
      `,
        },
    },
];
