import { Logger } from "../main";
import { getAndroidPref, isAndroidAmbient, saveAndroidPref } from "./Utils";

export function setItem(key: string, value: any) {
  let stringValue = JSON.stringify(value);
  if (!isAndroidAmbient()) {
    localStorage.setItem(key, stringValue);
  } else {
    saveAndroidPref(key, stringValue);
  }
}

export function removeItem(key: string) {
  if (!isAndroidAmbient()) {
    localStorage.removeItem(key);
  } else {
    saveAndroidPref(key, null);
  }
}

export function getTypedItem(
  Class: any,
  key: string,
  defValue: Class = undefined
) {
  let item = getItem(key) || {};
  return Object.assign(new Class(), item, defValue);
}

export function getItem<T>(key: string, defValue: T = undefined): T {
  let item = defValue;
  try {
    let itemString = null;
    if (!isAndroidAmbient()) {
      itemString = localStorage.getItem(key);
    } else {
      itemString = getAndroidPref(key);
    }
    Logger.info("storage.getItem", itemString);
    if (itemString) {
      let json = JSON.parse(itemString) as T;
      item = json;
    }
  } catch (e) {
    Logger.warn(
      `Storage item not found ${key}. Returning default value: ${defValue}`
    );
    Logger.error(e);
  }
  return item;
}
