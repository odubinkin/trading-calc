import { useState, useEffect } from 'react';
import { Box, FormControl, FormLabel, NumberInput, NumberInputField, VStack, Text, HStack, Divider, Switch, Wrap, WrapItem } from '@chakra-ui/react';

const DECIMALS = 3;
const DECIMALS_PERCENTS = 2;

// Function to calculate the DCA (Dollar-Cost Averaging) price
const calculateDcaPrice = (entryPrices: number[]) => {
    return entryPrices.reduce((a, b) => a + b, 0) / entryPrices.length;
};

// Function to calculate the Stop Loss (SL) price
const calculateSlPrice = (dcaPrice: number, slPercentage: number, isBuy: boolean) => {
    return isBuy ? dcaPrice * (1 - slPercentage / 100) : dcaPrice * (1 + slPercentage / 100);
};

// Function to calculate the Take Profit (TP) prices
const calculateTpPrices = (dcaPrice: number, numOrders: number, minTpPercentage: number, maxTpPercentage: number, isBuy: boolean) => {
    const tpPrices = [];
    const step = (maxTpPercentage - minTpPercentage) / (numOrders - 1);
    for (let i = 0; i < numOrders; i++) {
        const tpPercentage = minTpPercentage + i * step;
        tpPrices.push(isBuy ? dcaPrice * (1 + tpPercentage / 100) : dcaPrice * (1 - tpPercentage / 100));
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
    const [minTpPercentage, setMinTpPercentage] = useState<number>(1.5);
    const [maxTpPercentage, setMaxTpPercentage] = useState<number>(8.5);
    const [isBuy, setIsBuy] = useState<boolean>(true);

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
        const tp = calculateTpPrices(dca, numOrders, minTpPercentage, maxTpPercentage, isBuy);
        setTpPrices(tp);
        const avTp = calculateAverageTp(tp);
        setAverageTp(avTp);
        setAverageTpDiff((avTp-dca)*100/dca);
        setPercentageDiffs(calculatePercentageDiffs(prices, dca));
        setTpPercentageDiffs(calculatePercentageDiffs(tp, dca));
    }, [upperPrice, lowerPrice, numOrders, slPercentage, minTpPercentage, maxTpPercentage, isBuy]);

    return (
        <Box p={5}>
            <HStack spacing={10} align="start">
                <VStack spacing={4} width="40%">
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
                        <FormLabel>Minimum Take Profit Percentage from DCA</FormLabel>
                        <NumberInput value={minTpPercentage} onChange={(valueString) => setMinTpPercentage(parseFloat(valueString))} min={0} step={0.01} precision={2}>
                            <NumberInputField />
                        </NumberInput>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Maximum Take Profit Percentage from DCA</FormLabel>
                        <NumberInput value={maxTpPercentage} onChange={(valueString) => setMaxTpPercentage(parseFloat(valueString))} min={0} step={0.01} precision={2}>
                            <NumberInputField />
                        </NumberInput>
                    </FormControl>
                </VStack>
                <Divider orientation="vertical" />
                <VStack spacing={4} width="60%" align="start">
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
            </HStack>
        </Box>
    );
};

export default TradingCalc;