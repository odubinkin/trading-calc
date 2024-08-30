export type TpAlgorithm = 'linear' | 'exponential' | 'fibonacci' | 'logarithmic';

// Function to calculate the DCA (Dollar-Cost Averaging) price
export const calculateDcaPrice = (entryPrices: number[]) => {
    return entryPrices.reduce((a, b) => a + b, 0) / entryPrices.length;
};

// Function to calculate the Stop Loss (SL) price
export const calculateSlPrice = (dcaPrice: number, slPercentage: number, isBuy: boolean) => {
    return isBuy ? dcaPrice * (1 - slPercentage / 100) : dcaPrice * (1 + slPercentage / 100);
};

// Function to calculate the Take Profit (TP) prices based on the selected algorithm
export const calculateTpPrices = (dcaPrice: number, numOrders: number, minTpPercentage: number, maxTpPercentage: number, isBuy: boolean, algorithm: TpAlgorithm) => {
    const tpPrices = [];
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

// Function to calculate the percentage differences from the DCA price
export const calculatePercentageDiffs = (entryPrices: number[], dcaPrice: number) => {
    return entryPrices.map(price => (price - dcaPrice) / dcaPrice * 100);
};

// Function to calculate the average Take Profit (TP) price
export const calculateAverageTp = (tpPrices: number[]) => {
    return tpPrices.reduce((a, b) => a + b, 0) / tpPrices.length;
};

// Function to generate entry prices between the upper and lower price levels
export const generateEntryPrices = (upperPrice: number, lowerPrice: number, numOrders: number) => {
    const step = (upperPrice - lowerPrice) / (numOrders - 1);
    return Array.from({ length: numOrders }, (_, i) => upperPrice - i * step);
};