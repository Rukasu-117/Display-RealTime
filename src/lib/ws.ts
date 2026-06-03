export function sendWsEvent(
  displayId: string,
  event: string,
  payload?: Record<string, unknown>
) {
  console.log("➡️ sendWsEvent CHAMADO", displayId, event);

  fetch("http://192.168.0.129:8090/emit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ displayId, event, payload: payload ?? null }),
  }).catch((err) => {
    console.error("❌ ERRO FETCH WS:", err);
  });
}
