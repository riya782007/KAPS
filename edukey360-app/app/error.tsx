"use client";
import { useEffect } from "react";
import { RotateCcw } from "lucide-react";

/**
 * Route error boundary. The most common cause of a client-side exception in a
 * freshly-redeployed app is a STALE CHUNK: a browser tab opened on the previous
 * deploy tries to lazy-load a JS chunk whose hash changed in the new deploy.
 * We detect that and reload once to pull the fresh assets — self-healing.
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    const msg = error?.message || "";
    const isChunk = /ChunkLoadError|Loading chunk|dynamically imported module|Importing a module script failed|Failed to fetch/i.test(msg);
    if (isChunk && typeof window !== "undefined") {
      const key = "ek360-chunk-reload";
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, "1");
        window.location.reload();
        return;
      }
    }
  }, [error]);

  return (
    <div className="min-h-[70vh] grid place-items-center px-6">
      <div className="card p-8 max-w-md text-center">
        <div className="w-12 h-12 rounded-2xl grid place-items-center text-white mx-auto mb-4" style={{ background: "linear-gradient(135deg,var(--brand),var(--cyan))" }}>
          <RotateCcw size={22} />
        </div>
        <h2 className="text-xl font-extrabold tracking-tight">Refreshing the workspace…</h2>
        <p className="muted text-sm mt-2">A new version just went live. Reload to get the latest — your data is safe.</p>
        <button className="btn btn-primary mt-5 mx-auto" onClick={() => { try { sessionStorage.removeItem("ek360-chunk-reload"); } catch {} reset(); window.location.reload(); }}>
          <RotateCcw size={15} /> Reload now
        </button>
      </div>
    </div>
  );
}
