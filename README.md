# WineLED

Node.js server to control WS2812B addressable LEDs and have them show the position and status of the wines in my wine-cellar.

## Supported hardware

The server currently supports and has been tested with the following hardware.

### LED lights

- [WS2812B](https://www.amazon.se/dp/B07WCGLCWJ?ref_=pe_24982401_513610551_E_301_dt_1)

### LED drivers

- [Shelly RGBW2](https://www.shelly.cloud/en/products/shop/shelly-rgbw2-1)

## Configuration

All configuration is done in _ledconfig.json_ located in the root of the app.

### Examples

Here's some example configurations.

#### One row, inverted order, skipping 1 LED in the beginning and using 54 LEDs after that

```
{
  "rows": [
    {
      "start": 55,
      "bottleOffset": 3,
      "bottleWidth": 3,
      "end": 1,
      "extraOffset": 0,
      "extraOffsetIndex": 30,
      "invert": true
    }
  ]
}
```
