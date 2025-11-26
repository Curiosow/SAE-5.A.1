/**
 * Composable pour obtenir l'URL de base de l'API selon l'environnement
 * @returns L'URL de base de l'API (production ou développement)
 */
export const useApiUrl = () => {
  // @ts-ignore
  const isProduction = __USE_PROD_API__
  
  return isProduction 
    ? 'https://oscarapi.eternyuhc.fr'
    : 'http://localhost:8080'
}