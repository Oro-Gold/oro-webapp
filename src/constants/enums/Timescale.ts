export enum Timescale {
    Hour,
    Day,
    Month,
    Quarter,
    Year
  }
  
  export const getTimescaleText = (timescale: Timescale) => {
    if (timescale === Timescale.Hour) {
      return "1H";
    } else if (timescale === Timescale.Day) {
      return "1D";
    } else if (timescale === Timescale.Month) {
        return "1M";
    } else if (timescale === Timescale.Quarter) {
        return "3M";
    } else if (timescale === Timescale.Year) {
        return "1Y";
      }
  };
  
  export const getAllTimescales = () => {
    return [
        Timescale.Hour,
        Timescale.Day,
        Timescale.Month,
        Timescale.Quarter,
        Timescale.Year
    ];
  };
  