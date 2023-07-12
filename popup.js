//this code is running in different context
const pickBtn = document.querySelector("button");
const colorGrid = document.querySelector(".color-box");
const colorValue = document.querySelector(".color-value");
const copiedMsg = document.querySelector(".copied-msg");
pickBtn.addEventListener("click", async () => {
  chrome.storage.sync.get("color", ({ color }) => {
    console.log(color);
  });
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      function: pickColor,
    },
    async (injectionResults) => {
      const [data] = injectionResults;

      if (data.result) {
        const color = data.result.sRGBHex;
        colorGrid.style.background = color;
        colorValue.innerText = color;
        copiedMsg.innerText = "\u{2714} Copied";
        try {
          await navigator.clipboard.writeText(color);
        } catch (error) {
          console.log(error);
        }
      }
    }
  );
});

//this is running in different context that is on the website .help of scripting we used chome.scripting
//we cannot use varaibles declared like pickbtn inside this,we can but with args help
async function pickColor() {
  try {
    const eyeDropper = new EyeDropper();
    return await eyeDropper.open();
  } catch (err) {
    console.log(err);
  }
}
