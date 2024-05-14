import { luminance, classification, hslColor, origColPos, colScaleLumRef, selectedColor, colorScaleComplete, colorScale, expandedScale, allHslValues, desColPos } from './script.js';
import { hslToRgb, rgbToHex } from './color-conversions-1.js';
import { hexToLuminance, hexToRgb } from './color-conversions-2.js';



//find the original color's position
//Number of colors above = 9-origColPos
//Number of colors below = origColPos
var numColAbove = 9 - origColPos;
var numColBelow = origColPos;

//selected color in RGB
// console.log(selectedColor);

export function generateColorScaleRgb(selectedColor, origColPos){
    var selectedColRgbUnmapped = hexToRgb(selectedColor);
    var selectedColRgb = [selectedColRgbUnmapped[0] * 255, selectedColRgbUnmapped[1] * 255, selectedColRgbUnmapped[2] * 255 ]
    console.log("Selected color in RGB: " + selectedColRgb)
    var rgbColorScale = [];
    for (var i = 0; i <= 9; i++) {
        rgbColorScale.push([0, 0, 0]);
        if (i < origColPos) { //for colors lower than original color in the color scale
            rgbColorScale[i][0] = Math.round(selectedColRgb[0] - (selectedColRgb[0] / (origColPos + 1)) * ((origColPos) - i));//finding the 'r' value
            rgbColorScale[i][1] = Math.round(selectedColRgb[1] - (selectedColRgb[1] / (origColPos + 1)) * ((origColPos) - i));//finding the 'g' value
            rgbColorScale[i][2] = Math.round(selectedColRgb[2] - (selectedColRgb[2] / (origColPos + 1)) * ((origColPos) - i));//finding the 'g' value
        }
        else if (i > origColPos) { //for colors above the original color in the color scale
            rgbColorScale[i][0] = Math.round(selectedColRgb[0] + ((255 - selectedColRgb[0]) / (9 - origColPos + 1)) * (i - origColPos));//finding the 'r' value
            rgbColorScale[i][1] = Math.round(selectedColRgb[1] + ((255 - selectedColRgb[1]) / (9 - origColPos + 1)) * (i - origColPos));//finding the 'g' value
            rgbColorScale[i][2] = Math.round(selectedColRgb[2] + ((255 - selectedColRgb[2]) / (9 - origColPos + 1)) * (i - origColPos));//finding the 'b' value
        }
        else { // for selected color
            rgbColorScale[i][0] = selectedColRgb[0];
            rgbColorScale[i][1] = selectedColRgb[1];
            rgbColorScale[i][2] = selectedColRgb[2];
        }
        rgbColorScale[i] = rgbToHex(rgbColorScale[i]);
    }
    return rgbColorScale;
}
// console.log("RGB Color Scale:");
// console.table(rgbColorScale);