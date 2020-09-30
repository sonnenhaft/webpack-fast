export const MOCK_SEASON_NUM = 3;
export const MOCK_EPISODE_NUM = 2;
export const MOCK_TOTAL_EPISODES = 5;
export const MOCK_PRICE = '$9.90';
export const mockEpisodeList = () =>
  Array(MOCK_TOTAL_EPISODES)
    .fill()
    .map((_, episodeIndex) => `Episode ${episodeIndex + 1}`);

export const MOCK_RENT_ASSET = 'GLOBAL_CT0000005249';
export const MOCK_WATCHING_ASSET = 'GLOBAL_CT0000009565';
