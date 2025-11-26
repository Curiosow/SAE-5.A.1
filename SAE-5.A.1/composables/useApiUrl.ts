/**
 * Composable pour obtenir l'URL de base de l'API selon l'environnement
 * @returns L'URL de base de l'API (production ou développement)
 */
export const useApiUrl = () => {
  const isProduction = import.meta.env.MODE === 'production' || process.env.NODE_ENV === 'production'
  
  return isProduction 
    ? 'https://oscarapi.eternyuhc.fr:8080'
    : 'http://localhost:8080'
}

