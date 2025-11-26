/**
 * Composable pour obtenir l'URL de base de l'API selon l'environnement
 * @returns L'URL de base de l'API (production ou développement)
 */
export const useApiUrl = () => {
  // @ts-ignore
  const isProduction = __USE_PROD_API__
  
  return isProduction 
    ? 'https://oscarapi.eternyuhc.fr:8080'
    : 'http://localhost:8080'
}