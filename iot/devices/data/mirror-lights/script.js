const rgbToHex = (colour) => {
  return (
    "#" +
    ((1 << 24) | (colour.red << 16) | (colour.green << 8) | colour.blue)
      .toString(16)
      .slice(1)
  );
};

const hexToRgb = (hex) => {
  const [red, green, blue] = hex
    .replace(
      /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
      (m, r, g, b) => "#" + r + r + g + g + b + b
    )
    .substring(1)
    .match(/.{2}/g)
    .map((x) => parseInt(x, 16));
  return { red, green, blue };
};

const rgbToCss = (colour) =>
  `rgb(${colour.red},${colour.green},${colour.blue})`;

const rgbToLuminance = (colour) =>
  0.2126 * colour.red + 0.7152 * colour.green + 0 * colour.blue;

(() => {
  let colour = { red: 0, green: 0, blue: 0, white: 0 };

  const body = document.querySelector("body");
  const whiteOverlay = document.querySelector("#white-overlay");
  const inputs = document.querySelector(".inputs");
  const eyedropIcon = document.querySelector("#eyedrop-icon");
  const eyedropInput = document.querySelector("#eyedrop-input");
  const redInput = document.querySelector("#red-input");
  const redSlideInput = document.querySelector("#red-slide-input");
  const greenInput = document.querySelector("#green-input");
  const greenSlideInput = document.querySelector("#green-slide-input");
  const blueInput = document.querySelector("#blue-input");
  const blueSlideInput = document.querySelector("#blue-slide-input");
  const whiteInput = document.querySelector("#white-input");
  const whiteSlideInput = document.querySelector("#white-slide-input");
  const buttons = document.querySelector(".buttons");
  const button = document.querySelector("#button");

  const updateBodyColour = () => {
    body.style.backgroundColor = rgbToCss(colour);
    whiteOverlay.style.opacity = colour.white / 255;
  };

  const updateEyedropColours = () => {
    const luminance = rgbToLuminance(colour) + (100 * colour.white) / 255;
    eyedropIcon.style.filter = `invert(${luminance > 50 ? 0 : 1})`;
  };

  const updateInputColours = () => {
    const luminance = rgbToLuminance(colour) + (100 * colour.white) / 255;
    inputs.style.filter = `invert(${luminance > 50 ? 0 : 1})`;
  };

  const updateButtonColours = () => {
    const luminance = rgbToLuminance(colour) + (100 * colour.white) / 255;
    buttons.style.filter = `invert(${luminance > 50 ? 0 : 1})`;
  };

  const updateStyles = () => {
    updateBodyColour();
    updateEyedropColours;
    updateInputColours();
    updateButtonColours();
  };

  const udpateEyedropper = () => {
    eyedropInput.value = rgbToHex(colour);
  };

  const updateInputs = () => {
    redInput.value = Math.floor((100 * colour.red) / 255).toString();
    redSlideInput.value = Math.floor((100 * colour.red) / 255).toString();
    greenInput.value = Math.floor((100 * colour.green) / 255).toString();
    greenSlideInput.value = Math.floor((100 * colour.green) / 255).toString();
    blueInput.value = Math.floor((100 * colour.blue) / 255).toString();
    blueSlideInput.value = Math.floor((100 * colour.blue) / 255).toString();
    whiteInput.value = Math.floor((100 * colour.white) / 255).toString();
    whiteSlideInput.value = Math.floor((100 * colour.white) / 255).toString();
  };

  const handleEyedropperChange = (event) => {
    colour = { ...colour, ...hexToRgb(event.target.value) };
    updateStyles();
    updateInputs();
  };

  const createHandleColourInputChange = (_colour) => (event) => {
    const value = Math.max(
      Math.min(100, parseInt(event.target.value || "0")),
      0
    );
    event.target.parentElement
      .querySelectorAll("input")
      .forEach((input) => (input.value = value));
    colour[_colour] = Math.round((255 * value) / 100);
    updateStyles();
    udpateEyedropper();
  };

  const handleApply = () => {
    fetch(`http://${window.location.host}/4/colour`, {
      method: "POST",
      body: JSON.stringify(colour),
    });
  };

  const updateFromData = (data) => {
    if (data.pin === 4 && data.metric === "colour") {
      colour.red = data?.value?.[0]?.red;
      colour.green = data?.value?.[0]?.green;
      colour.blue = data?.value?.[0]?.blue;
      colour.white = data?.value?.[0]?.white;
      updateStyles();
      udpateEyedropper();
      updateInputs();
    }
  };

  const getInitialColour = () =>
    fetch(`http://${window.location.host}/4/colour`)
      .then((response) => response.json())
      .then(updateFromData);

  const listenToWebsocket = () => {
    const websocket = new WebSocket(`ws://${window.location.host}/reports`);
    websocket.onmessage = (event) => updateFromData(JSON.parse(event.data));
  };

  eyedropInput.addEventListener("input", handleEyedropperChange);
  redInput.addEventListener("input", createHandleColourInputChange("red"));
  redSlideInput.addEventListener("input", createHandleColourInputChange("red"));
  greenInput.addEventListener("input", createHandleColourInputChange("green"));
  greenSlideInput.addEventListener(
    "input",
    createHandleColourInputChange("green")
  );
  blueInput.addEventListener("input", createHandleColourInputChange("blue"));
  blueSlideInput.addEventListener(
    "input",
    createHandleColourInputChange("blue")
  );
  whiteInput.addEventListener("input", createHandleColourInputChange("white"));
  whiteSlideInput.addEventListener(
    "input",
    createHandleColourInputChange("white")
  );
  button.addEventListener("click", handleApply);

  getInitialColour();
  listenToWebsocket();
})();
