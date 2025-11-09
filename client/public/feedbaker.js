(() => {
  console.log(
    "Widget loaded with site ID:",
    document.currentScript.getAttribute("data-site")
  );

  const siteId = document.currentScript.getAttribute("data-site") || "";
  const bgColor = document.currentScript.getAttribute("data-bg") || "#fff";
  const fgColor = document.currentScript.getAttribute("data-fg") || "#000";

  const url = new URL(document.currentScript.src);
  const serverUrl = `${url.protocol}//${url.host}`;
  // const serverUrl = "http://192.168.100.192:3000"; // Hardcoded for testing
  // const serverUrl = "http://localhost:3000";

  const feedbakerPostUrl = `${serverUrl}/api/feedback`;
  const feedbakerSitesUrl = `${serverUrl}/sites/${siteId}/feedback`;

  const inputId = `feedback-input-${siteId}`;
  const textareaId = `feedback-textarea-${siteId}`;
  const statusId = `feedback-status-${siteId}`;

  // Create holder and attach shadow root
  const holder = document.createElement("div");
  const shadow = holder.attachShadow({ mode: "open" });

  // Add your styles here
  const style = document.createElement("style");
  style.textContent = `
        /* Your widget styles here */
        :host>div {
            position: fixed;
            bottom: 16px;
            right: 16px;
            max-width: 600px;
            min-width: 300px;
            width: calc(50% - 32px);
            margin: 0 auto;
            z-index: 1000;
            background:red;
            font-family: Arial, sans-serif;
            background: ${bgColor}; 
            color: ${fgColor};
            padding: 16px; 
            display: flex; 
            flex-direction: column; 
            gap: 16px;
            user-select: none;
            font-size: 14px; 
            border:4px solid ${fgColor};
            box-shadow: 
            0 0 16px rgba(0,0,0,0.3);
            border-radius: 16px;
            opacity:0.4;
            transition: opacity 0.3s ease;   
        }

       :host>div:hover,:host>div:focus-within { opacity:1;}
        a {
            color: ${fgColor};
            background: ${fgColor}11;
            padding: 4px 8px;
            margin: -4px -8px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
        }
        button {
            border-radius: 8px;
            flex:1;
            background: ${fgColor}11;
            font-weight: bold; 
            xopacity:0.8; 
            color: ${fgColor}; 
            border: none; 
            padding: 16px; 
            display: inline-block;
            border:4px solid ${fgColor}88;
            cursor: pointer;
            outline:none;
            xxbox-shadow:0 0 8px rgba(0,0,0,0.3);
        }
        input:focus, textarea:focus, button:focus {
           border:4px solid ${fgColor}ff;
        }
        input, textarea {
            outline:none;
            border:4px solid ${fgColor}88;
            box-shadow:inset 0 0 8px rgba(0,0,0,0.3);
            resize: none;
            padding:16px;
            border-radius: 8px;
            background: #ffffff;
            color: #000;
        }

        /* Add more styles as needed */
    `;
  shadow.appendChild(style);

  // Update renderState to use shadow root
  const renderState = (state) => {
    if (state === "start") {
      shadow.innerHTML = style.outerHTML + codeStart;
      shadow
        .querySelector("button[aria-label='start']")
        .addEventListener("click", () => renderState("form"));
    } else if (state === "form") {
      shadow.innerHTML = style.outerHTML + codeForm;
      shadow
        .querySelector("button[aria-label='cancel']")
        .addEventListener("click", () => renderState("start"));
      shadow
        .querySelector("button[aria-label='submit']")
        .addEventListener("click", sendFeedback);
      shadow.getElementById(inputId).focus();
    } else if (state === "done") {
      shadow.innerHTML = style.outerHTML + codeDone;
    }
  };

  // Update sendFeedback to use shadow root
  const sendFeedback = () => {
    const name = shadow.getElementById(inputId).value.trim();
    const feedback = shadow.getElementById(textareaId).value.trim();
    if (name === "") {
      shadow.getElementById(inputId).focus();
      return;
    }
    if (feedback === "") {
      shadow.getElementById(textareaId).focus();
      return;
    }

    fetch(feedbakerPostUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        site_id: siteId,
        body: feedback,
        author: name,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Feedback submitted successfully:", data);
        shadow.getElementById(statusId).innerHTML =
          "Feedback Submitted! Thank you.";
      })
      .catch((error) => {
        console.error("Error submitting feedback:", error);
        shadow.getElementById(statusId).innerHTML = "Error Sending Feedback!";
      });

    console.log("Sending feedback:", { name, feedback, siteId });

    renderState("done");
  };

  const codeForm = `
    <div>
        <div style='padding:8px;font-weight:bold;user-select:none;display:flex;gap:8px;justify-content:center;align-items:center;'>
        <div style='flex:1;'>Your Feedback:</div>
        <a href='${feedbakerSitesUrl}' target='_blank' >View All Feedback</a> 
        </div>
        <input id='${inputId}' type='text' placeholder='name'/>
        <textarea id='${textareaId}' placeholder='feedback' rows='3'></textarea>
        <div style='display: flex; gap:16px; justify-content: center;'>
            <button aria-label='cancel'>Cancel</button>
            <button aria-label='submit'>Submit</button>
        </div>
    </div>
`;

  const codeStart = `
    <div style='max-width:fit-content;min-width:fit-content; padding:0px;'>
        <button aria-label='start' style='border:none;background:transparent;cursor:pointer;'>
        <svg xmlns="http://www.w3.org/2000/svg" width="2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-bread"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 4a3 3 0 0 1 2 5.235v8.765a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-8.764a3 3 0 0 1 1.824 -5.231h12.176v-.005z" /></svg>
        
        </button></div>`;

  const codeDone = `
        <div style='width:fit-content;'>
            <div id='${statusId}' style='padding:8px;font-weight:bold;user-select: none;'>Sending Feedback...</div>
        </div>`;

  document.addEventListener("DOMContentLoaded", function () {
    document.body.appendChild(holder);
    renderState("start");
  });
})();
