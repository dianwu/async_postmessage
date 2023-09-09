const MESSAGE_TYPE = {
  CALLBACK: "CALLBACK",
};
const callbackPromise = {};
let messageIndex = 0;
function getMessageIndex() {
  messageIndex += 1;
  return "msg_" + messageIndex;
}

export function postMessage(target, opt) {
  console.log(`[${hostname}] postMessage`);
  target.postMessage(opt, location.origin);
}

export async function awaitPostMessage(target, opt) {
  console.log(`[${hostname}] awaitPostMessage`);
  const msgIndex = getMessageIndex();
  const p = new Promise((reslove) => {
    callbackPromise[msgIndex] = (result) => {
      console.log(`[${hostname}] callbackPromise`, result);
      reslove(result);
    };
  });

  target.postMessage({ ...opt, msgIndex }, location.origin);
  return p;
}

let agent = (value) => value;
function agentProcess(data) {
  return agent(data);
}

function onMessage(evt) {
  if (evt.origin !== location.origin) {
    return;
  }

  console.log(`[${hostname}] onMessage`, evt.data);

  const { messageType, msgIndex } = evt.data;
  const response = agentProcess(evt);

  if (msgIndex && callbackPromise[msgIndex]) {
    callbackPromise[msgIndex](evt.data);
    delete callbackPromise[msgIndex];
  }

  if (msgIndex && messageType !== MESSAGE_TYPE.CALLBACK) {
    postMessage(evt.source, {
      ...response,
      messageType: MESSAGE_TYPE.CALLBACK,
      msgIndex,
    });
  }

  console.log(`[${hostname}] onMessage`, evt.data);
}

export function setupMessageHandler({ name = "", messageAgent } = {}) {
  window.addEventListener("message", onMessage);
  setHostName(name);
  setMessageAgent(messageAgent);
}

let hostname = "";
export function setHostName(name) {
  console.log("setHostName", name, location.origin);
  hostname = name;
}

export function setMessageAgent(newAgent) {
  if (typeof newAgent === "function") {
    agent = newAgent;
  }
}
