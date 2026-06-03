"use client";

import type { DisplayWithContents } from "@/types/display";
import {
  getNextIndex,
  getSyncDelay,
  shouldLoopSingleVideo,
} from "@/lib/display-runtime";
import { useCallback, useEffect, useMemo, useState } from "react";

function toCssAspectRatio(aspectRatio: string) {
  return aspectRatio.replace(":", " / ");
}

export default function DisplayClient({
  display,
}: {
  display: DisplayWithContents;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rotation, setRotation] = useState(display.rotation);
  const [contents, setContents] = useState(display.contents);
  const [aspectRatio, setAspectRatio] = useState(display.aspectRatio);
  const [mediaRevision, setMediaRevision] = useState(0);
  const [pendingAdvanceIndex, setPendingAdvanceIndex] = useState<number | null>(
    null
  );
  const [scheduledSyncIndex, setScheduledSyncIndex] = useState<number | null>(
    null
  );
  const [nextVideoReady, setNextVideoReady] = useState(false);
  const current = contents[currentIndex];
  const nextIndex = useMemo(
    () => getNextIndex(currentIndex, contents.length),
    [currentIndex, contents.length]
  );
  const next = contents[nextIndex];
  const isSingleVideoLoop = shouldLoopSingleVideo(
    current?.type,
    contents.length
  );

  const restartPlayback = useCallback((index = 0) => {
    setScheduledSyncIndex(null);
    setPendingAdvanceIndex(null);
    setNextVideoReady(false);
    setCurrentIndex(index);
    setMediaRevision((revision) => revision + 1);
  }, []);

  const advanceToIndex = useCallback((index: number) => {
    setPendingAdvanceIndex(null);
    setNextVideoReady(false);
    setCurrentIndex(index);
    setMediaRevision((revision) => revision + 1);
  }, []);

  const requestAdvance = useCallback(() => {
    if (!current) {
      return;
    }

    if (nextIndex === currentIndex) {
      restartPlayback(currentIndex);
      return;
    }

    if (next?.type === "video" && !nextVideoReady) {
      setPendingAdvanceIndex(nextIndex);
      return;
    }

    advanceToIndex(nextIndex);
  }, [advanceToIndex, current, currentIndex, next?.type, nextIndex, nextVideoReady, restartPlayback]);

  useEffect(() => {
    setPendingAdvanceIndex(null);
    setNextVideoReady(false);
  }, [currentIndex, mediaRevision, nextIndex]);

  useEffect(() => {
    if (!current || current.type === "video") {
      return;
    }

    const duration = current.duration ?? 10000;
    const timer = window.setTimeout(() => {
      requestAdvance();
    }, duration);

    return () => window.clearTimeout(timer);
  }, [current, mediaRevision, nextIndex, next?.type, nextVideoReady, requestAdvance]);

  useEffect(() => {
    if (pendingAdvanceIndex === null) {
      return;
    }

    if (pendingAdvanceIndex === nextIndex && nextVideoReady) {
      advanceToIndex(pendingAdvanceIndex);
    }
  }, [advanceToIndex, nextIndex, nextVideoReady, pendingAdvanceIndex]);

  useEffect(() => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!);
    let syncTimer: number | undefined;

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

      if (data.event === "DISPLAY_SYNC_REQUESTED") {
        const startAt = Number(data.payload?.startAt);
        const restartFromIndex = Number(data.payload?.restartFromIndex ?? 0);

        if (Number.isFinite(startAt)) {
          const delay = getSyncDelay(startAt, Date.now());
          setScheduledSyncIndex(restartFromIndex);

          if (syncTimer) {
            window.clearTimeout(syncTimer);
          }

          syncTimer = window.setTimeout(() => {
            restartPlayback(restartFromIndex);
          }, delay);
        }

        return;
      }

      if (
        data.event?.startsWith("CONTENT_") ||
        data.event === "DISPLAY_UPDATED"
      ) {
        fetch(`/api/display/${display.id}`, {
          cache: "no-store",
        })
          .then(async (res) => {
            if (!res.ok) {
              throw new Error("Falha ao atualizar o display");
            }

            return res.json();
          })
          .then((updated) => {
            const updatedContents = Array.isArray(updated.contents)
              ? updated.contents
              : [];

            setContents(updatedContents);
            setRotation(updated.rotation);
            setAspectRatio(updated.aspectRatio ?? display.aspectRatio);
            restartPlayback(updatedContents.length > 0 ? 0 : 0);
          })
          .catch((error) => {
            console.error("DISPLAY REFRESH ERROR:", error);
            setContents([]);
          });
      }
    };

    return () => {
      if (syncTimer) {
        window.clearTimeout(syncTimer);
      }

      ws.close();
    };
  }, [display.aspectRatio, display.id, restartPlayback]);

  if (!current) {
    return (
      <div className="display-runtime flex items-center justify-center text-sm text-white/70">
        Nenhum conteudo disponivel para este display.
      </div>
    );
  }

  return (
    <div className="display-runtime flex items-center justify-center">
      <div
        className="relative bg-black"
        style={{
          aspectRatio: toCssAspectRatio(aspectRatio),
          height: "100%",
          transform: `rotate(${rotation}deg)`,
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {current.type === "image" && (
            <img
              key={`${current.id}-${mediaRevision}`}
              src={`${current.filePath}?v=${current.id}`}
              className="h-full w-full object-contain"
              alt=""
            />
          )}

          {current.type === "video" && (
            <video
              key={`${current.id}-${mediaRevision}`}
              src={`${current.filePath}?v=${current.id}`}
              autoPlay
              muted
              playsInline
              preload="auto"
              loop={isSingleVideoLoop}
              className="h-full w-full object-contain"
              onEnded={(event) => {
                if (isSingleVideoLoop) {
                  event.currentTarget.currentTime = 0;
                  void event.currentTarget.play();
                  return;
                }

                requestAdvance();
              }}
            />
          )}

          {current.type === "pdf" && (
            <iframe
              key={`${current.id}-${mediaRevision}`}
              src={`${current.filePath}?v=${current.id}`}
              className="h-full w-full"
              title="Conteudo em PDF"
            />
          )}
        </div>

        {next?.type === "video" && nextIndex !== currentIndex && (
          <video
            key={`preload-${next.id}-${mediaRevision}`}
            src={`${next.filePath}?v=${next.id}`}
            muted
            playsInline
            preload="auto"
            className="hidden"
            onCanPlay={() => {
              setNextVideoReady(true);
            }}
          />
        )}

        {scheduledSyncIndex !== null &&
          contents[scheduledSyncIndex]?.type === "video" &&
          scheduledSyncIndex !== currentIndex && (
            <video
              key={`sync-preload-${contents[scheduledSyncIndex].id}-${mediaRevision}`}
              src={`${contents[scheduledSyncIndex].filePath}?v=${contents[scheduledSyncIndex].id}`}
              muted
              playsInline
              preload="auto"
              className="hidden"
            />
          )}
      </div>
    </div>
  );
}
