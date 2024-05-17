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


/*export var colScaleLumRef = [
    { lowerLumLimit: 0.000, upperLumLimit: 0.1, diff: 0, desLum: 0 },
    { lowerLumLimit: 0.1, upperLumLimit: 0.2, diff: 0, desLum: 0 },
    { lowerLumLimit: 0.2, upperLumLimit: 0.3, diff: 0, desLum: 0 },
    { lowerLumLimit: 0.3, upperLumLimit: 0.4, diff: 0, desLum: 0 },
    { lowerLumLimit: 0.4, upperLumLimit: 0.5, diff: 0, desLum: 0 },
    { lowerLumLimit: 0.5, upperLumLimit: 0.6, diff: 0, desLum: 0 },
    { lowerLumLimit: 0.6, upperLumLimit: 0.7, diff: 0, desLum: 0. },
    { lowerLumLimit: 0.7, upperLumLimit: 0.8, diff: 0, desLum: 0 },
    { lowerLumLimit: 0.8, upperLumLimit: 0.9, diff: 0, desLum: 0 },
    { lowerLumLimit: 0.9, upperLumLimit: 1.000, diff: 0, desLum: 0 },
]*/
//update the values of colScaleLumRef array to include difference and desired luminances
for (var i = 0; i < 10; i++) {
    colScaleLumRef[i].diff = colScaleLumRef[i].upperLumLimit - colScaleLumRef[i].lowerLumLimit;
    colScaleLumRef[i].desLum = colScaleLumRef[i].lowerLumLimit + (colScaleLumRef[i].diff * 0.33);
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

import { hexToHsl, hslToHex } from './color-conversions-1.js';
import { hexToLuminance } from './color-conversions-2.js';
import { compareLuminance, createExpandedScale, closestValuePosition, generateColorScale, addHslToColorScale, classify } from './helper-functions.js';
import { generateColorScaleRgb } from './rgb-color-scale.js';

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
    console.log("----COLOR PICKER: " + (str.toUpperCase()) + "----");
    // console.log("selected color in HSL:" + (hslColor));
    console.log("Selected color in Hexcode: " + selectedColor);
    console.log("Luminance of selected color: " + luminance);
    console.log("Position of selected color (from 1 to 10) : " + (origColPos + 1));
    console.log("Classification/Darkness of the selected color: " + classify(origColPos));//classification of color
    console.log("Final color scale with Hexcode, Luminance and HSL values: ");

    console.table(colorScaleComplete);
    /*     console.log("Expanded table in HSL: ");
        console.table(allHslValues);
        console.log("Expanded table in Hexcode with Luminance: ");
        console.table(expandedScale); */
    console.log("RGB Color Scale: ");
    console.table(rgbColorScale);
    console.log('\n');
    console.log('\n');
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
        handleColorChange(colorPicker1, 'lum-scl-1-col-', 'rgb-scl-1-col-');
    });
    colorPicker2.addEventListener("change", function () {
        handleColorChange(colorPicker2, 'lum-scl-2-col-', 'rgb-scl-2-col-');
    });
    colorPicker3.addEventListener("change", function () {
        handleColorChange(colorPicker3, 'lum-scl-3-col-', 'rgb-scl-3-col-');
    });
});
// Call handleColorChange function for colorPicker1 on page load
handleColorChange(colorPicker1, 'lum-scl-1-col-', 'rgb-scl-1-col-');

// Call handleColorChange function for colorPicker2 on page load
handleColorChange(colorPicker2, 'lum-scl-2-col-', 'rgb-scl-2-col-');

// Call handleColorChange function for colorPicker3 on page load
handleColorChange(colorPicker3, 'lum-scl-3-col-', 'rgb-scl-3-col-');


function toggleElements(selectedValue) {
    const lumElements = document.getElementsByClassName('lum');
    const rgbElements = document.getElementsByClassName('rgb');

    if (selectedValue === 'rgb') {
        // Show RGB elements and hide Luminance elements
        Array.from(lumElements).forEach(element => element.style.display = 'none');
        Array.from(rgbElements).forEach(element => element.style.display = 'table-cell');
    } else if (selectedValue === 'lum') {
        // Show Luminance elements and hide RGB elements
        Array.from(rgbElements).forEach(element => element.style.display = 'none');
        Array.from(lumElements).forEach(element => element.style.display = 'table-cell');
    } else if (selectedValue === 'both') {
        // Show Luminance elements and hide RGB elements
        Array.from(rgbElements).forEach(element => element.style.display = 'table-cell');
        Array.from(lumElements).forEach(element => element.style.display = 'table-cell');
    }
}

// Get the dropdown element
const dropdown = document.getElementById('dropDown');

// Add event listener to handle changes
dropdown.addEventListener('change', function (event) {
    // Get the selected value
    const selectedValue = event.target.value;
    // Toggle elements based on the selected value
    toggleElements(selectedValue);
});

// Initially hide RGB elements and show Luminance elements
toggleElements(dropdown.value);

document.addEventListener('DOMContentLoaded', function () {
    // Get all elements with the class 'color-cell'
    var colorCells = document.querySelectorAll('.color-cell');

    // Add click event listener to each color cell
    colorCells.forEach(function (cell) {
        cell.addEventListener('click', function () {
            // Get the background color of the clicked element
            var bgColor = this.style.backgroundColor;

            // Convert the RGB color to HEX format
            var hexColor = rgbStrToHexCode(bgColor);

            // Copy the HEX color to the clipboard
            navigator.clipboard.writeText(hexColor)
                .then(function () {
                    // Alert that the color has been copied to clipboard
                    var alertMessage = 'Color copied to clipboard: ' + hexColor;
                    showMessage(alertMessage, 3000); // Display for 3 seconds
                })
                .catch(function () {
                    // If clipboard write fails
                    var errorMessage = 'Failed to copy color to clipboard';
                    showMessage(errorMessage, 3000); // Display for 3 seconds
                });

                var messageTimeout; // Variable to store the timeout reference

                function showMessage(message, duration) {
                  var messageBox = document.getElementById('messageBox');
                  // Set the message content
                  messageBox.textContent = message;
                  // Show the message box
                  messageBox.style.display = 'block';
                  
                  // Clear the previous timeout, if any
                  clearTimeout(messageTimeout);
                  
                  // Automatically hide the message box after the specified duration
                  messageTimeout = setTimeout(function() {
                    // Hide the message box
                    messageBox.style.display = 'none';
                  }, duration);
                }
                
                // Example function to simulate triggering a message
                function triggerMessage() {
                  var hexColor = "#ff0000"; // Example color, replace with your logic to get the color
                  var alertMessage = 'Color copied to clipboard: ' + hexColor;
                  showMessage(alertMessage, 3000); // Display for 3 seconds
                }
        });
    });

    // Function to convert RGB color to HEX format
    function rgbStrToHexCode(rgb) {
        // Convert rgb color to an array of integers
        var parts = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        delete (parts[0]);
        for (var i = 1; i <= 3; ++i) {
            parts[i] = parseInt(parts[i]).toString(16);
            if (parts[i].length == 1) parts[i] = '0' + parts[i];
        }
        // Construct the HEX color
        var hexColor = '#' + parts.join('');
        return hexColor;
    }
});