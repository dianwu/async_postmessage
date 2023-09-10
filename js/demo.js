const iframeWindow = document.querySelector("iframe").contentWindow;

function genMessageChannel() {
  return new MessageChannel();
}

let messageId = 0;
// 把 function 加上 async 設定，以及回傳一個 promise
async function postMessageWrap(msg) {
  const msgChannel = genMessageChannel();
  const p = new Promise((reslove) => {
    msgChannel.port1.onmessage = (evt) => {
      reslove(evt.data);
      msgChannel.port1.close();
      msgChannel.port2.close();
    };
  });

  iframeWindow.postMessage(
    {
      type: "awaitpostmessage",
      message: msg,
      messageId: ++messageId,
    },
    location.origin,
    [msgChannel.port2]
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
