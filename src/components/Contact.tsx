import { Mail, Phone, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-6">
            Réservez votre séjour
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            Contactez-nous pour planifier vos prochaines vacances de rêve à Cosynest
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="hover:shadow-medium transition-smooth border-border/50">
              <CardContent className="p-8 text-center">
                <div className="inline-flex p-4 rounded-full bg-accent/10 mb-4">
                  <Mail className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Email</h3>
                <p className="text-muted-foreground text-sm">
                  contact@cosynest.com
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-medium transition-smooth border-border/50">
              <CardContent className="p-8 text-center">
                <div className="inline-flex p-4 rounded-full bg-accent/10 mb-4">
                  <Phone className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Téléphone</h3>
                <p className="text-muted-foreground text-sm">
                  +33 (0)X XX XX XX XX
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-medium transition-smooth border-border/50">
              <CardContent className="p-8 text-center">
                <div className="inline-flex p-4 rounded-full bg-accent/10 mb-4">
                  <Instagram className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Instagram</h3>
                <p className="text-muted-foreground text-sm">
                  @cosynest
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Button size="lg" className="text-lg px-8 shadow-luxury">
              Demander une réservation
            </Button>
            <p className="text-sm text-muted-foreground">
              Retrouvez-nous également sur Booking, Abritel et Airbnb
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
