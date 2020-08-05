import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { SnackbarProvider } from 'notistack';
import './styles.scss';

import { StoreProvider } from './context/StoreContext';

ReactDOM.render(
  <StoreProvider>
    <SnackbarProvider maxSnack={7}>
      <App />
    </SnackbarProvider>
  </StoreProvider>,
  document.getElementById('root')
);
