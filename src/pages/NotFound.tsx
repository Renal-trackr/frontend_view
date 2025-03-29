import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-5 text-center">
      <h1 className="text-4xl font-bold text-primary-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page non trouvée</h2>
      <p className="text-gray-500 mb-6">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Link to="/">
        <Button>
          Retour à l'accueil
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
