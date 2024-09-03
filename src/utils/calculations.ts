import Decimal from 'decimal.js-light';

/**
 * Type representing the available algorithms for calculating Take Profit (TP) prices.
 */
export type TpAlgorithm = 'linear' | 'exponential' | 'fibonacci' | 'logarithmic';

/**
 * Calculates the Dollar-Cost Averaging (DCA) price.
 * 
 * @param {Decimal[]} entryPrices - Array of entry prices.
 * @returns {Decimal} - The calculated DCA price.
 */
export const calculateDcaPrice = (entryPrices: Decimal[]): Decimal => {
    const total = entryPrices.reduce((a, b) => a.plus(b), new Decimal(0));
    return total.div(entryPrices.length);
};

/**
 * Calculates the Stop Loss (SL) price.
 * 
 * @param {Decimal} dcaPrice - The DCA price.
 * @param {Decimal} slPercentage - The stop loss percentage.
 * @param {boolean} isBuy - Indicates if the order is a buy order.
 * @returns {Decimal} - The calculated SL price.
 */
export const calculateSlPrice = (dcaPrice: Decimal, slPercentage: Decimal, isBuy: boolean): Decimal => {
    const slFactor = slPercentage.div(100);
    return isBuy ? dcaPrice.times(new Decimal(1).minus(slFactor)) : dcaPrice.times(new Decimal(1).plus(slFactor));
};

/**
 * Calculates the Take Profit (TP) prices based on the selected algorithm.
 * 
 * @param {Decimal} dcaPrice - The DCA price.
 * @param {number} numOrders - The number of orders.
 * @param {Decimal} minTpPercentage - The minimum TP percentage.
 * @param {Decimal} maxTpPercentage - The maximum TP percentage.
 * @param {boolean} isBuy - Indicates if the order is a buy order.
 * @param {TpAlgorithm} algorithm - The algorithm to use for calculating TP prices.
 * @returns {Decimal[]} - An array of calculated TP prices.
 */
export const calculateTpPrices = (
    dcaPrice: Decimal, 
    numOrders: number, 
    minTpPercentage: Decimal, 
    maxTpPercentage: Decimal, 
    isBuy: boolean, 
    algorithm: TpAlgorithm
): Decimal[] => {
    const tpPrices = [];

    if (numOrders === 1) {
        const tpPercentage = minTpPercentage.plus(maxTpPercentage).div(2);
        tpPrices.push(isBuy ? dcaPrice.times(new Decimal(1).plus(tpPercentage.div(100))) : dcaPrice.times(new Decimal(1).minus(tpPercentage.div(100))));
        return tpPrices;
    }

    const step = maxTpPercentage.minus(minTpPercentage).div(numOrders - 1);

    for (let i = 0; i < numOrders; i++) {
        let tpPercentage;
        switch (algorithm) {
            case 'exponential':
                const exp = (maxTpPercentage.div(minTpPercentage)).pow(i / (numOrders - 1));
                tpPercentage = minTpPercentage.times(exp);
                break;
            case 'fibonacci':
                const fib = [new Decimal(0), new Decimal(1)];
                for (let j = 2; j <= numOrders; j++) fib[j] = fib[j - 1].plus(fib[j - 2]);
                tpPercentage = minTpPercentage.plus(maxTpPercentage.minus(minTpPercentage).times(fib[i].div(fib[numOrders - 1])));
                break;
            case 'logarithmic':
                tpPercentage = minTpPercentage.plus(new Decimal(Math.log(i + 1)).div(Math.log(numOrders)).times(maxTpPercentage.minus(minTpPercentage)));
                break;
            case 'linear':
            default:
                tpPercentage = minTpPercentage.plus(step.times(i));
                break;
        }
        tpPrices.push(isBuy ? dcaPrice.times(new Decimal(1).plus(tpPercentage.div(100))) : dcaPrice.times(new Decimal(1).minus(tpPercentage.div(100))));
    }
    return tpPrices;
};

/**
 * Calculates the percentage differences from the DCA price.
 * 
 * @param {Decimal[]} entryPrices - Array of entry prices.
 * @param {Decimal} dcaPrice - The DCA price.
 * @returns {Decimal[]} - An array of percentage differences.
 */
export const calculatePercentageDiffs = (entryPrices: Decimal[], dcaPrice: Decimal): Decimal[] => {
    return entryPrices.map(price => price.minus(dcaPrice).div(dcaPrice).times(100));
};

/**
 * Calculates the average Take Profit (TP) price.
 * 
 * @param {Decimal[]} tpPrices - Array of TP prices.
 * @returns {Decimal} - The calculated average TP price.
 */
export const calculateAverageTp = (tpPrices: Decimal[]): Decimal => {
    const total = tpPrices.reduce((a, b) => a.plus(b), new Decimal(0));
    return total.div(tpPrices.length);
};

/**
 * Generates entry prices between the upper and lower price levels.
 * 
 * @param {Decimal} upperPrice - The upper price level.
 * @param {Decimal} lowerPrice - The lower price level.
 * @param {number} numOrders - The number of orders.
 * @returns {Decimal[]} - An array of generated entry prices.
 */
export const generateEntryPrices = (upperPrice: Decimal, lowerPrice: Decimal, numOrders: number): Decimal[] => {
    if (numOrders === 1) {
        return [upperPrice.plus(lowerPrice).div(2)];
    }

    const step = upperPrice.minus(lowerPrice).div(numOrders - 1);
    return Array.from({ length: numOrders }, (_, i) => upperPrice.minus(step.times(i)));
};