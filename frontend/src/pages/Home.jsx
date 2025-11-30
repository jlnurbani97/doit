import FeatureCard from '../components/FeaturedCard';
import logo from '../assets/logoSmall.png';
import { Link } from 'react-router-dom';

//Componente Home
export default function Home() {
  return (
    <div className="bg-linear-to-br from-light to-accent min-h-screen">
      <section className="px-8 py-20 text-center">
        <div className="flex justify-center">
          <img src={logo} className="object-contain" />
        </div>
        <h1 className="pt-4 text-6xl font-bold text-primary">
          Pick your life!
        </h1>

        <p className="text-dark mt-4 text-lg max-w-2xl mx-auto">
          Un'applicazione semplice ed elegante per la gestione delle attività.
        </p>

        <Link
          to="/register"
          className=" mt-5 inline-block bg-accent hover:bg-accent-str transition hover:scale-105 text-white font-semibold py-3 px-6 rounded-xl"
        >
          Inizia Ora
        </Link>
      </section>

      {/* Sezione features*/}
      <section className="px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <FeatureCard
          title="Gestione Task"
          description="Crea, modifica e organizza le tue attività con semplicità."
        />
        <FeatureCard
          title="Statistiche"
          description="Monitora i tuoi progressi e rimani motivato ogni giorno."
        />
        <FeatureCard
          title="Cloud Sync"
          description="Accedi ai tuoi task da qualsiasi dispositivo, ovunque."
        />
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-dark opacity-60">
        doit - Progetto cyber 2025
      </footer>
    </div>
  );
}
