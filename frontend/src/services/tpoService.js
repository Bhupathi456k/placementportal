import { getToken } from './authService';

class TPOService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  }

  // Get auth headers
  getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    };
  }

  // Generic API call method
  async apiCall(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: this.getAuthHeaders(),
        ...options
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'API call failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API call failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Company Management
  async getCompanyInsights(companyId = null) {
    return this.apiCall('/tpo/ai/company-insights', {
      method: 'POST',
      body: JSON.stringify({ company_id: companyId })
    });
  }

  async getCompanies() {
    return this.apiCall('/tpo/companies');
  }

  async createCompany(companyData) {
    return this.apiCall('/tpo/companies', {
      method: 'POST',
      body: JSON.stringify(companyData)
    });
  }

  // Placement Drives
  async getDriveAnalytics(driveId = null) {
    return this.apiCall('/tpo/ai/drive-analytics', {
      method: 'POST',
      body: JSON.stringify({ drive_id: driveId })
    });
  }

  async getDrives() {
    return this.apiCall('/tpo/drives');
  }

  async createDrive(driveData) {
    return this.apiCall('/tpo/drives', {
      method: 'POST',
      body: JSON.stringify(driveData)
    });
  }

  // Student Applications
  async getApplicationInsights(driveId = null) {
    return this.apiCall('/tpo/ai/application-insights', {
      method: 'POST',
      body: JSON.stringify({ drive_id: driveId })
    });
  }

  // Recruitment Rounds
  async getRoundOptimization(roundId = null) {
    return this.apiCall('/tpo/ai/round-optimization', {
      method: 'POST',
      body: JSON.stringify({ round_id: roundId })
    });
  }

  // Reports
  async getComprehensiveReports(params = {}) {
    return this.apiCall('/tpo/ai/comprehensive-reports', {
      method: 'POST',
      body: JSON.stringify({
        type: params.type || 'overview',
        date_range: params.dateRange || 'last_6_months',
        department: params.department,
        company: params.company,
        include_predictions: params.includePredictions || true
      })
    });
  }

  // System Administration
  async getSystemOptimization() {
    return this.apiCall('/tpo/ai/system-optimization', {
      method: 'POST',
      body: JSON.stringify({})
    });
  }

  // Live Statistics
  async getLiveStats() {
    return this.apiCall('/tpo/live-stats');
  }

  // Real-time data updates
  async subscribeToLiveUpdates(callback) {
    // This would typically use WebSocket or Server-Sent Events
    // For now, we'll use periodic polling
    const pollInterval = setInterval(async () => {
      try {
        const stats = await this.getLiveStats();
        callback(stats);
      } catch (error) {
        console.error('Failed to get live updates:', error);
      }
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(pollInterval);
  }
}

export const tpoService = new TPOService();