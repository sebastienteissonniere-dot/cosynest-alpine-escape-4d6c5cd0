import { MapPin, Users, Bed, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: MapPin,
    label: "Localisation",
    value: "Vars 05560, Hautes-Alpes",
  },
  {
    icon: Users,
    label: "Capacité",
    value: "Jusqu'à 10 personnes",
  },
  {
    icon: Bed,
    label: "Chambres",
    value: "5 suites avec SDB privative",
  },
  {
    icon: Calendar,
    label: "Disponibilité",
    value: "Été & Hiver",
  },
];

const ChaletInfo = () => {
  return (
    <section id="chalet" className="py-20 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-6">
                Le Chalet Cosynest
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Niché au cœur de Vars, station prisée des Alpes du Sud, Cosynest vous accueille dans un écrin de luxe et de modernité. Notre chalet allie design contemporain et chaleur alpine pour créer une atmosphère unique où confort rime avec élégance.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Que vous soyez passionné de ski ou amateur de randonnées estivales, Cosynest est le point de départ idéal pour explorer les sommets. Profitez d'un cadre exceptionnel où chaque saison révèle sa magie.
              </p>
              <Button size="lg" className="shadow-medium">
                Contactez-nous
              </Button>
            </div>

            <div className="space-y-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={index}
                    className="hover:shadow-medium transition-slow border-border/50"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-primary/10">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground font-medium mb-1">
                            {feature.label}
                          </p>
                          <p className="text-lg text-foreground font-semibold">
                            {feature.value}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChaletInfo;
