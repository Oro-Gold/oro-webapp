export enum PageTab {
    Trade,
    Lend,
  }
  
  export const getPageTabText = (pageTab: PageTab) => {
    if (pageTab === PageTab.Trade) {
      return "trade";
    } else if (pageTab === PageTab.Lend) {
      return "lend";
    }
  };
  
  export const getAllPageTabs = () => {
    return [PageTab.Trade, PageTab.Lend];
  };
  