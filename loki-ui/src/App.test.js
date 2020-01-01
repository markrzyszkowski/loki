import React from 'react';
import {render} from '@testing-library/react';
import App from './App';

test('renders page with logo', () => {
    const {getByTestId} = render(<App/>);

    expect(getByTestId('logo')).toBeInTheDocument();
});
