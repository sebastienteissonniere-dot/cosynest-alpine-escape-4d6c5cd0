import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronLeft, AlertCircle } from "lucide-react";
import { format, differenceInDays, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Reservation = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState(2);

  const MIN_NIGHTS = 2;

  const numberOfNights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;
  const isValidStay = numberOfNights >= MIN_NIGHTS;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidStay) return;
    // Handle reservation submission
    console.log({ checkIn, checkOut, guests, nights: numberOfNights });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            {language === "fr" ? "Retour" : "Back"}
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-serif font-bold mb-8 text-center">
            {language === "fr" ? "Réservez votre séjour" : "Book Your Stay"}
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Check-in Calendar */}
              <Card>
                <CardHeader>
                  <CardTitle>{language === "fr" ? "Date d'arrivée" : "Check-in"}</CardTitle>
                  <CardDescription>
                    {checkIn
                      ? format(checkIn, "PPP", { locale: language === "fr" ? fr : undefined })
                      : language === "fr"
                      ? "Sélectionnez votre date d'arrivée"
                      : "Select your check-in date"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={checkIn}
                    onSelect={setCheckIn}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>

              {/* Check-out Calendar */}
              <Card>
                <CardHeader>
                  <CardTitle>{language === "fr" ? "Date de départ" : "Check-out"}</CardTitle>
                  <CardDescription>
                    {checkOut
                      ? format(checkOut, "PPP", { locale: language === "fr" ? fr : undefined })
                      : language === "fr"
                      ? "Sélectionnez votre date de départ"
                      : "Select your check-out date"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={checkOut}
                    onSelect={setCheckOut}
                    disabled={(date) => !checkIn || date <= addDays(checkIn, MIN_NIGHTS - 1)}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Minimum Stay Alert */}
            {checkIn && checkOut && !isValidStay && (
              <Alert variant="destructive" className="mt-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {language === "fr"
                    ? `Séjour minimum de ${MIN_NIGHTS} nuits requis. Actuellement: ${numberOfNights} nuit${numberOfNights > 1 ? "s" : ""}.`
                    : `Minimum stay of ${MIN_NIGHTS} nights required. Currently: ${numberOfNights} night${numberOfNights > 1 ? "s" : ""}.`}
                </AlertDescription>
              </Alert>
            )}

            {/* Stay Duration Info */}
            {checkIn && checkOut && isValidStay && (
              <Alert className="mt-6">
                <AlertDescription>
                  {language === "fr"
                    ? `Durée du séjour: ${numberOfNights} nuit${numberOfNights > 1 ? "s" : ""}`
                    : `Stay duration: ${numberOfNights} night${numberOfNights > 1 ? "s" : ""}`}
                </AlertDescription>
              </Alert>
            )}

            {/* Guest Count */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>{language === "fr" ? "Nombre de personnes" : "Number of Guests"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Label htmlFor="guests" className="min-w-fit">
                    {language === "fr" ? "Personnes" : "Guests"}
                  </Label>
                  <Input
                    id="guests"
                    type="number"
                    min="1"
                    max="12"
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="max-w-32"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="mt-8 flex justify-center">
              <Button
                type="submit"
                size="lg"
                disabled={!checkIn || !checkOut || !isValidStay}
                className="px-12"
              >
                {language === "fr" ? "Confirmer la réservation" : "Confirm Reservation"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Reservation;
