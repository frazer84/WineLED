import {parse, transform} from "csv/sync";
import fetch from "node-fetch";
import {MatureState, WineBottle, WineType} from "./types";
import {readFile, writeFile} from "fs/promises";

export const getCellarTrackerWinesCSV = async () => {
  const {CT_USERNAME, CT_PASSWORD} = process.env;
  const url = `https://www.cellartracker.com/xlquery.asp?User=${CT_USERNAME}&Password=${CT_PASSWORD}&Format=csv&Table=Bottles&FF=1`;
  /*const response = await fetch(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
    },
  });
  const body = await response.text();*/
  const body = await readFile("ct1.csv", {encoding: "utf8"});
  const rawRecords = parse(body);
  const wineData: WineBottle[] = [];
  const refinedRecords = transform(rawRecords, data => {
    wineData.push(parseWineFromCsvRow(data));
  });

  return wineData;
};

const parseWineFromCsvRow = (row: string[]): WineBottle => {
  const yearNow = new Date().getFullYear();

  const binRegex = /([CR]\d*)([CR]\d*)/;
  const parsedBin = binRegex.exec(row[20]);
  let parsedBinColumn;
  let parsedBinRow;
  if (parsedBin) {
    parsedBinColumn =
      parsedBin[1].charAt(0) === "C"
        ? Number(parsedBin[1].substring(1))
        : Number(parsedBin[2].substring(1));
    parsedBinRow =
      parsedBin[1].charAt(0) === "R"
        ? Number(parsedBin[1].substring(1))
        : Number(parsedBin[2].substring(1));
  }

  return {
    BottleState: row[0] === "1",
    Barcode: Number(row[1]),
    iWine: Number(row[2]),
    Vintage: Number(row[3]),
    Wine: row[4],
    Locale: row[5],
    Country: row[6],
    Region: row[7],
    SubRegion: row[8],
    Appellation: row[9],
    Producer: row[10],
    SortProducer: row[11],
    Type: row[12] as unknown as WineType,
    Varietal: row[13],
    MasterVarietal: row[14],
    Designation: row[15],
    Vineyard: row[16],
    Quantity: Number(row[17]),
    BottleSize: row[18],
    Location: row[19],
    Bin: row[20],
    BinColumn: parsedBin ? parsedBinColumn : undefined,
    BinRow: parsedBin ? parsedBinRow : undefined,
    Store: row[21],
    PurchaseDate: new Date(row[22]),
    DeliveryDate: new Date(row[23]),
    BottleCost: Number(row[24]),
    BottleCostCurrency: row[25],
    BottleNote: row[26],
    PurchaseNote: row[27],
    ConsumptionDate: row[28] ? new Date(row[28]) : undefined,
    ConsumptionType: row[29] || undefined,
    ShortType: row[30] || undefined,
    ConsumptionNote: row[31] || undefined,
    ConsumptionRevenue: Number(row[32]) || undefined,
    ConsumptionRevenueCurrency: row[33] || undefined,
    BeginConsume: Number(row[34]),
    EndConsume: Number(row[35]),
    MatureState:
      Number(row[34]) > yearNow
        ? MatureState.Young
        : Number(row[35]) < yearNow
        ? MatureState.Passed
        : MatureState.Mature,
  };
};
