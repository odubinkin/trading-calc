import Decimal from 'decimal.js-light';
import { 
    calculateDcaPrice, 
    calculateSlPrice, 
    calculateTpPrices, 
    calculatePercentageDiffs, 
    calculateAverageTp, 
    generateEntryPrices, 
    TpAlgorithm 
} from './calculations';

describe('Calculations Utils', () => {
    test('calculateDcaPrice should return correct DCA price', () => {
        const entryPrices = [new Decimal(100), new Decimal(200), new Decimal(300)];
        const result = calculateDcaPrice(entryPrices);
        expect(result.toNumber()).toBe(200);
    });

    test('calculateSlPrice should return correct SL price for buy order', () => {
        const dcaPrice = new Decimal(200);
        const slPercentage = new Decimal(10);
        const isBuy = true;
        const result = calculateSlPrice(dcaPrice, slPercentage, isBuy);
        expect(result.toNumber()).toBe(180);
    });

    test('calculateSlPrice should return correct SL price for sell order', () => {
        const dcaPrice = new Decimal(200);
        const slPercentage = new Decimal(10);
        const isBuy = false;
        const result = calculateSlPrice(dcaPrice, slPercentage, isBuy);
        expect(result.toNumber()).toBe(220);
    });

    test('calculateTpPrices should return correct TP prices for linear algorithm', () => {
        const dcaPrice = new Decimal(200);
        const numOrders = 3;
        const minTpPercentage = new Decimal(10);
        const maxTpPercentage = new Decimal(30);
        const isBuy = true;
        const algorithm: TpAlgorithm = 'linear';
        const result = calculateTpPrices(dcaPrice, numOrders, minTpPercentage, maxTpPercentage, isBuy, algorithm);
        expect(result.map(price => price.toNumber())).toEqual([220, 240, 260]);
    });

    test('calculatePercentageDiffs should return correct percentage differences', () => {
        const entryPrices = [new Decimal(100), new Decimal(200), new Decimal(300)];
        const dcaPrice = new Decimal(200);
        const result = calculatePercentageDiffs(entryPrices, dcaPrice);
        expect(result.map(diff => diff.toNumber())).toEqual([-50, 0, 50]);
    });

    test('calculateAverageTp should return correct average TP price', () => {
        const tpPrices = [new Decimal(220), new Decimal(240), new Decimal(260)];
        const result = calculateAverageTp(tpPrices);
        expect(result.toNumber()).toBe(240);
    });

    test('generateEntryPrices should return correct entry prices', () => {
        const upperPrice = new Decimal(300);
        const lowerPrice = new Decimal(100);
        const numOrders = 3;
        const result = generateEntryPrices(upperPrice, lowerPrice, numOrders);
        expect(result.map(price => price.toNumber())).toEqual([300, 200, 100]);
    });
});