let agent = (value) => value;

function genMessageChannel() {
  return new MessageChannel();
}

function agentProcess(data) {
  return agent(data);
}

function onMessage(evt) {
  if (evt.origin !== location.origin) {
    return;
  }

  console.log(`[${hostname}] onMessage`, evt);
  const response = agentProcess(evt);

  const messagePort = evt.ports?.[0];

  if (messagePort) {
    messagePort.postMessage(response);
  }
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

export function setupMessageHandler({ name = "", messageAgent } = {}) {
  console.log(name + " setupMessageHandler.....");
  window.addEventListener("message", onMessage);
  setHostName(name);
  setMessageAgent(messageAgent);
}

export async function awaitPostMessage(target, opt) {
  console.log(`[${hostname}] awaitPostMessage`);
  const msgChannel = genMessageChannel();
  const p = new Promise((reslove) => {
    msgChannel.port1.onmessage = (result) => {
      reslove(result);
      msgChannel.port1.close();
      msgChannel.port2.close();
    };
  });

  target.postMessage(opt, location.origin, [msgChannel.port2]);
  return p;
}
