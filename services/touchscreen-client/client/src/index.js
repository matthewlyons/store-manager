import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import './reset.scss';
import './global.scss';
import { StoreProvider } from './context/StoreContext';

ReactDOM.render(
  <StoreProvider>
    <App />
  </StoreProvider>,
  document.getElementById('root')
);
