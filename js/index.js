import {
  setupMessageHandler,
  awaitPostMessage,
  setHostName,
} from "messagehandler";

setupMessageHandler({
  name: "main",
  messageAgent: () => {},
});

const button = document.querySelector("input");
const iframe = document.querySelector("iframe").contentWindow;

async function postMessage() {
  console.time("postMessage");
  const result = await awaitPostMessage(iframe, {
    meesage: "hello",
    action: "getTime",
  });
  console.timeEnd("postMessage");
  console.log("postMessage result", result);
}

function clickHandler(e) {
  const { fn } = e.target.dataset;

  switch (fn) {
    case "postMessage":
      postMessage();
      break;
    default:
  }
}

button.addEventListener("click", clickHandler);
