import { useState, useEffect } from 'react';
import { Box, FormControl, FormLabel, NumberInput, NumberInputField, VStack, Text, Divider, Switch, Wrap, WrapItem, Select, Stack, useBreakpointValue } from '@chakra-ui/react';
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
    const [upperPrice, setUpperPrice] = useState<number>(0);
    const [lowerPrice, setLowerPrice] = useState<number>(0);
    const [numOrders, setNumOrders] = useState<number>(5);
    const [slPercentage, setSlPercentage] = useState<number>(5);
    const [minTpPercentage, setMinTpPercentage] = useState<number>(1.5);
    const [maxTpPercentage, setMaxTpPercentage] = useState<number>(8.5);
    const [isBuy, setIsBuy] = useState<boolean>(true);
    const [tpAlgorithm, setTpAlgorithm] = useState<TpAlgorithm>('exponential');

    const [entryPrices, setEntryPrices] = useState<number[]>([]);
    const [dcaPrice, setDcaPrice] = useState<number>(0);
    const [slPrice, setSlPrice] = useState<number>(0);
    const [tpPrices, setTpPrices] = useState<number[]>([]);
    const [percentageDiffs, setPercentageDiffs] = useState<number[]>([]);
    const [tpPercentageDiffs, setTpPercentageDiffs] = useState<number[]>([]);
    const [averageTp, setAverageTp] = useState<number>(0);
    const [averageTpDiff, setAverageTpDiff] = useState<number>(0);

    useEffect(() => {
        if (lowerPrice > upperPrice) {
            setLowerPrice(upperPrice);
        }
        if (minTpPercentage > maxTpPercentage) {
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
        setAverageTpDiff((avTp-dca)*100/dca);
        setPercentageDiffs(calculatePercentageDiffs(prices, dca));
        setTpPercentageDiffs(calculatePercentageDiffs(tp, dca));
    }, [upperPrice, lowerPrice, numOrders, slPercentage, minTpPercentage, maxTpPercentage, isBuy, tpAlgorithm]);

    const isMobile = useBreakpointValue({ base: true, md: false });

    return (
        <Box p={5}>
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
                        <NumberInput value={upperPrice} onChange={(valueString) => setUpperPrice(parseFloat(valueString))} min={0} step={0.01} precision={2}>
                            <NumberInputField />
                        </NumberInput>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Lower Price Level</FormLabel>
                        <NumberInput value={lowerPrice} onChange={(valueString) => setLowerPrice(parseFloat(valueString))} min={0} step={0.01} precision={2}>
                            <NumberInputField />
                        </NumberInput>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Number of Orders</FormLabel>
                        <NumberInput value={numOrders} onChange={(valueString) => setNumOrders(parseInt(valueString))} min={1} step={1}>
                            <NumberInputField />
                        </NumberInput>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Stop Loss Percentage from DCA</FormLabel>
                        <NumberInput value={slPercentage} onChange={(valueString) => setSlPercentage(parseFloat(valueString))} min={0} step={0.01} precision={2}>
                            <NumberInputField />
                        </NumberInput>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Maximum Take Profit Percentage from DCA</FormLabel>
                        <NumberInput value={maxTpPercentage} onChange={(valueString) => setMaxTpPercentage(parseFloat(valueString))} min={0} step={0.01} precision={2}>
                            <NumberInputField />
                        </NumberInput>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Minimum Take Profit Percentage from DCA</FormLabel>
                        <NumberInput value={minTpPercentage} onChange={(valueString) => setMinTpPercentage(parseFloat(valueString))} min={0} step={0.01} precision={2}>
                            <NumberInputField />
                        </NumberInput>
                    </FormControl>
                    <FormControl>
                        <FormLabel>TP Calculation Algorithm</FormLabel>
                        <Select value={tpAlgorithm} onChange={(e) => setTpAlgorithm(e.target.value as TpAlgorithm)}>
                            <option value="linear">Linear</option>
                            <option value="exponential">Exponential</option>
                            <option value="fibonacci">Fibonacci</option>
                            <option value="logarithmic">Logarithmic</option>
                        </Select>
                    </FormControl>
                </VStack>
                <Divider orientation={ isMobile ? 'horizontal' : 'vertical' } />
                <VStack spacing={4} width={{ base: '100%', md: '60%' }} align="start">
                    <Text>Average DCA Price: {dcaPrice.toFixed(DECIMALS)}</Text>
                    <Text>Average TP Value: {averageTp.toFixed(DECIMALS)} (DCA {averageTpDiff >= 0 ? '+' : ''}{averageTpDiff.toFixed(DECIMALS_PERCENTS)}%)</Text>
                    <Text>Stop Loss (SL) Level: {slPrice.toFixed(DECIMALS)}</Text>
                    <Wrap spacing={4}>
                        {entryPrices.map((price, index) => (
                            <WrapItem key={index}>
                                <Box p={2} borderWidth="1px" borderRadius="lg" width="100%">
                                    <Text>Order {index + 1}:</Text>
                                    <Text>Entry Price: {price.toFixed(DECIMALS)} (DCA {percentageDiffs[index] >= 0 ? '+' : ''}{percentageDiffs[index].toFixed(DECIMALS_PERCENTS)}%)</Text>
                                    <Text>TP Level: {tpPrices[index].toFixed(DECIMALS)} (DCA {tpPercentageDiffs[index] >= 0 ? '+' : ''}{tpPercentageDiffs[index].toFixed(DECIMALS_PERCENTS)}%)</Text>
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