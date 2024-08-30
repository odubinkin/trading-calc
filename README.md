# Trading Calculator

This project is a simple trading calculator built with React and TypeScript, utilizing the Chakra UI library for styling. The calculator helps users to determine the Dollar-Cost Averaging (DCA) price, Stop Loss (SL) price, and Take Profit (TP) prices based on user inputs.

**Current version is available at [https://odubinkin.github.io/trading-calc/](https://odubinkin.github.io/trading-calc/).**

## Features

- **DCA Price Calculation**: Calculates the average entry price based on multiple entry prices.
- **Stop Loss Calculation**: Determines the stop loss price based on the DCA price and a user-defined percentage.
- **Take Profit Calculation**: Calculates multiple take profit prices based on the DCA price, user-defined percentage, and selected algorithm.
- **Entry Prices Generation**: Generates entry prices between upper and lower price levels.
- **Percentage Differences Calculation**: Computes the percentage differences of entry prices from the DCA price.
- **Average Take Profit Calculation**: Calculates the average take profit price.

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/trading-calculator.git
    ```
2. Navigate to the project directory:
    ```sh
    cd trading-calculator
    ```
3. Install the dependencies:
    ```sh
    npm install
    ```

## Usage

1. Start the development server:
    ```sh
    npm start
    ```
2. Open your browser and navigate to `http://localhost:3000`.

## Components

### `TradingCalc`

The main component that renders the trading calculator interface. It includes form controls for user inputs and displays the calculated results.

#### State Variables

- `upperPrice`: Upper price level for entry prices.
- `lowerPrice`: Lower price level for entry prices.
- `numOrders`: Number of orders.
- `slPercentage`: Stop loss percentage from DCA price.
- `minTpPercentage`: Minimum take profit percentage from DCA price.
- `maxTpPercentage`: Maximum take profit percentage from DCA price.
- `isBuy`: Boolean indicating if the calculation is for a buy or sell order.
- `tpAlgorithm`: Algorithm used for take profit calculation (linear, exponential, fibonacci, logarithmic).
- `entryPrices`: Array of generated entry prices.
- `dcaPrice`: Calculated DCA price.
- `slPrice`: Calculated stop loss price.
- `tpPrices`: Array of calculated take profit prices.
- `percentageDiffs`: Array of percentage differences from DCA price.
- `tpPercentageDiffs`: Array of percentage differences of TP prices from DCA price.
- `averageTp`: Calculated average take profit price.
- `averageTpDiff`: Percentage difference of average TP price from DCA price.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes or improvements.

## Acknowledgements

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Chakra UI](https://chakra-ui.com/)