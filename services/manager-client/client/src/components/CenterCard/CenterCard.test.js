import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent, waitForDomChange } from '@testing-library/react';

// Component Requirements
import CenterCard from './CenterCard';

describe('Test', () => {
  it('Renders Component Children', () => {
    const { getByText } = render(
      <CenterCard>
        <h1>Hello World</h1>
      </CenterCard>
    );
    expect(getByText('Hello World')).toBeInTheDocument();
  });
});
