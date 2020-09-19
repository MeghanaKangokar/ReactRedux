export const getHistory = (data) => ({
  type: 'GET_HISTORY',
  payload: data
});

export const searchTerm = (data) => ({
  type: 'SEARCH',
  payload: data
});

export const getAddress = (data) => ({
  type: 'GET_ADDRESS',
  payload: data
});