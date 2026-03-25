"use client";

import type { DisplayWithContents } from "@/types/display";
import { useEffect, useState } from "react";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL!;

export default function DisplayClient({
  display,
}: {
  display: DisplayWithContents;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rotation, setRotation] = useState(display.rotation);
  const [contents, setContents] = useState(display.contents);
  const current = contents[currentIndex];

  // 🔁 Player (rotação automática)
    useEffect(() => {
        if (!current) return;

        const duration = current.duration ?? 10000;

        const timer = setTimeout(() => {
          setCurrentIndex((prev) =>
            prev + 1 >= contents.length ? 0 : prev + 1
          );
        }, duration);

        return () => clearTimeout(timer);
      }, [currentIndex, current, contents.length]);

      

    // 🔌 WebSocket (Realtime)
    useEffect(() => {
      
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!);

    ws.onopen = () => {
      console.log("🟢 WS CONECTADO");
      ws.send(
        JSON.stringify({
          type: "JOIN_DISPLAY",
          displayId: display.id,
        })
      );
    };

    ws.onmessage = (event) => {
      console.log("📨 WS RECEBIDO:", event.data);
      const data = JSON.parse(event.data);

      if (
        data.event?.startsWith("CONTENT_") ||
        data.event === "DISPLAY_UPDATED"
      ) {
      fetch(`/api/display/${display.id}`, {
        cache: "no-store",
      })
        .then((res) => res.json())
        .then((updated) => {
          setContents(updated.contents);
          setRotation(updated.rotation);
          setCurrentIndex(0);
        });

      }
    };


    return () => ws.close();
  }, [display.id]);


  return (
  <div className="display-runtime flex items-center justify-center">
    <div
      className="relative bg-black"
      style={{
        aspectRatio: "16 / 9",
        height: "100%",
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {current?.type === "image" && (
          <img
            src={`${current.filePath}?v=${current.id}`}
            className="w-full h-full object-contain"
          />
        )}

        {current?.type === "video" && (
          <video
            src={`${current.filePath}?v=${current.id}`}
            autoPlay
            muted
            className="w-full h-full object-contain"
          />

        )}

        {current?.type === "pdf" && (
          <iframe
            src={`${current.filePath}?v=${current.id}`}
            className="w-full h-full"
          />
        )}
      </div>
    </div>
  </div>
);

}
