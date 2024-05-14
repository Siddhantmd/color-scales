import {luminance, classification, hslColor, origColPos, colScaleLumRef, selectedColor, colorScaleComplete, colorScale, expandedScale, allHslValues, desColPos } from './script.js';
import {hslToRgb, rgbToHex} from './color-conversions-1.js';
import {hexToLuminance} from './color-conversions-2.js';

//----HELPER FUNCTIONS----//

// Function to calculate the luminance of selected color
export function calculateLuminance(color) {
    // Convert hex color to RGB components. 16 is the base.
    var r = parseInt(color.substring(1, 3), 16);
    var g = parseInt(color.substring(3, 5), 16);
    var b = parseInt(color.substring(5, 7), 16);

    // Calculate luminance using relative luminance formula
    luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

    // Return luminance value rounded to 2 decimal places
    return luminance.toFixed(3);
}

// Function to find the given color's position in the color scale by comparing against the reference table
export function compareLuminance(luminance) {
    let origColPosTemp = 0; // Default value

    // Compare the provided luminance against the upperLumLimit of each range in colScaleLumRef
    for (var i = 0; i < colScaleLumRef.length; i++) {
        if (luminance <= colScaleLumRef[i].upperLumLimit) {
            origColPosTemp = i;
            break;
        }
    }

    return origColPosTemp;
}


//create expanded color scale
export function createExpandedScale(hslColor) {
    for (var i = 0; i <= 100; i++) {
        var hslValues = [hslColor[0], hslColor[1], i]; // Create an array with three elements
        //stores r,g,b values
        allHslValues[i] = hslValues;
        expandedScale[i] = hslToRgb(hslValues);
        expandedScale[i] = rgbToHex(expandedScale[i]);
        const hexAndLum = [expandedScale[i], hexToLuminance(expandedScale[i])];
        expandedScale[i] = hexAndLum;
    }
}

//selecting the right colors from the expanded color scale
export function closestValuePosition(colScaleLumRef, expandedScale) {
    const closestPositions = [];

    for (let i = 0; i < colScaleLumRef.length; i++) {
        let closestPosition = null;
        let minDifference = Infinity;
        const targetValue = colScaleLumRef[i].desLum; // Fourth item of the subarray in smallerArray

        for (let j = 0; j < expandedScale.length; j++) {
            const difference = Math.abs(targetValue - expandedScale[j][1]); // Second item of the subarray in largerArray
            const tolerance = 1e-6;
            if (difference < minDifference || Math.abs(difference - minDifference) < tolerance) {
                minDifference = difference;
                closestPosition = j;
            }
        }

        closestPositions.push(closestPosition);
    }

    return closestPositions;
}

//Function to push the derived colors into the final color scale array
export function generateColorScale(expandedScaleTemp, colorScaleTemp, desColPosTemp) {
    for (var i = 0; i < 10; i++) {
        colorScaleTemp[i] = expandedScaleTemp[desColPosTemp[i]];
    }

}

// Function to insert a third value into each sub-array
export function addHslToColorScale(colorScale, allHslValuesTemp, desColPos) {
    for (let i = 0; i < colorScale.length; i++) {
        //console.log("test" + colorScale[i]);
        colorScale[i].push(allHslValuesTemp[desColPos[i]]);


    }
    return colorScale;
}

//function to classify the color as light, medium or dark
export function classify(origColPos) {
    let result;

    if (origColPos >= 7) {
        result = "light";
    } else if (origColPos >= 4) {
        result = "medium";
    } else {
        result = "dark";
    }

    return result;
}

