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

    test('calculateTpPrices should return correct TP prices for exponential algorithm', () => {
        const dcaPrice = new Decimal(200);
        const numOrders = 3;
        const minTpPercentage = new Decimal(10);
        const maxTpPercentage = new Decimal(30);
        const isBuy = true;
        const algorithm: TpAlgorithm = 'exponential';
        const result = calculateTpPrices(dcaPrice, numOrders, minTpPercentage, maxTpPercentage, isBuy, algorithm);
        expect(result.map(price => price.toNumber())).toEqual([220, 234.64101615137756, 260]);
    });

    test('calculateTpPrices should return correct TP prices for logarithmic algorithm', () => {
        const dcaPrice = new Decimal(200);
        const numOrders = 3;
        const minTpPercentage = new Decimal(10);
        const maxTpPercentage = new Decimal(30);
        const isBuy = true;
        const algorithm: TpAlgorithm = 'logarithmic';
        const result = calculateTpPrices(dcaPrice, numOrders, minTpPercentage, maxTpPercentage, isBuy, algorithm);
        expect(result.map(price => price.toNumber())).toEqual([220, 245.2371901428583, 260]);
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

    // Boundary tests
    test('calculateDcaPrice should handle empty array', () => {
        const entryPrices: Decimal[] = [];
        expect(() => calculateDcaPrice(entryPrices)).toThrow();
    });

    test('calculateDcaPrice should handle single entry price', () => {
        const entryPrices = [new Decimal(100)];
        const result = calculateDcaPrice(entryPrices);
        expect(result.toNumber()).toBe(100);
    });

    test('calculateSlPrice should handle zero SL percentage', () => {
        const dcaPrice = new Decimal(200);
        const slPercentage = new Decimal(0);
        const isBuy = true;
        const result = calculateSlPrice(dcaPrice, slPercentage, isBuy);
        expect(result.toNumber()).toBe(200);
    });

    test('calculateSlPrice should handle 100% SL percentage for buy order', () => {
        const dcaPrice = new Decimal(200);
        const slPercentage = new Decimal(100);
        const isBuy = true;
        const result = calculateSlPrice(dcaPrice, slPercentage, isBuy);
        expect(result.toNumber()).toBe(0);
    });

    test('calculateSlPrice should handle 100% SL percentage for sell order', () => {
        const dcaPrice = new Decimal(200);
        const slPercentage = new Decimal(100);
        const isBuy = false;
        const result = calculateSlPrice(dcaPrice, slPercentage, isBuy);
        expect(result.toNumber()).toBe(400);
    });

    test('calculateTpPrices should handle single order', () => {
        const dcaPrice = new Decimal(200);
        const numOrders = 1;
        const minTpPercentage = new Decimal(10);
        const maxTpPercentage = new Decimal(30);
        const isBuy = true;
        const algorithm: TpAlgorithm = 'linear';
        const result = calculateTpPrices(dcaPrice, numOrders, minTpPercentage, maxTpPercentage, isBuy, algorithm);
        expect(result.map(price => price.toNumber())).toEqual([240]);
    });

    test('calculateTpPrices should handle zero TP percentage', () => {
        const dcaPrice = new Decimal(200);
        const numOrders = 3;
        const minTpPercentage = new Decimal(0);
        const maxTpPercentage = new Decimal(0);
        const isBuy = true;
        const algorithm: TpAlgorithm = 'linear';
        const result = calculateTpPrices(dcaPrice, numOrders, minTpPercentage, maxTpPercentage, isBuy, algorithm);
        expect(result.map(price => price.toNumber())).toEqual([200, 200, 200]);
    });

    test('calculatePercentageDiffs should handle empty array', () => {
        const entryPrices: Decimal[] = [];
        const dcaPrice = new Decimal(200);
        const result = calculatePercentageDiffs(entryPrices, dcaPrice);
        expect(result).toEqual([]);
    });

    test('calculatePercentageDiffs should handle single entry price', () => {
        const entryPrices = [new Decimal(200)];
        const dcaPrice = new Decimal(200);
        const result = calculatePercentageDiffs(entryPrices, dcaPrice);
        expect(result.map(diff => diff.toNumber())).toEqual([0]);
    });

    test('calculateAverageTp should handle empty array', () => {
        const tpPrices: Decimal[] = [];
        expect(() => calculateAverageTp(tpPrices)).toThrow();
    });

    test('calculateAverageTp should handle single TP price', () => {
        const tpPrices = [new Decimal(220)];
        const result = calculateAverageTp(tpPrices);
        expect(result.toNumber()).toBe(220);
    });

    test('generateEntryPrices should handle single order', () => {
        const upperPrice = new Decimal(300);
        const lowerPrice = new Decimal(100);
        const numOrders = 1;
        const result = generateEntryPrices(upperPrice, lowerPrice, numOrders);
        expect(result.map(price => price.toNumber())).toEqual([200]);
    });

    test('generateEntryPrices should handle equal upper and lower prices', () => {
        const upperPrice = new Decimal(200);
        const lowerPrice = new Decimal(200);
        const numOrders = 3;
        const result = generateEntryPrices(upperPrice, lowerPrice, numOrders);
        expect(result.map(price => price.toNumber())).toEqual([200, 200, 200]);
    });

});