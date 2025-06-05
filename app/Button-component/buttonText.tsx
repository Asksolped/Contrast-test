import { useRef, useState } from "react";
import "./button.css";

// Random RGB generator
const generateColor = () => {
  return {
    hue: Math.floor(Math.random() * 255),
    sat: Math.floor(Math.random() * 255),
    lum: Math.floor(Math.random() * 255),
  };
};

// Difference calculator
const diffyColor = (color1, color2) => {
  return (
    Math.abs(color1.hue - color2.hue) +
    Math.abs(color1.sat - color2.sat) +
    Math.abs(color1.lum - color2.lum)
  );
};

// Parse RGB string
function parseRGBString(rgbString) {
  const match = rgbString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!match) {
    console.warn("Failed to parse RGB string:", rgbString);
    return { hue: 0, sat: 0, lum: 0 };
  }
  return {
    hue: parseInt(match[1]),
    sat: parseInt(match[2]),
    lum: parseInt(match[3]),
  };
}

export function ColorButton() {
  const textRef = useRef<HTMLParagraphElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  const [backgroundColor, setBackColor] = useState("rgb(0, 0, 0)");
  const [color, setColor] = useState("rgb(0, 0, 0)");

  const colorSelectBackground = () => {
    if (!textRef.current) return;

    const computedTextColor = getComputedStyle(textRef.current).color;
    const currColor = parseRGBString(computedTextColor);

    let bgColor, contrast;
    do {
      bgColor = generateColor();
      contrast = diffyColor(bgColor, currColor);
    } while (contrast < 200);

    setBackColor(`rgb(${bgColor.hue}, ${bgColor.sat}, ${bgColor.lum})`);
  };

  const colorSelectText = () => {
    if (!backgroundRef.current) return;

    const computedBackgroundColor = getComputedStyle(
      backgroundRef.current
    ).backgroundColor;
    const currColor = parseRGBString(computedBackgroundColor);

    let txtColor, contrast;
    do {
      txtColor = generateColor();
      contrast = diffyColor(txtColor, currColor);
    } while (contrast < 200);

    setColor(`rgb(${txtColor.hue}, ${txtColor.sat}, ${txtColor.lum})`);
  };

  const both = () => {
    let bg, text, diff;
    do {
      bg = generateColor();
      text = generateColor();
      diff = diffyColor(bg, text);
    } while (diff < 200);

    setBackColor(`rgb(${bg.hue}, ${bg.sat}, ${bg.lum})`);
    setColor(`rgb(${text.hue}, ${text.sat}, ${text.lum})`);
  };

  return (
    <div ref={backgroundRef} className="background" style={{ backgroundColor }}>
      <p ref={textRef} style={{ color }}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </p>
      <div className="Button-container">
        <button id="textButton" onClick={colorSelectText}>
          Click me to change text color
        </button>
        <button id="backgroundButton" onClick={colorSelectBackground}>
          Click me to change background color
        </button>
        <button id="bothButton" onClick={both}>
          Click me to change both!
        </button>
      </div>
    </div>
  );
}
