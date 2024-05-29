import {WLED} from "wled";
import ledConfig from "../ledconfig.json";

const wled = new WLED(process.env.WLED_IP_ADDRESS!);

export const TurnOnLEDsWithColor = async (leds: number[], color: number[]) => {
  if (color.length !== 3) {
    throw new Error(
      "Invalid RGB color value. Needs to be an array with length 3 and values 0-255"
    );
  }

  let ledArray: any[] = [];
  leds.forEach(async led => {
    ledArray = [...ledArray, led, color];
  });
  await wled.setLedColor(ledArray, true);
};

export const TurnOnLEDs = async (ledArray: any[]) => {
  await wled.setLedColor(ledArray, true);
};

//      | |
// ... (...) ... (...) ... (...) ... (...) ... (...) ... . (...) ... (...) ... (...)
export const GetLedsForRowAndColumn = (
  row: number,
  column: number,
  color: number[]
): any[] => {
  if (!ledConfig.rows[row])
    throw new Error(`Row ${row} not configured in ledconfig.json`);

  const rowConfig = ledConfig.rows[row];
  let ledStart =
    rowConfig.start +
    (rowConfig.bottleOffset + rowConfig.bottleWidth) *
      column *
      (rowConfig.invert ? -1 : 1);
  if (ledStart >= rowConfig.extraOffsetIndex) ledStart += rowConfig.extraOffset;
  const ledEnd = ledStart + rowConfig.bottleWidth;
  const leds: any[] = [];
  for (let i = ledStart; i <= ledEnd; i++) {
    leds.push(i);
    if (i === ledStart || i === ledEnd) {
      leds.push(dimColor(color));
    } else {
      leds.push(color);
    }
  }
  return leds;
};

const dimColor = (color: number[]) => {
  return color.map(n => n * 0.5);
};
