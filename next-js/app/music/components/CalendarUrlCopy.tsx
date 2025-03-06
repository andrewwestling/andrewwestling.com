"use client";

import { Button } from "@components/Button";
import { useState, useEffect, useRef } from "react";

export function CalendarUrlCopy({ calendarUrl }: { calendarUrl: string }) {
  const [copied, setCopied] = useState(false);
  const urlInputRef = useRef<HTMLInputElement>(null);

  const copyToClipboard = async () => {
    try {
      // Try the modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(calendarUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      }

      // Fallback for iOS and older browsers
      if (urlInputRef.current) {
        urlInputRef.current.select();
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  return (
    <div className="w-full">
      {/* URL Copy Section */}
      <div className="flex items-center gap-2 rounded-md border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-2">
        <div className="flex-1 relative">
          <code className="text-sm break-all">{calendarUrl}</code>
          <input
            ref={urlInputRef}
            type="text"
            value={calendarUrl}
            readOnly
            className="sr-only"
          />
        </div>
        <Button
          onClick={copyToClipboard}
          className="shrink-0 min-w-[90px] rounded-md bg-surface dark:bg-surface-dark px-2 py-1 text-sm border border-border dark:border-border-dark flex items-center justify-center gap-1"
        >
          {copied ? <>Copied!</> : <>Copy URL</>}
        </Button>
      </div>
    </div>
  );
}
