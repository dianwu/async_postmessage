const iframeWindow = document.querySelector("iframe").contentWindow;
// 新增 messageId 區分訊息
let messageId = 0;

// callback promise map
const callbackPromise = {};

window.addEventListener("message", (msgEvt) => {
  const { message, messageId } = msgEvt.data;
  // 把收到的 data 送進對應的 messageId callbackPromise
  if (messageId && callbackPromise[messageId]) {
    callbackPromise[messageId](msgEvt.data);
    delete callbackPromise[messageId];
  }
});

function getMsgId() {
  messageId += 1;
  return "msg_" + messageId;
}

// 把 function 加上 async 設定，以及回傳一個 promise
async function postMessageWrap(msg) {
  const msgId = getMsgId();

  const p = new Promise((reslove) => {
    callbackPromise[msgId] = (result) => {
      reslove(result);
    };
  });

  iframeWindow.postMessage(
    {
      type: "awaitppostmessage",
      message: msg,
      messageId: msgId,
    },
    location.origin
  );

  // 回傳 promise
  return p;
}

setTimeout(async () => {
  const result1 = await postMessageWrap("Hello iframe. Give me a number.");
  console.log(`[iframe -> main][${result1.messageId}]: ${result1.message}`);
  const result2 = await postMessageWrap("Hello iframe. Give me a number.");
  console.log(`[iframe -> main][${result2.messageId}]: ${result2.message}`);
}, 2000);
// 使用包裝過的 postMessage function
