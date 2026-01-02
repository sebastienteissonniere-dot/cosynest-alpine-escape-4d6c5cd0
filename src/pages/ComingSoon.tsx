import heroImage from "@/assets/hero-chalet.jpg";
import { Mail } from "lucide-react";

const ComingSoon = () => {
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Cosynest - Chalet de luxe à Vars"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-white mb-6">
          Chalet Cosynest
        </h1>
        <div className="w-24 h-1 bg-white/50 mx-auto mb-8 rounded-full" />
        <p className="text-2xl sm:text-3xl text-white/90 font-light tracking-wide mb-12">
          Ouverture Février 2027
        </p>
        
        <div className="mt-16">
          <a 
            href="mailto:contact@chaletcosynest.fr"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-300"
          >
            <Mail className="w-5 h-5" />
            <span className="text-lg">contact@chaletcosynest.fr</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
