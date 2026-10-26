import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Droplets,
  ShieldCheck,
  Heart,
  Leaf,
  Recycle,
  Baby,
  Check,
  ExternalLink,
  Snowflake,
  ShowerHead,
  Info,
  Globe,
} from "lucide-react";

import svrMainImg from "@/assets/svr-topialyse-flacon.jpg";
import svrTextureImg from "@/assets/svr-topialyse-texture.jpg";
import svrEcoRefillImg from "@/assets/svr-topialyse-ecorefill.jpg";

const Amenities = () => {
  const { language, setLanguage } = useLanguage();
  const isFr = language === "fr";
  const [selectedImage, setSelectedImage] = useState(0);

  const productImages = [
    {
      src: svrMainImg,
      alt: isFr
        ? "Flacon pompe SVR Topialyse Huile Lavante 1L mis à disposition au Chalet CosyNest"
        : "SVR Topialyse Cleansing Oil 1L pump bottle provided at Chalet CosyNest",
      caption: isFr ? "Flacon pompe 1L Rechargeable" : "1L Refillable Pump Bottle",
    },
    {
      src: svrTextureImg,
      alt: isFr
        ? "Texture huile dorée soyeuse et enveloppante SVR Topialyse"
        : "Silky golden oil texture of SVR Topialyse",
      caption: isFr ? "Texture huile soyeuse & moussante" : "Silky foaming oil texture",
    },
    {
      src: svrEcoRefillImg,
      alt: isFr
        ? "Éco-recharge SVR Topialyse Huile Lavante utilisée au Chalet CosyNest"
        : "SVR Topialyse Cleansing Oil eco-refill used at Chalet CosyNest",
      caption: isFr ? "Engagement Éco-Recharge 1L" : "1L Eco-Refill Commitment",
    },
  ];

  const multiUses = [
    {
      title: isFr ? "Corps & Douche" : "Body & Shower",
      description: isFr
        ? "Remplace le gel douche quotidien et le bain moussant avec une mousse fine, onctueuse et enveloppante."
        : "Replaces daily shower gel and bubble bath with a fine, creamy, enveloping lather.",
    },
    {
      title: isFr ? "Cheveux & Cuir chevelu" : "Hair & Scalp",
      description: isFr
        ? "S'utilise comme shampoing doux qui nettoie les cheveux tout en apaisant les cuirs chevelus sensibles ou irrités."
        : "Works as a gentle shampoo that cleanses hair while soothing sensitive or irritated scalps.",
    },
    {
      title: isFr ? "Visage & Démaquillant" : "Face & Makeup Remover",
      description: isFr
        ? "Nettoie délicatement le visage et élimine le maquillage sous la douche sans piquer les yeux."
        : "Gently cleanses the face and removes makeup in the shower without stinging the eyes.",
    },
    {
      title: isFr ? "Mains & Usage fréquent" : "Hands & Frequent Wash",
      description: isFr
        ? "Protège les mains mises à rude épreuve par le froid alpin grâce à sa base lavante sans savon."
        : "Protects hands exposed to alpine cold thanks to its soap-free cleansing base.",
    },
    {
      title: isFr ? "Hygiène intime" : "Intimate Hygiene",
      description: isFr
        ? "Formulé à pH physiologique et testé sous contrôle gynécologique pour un respect absolu des zones sensibles."
        : "Formulated at physiological pH and gynecologically tested for complete respect of sensitive areas.",
    },
    {
      title: isFr ? "Toute la famille" : "The Whole Family",
      description: isFr
        ? "Convient aux nourrissons dès la naissance (hors prématurés), enfants, adultes et femmes enceintes ou allaitantes."
        : "Suitable for newborns from birth (excluding premature babies), children, adults, and pregnant or nursing women.",
    },
  ];

  const keyIngredients = [
    {
      badge: "35%",
      title: isFr ? "Complexe d'Actifs Relipidants & Hydratants" : "Lipid-Replenishing & Moisturizing Complex",
      subtitle: isFr ? "Huile de coton (Omégas 3, 6, 9) & Glycérine végétale" : "Cottonseed oil (Omegas 3, 6, 9) & Plant glycerin",
      description: isFr
        ? "Nourrit intensément l'épiderme, restaure la barrière cutanée, préserve le film hydrolipidique et maintient 24h d'hydratation."
        : "Intensely nourishes the epidermis, restores the skin barrier, preserves the hydrolipidic film and maintains 24-hour hydration.",
    },
    {
      badge: isFr ? "Vitamine B3" : "Vitamin B3",
      title: "Niacinamide",
      subtitle: isFr ? "Actif dermo-apaisant de référence" : "Benchmark dermo-soothing active",
      description: isFr
        ? "Apaise immédiatement les sensations d'irritation, de tiraillements et de grattage provoquées par le froid, le vent et le frottement des vêtements de ski."
        : "Immediately soothes feelings of irritation, tightness, and itching caused by cold, wind, and friction from ski clothing.",
    },
    {
      badge: isFr ? "Microbiome" : "Microbiome",
      title: isFr ? "Sucre Prébiotique" : "Prebiotic Sugar",
      subtitle: "Alpha-Glucan Oligosaccharide",
      description: isFr
        ? "Respecte et rééquilibre la flore cutanée pour renforcer les défenses naturelles de la peau et limiter le dessèchement."
        : "Respects and rebalances skin flora to strengthen natural skin defenses and limit dryness.",
    },
    {
      badge: "0%",
      title: isFr ? "Tensio-Actifs Ultra-Doux Sans Savon" : "Soap-Free Ultra-Gentle Surfactants",
      subtitle: isFr ? "Tolérance optimale • pH physiologique" : "Optimal tolerance • Physiological pH",
      description: isFr
        ? "Nettoie la peau et les cheveux en douceur sans les décaper ni les dessécher. Ne pique pas les yeux et se rince facilement."
        : "Gently cleanses skin and hair without stripping or drying. Does not sting the eyes and rinses off easily.",
    },
  ];

  const clinicalResults = [
    {
      stat: "+39,5%",
      label: isFr ? "d'hydratation après 8h dès la 1ère utilisation¹" : "hydration after 8h from the first use¹",
    },
    {
      stat: "24h",
      label: isFr ? "d'hydratation préservée et confort longue durée" : "preserved hydration and long-lasting comfort",
    },
    {
      stat: "100%",
      label: isFr
        ? "des sensations de démangeaisons liées au dessèchement soulagées²"
        : "of itching sensations due to skin dryness relieved²",
    },
    {
      stat: "100%",
      label: isFr
        ? "protège la peau des effets desséchants de l'eau calcaire et du froid²"
        : "protects skin from the drying effects of hard water and cold²",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal Standalone Header for QR Code Scan */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-border/50 shadow-soft">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div>
            <span className="text-xl sm:text-2xl font-serif font-bold text-primary">
              Chalet CosyNest
            </span>
            <span className="hidden sm:inline-block ml-3 text-xs uppercase tracking-widest text-muted-foreground border-l border-border pl-3">
              {isFr ? "Soin d'Accueil Corps & Cheveux" : "Body & Hair Welcome Care"}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setLanguage(language === "fr" ? "en" : "fr")}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/70 hover:bg-secondary text-foreground text-sm font-medium transition-smooth"
            aria-label={isFr ? "Switch to English" : "Passer en français"}
          >
            <Globe className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>{language === "fr" ? "English" : "Français"}</span>
          </button>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero / Presentation Section */}
        <section className="py-12 lg:py-20 gradient-hero border-b border-border/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Product Visuals */}
              <div className="lg:col-span-5 space-y-4">
                <div className="relative rounded-2xl overflow-hidden bg-white shadow-luxury border border-border/50 aspect-square">
                  <img
                    src={productImages[selectedImage].src}
                    alt={productImages[selectedImage].alt}
                    className="w-full h-full object-cover transition-all duration-500"
                  />
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <Badge className="bg-primary text-primary-foreground border-none px-3 py-1 text-xs font-medium shadow-sm">
                      Laboratoire SVR
                    </Badge>
                    <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-foreground border border-border/50 px-3 py-1 text-xs">
                      {isFr ? "Corps, Cheveux & Visage" : "Body, Hair & Face"}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-2 rounded-lg text-center">
                    {productImages[selectedImage].caption}
                  </div>
                </div>

                {/* Thumbnail Selector */}
                <div className="grid grid-cols-3 gap-3">
                  {productImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(idx)}
                      className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                        selectedImage === idx
                          ? "border-primary shadow-md scale-[1.02]"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                      aria-label={img.caption}
                    >
                      <img src={img.src} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Main Description */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                  <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span className="text-primary font-medium text-sm">
                    {isFr
                      ? "Votre Soin Lavant au Chalet CosyNest"
                      : "Your Cleansing Care at Chalet CosyNest"}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-serif font-bold text-foreground leading-tight">
                  SVR Topialyse Huile Lavante
                </h1>

                <p className="text-lg sm:text-xl font-serif text-primary font-medium">
                  {isFr
                    ? "Huile nettoyante micellaire relipidante & anti-irritation — Corps, Cheveux, Visage"
                    : "Lipid-replenishing & anti-irritation micellar cleansing oil — Body, Hair, Face"}
                </p>

                <div className="space-y-4 text-muted-foreground leading-relaxed text-base sm:text-lg">
                  <p>
                    {isFr
                      ? "En altitude à Vars 2000, le froid, le vent, les frottements des vêtements de ski et l'eau sensibilisent l'épiderme. Pour prendre soin de votre peau et de vos cheveux tout au long de votre séjour, nous avons sélectionné l'Huile Lavante Topialyse du Laboratoire dermatologique français SVR."
                      : "At high altitude in Vars 2000, cold air, wind, ski clothing friction, and water can sensitize the skin. To care for your skin and hair throughout your stay, we have selected Topialyse Cleansing Oil by French dermatological laboratory SVR."}
                  </p>
                  <p>
                    {isFr
                      ? "Véritable soin lavant tout-en-un pour toute la famille dès la naissance, cette huile sensorielle riche en actifs relipidants et hydratants nourrit intensément la peau, préserve le film hydrolipidique pendant 24h et nettoie délicatement le corps, les cheveux et le visage sans piquer les yeux."
                      : "A true all-in-one cleansing care for the whole family from birth, this sensory oil rich in lipid-replenishing and moisturizing actives intensely nourishes the skin, preserves the hydrolipidic film for 24 hours, and gently cleanses body, hair, and face without stinging the eyes."}
                  </p>
                </div>

                {/* Key Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-background/80 border border-border/60 text-center">
                    <Leaf className="h-5 w-5 text-primary mx-auto mb-1" aria-hidden="true" />
                    <span className="block text-sm font-bold text-foreground">89%</span>
                    <span className="text-xs text-muted-foreground">
                      {isFr ? "Origine naturelle" : "Natural origin"}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-background/80 border border-border/60 text-center">
                    <Droplets className="h-5 w-5 text-primary mx-auto mb-1" aria-hidden="true" />
                    <span className="block text-sm font-bold text-foreground">24h</span>
                    <span className="text-xs text-muted-foreground">
                      {isFr ? "Hydratation" : "Hydration"}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-background/80 border border-border/60 text-center">
                    <ShieldCheck className="h-5 w-5 text-primary mx-auto mb-1" aria-hidden="true" />
                    <span className="block text-sm font-bold text-foreground">
                      {isFr ? "Sans Savon" : "Soap-Free"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {isFr ? "pH physiologique" : "Physiological pH"}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-background/80 border border-border/60 text-center">
                    <Baby className="h-5 w-5 text-primary mx-auto mb-1" aria-hidden="true" />
                    <span className="block text-sm font-bold text-foreground">
                      {isFr ? "Dès la naissance" : "From birth"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {isFr ? "Toute la famille" : "Whole family"}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                  >
                    <a
                      href="https://fr.svr.com/products/topialyse-huile-lavante"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {isFr ? "Consulter la fiche officielle Laboratoire SVR" : "View Official SVR Lab Product Page"}
                      <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Multi-Use Section: Body, Hair, Face */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-4">
                <ShowerHead className="h-4 w-4 text-accent" aria-hidden="true" />
                <span className="text-accent font-medium text-sm">
                  {isFr ? "Soin Multi-Usages 6-en-1" : "6-in-1 Multi-Purpose Care"}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">
                {isFr
                  ? "Le soin lavant qui remplace tous les autres"
                  : "The all-in-one cleanser that replaces all others"}
              </h2>
              <p className="text-lg text-muted-foreground">
                {isFr
                  ? "Ce flacon nettoie en douceur le corps, les cheveux et le visage de toute la famille."
                  : "This bottle gently cleanses body, hair, and face for the whole family."}
              </p>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {multiUses.map((use, idx) => (
                <Card key={idx} className="border-border/50 shadow-soft hover:shadow-luxury transition-smooth">
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10 text-primary">
                        <Check className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <h3 className="text-xl font-serif font-semibold text-foreground">
                        {use.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                      {use.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Active Ingredients & INCI Section */}
        <section className="py-16 bg-secondary/30 border-y border-border/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="max-w-3xl mx-auto text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
                  <Heart className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span className="text-primary font-medium text-sm">
                    {isFr ? "Haute Tolérance Dermatologique" : "High Dermatological Tolerance"}
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">
                  {isFr
                    ? "Formulation & Actifs Dermatologiques"
                    : "Formulation & Dermatological Actives"}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {isFr
                    ? "Testé sous contrôle dermatologique, pédiatrique, ophtalmologique et gynécologique sur peaux sensibles, et testé sans effet sur les mécanismes endocriniens."
                    : "Tested under dermatological, pediatric, ophthalmological, and gynecological control on sensitive skin, and tested with no effect on endocrine mechanisms."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {keyIngredients.map((item, idx) => (
                  <Card key={idx} className="bg-background border-border/60 shadow-soft">
                    <CardContent className="p-6 sm:p-8 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-xl font-serif font-bold text-foreground">
                          {item.title}
                        </h3>
                        <Badge variant="outline" className="border-primary/40 text-primary font-semibold">
                          {item.badge}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-primary">{item.subtitle}</p>
                      <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* INCI Disclosure */}
              <Card className="bg-background border-border/60">
                <CardContent className="p-6 sm:p-8">
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer list-none font-serif font-semibold text-lg text-foreground">
                      <span className="flex items-center gap-2">
                        <Info className="h-5 w-5 text-primary" aria-hidden="true" />
                        {isFr
                          ? "Composition complète (Liste INCI officielle SVR)"
                          : "Full Ingredients List (Official SVR INCI)"}
                      </span>
                      <span className="text-sm font-sans text-primary group-open:rotate-180 transition-transform">
                        ▼
                      </span>
                    </summary>
                    <div className="mt-4 pt-4 border-t border-border/50 text-xs sm:text-sm text-muted-foreground leading-relaxed space-y-2">
                      <p className="font-mono">
                        LAB16.16/D.10 — INGREDIENTS : AQUA/WATER/EAU, GLYCERIN, SODIUM C14-16 OLEFIN SULFONATE, SODIUM LAUROAMPHOACETATE, COCO-BETAINE, NIACINAMIDE, CITRIC ACID, SODIUM OLIVAMPHOACETATE, ALPHA-GLUCAN OLIGOSACCHARIDE, PARFUM (FRAGRANCE), SACCHARIDE ISOMERATE, CAPRYLYL/CAPRYL GLUCOSIDE, SODIUM BENZOATE, POTASSIUM SORBATE, POLYGLYCERYL-3 COCOATE, POLYGLYCERYL-10 LAURATE, GOSSYPIUM HERBACEUM (COTTON) SEED OIL, SODIUM CITRATE.
                      </p>
                      <p className="italic text-xs">
                        {isFr
                          ? "89% d'ingrédients d'origine naturelle. Formule facilement biodégradable selon la norme OCDE 301F."
                          : "89% natural origin ingredients. Readily biodegradable formula according to OECD 301F standard."}
                      </p>
                    </div>
                  </details>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Clinical Efficacy & How to use */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-14">
              {/* Clinical Stats */}
              <div>
                <div className="text-center max-w-3xl mx-auto mb-10">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-4">
                    <Snowflake className="h-4 w-4 text-accent" aria-hidden="true" />
                    <span className="text-accent font-medium text-sm">
                      {isFr ? "Protection Spéciale Montagne & Froid" : "Special Mountain & Cold Protection"}
                    </span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
                    {isFr ? "Une Efficacité Prouvée" : "Proven Efficacy"}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {clinicalResults.map((res, idx) => (
                    <div
                      key={idx}
                      className="p-6 rounded-2xl bg-gradient-to-br from-secondary/40 to-secondary/10 border border-border/60 text-center space-y-2"
                    >
                      <span className="block text-4xl font-serif font-bold text-primary">
                        {res.stat}
                      </span>
                      <p className="text-sm text-foreground font-medium leading-snug">
                        {res.label}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  {isFr
                    ? "¹ Cornéométrie sur 10 volontaires. ² Auto-évaluation sur 22 sujets à peau très sèche à tendance atopique pendant 21 jours, 1 application/jour."
                    : "¹ Corneometry on 10 volunteers. ² Self-assessment on 22 subjects with very dry, atopic-prone skin over 21 days, 1 application/day."}
                </p>
              </div>

              {/* Usage Advice & Eco Commitment */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-border/60 shadow-soft">
                  <CardContent className="p-8 space-y-4">
                    <div className="inline-flex items-center gap-2 text-primary font-medium text-sm">
                      <Droplets className="h-5 w-5" aria-hidden="true" />
                      <span>{isFr ? "Conseils d'utilisation" : "How to Use"}</span>
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-foreground">
                      {isFr ? "Votre rituel douceur après le ski ou le sauna" : "Your soothing ritual after skiing or the sauna"}
                    </h3>
                    <ul className="space-y-3 text-muted-foreground leading-relaxed">
                      <li className="flex items-start gap-2.5">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <span>
                          {isFr
                            ? "Sous la douche : appliquez sur la peau et les cheveux mouillés, faites mousser délicatement puis rincez abondamment."
                            : "In the shower: apply to wet skin and hair, lather gently, then rinse thoroughly."}
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <span>
                          {isFr
                            ? "Dans le bain : versez l'équivalent de 3 pressions pendant le remplissage de la baignoire pour un bain lacté relipidant."
                            : "In the bath: pour the equivalent of 3 pumps while filling the bathtub for a soothing, lipid-replenishing bath."}
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <span>
                          {isFr
                            ? "Séchage : tapotez doucement la peau avec votre serviette sans frotter afin de préserver la barrière cutanée."
                            : "Drying: gently pat your skin dry with your towel without rubbing to preserve the skin barrier."}
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-border/60 shadow-soft bg-gradient-to-br from-primary/5 to-accent/5">
                  <CardContent className="p-8 space-y-4">
                    <div className="inline-flex items-center gap-2 text-primary font-medium text-sm">
                      <Recycle className="h-5 w-5" aria-hidden="true" />
                      <span>{isFr ? "Engagement Éco-Responsable" : "Eco-Responsible Commitment"}</span>
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-foreground">
                      {isFr ? "Pourquoi le format 1L Éco-Recharge au Chalet ?" : "Why 1L Eco-Refills at the Chalet?"}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {isFr
                        ? "Pour préserver l'environnement alpin de Vars tout en vous offrant des soins dermatologiques d'exception, nous avons privilégié des flacons réemployables plutôt que des mini-flacons individuels jetables."
                        : "To preserve the alpine environment of Vars while offering exceptional dermatological care, we chose reusable dispensers over single-use miniature plastic bottles."}
                    </p>
                    <ul className="space-y-2.5 text-muted-foreground text-sm sm:text-base">
                      <li className="flex items-start gap-2.5">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <span>
                          {isFr
                            ? "Flacons pompes 1L réemployables rechargés avec les éco-recharges SVR (réduction majeure du plastique et empreinte carbone de seulement 1,30 kg CO₂ eq.)."
                            : "Reusable 1L pump bottles refilled with SVR eco-refills (major plastic reduction and low carbon footprint of 1.30 kg CO₂ eq.)."}
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <span>
                          {isFr
                            ? "Formule à 89% d'origine naturelle et facilement biodégradable (norme OCDE 301F)."
                            : "89% natural-origin and readily biodegradable formula (OECD 301F standard)."}
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Simple Standalone Footer */}
      <footer className="bg-foreground text-background py-8 text-center text-sm text-background/70">
        <div className="container mx-auto px-4">
          <p className="font-serif text-base text-background font-semibold mb-1">
            Chalet CosyNest • Vars 2000
          </p>
          <p>
            {isFr
              ? "Nous vous souhaitons un excellent séjour au Chalet CosyNest."
              : "We wish you a wonderful stay at Chalet CosyNest."}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Amenities;
