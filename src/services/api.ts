import { apiClient } from '../lib/api-client';

// Types
export interface Asset {
  id: string;
  title: {
    zh: string;
    en: string;
  };
  description: {
    zh: string;
    en: string;
  };
  cover: string;
  apr: number;
  targetAmount: number;
  raisedAmount: number;
  durationDays: number;
  currentPrice: number;
}

export interface Drama {
  id: string;
  title: {
    zh: string;
    en: string;
  };
  cover: string;
  episodes: number;
  heat: number;
  vipLevel: number;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
  };
}

// API methods
export const api = {
  // Assets
  getAssets: async (): Promise<Asset[]> => {
    const response = await apiClient.get('/assets');
    return response.data;
  },

  getAsset: async (id: string): Promise<Asset> => {
    const response = await apiClient.get(`/assets/${id}`);
    return response.data;
  },

  investAsset: async (id: string, amount: number): Promise<any> => {
    const response = await apiClient.post(`/assets/${id}/invest`, { amount });
    return response.data;
  },

  getMyHoldings: async (): Promise<any> => {
    const response = await apiClient.get('/assets/my/holdings');
    return response.data;
  },

  // Dramas
  getDramas: async (): Promise<Drama[]> => {
    const response = await apiClient.get('/dramas');
    return response.data;
  },

  getDrama: async (id: string): Promise<Drama> => {
    const response = await apiClient.get(`/dramas/${id}`);
    return response.data;
  },

  // Auth
  login: async (credentials: {
    email?: string;
    phone?: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  register: async (data: {
    email?: string;
    phone?: string;
    password: string;
    code: string;
  }): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  // Stake
  getStakePools: async () => {
    const response = await apiClient.get('/stake/pools');
    return response.data;
  },

  getMyStake: async () => {
    const response = await apiClient.get('/stake/my');
    return response.data;
  },

  depositStake: async (poolId: string, amount: number) => {
    const response = await apiClient.post('/stake/deposit', { poolId, amount });
    return response.data;
  },

  withdrawStake: async (poolId: string, amount: number) => {
    const response = await apiClient.post('/stake/withdraw', { poolId, amount });
    return response.data;
  },

  claimStake: async (poolId: string) => {
    const response = await apiClient.post('/stake/claim', { poolId });
    return response.data;
  },

  // Trade
  getOrderBook: async (assetId: string) => {
    const response = await apiClient.get(`/trade/orderbook/${assetId}`);
    return response.data;
  },

  getMyOrders: async () => {
    const response = await apiClient.get('/trade/my-orders');
    return response.data;
  },

  placeOrder: async (data: {
    assetId: string;
    type: 'buy' | 'sell';
    price: number;
    amount: number;
  }) => {
    const response = await apiClient.post('/trade/place', data);
    return response.data;
  },

  cancelOrder: async (orderId: string) => {
    const response = await apiClient.delete(`/trade/${orderId}`);
    return response.data;
  },

  // Profile
  getProfile: async () => {
    const response = await apiClient.get('/user/profile');
    return response.data;
  },

  // Shop
  getProducts: async () => {
    const response = await apiClient.get('/shop/products');
    return response.data;
  },

  getMyOrdersShop: async () => {
    const response = await apiClient.get('/shop/my-orders');
    return response.data;
  },

  exchangeProduct: async (productId: string) => {
    const response = await apiClient.post('/shop/exchange', { productId });
    return response.data;
  },

  // Tasks
  getTasks: async () => {
    const response = await apiClient.get('/tasks/list');
    return response.data;
  },

  claimTask: async (taskId: string) => {
    const response = await apiClient.post('/tasks/claim', { taskId });
    return response.data;
  },

  // Ad
  getAdConfig: async () => {
    const response = await apiClient.get('/ad/config');
    return response.data;
  },

  recordImpression: async (adId: string) => {
    const response = await apiClient.post('/ad/impression', { adId });
    return response.data;
  },

  recordClick: async (adId: string) => {
    const response = await apiClient.post('/ad/click', { adId });
    return response.data;
  },

  // Invite
  getInviteStats: async () => {
    const response = await apiClient.get('/invite/stats');
    return response.data;
  },

  getInviteRecords: async () => {
    const response = await apiClient.get('/invite/records');
    return response.data;
  },
};

export default api;
