//Convert hex/RGB color to HSL
export function hexToHsl(hexColor) {
    // Convert hex to RGB
    const rgbColor = hexToRgb(hexColor);

    // Convert RGB to HSL
    const hslColor = rgbToHsl(rgbColor);
    return hslColor;

}

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

export function rgbToHsl(rgbColor) {
    // Normalize RGB values
    const r = rgbColor[0];
    const g = rgbColor[1];
    const b = rgbColor[2];

    // Find max and min of normalized RGB values
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    // Calculate lightness
    const l = (max + min) / 2;

    // Calculate saturation
    let s;
    if (max === min) {
        s = 0; // achromatic
    } else {
        s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
    }

    // Calculate hue
    let h;
    if (max === min) {
        h = 0; // achromatic
    } else {
        const d = max - min;
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h *= 60;
    }

    // Ensure hue is between 0 and 360
    if (h < 0) {
        h += 360;
    }

    // Round HSL values and return
    return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}

//HSL to Hex
export function hslToHex(hslColor) {
    const rgbColor = hslToRgb(hslColor);
    return rgbToHex(rgbColor);
}

export function rgbToHex(rgbColor) {
    return "#" + rgbColor.map(component => {
        const hex = component.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }).join("");
}

export function hslToRgb(hslColor) {
    const [h, s, l] = hslColor;
    const hue = h / 360;
    const saturation = s / 100;
    const lightness = l / 100;

    let r, g, b;

    if (s === 0) {
        r = g = b = lightness * 255; // achromatic
    } else {
        const hueToRgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
        const p = 2 * lightness - q;

        r = hueToRgb(p, q, hue + 1 / 3) * 255;
        g = hueToRgb(p, q, hue) * 255;
        b = hueToRgb(p, q, hue - 1 / 3) * 255;
    }

    return [Math.round(r), Math.round(g), Math.round(b)];
}
