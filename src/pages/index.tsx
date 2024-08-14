import { useState, useEffect } from 'react';
import { Box, FormControl, FormLabel, NumberInput, NumberInputField, VStack, Text, HStack, Divider } from '@chakra-ui/react';

// Function to calculate the DCA (Dollar-Cost Averaging) price
const calculateDcaPrice = (entryPrices: number[]) => {
    return entryPrices.reduce((a, b) => a + b, 0) / entryPrices.length;
};

// Function to calculate the Stop Loss (SL) price
const calculateSlPrice = (dcaPrice: number, slPercentage: number) => {
    return dcaPrice * (1 - slPercentage / 100);
};

// Function to calculate the Take Profit (TP) prices
const calculateTpPrices = (dcaPrice: number, numOrders: number, tpPercentage: number, tpFearFactor: number, tpGreedFactor: number) => {
    const tpPrices = [];
    const averageFactor = (tpFearFactor + tpGreedFactor) / 2;
    const adjustmentFactor = tpPercentage / (averageFactor * 100);
    for (let i = 0; i < numOrders; i++) {
        const factor = tpFearFactor + (tpGreedFactor - tpFearFactor) * (i / (numOrders - 1));
        const tpAdjustedPercentage = adjustmentFactor * factor;
        tpPrices.push(dcaPrice * (1 + tpAdjustedPercentage));
    }
    return tpPrices;
};

// Function to calculate the percentage differences from the DCA price
const calculatePercentageDiffs = (entryPrices: number[], dcaPrice: number) => {
    return entryPrices.map(price => (price - dcaPrice) / dcaPrice * 100);
};

// Function to calculate the average Take Profit (TP) price
const calculateAverageTp = (tpPrices: number[]) => {
    return tpPrices.reduce((a, b) => a + b, 0) / tpPrices.length;
};

// Function to generate entry prices between the upper and lower price levels
const generateEntryPrices = (upperPrice: number, lowerPrice: number, numOrders: number) => {
    const step = (upperPrice - lowerPrice) / (numOrders - 1);
    return Array.from({ length: numOrders }, (_, i) => upperPrice - i * step);
};

const TradingCalc = () => {
    const [upperPrice, setUpperPrice] = useState<number>(0);
    const [lowerPrice, setLowerPrice] = useState<number>(0);
    const [numOrders, setNumOrders] = useState<number>(5);
    const [slPercentage, setSlPercentage] = useState<number>(5);
    const [tpPercentage, setTpPercentage] = useState<number>(5);
    const [tpFearFactor, setTpFearFactor] = useState<number>(0.4);
    const [tpGreedFactor, setTpGreedFactor] = useState<number>(1.8);

    const [entryPrices, setEntryPrices] = useState<number[]>([]);
    const [dcaPrice, setDcaPrice] = useState<number>(0);
    const [slPrice, setSlPrice] = useState<number>(0);
    const [tpPrices, setTpPrices] = useState<number[]>([]);
    const [percentageDiffs, setPercentageDiffs] = useState<number[]>([]);
    const [averageTp, setAverageTp] = useState<number>(0);

    useEffect(() => {
        if (lowerPrice > upperPrice) {
            setLowerPrice(upperPrice);
        }
        const prices = generateEntryPrices(upperPrice, lowerPrice, numOrders);
        setEntryPrices(prices);
        const dca = calculateDcaPrice(prices);
        setDcaPrice(dca);
        setSlPrice(calculateSlPrice(dca, slPercentage));
        const tp = calculateTpPrices(dca, numOrders, tpPercentage, tpFearFactor, tpGreedFactor);
        setTpPrices(tp);
        setPercentageDiffs(calculatePercentageDiffs(prices, dca));
        setAverageTp(calculateAverageTp(tp));
    }, [upperPrice, lowerPrice, numOrders, slPercentage, tpPercentage, tpFearFactor, tpGreedFactor]);

    return (
        <Box p={5}>
            <HStack spacing={10} align="start">
                <VStack spacing={4} width="40%">
                    <FormControl>
                        <FormLabel>Upper Price Level</FormLabel>
                        <NumberInput value={upperPrice} onChange={(valueString) => setUpperPrice(parseFloat(valueString))} step={0.01} precision={2}>
                            <NumberInputField />
                        </NumberInput>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Lower Price Level</FormLabel>
                        <NumberInput value={lowerPrice} onChange={(valueString) => setLowerPrice(parseFloat(valueString))} step={0.01} precision={2}>
                            <NumberInputField />
                        </NumberInput>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Number of Orders</FormLabel>
                        <NumberInput value={numOrders} onChange={(valueString) => setNumOrders(parseInt(valueString))} step={1}>
                            <NumberInputField />
                        </NumberInput>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Stop Loss Percentage from DCA</FormLabel>
                        <NumberInput value={slPercentage} onChange={(valueString) => setSlPercentage(parseFloat(valueString))} step={0.01} precision={2}>
                            <NumberInputField />
                        </NumberInput>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Take Profit Percentage from DCA</FormLabel>
                        <NumberInput value={tpPercentage} onChange={(valueString) => setTpPercentage(parseFloat(valueString))} step={0.01} precision={2}>
                            <NumberInputField />
                        </NumberInput>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Fear Factor for TP</FormLabel>
                        <NumberInput value={tpFearFactor} onChange={(valueString) => setTpFearFactor(parseFloat(valueString))} step={0.01} precision={2}>
                            <NumberInputField />
                        </NumberInput>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Greed Factor for TP</FormLabel>
                        <NumberInput value={tpGreedFactor} onChange={(valueString) => setTpGreedFactor(parseFloat(valueString))} step={0.01} precision={2}>
                            <NumberInputField />
                        </NumberInput>
                    </FormControl>
                </VStack>
                <Divider orientation="vertical" />
                <VStack spacing={4} width="60%" align="start">
                    <Text>Average DCA Price: {dcaPrice}</Text>
                    <Text>Stop Loss (SL) Level: {slPrice}</Text>
                    <Text>Average TP Value: {averageTp}</Text>
                    {entryPrices.map((price, index) => (
                        <Box key={index} p={2} borderWidth="1px" borderRadius="lg" width="100%">
                            <Text>Order {index + 1}:</Text>
                            <Text>Entry Price: {price}</Text>
                            <Text>Deviation from DCA: {percentageDiffs[index].toFixed(2)}%</Text>
                            <Text>TP Level: {tpPrices[index]}</Text>
                        </Box>
                    ))}
                </VStack>
            </HStack>
        </Box>
    );
};

export default TradingCalc;