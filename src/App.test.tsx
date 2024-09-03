import { render, screen } from '@testing-library/react';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';

// Mock matchMedia
beforeAll(() => {
    window.matchMedia = window.matchMedia || function() {
        return {
            matches: false,
            addListener: function() {},
            removeListener: function() {}
        };
    };
});

test('renders calculator', async () => {
    render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
    const linkElement = screen.getByTestId('trading-calc');
    expect(linkElement).toBeInTheDocument();
});
