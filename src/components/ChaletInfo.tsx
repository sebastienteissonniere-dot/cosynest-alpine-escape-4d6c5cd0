import { MapPin, Users, Bed, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const ChaletInfo = () => {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: MapPin,
      label: t("chalet.location.label"),
      value: t("chalet.location.value"),
    },
    {
      icon: Users,
      label: t("chalet.capacity.label"),
      value: t("chalet.capacity.value"),
    },
    {
      icon: Bed,
      label: t("chalet.bedrooms.label"),
      value: t("chalet.bedrooms.value"),
    },
    {
      icon: Calendar,
      label: t("chalet.availability.label"),
      value: t("chalet.availability.value"),
    },
  ];
  return (
    <section id="chalet" className="py-20 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-6">
                {t("chalet.title")}
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {t("chalet.description1")}
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {t("chalet.description2")}
              </p>
              <Button size="lg" className="shadow-medium">
                {t("chalet.contactUs")}
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
                          <p className="text-lg text-foreground font-semibold whitespace-pre-line">
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
