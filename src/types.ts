type CTData = {
  bottles: WineBottle[];
};

type WineBottle = {
  BottleState: boolean;
  Barcode: number;
  iWine: number;
  Vintage: number;
  Wine: string;
  Locale: string;
  Country: string;
  Region: string;
  SubRegion: string;
  Appellation: string;
  Producer: string;
  SortProducer: string;
  Type: WineType;
  Varietal: string;
  MasterVarietal: string;
  Designation: string;
  Vineyard: string;
  Quantity: number;
  BottleSize: string;
  Location: string;
  Bin: string;
  BinColumn?: number;
  BinRow?: number;
  Store: string;
  PurchaseDate: Date;
  DeliveryDate: Date;
  BottleCost: number;
  BottleCostCurrency: string;
  BottleNote: string;
  PurchaseNote: string;
  ConsumptionDate?: Date;
  ConsumptionType?: string;
  ShortType?: string;
  ConsumptionNote?: string;
  ConsumptionRevenue?: number;
  ConsumptionRevenueCurrency?: string;
  BeginConsume: number;
  EndConsume: number;
  MatureState: MatureState;
};

enum WineType {
  "Red",
  "White",
  "White - Sparkling",
  "White - Sweet/Dessert",
  "Rosé",
}

enum MatureState {
  "Young",
  "Mature",
  "Passed",
}

export {CTData, WineBottle, WineType, MatureState};
