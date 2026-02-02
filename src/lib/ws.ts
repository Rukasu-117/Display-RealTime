export function sendWsEvent(displayId: string, event: string) {
  console.log("➡️ sendWsEvent CHAMADO", displayId, event);

  fetch("http://192.168.0.129:8090/emit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ displayId, event }),
  }).catch((err) => {
    console.error("❌ ERRO FETCH WS:", err);
  });
}
