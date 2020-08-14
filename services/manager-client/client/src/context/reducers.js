const initialState = {
  alert: { message: '', success: false, active: false },
  redirect: { to: '', active: false },
  loading: false,
  apiAuth: {
    user: {
      name: '',
      access: 3
    },
    token: '',
    exp: 0
  },
  custAuth: {
    token: '',
    exp: 0
  },
  order_values: {},
  order_customer: {},
  order_products: [],
  order_totals: {}
};

// Set State as Local Storage Item for Persistant State
let localState;
if (localStorage.getItem('state')) {
  localState = localStorage.getItem('state');
} else {
  localStorage.setItem('state', JSON.stringify(initialState));
  localState = JSON.stringify(initialState);
}

const types = {
  SET_ALERT: 'SET_ALERT',
  SET_LOADING: 'SET_LOADING',
  SET_API: 'SET_API',
  SET_CUST: 'SET_CUST'
};

const reducer = (state = localState, action) => {
  let updatedState;
  switch (action.type) {
    case types.SET_ALERT:
      updatedState = { ...state, alert: action.payload };
      localStorage.setItem('state', JSON.stringify(updatedState));
      return updatedState;
    case types.SET_API:
      updatedState = { ...state, apiAuth: action.payload };
      localStorage.setItem('state', JSON.stringify(updatedState));
      return updatedState;
    case types.SET_CUST:
      updatedState = { ...state, custAuth: action.payload };
      localStorage.setItem('state', JSON.stringify(updatedState));
      return updatedState;
    case types.SET_LOADING:
      updatedState = { ...state, loading: action.payload };
      localStorage.setItem('state', JSON.stringify(updatedState));
      return updatedState;
    default:
      throw new Error('Unexpected action');
  }
};
let globalState = JSON.parse(localState);
export { globalState, types, reducer };
