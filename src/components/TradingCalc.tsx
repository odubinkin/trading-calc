import { useState, useEffect } from 'react';
import { Box, FormControl, FormLabel, NumberInput, NumberInputField, VStack, Text, Divider, Switch, Wrap, WrapItem, Select, Stack, useBreakpointValue } from '@chakra-ui/react';
import Decimal from 'decimal.js-light';
import { 
    TpAlgorithm, 
    calculateDcaPrice, 
    calculateSlPrice, 
    calculateTpPrices, 
    calculatePercentageDiffs, 
    calculateAverageTp, 
    generateEntryPrices 
} from '../utils/calculations';

const DECIMALS = 3;
const DECIMALS_PERCENTS = 2;

const TradingCalc = () => {
    const [upperPrice, setUpperPrice] = useState<Decimal>(new Decimal(1));
    const [lowerPrice, setLowerPrice] = useState<Decimal>(new Decimal(1));
    const [numOrders, setNumOrders] = useState<number>(5);
    const [slPercentage, setSlPercentage] = useState<Decimal>(new Decimal(5));
    const [minTpPercentage, setMinTpPercentage] = useState<Decimal>(new Decimal(1.5));
    const [maxTpPercentage, setMaxTpPercentage] = useState<Decimal>(new Decimal(8.5));
    const [isBuy, setIsBuy] = useState<boolean>(true);
    const [tpAlgorithm, setTpAlgorithm] = useState<TpAlgorithm>('exponential');

    const [entryPrices, setEntryPrices] = useState<Decimal[]>([]);
    const [dcaPrice, setDcaPrice] = useState<Decimal>(new Decimal(0));
    const [slPrice, setSlPrice] = useState<Decimal>(new Decimal(0));
    const [tpPrices, setTpPrices] = useState<Decimal[]>([]);
    const [percentageDiffs, setPercentageDiffs] = useState<Decimal[]>([]);
    const [tpPercentageDiffs, setTpPercentageDiffs] = useState<Decimal[]>([]);
    const [averageTp, setAverageTp] = useState<Decimal>(new Decimal(0));
    const [averageTpDiff, setAverageTpDiff] = useState<Decimal>(new Decimal(0));

    useEffect(() => {
        if (lowerPrice.greaterThan(upperPrice)) {
            setLowerPrice(upperPrice);
        }
        if (minTpPercentage.greaterThan(maxTpPercentage)) {
            setMinTpPercentage(maxTpPercentage);
        }
        const prices = generateEntryPrices(upperPrice, lowerPrice, numOrders);
        !isBuy && prices.reverse(); // Change orders order for sell
        setEntryPrices(prices);
        const dca = calculateDcaPrice(prices);
        setDcaPrice(dca);
        setSlPrice(calculateSlPrice(dca, slPercentage, isBuy));
        const tp = calculateTpPrices(dca, numOrders, minTpPercentage, maxTpPercentage, isBuy, tpAlgorithm);
        setTpPrices(tp);
        const avTp = calculateAverageTp(tp);
        setAverageTp(avTp);
        setAverageTpDiff(avTp.minus(dca).times(100).div(dca));
        setPercentageDiffs(calculatePercentageDiffs(prices, dca));
        setTpPercentageDiffs(calculatePercentageDiffs(tp, dca));
    }, [upperPrice, lowerPrice, numOrders, slPercentage, minTpPercentage, maxTpPercentage, isBuy, tpAlgorithm]);

    const isMobile = useBreakpointValue({ base: true, md: false });

    const handleChangeDecimal = (value: string, minValue: number, setter: (value: Decimal) => void) => {
        const decimalMinValue = new Decimal(minValue);
        if (!value || value === '') {
            setter(decimalMinValue);
            return;
        }
        const decimalValue = new Decimal(value);
        if (decimalValue.lessThan(decimalMinValue)) {
            setter(decimalMinValue);
        } else {
            setter(decimalValue);
        }
    };

    const handleChangeNumber = (value: string, minValue: number, setter: (value: number) => void) => {
        if (!value || value === '') {
            setter(minValue);
            return;
        }
        const numberValue = parseInt(value);
        if (numberValue < minValue) {
            setter(minValue);
        } else {
            setter(numberValue);
        }
    };

    return (
        <Box data-testid="trading-calc" p={5}>
            <Stack direction={{ base: 'column', md: 'row' }} spacing={10} align="start">
                <VStack spacing={4} width={{ base: '100%', md: '40%' }}>
                    <FormControl display="flex" alignItems="center">
                        <FormLabel htmlFor="buy-sell-switch" mb="0" color={!isBuy ? 'green' : 'black'}>
                            Sell
                        </FormLabel>
                        <Switch id="buy-sell-switch" isChecked={isBuy} onChange={() => setIsBuy(!isBuy)} />
                        <FormLabel htmlFor="buy-sell-switch" mb="0" ml="2" color={isBuy ? 'green' : 'black'}>
                            Buy
                        </FormLabel>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Upper Price Level</FormLabel>
                        <NumberInput 
                            value={upperPrice.toString()} 
                            onChange={(valueString) => handleChangeDecimal(valueString, 0, setUpperPrice)} 
                            min={0} 
                            step={0.01}
                        >
                            <NumberInputField />
                        </NumberInput>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Lower Price Level</FormLabel>
                        <NumberInput 
                            value={lowerPrice.toString()} 
                            onChange={(valueString) => handleChangeDecimal(valueString, 0, setLowerPrice)} 
                            min={0} 
                            step={0.01}
                        >
                            <NumberInputField />
                        </NumberInput>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Number of Orders</FormLabel>
                        <NumberInput 
                            value={numOrders} 
                            onChange={(valueString) => handleChangeNumber(valueString, 1, setNumOrders)} 
                            min={1} 
                            step={1}
                        >
                            <NumberInputField />
                        </NumberInput>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Stop Loss Percentage from DCA</FormLabel>
                        <NumberInput 
                            value={slPercentage.toString()} 
                            onChange={(valueString) => handleChangeDecimal(valueString, 0, setSlPercentage)} 
                            min={0} 
                            step={0.01}
                        >
                            <NumberInputField />
                        </NumberInput>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Maximum Take Profit Percentage from DCA</FormLabel>
                        <NumberInput 
                            value={maxTpPercentage.toString()} 
                            onChange={(valueString) => handleChangeDecimal(valueString, 0, setMaxTpPercentage)} 
                            min={0} 
                            step={0.01}
                        >
                            <NumberInputField />
                        </NumberInput>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Minimum Take Profit Percentage from DCA</FormLabel>
                        <NumberInput 
                            value={minTpPercentage.toString()} 
                            onChange={(valueString) => handleChangeDecimal(valueString, 0, setMinTpPercentage)} 
                            min={0} 
                            step={0.01}
                        >
                            <NumberInputField />
                        </NumberInput>
                    </FormControl>
                    <FormControl>
                        <FormLabel>TP Calculation Algorithm</FormLabel>
                        <Select value={tpAlgorithm} onChange={(e) => setTpAlgorithm(e.target.value as TpAlgorithm)}>
                            <option value="linear">Linear</option>
                            <option value="exponential">Exponential</option>
                            <option value="logarithmic">Logarithmic</option>
                        </Select>
                    </FormControl>
                </VStack>
                <Divider orientation={ isMobile ? 'horizontal' : 'vertical' } />
                <VStack spacing={4} width={{ base: '100%', md: '60%' }} align="start">
                    <Text>Average DCA Price: {dcaPrice.toFixed(DECIMALS)}</Text>
                    <Text>Average TP Value: {averageTp.toFixed(DECIMALS)} (DCA {averageTpDiff.greaterThanOrEqualTo(0) ? '+' : ''}{averageTpDiff.toFixed(DECIMALS_PERCENTS)}%)</Text>
                    <Text>Stop Loss (SL) Level: {slPrice.toFixed(DECIMALS)}</Text>
                    <Wrap spacing={4}>
                        {entryPrices.map((price, index) => (
                            <WrapItem key={index}>
                                <Box p={2} borderWidth="1px" borderRadius="lg" width="100%">
                                    <Text>Order {index + 1}:</Text>
                                    <Text>Entry Price: {price.toFixed(DECIMALS)} (DCA {percentageDiffs[index].greaterThanOrEqualTo(0) ? '+' : ''}{percentageDiffs[index].toFixed(DECIMALS_PERCENTS)}%)</Text>
                                    <Text>TP Level: {tpPrices[index].toFixed(DECIMALS)} (DCA {tpPercentageDiffs[index].greaterThanOrEqualTo(0) ? '+' : ''}{tpPercentageDiffs[index].toFixed(DECIMALS_PERCENTS)}%)</Text>
                                </Box>
                            </WrapItem>
                        ))}
                    </Wrap>
                </VStack>
            </Stack>
        </Box>
    );
};

export default TradingCalc;