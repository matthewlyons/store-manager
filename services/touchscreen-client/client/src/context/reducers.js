const initialState = {
  products: [],
  storeProducts: {}
};

const types = {
  SET_PRODUCT: 'SET_PRODUCT:',
  SET_QUERY: 'SET_QUERY'
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_PRODUCT:
      return {
        ...state,
        product: action.payload
      };
    case types.SET_QUERY:
      return {
        ...state,
        query: action.payload
      };
    default:
      throw new Error('Unexpected action');
  }
};

export { initialState, types, reducer };
