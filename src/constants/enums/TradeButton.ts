export enum TradeButton {
    Buy,
    Withdraw,
  }
  
  export const getTradeButtonText = (tradeButton: TradeButton) => {
    if (tradeButton === TradeButton.Buy) {
      return "buy";
    } else if (tradeButton === TradeButton.Withdraw) {
      return "withdraw";
    }
  };
  
  export const getAllTradeButtons = () => {
    return [TradeButton.Buy, TradeButton.Withdraw];
  };
  