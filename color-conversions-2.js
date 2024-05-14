//Updated color mode conversions
export function hexToRgb(hex) {
    // Remove '#' if present
    hex = hex.replace(/^#/, '');
    // Convert to RGB
    return [
        parseInt(hex.substring(0, 2), 16) / 255.0,
        parseInt(hex.substring(2, 4), 16) / 255.0,
        parseInt(hex.substring(4, 6), 16) / 255.0
    ];
}

export function sRgbToLinear(sRgb) {
    return sRgb.map(function (val) {
        val = val <= 0.04045 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
        return val;
    });
}

export function lum(rgbLinear) {
    const [r, g, b] = rgbLinear;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function luminanceWithoutSRGB(rgb) {
    const [r, g, b] = rgb;
    return 0.299 * r + 0.587 * g + 0.114 * b;
}

export function hexToLuminance(hex) {
    const rgb = hexToRgb(hex);
    const rgbLinear = sRgbToLinear(rgb);
    return lum(rgbLinear);
}

