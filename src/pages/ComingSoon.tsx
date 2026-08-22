import heroImage from "@/assets/hero-chalet.jpg";
import EarlyAccessForm from "@/components/EarlyAccessForm";

const ComingSoon = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-y-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0">
        <img
          src={heroImage}
          alt="Cosynest - Chalet de luxe à Vars"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/75" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto w-full my-auto">
        <h1 className="text-4xl sm:text-6xl font-serif font-bold text-white mb-4">
          Chalet Cosynest
        </h1>
        <div className="w-20 h-1 bg-amber-400/80 mx-auto mb-6 rounded-full" />
        <p className="text-xl sm:text-2xl text-amber-200/90 font-light tracking-wide mb-8">
          Ouverture Début 2027
        </p>
        
        <div className="w-full">
          <EarlyAccessForm />
        </div>

        <div className="mt-8 text-center">
          <a 
            href="mailto:contact@chaletcosynest.fr"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors duration-300 text-sm sm:text-base font-light"
          >
            <span>contact@chaletcosynest.fr</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
