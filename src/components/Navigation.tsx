import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-serif font-bold text-primary">Cosynest</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("experience")}
              className="text-foreground hover:text-primary transition-smooth font-medium"
            >
              L'Expérience
            </button>
            <button
              onClick={() => scrollToSection("chalet")}
              className="text-foreground hover:text-primary transition-smooth font-medium"
            >
              Le Chalet
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="text-foreground hover:text-primary transition-smooth font-medium"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-foreground hover:text-primary transition-smooth font-medium"
            >
              Contact
            </button>
            <Button variant="default" size="lg">
              Réserver
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-6 space-y-4">
            <button
              onClick={() => scrollToSection("experience")}
              className="block w-full text-left py-2 text-foreground hover:text-primary transition-smooth font-medium"
            >
              L'Expérience
            </button>
            <button
              onClick={() => scrollToSection("chalet")}
              className="block w-full text-left py-2 text-foreground hover:text-primary transition-smooth font-medium"
            >
              Le Chalet
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="block w-full text-left py-2 text-foreground hover:text-primary transition-smooth font-medium"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="block w-full text-left py-2 text-foreground hover:text-primary transition-smooth font-medium"
            >
              Contact
            </button>
            <Button variant="default" size="lg" className="w-full">
              Réserver
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
