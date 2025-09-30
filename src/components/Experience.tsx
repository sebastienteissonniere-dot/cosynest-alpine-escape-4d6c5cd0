import { Bed, Dumbbell, Flame, Coffee } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import suiteImage from "@/assets/suite.jpg";
import spaImage from "@/assets/spa.jpg";
import livingImage from "@/assets/living.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

const Experience = () => {
  const { t } = useLanguage();
  
  const experiences = [
    {
      icon: Bed,
      title: t("experience.suites.title"),
      description: t("experience.suites.description"),
      image: suiteImage,
    },
    {
      icon: Dumbbell,
      title: t("experience.wellness.title"),
      description: t("experience.wellness.description"),
      image: spaImage,
    },
    {
      icon: Flame,
      title: t("experience.living.title"),
      description: t("experience.living.description"),
      image: livingImage,
    },
  ];
  return (
    <section id="experience" className="py-20 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-4">
            {t("experience.title")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("experience.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {experiences.map((experience, index) => {
            const Icon = experience.icon;
            return (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-luxury transition-slow border-border/50"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={experience.image}
                    alt={experience.title}
                    className="w-full h-full object-cover transition-slow hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-primary/10 backdrop-blur-sm">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-2xl font-serif font-semibold text-foreground">
                        {experience.title}
                      </h3>
                    </div>
                  </div>
                </div>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {experience.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Feature */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent/10 border border-accent/20">
            <Coffee className="h-5 w-5 text-accent" />
            <p className="text-accent font-medium">
              {t("experience.cocooning")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
