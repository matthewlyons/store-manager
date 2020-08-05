import React from 'react';
import ListLink from './ListLink';

import { render } from '@testing-library/react';

test('renders without crashing ', () => {
  const { getByText } = render(<ListLink children={['Hello']} />);
  getByText('Hello');
});
