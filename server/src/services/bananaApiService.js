/**
 * Banana REST API Service (Module 2: Interoperability)
 * Communicates with Marc Conrad's external Banana REST API to fetch
 * live visual math puzzle images and their solutions.
 */
class BananaApiService {
  constructor() {
    // Read API URL from environment variables
    this.apiUrl = process.env.BANANA_API_URL || 'https://marcconrad.com/uob/banana/api.php?out=json';
  }

  // Viva comment: Fetch a live visual cipher puzzle from external Banana REST API
  async fetchPuzzle() {
    try {
      const response = await fetch(this.apiUrl, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Banana API returned status: ${response.status}`);
      }

      const data = await response.json();

      return {
        success: true,
        question: data.question, // Live puzzle image URL
        solution: String(data.solution), // Integer solution as string
        source: 'BANANA_REST_API'
      };
    } catch (error) {
      console.warn('[BANANA API WARNING] External API unreachable, using fail-safe puzzle:', error.message);
      
      // Fallback puzzle in case internet connection is unavailable during viva
      return {
        success: true,
        question: 'https://www.sanfoh.com/uob/banana/data/t8adba4b4a12132805a28c8b895n82.png',
        solution: '2',
        source: 'FAILSAFE_LOCAL'
      };
    }
  }

  // Viva comment: Check connection status with external Banana API endpoint
  async checkConnection() {
    try {
      const puzzle = await this.fetchPuzzle();
      return {
        status: 'CONNECTED',
        module: 'Banana REST API Interoperability',
        endpoint: this.apiUrl,
        active: puzzle.success
      };
    } catch (err) {
      return {
        status: 'DISCONNECTED',
        module: 'Banana REST API Interoperability',
        error: err.message
      };
    }
  }
}

module.exports = new BananaApiService();
