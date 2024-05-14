//----DECLARE GLOBAL VARIABLES ETC.----//

//stores selected color's luminance
export var luminance;

//stores classification of selected color
export var classification;

//stores the HSL value of the original color
export var hslColor;

//stores selected color's position on the color scale
export var origColPos;

//array with reference upper and lower luminance limits
export var colScaleLumRef = [
    { lowerLumLimit: 0.000, upperLumLimit: 0.032, diff: 0, desLum: 0 },
    { lowerLumLimit: 0.033, upperLumLimit: 0.073, diff: 0, desLum: 0 },
    { lowerLumLimit: 0.074, upperLumLimit: 0.131, diff: 0, desLum: 0 },
    { lowerLumLimit: 0.132, upperLumLimit: 0.206, diff: 0, desLum: 0 },
    { lowerLumLimit: 0.207, upperLumLimit: 0.298, diff: 0, desLum: 0 },
    { lowerLumLimit: 0.299, upperLumLimit: 0.406, diff: 0, desLum: 0 },
    { lowerLumLimit: 0.407, upperLumLimit: 0.531, diff: 0, desLum: 0. },
    { lowerLumLimit: 0.532, upperLumLimit: 0.673, diff: 0, desLum: 0 },
    { lowerLumLimit: 0.674, upperLumLimit: 0.831, diff: 0, desLum: 0 },
    { lowerLumLimit: 0.832, upperLumLimit: 1.000, diff: 0, desLum: 0 },
]
//update the values of colScaleLumRef array to include difference and desired luminances
for (var i = 0; i < 10; i++) {
    colScaleLumRef[i].diff = colScaleLumRef[i].upperLumLimit - colScaleLumRef[i].lowerLumLimit;
    colScaleLumRef[i].desLum = colScaleLumRef[i].lowerLumLimit + (colScaleLumRef[i].diff * 0.25);
};
console.log(colScaleLumRef);

// Get the color picker element
var colorPicker1 = document.getElementById("colorPicker1");
var colorPicker2 = document.getElementById("colorPicker2");
var colorPicker3 = document.getElementById("colorPicker3");
export var selectedColor; //will be used to store the value of the color picker


//Array where all the final colors will be stored
export var colorScaleComplete = [];
export var colorScale = [
    undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined
];


//An expanded color scale of 100 shades of the selected color
export var expandedScale = [];
//expanded scale in HSL
export var allHslValues = [];

//list of desired colors from the expanded color scale
export var desColPos;

import {hexToHsl,hslToHex} from './color-conversions-1.js';
import {hexToLuminance} from './color-conversions-2.js';
import {compareLuminance, createExpandedScale,closestValuePosition, generateColorScale, addHslToColorScale, classify} from './helper-functions.js';
import {generateColorScaleRgb} from './rgb-color-scale.js';

//----MAIN FUNCTION----//
// Define a generic event handler function
function handleColorChange(colorPicker, elementPrefix1, elementPrefix2) {

    // Get the selected color value
    const selectedColor = colorPicker.value;

    // Calculate luminance for the selected color
    const luminance = hexToLuminance(selectedColor);

    // Return the position of the color in the color scale
    const origColPos = compareLuminance(luminance);

    // Additional functions
    const hslColor = hexToHsl(selectedColor);
    const hexColor = hslToHex(hslColor);
    createExpandedScale(hslColor);
    const desColPos = closestValuePosition(colScaleLumRef, expandedScale);
    generateColorScale(expandedScale, colorScale, desColPos);
    // Call the function to insert the third value into each sub-array
    colorScaleComplete = addHslToColorScale(colorScale, allHslValues, desColPos);
    var rgbColorScale = generateColorScaleRgb(selectedColor, origColPos);


    // Logging results
    let str = colorPicker.id;
    console.log("####----COLOR PICKER: " + (str.toUpperCase()) + "----####");
    console.table('\n');
    console.log("selected color in HSL:" + (hslColor));
    console.log("Selected color in Hexcode: " + selectedColor);
    console.log("Luminance of selected color: " + luminance);
    console.log("Position of selected color from 0 to 9: " + (origColPos));
    console.log("Classification/Darkness of the selected color: " + classify(origColPos));//classification of color
    console.table("Final color scale with Hexcode, Luminance and HSL values: ");

    console.log(colorScaleComplete);
    console.log("Expanded table in HSL: ");
    console.table(allHslValues);
    console.log("Expanded table in Hexcode with Luminance: ");
    console.table(expandedScale);
    console.log("RGB Color Scale: ");
    console.table (rgbColorScale);
    console.log('\n');


    // Rendering Luminance color scale in HTML
    const mappedColorScale = colorScaleComplete.map(item => item[0]); //creates a new array mappedColorScale by mapping over the elements of the colorScaleComplete array and extracting the first element of each subarray.
    for (let i = 1; i <= 10; i++) {
        const elementId = elementPrefix1 + i;
        const element = document.getElementById(elementId);
        // Assign a different background color to each element
        element.style.backgroundColor = mappedColorScale[i - 1];
        
        //Rendering RGB color scale in HTML
        const elementId2 = elementPrefix2 + i;
        const element2 = document.getElementById(elementId2);
        // Assign background color from the second array to the second column
        element2.style.backgroundColor = rgbColorScale[i - 1];
    }

}
// Add event listeners after DOM content has loaded
document.addEventListener('DOMContentLoaded', function () {
    colorPicker1.addEventListener("change", function () {
        handleColorChange(colorPicker1, 'lum-scl-1-col-','rgb-scl-1-col-');
        // handleColorChange(colorPicker1, 'rgb-scl-1-col-');
    });
    colorPicker2.addEventListener("change", function () {
        handleColorChange(colorPicker2, 'lum-scl-2-col-', 'rgb-scl-2-col-');
    });
    colorPicker3.addEventListener("change", function () {
        handleColorChange(colorPicker3, 'lum-scl-3-col-','rgb-scl-3-col-');
    });
});
