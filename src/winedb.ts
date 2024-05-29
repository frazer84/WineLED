import {readFile, writeFile, stat} from "fs/promises";
import {CTData} from "./types.js";

let data: CTData;
export default async function (fileName: string) {
  if (await fileExists("./" + fileName)) {
    try {
      data = JSON.parse(await readFile("./" + fileName, {encoding: "utf8"}));
    } catch (e) {
      console.error(e);
    }
  } else {
    console.warn(
      "Wine database file " + fileName + " not found, writing empty file."
    );
    await storeData({bottles: []}, fileName);
  }
}

export async function getAllWines(includeConsumed = false) {
  if (includeConsumed) return data?.bottles;
  else return data?.bottles.filter(b => b.BottleState);
}

export async function storeData(data: CTData, fileName: string) {
  try {
    await writeFile("./" + fileName, JSON.stringify(data), {encoding: "utf8"});
    console.log(
      "Updated wine database with " +
        (data ? data.bottles.length : "0") +
        " bottles"
    );
  } catch (e) {
    console.error(e);
  }
}

const fileExists = async (path: string) =>
  !!(await stat(path).catch(() => false));
