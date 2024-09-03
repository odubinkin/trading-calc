import { ChakraProvider } from '@chakra-ui/react';
import TradingCalc from './components/TradingCalc';

const App: React.FC = () => {
    return (
        <ChakraProvider>
            <TradingCalc />
        </ChakraProvider>
    );
};

export default App;
