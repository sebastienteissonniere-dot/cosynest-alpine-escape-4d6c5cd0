import { Mail, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

import { useNavigate } from "react-router-dom";

const Contact = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-6">
            {t("contact.title")}
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            {t("contact.subtitle")}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto">
            <Card className="hover:shadow-medium transition-smooth border-border/50">
              <CardContent className="p-8 text-center">
                <div className="inline-flex p-4 rounded-full bg-accent/10 mb-4">
                  <Mail className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{t("contact.email")}</h3>
                <p className="text-muted-foreground text-sm">
                  contact@chaletcosynest.fr
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-medium transition-smooth border-border/50">
              <CardContent className="p-8 text-center">
                <div className="inline-flex p-4 rounded-full bg-accent/10 mb-4">
                  <Instagram className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{t("contact.instagram")}</h3>
                <p className="text-muted-foreground text-sm">
                  @cosynest
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Button
              size="lg"
              className="text-lg px-8 shadow-luxury"
              onClick={() => navigate("/reservation")}
            >
              {t("contact.bookNow")}
            </Button>
            <p className="text-sm text-muted-foreground">
              {t("contact.platforms")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
