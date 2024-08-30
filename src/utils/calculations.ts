/**
 * Type representing the available algorithms for calculating Take Profit (TP) prices.
 */
export type TpAlgorithm = 'linear' | 'exponential' | 'fibonacci' | 'logarithmic';

/**
 * Calculates the Dollar-Cost Averaging (DCA) price.
 * 
 * @param {number[]} entryPrices - Array of entry prices.
 * @returns {number} - The calculated DCA price.
 */
export const calculateDcaPrice = (entryPrices: number[]): number => {
    return entryPrices.reduce((a, b) => a + b, 0) / entryPrices.length;
};

/**
 * Calculates the Stop Loss (SL) price.
 * 
 * @param {number} dcaPrice - The DCA price.
 * @param {number} slPercentage - The stop loss percentage.
 * @param {boolean} isBuy - Indicates if the order is a buy order.
 * @returns {number} - The calculated SL price.
 */
export const calculateSlPrice = (dcaPrice: number, slPercentage: number, isBuy: boolean): number => {
    return isBuy ? dcaPrice * (1 - slPercentage / 100) : dcaPrice * (1 + slPercentage / 100);
};

/**
 * Calculates the Take Profit (TP) prices based on the selected algorithm.
 * 
 * @param {number} dcaPrice - The DCA price.
 * @param {number} numOrders - The number of orders.
 * @param {number} minTpPercentage - The minimum TP percentage.
 * @param {number} maxTpPercentage - The maximum TP percentage.
 * @param {boolean} isBuy - Indicates if the order is a buy order.
 * @param {TpAlgorithm} algorithm - The algorithm to use for calculating TP prices.
 * @returns {number[]} - An array of calculated TP prices.
 */
export const calculateTpPrices = (
    dcaPrice: number, 
    numOrders: number, 
    minTpPercentage: number, 
    maxTpPercentage: number, 
    isBuy: boolean, 
    algorithm: TpAlgorithm
): number[] => {
    const tpPrices = [];
    if (numOrders === 1) {
        const tpPercentage = (minTpPercentage + maxTpPercentage)/2;
        tpPrices.push(isBuy ? dcaPrice * (1 + tpPercentage / 100) : dcaPrice * (1 - tpPercentage / 100));
        return tpPrices;
    }

    const step = (maxTpPercentage - minTpPercentage) / (numOrders - 1);

    for (let i = 0; i < numOrders; i++) {
        let tpPercentage;
        switch (algorithm) {
            case 'exponential':
                tpPercentage = minTpPercentage * Math.pow(maxTpPercentage / minTpPercentage, i / (numOrders - 1));
                break;
            case 'fibonacci':
                const fib = [0, 1];
                for (let j = 2; j <= numOrders; j++) fib[j] = fib[j - 1] + fib[j - 2];
                tpPercentage = minTpPercentage + (maxTpPercentage - minTpPercentage) * (fib[i] / fib[numOrders - 1]);
                break;
            case 'logarithmic':
                tpPercentage = minTpPercentage + (Math.log(i + 1) / Math.log(numOrders)) * (maxTpPercentage - minTpPercentage);
                break;
            case 'linear':
            default:
                tpPercentage = minTpPercentage + i * step;
                break;
        }
        tpPrices.push(isBuy ? dcaPrice * (1 + tpPercentage / 100) : dcaPrice * (1 - tpPercentage / 100));
    }
    return tpPrices;
};

/**
 * Calculates the percentage differences from the DCA price.
 * 
 * @param {number[]} entryPrices - Array of entry prices.
 * @param {number} dcaPrice - The DCA price.
 * @returns {number[]} - An array of percentage differences.
 */
export const calculatePercentageDiffs = (entryPrices: number[], dcaPrice: number): number[] => {
    return entryPrices.map(price => (price - dcaPrice) / dcaPrice * 100);
};

/**
 * Calculates the average Take Profit (TP) price.
 * 
 * @param {number[]} tpPrices - Array of TP prices.
 * @returns {number} - The calculated average TP price.
 */
export const calculateAverageTp = (tpPrices: number[]): number => {
    return tpPrices.reduce((a, b) => a + b, 0) / tpPrices.length;
};

/**
 * Generates entry prices between the upper and lower price levels.
 * 
 * @param {number} upperPrice - The upper price level.
 * @param {number} lowerPrice - The lower price level.
 * @param {number} numOrders - The number of orders.
 * @returns {number[]} - An array of generated entry prices.
 */
export const generateEntryPrices = (upperPrice: number, lowerPrice: number, numOrders: number): number[] => {
    if (numOrders === 1) {
        return [(upperPrice + lowerPrice) / 2];
    }

    const step = (upperPrice - lowerPrice) / (numOrders - 1);
    return Array.from({ length: numOrders }, (_, i) => upperPrice - i * step);
};