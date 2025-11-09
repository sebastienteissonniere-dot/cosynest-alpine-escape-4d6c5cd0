import { Check, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const Services = () => {
  const { t } = useLanguage();
  
  const services = [
    t("services.items.welcome"),
    t("services.items.linen"),
    t("services.items.cleaning"),
    t("services.items.finalCleaning"),
    t("services.items.essentials"),
    t("services.items.products"),
    t("services.items.concierge"),
    t("services.items.wifi"),
    t("services.items.evCharger"),
  ];
  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-4">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-accent font-medium text-sm">{t("services.allInclusive")}</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-4">
              {t("services.title")}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t("services.subtitle")}
            </p>
          </div>

          <Card className="shadow-luxury border-border/50">
            <CardContent className="p-8 sm:p-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 group"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="p-1 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-smooth">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <p className="text-foreground font-medium leading-relaxed">
                      {service}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20">
            <div className="text-center">
              <h3 className="text-2xl font-serif font-semibold text-foreground mb-3">
                {t("services.commitment.title")}
              </h3>
              <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                {t("services.commitment.description")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
