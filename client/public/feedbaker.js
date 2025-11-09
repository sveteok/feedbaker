//(() => {
console.log(
  "Widget loaded with site ID:",
  document.currentScript.getAttribute("data-site")
);

const siteId = document.currentScript.getAttribute("data-site") || "";
const bgColor = document.currentScript.getAttribute("data-bg") || "#fff";
const fgColor = document.currentScript.getAttribute("data-fg") || "#000";

const inputId = `feedback-input-${siteId}`;
const textareaId = `feedback-textarea-${siteId}`;
const statusId = `feedback-status-${siteId}`;

const holder = document.createElement("div");
holder.style.position = "fixed";
holder.style.bottom = "0px";
holder.style.right = "16px";
holder.style.left = "16px";
holder.style.maxWidth = "600px";
holder.style.margin = "0 auto";
holder.style.zIndex = 1000;

const renderState = (state) => {
  if (state === "start") {
    holder.innerHTML = codeStart;
  } else if (state === "form") {
    holder.innerHTML = codeForm;
    document.getElementById(inputId).focus();
  } else if (state === "done") {
    holder.innerHTML = codeDone;
  }
};

const sendFeedback = () => {
  const name = document.getElementById(inputId).value;
  const feedback = document.getElementById(textareaId).value;
  fetch("http://192.168.100.192:3000/api/sites")
    .then((res) => res.json())
    .then((sites) => {
      console.log("Sites:", sites);
      document.getElementById(statusId).innerHTML =
        "Feedback Submitted! Thank you.";
    })
    .catch((err) => {
      console.error("Error fetching sites:", err);
      document.getElementById(statusId).innerHTML = "Error Sending Feedback!";
    });
  renderState("done");
};

const codeForm = `
<div style='background: ${bgColor}; color: ${fgColor};padding: 16px; text-align: center;display: flex; flex-direction: column; 
    gap: 16px; font-family: Arial, sans-serif; 
    font-size: 14px; box-shadow: 0 0 10px rgba(0,0,0,0.3); 
    border-radius: 4px 4px 0 0;'>
    <div style='padding:8px;font-weight:bold;user-select: none;'>Your Feedback</div>
    <input id='${inputId}' type='text' placeholder='name' style='padding:16px;border-radius: 2px;border:none;background: ${fgColor};color: ${bgColor};' />
    <textarea id='${textareaId}' placeholder='feedback' rows='3' style='padding:16px;border-radius: 2px;border:none;background: ${fgColor};color: ${bgColor};'></textarea>

    <div style='display: flex; gap:16px; justify-content: center; padding: 0px;'>
        <button style='user-select: none;border-radius: 2px;flex:1;background: ${fgColor}; opacity:0.8; color: ${bgColor}; border: none; padding: 16px; cursor: pointer;'
        onClick='renderState("start")'>Cancel</button>
        <button style='user-select: none;border-radius: 2px;flex:1;background: ${fgColor}; opacity:0.8; color: ${bgColor}; border: none; padding: 16px; cursor: pointer;'
        onClick='sendFeedback()'
        >Submit</button>
    </div>
</div>`;

const codeStart = `
<div style='background: ${bgColor}; color: ${fgColor};padding: 8px; text-align: center;display: flex; flex-direction: column; 
    gap: 16px; font-family: Arial, sans-serif; 
    user-select: none;
    font-size: 14px; box-shadow: 0 0 6px rgba(0,0,0,0.3); 
    border-radius: 4px 4px 0 0;'>
    <div style='display: flex; padding: 0px;'>
        <button style='border-radius: 2px;flex:1;
            background: ${fgColor}; opacity:0.8; color: ${bgColor}; 
            border: none; padding: 16px; cursor: pointer;'
            onClick='renderState("form")'>
        Leave Feedback
        </button>
    </div>
</div>`;

const codeDone = `
<div style='background: ${bgColor}; color: ${fgColor};padding: 8px; text-align: center;display: flex; flex-direction: column; 
    gap: 16px; font-family: Arial, sans-serif; 
    user-select: none;
    font-size: 14px; box-shadow: 0 0 6px rgba(0,0,0,0.3); 
    border-radius: 4px 4px 0 0;'>
    <div id='${statusId}' style='padding:8px;font-weight:bold;user-select: none;'>Sending Feedback</div>
</div>`;

document.addEventListener("DOMContentLoaded", function () {
  document.body.appendChild(holder);
  renderState("start");
});

//})();
