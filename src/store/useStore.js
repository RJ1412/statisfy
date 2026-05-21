import { create } from 'zustand';

export const useStore = create((set, get) => ({
  // Auth
  auth: null,
  user: null,
  
  setAuth: async ({ accessToken, refreshToken, expiresAt }) => {
    set({ auth: { accessToken, refreshToken, expiresAt } });
  },
  
  setUser: (user) => set({ user }),
  
  logout: () => {
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    localStorage.removeItem('spotify_expires_at');
    set({ 
      auth: null, user: null, data: {},
      topTracks: [], topArtists: [], audioFeatures: [], genres: [], mood: null, 
      diversityIndex: null, heatmapData: [], personality: null
    });
  },

  // Data — keyed by timeRange
  data: {},
  
  // Backward compatibility root state
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  topTracks: [],
  topArtists: [],
  audioFeatures: [],
  genres: [],
  mood: null,
  diversityIndex: null,
  heatmapData: [],
  personality: null,
  
  setData: (timeRange, payload) =>
    set((state) => {
      const nextData = { ...state.data, [timeRange]: payload };
      const updates = { data: nextData };
      if (state.timeRange === timeRange) {
        Object.assign(updates, payload);
      }
      return updates;
    }),

  timeRange: 'medium_term',
  setTimeRange: (timeRange) => set((state) => {
    const payload = state.data[timeRange] || {};
    return { timeRange, ...payload };
  }),
  
  activeRoute: 'dashboard',
  setActiveRoute: (route) => set({ activeRoute: route }),
}));

export default useStore;
