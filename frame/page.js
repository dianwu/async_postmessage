import { setupMessageHandler } from "messagehandler";

export function getTime() {
  return Date.now();
}

function messageAgent(evt) {
  const { action } = evt.data;

  switch (action) {
    case "getTime":
      return { time: getTime() };
      break;
    default:
  }

  return;
}

setupMessageHandler({
  name: "page",
  messageAgent,
});
