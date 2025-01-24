"use client";

import { Button } from "@/app/components/Button";
import { useState, useEffect, useRef } from "react";
import { SectionHeading } from "./SectionHeading";

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
  </svg>
);

export function CalendarSubscribePopover({
  calendarUrl,
}: {
  calendarUrl: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scrolling when popover is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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
    <div className="relative" ref={popoverRef}>
      <Button onClick={() => setIsOpen(!isOpen)}>
        📆 Subscribe in Calendar App
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 dark:bg-black/40"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div className="fixed inset-x-0 top-4 z-50 mx-4 overflow-hidden rounded-lg sm:absolute sm:right-0 sm:left-auto sm:mx-0 sm:w-[min(50rem,calc(100vw-4rem))]">
            <div className="flex flex-col overflow-hidden rounded-lg bg-background dark:bg-surface-dark shadow-lg ring-1 ring-border dark:ring-border-dark">
              {/* Header - Fixed */}
              <div className="flex shrink-0 items-center justify-between border-b border-highlight dark:border-highlight-dark px-4 py-3">
                <SectionHeading>Subscribe to Calendar</SectionHeading>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-md p-1 hover:bg-surface dark:hover:bg-surface-dark"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Content - Scrollable */}
              <div className="max-h-[calc(100vh-8rem)] overflow-y-auto overscroll-contain p-4">
                <div className="flex flex-col gap-4">
                  <p>
                    Use this URL in your calendar app to keep track of my
                    upcoming concerts.
                  </p>
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

                  {/* Instructions Toggle */}
                  <button
                    onClick={() => setShowInstructions(!showInstructions)}
                    className="flex items-center justify-between underline w-fit"
                  >
                    How to Subscribe
                  </button>

                  {/* Instructions Content */}
                  {showInstructions && (
                    <div className="text-sm">
                      <div className="space-y-6">
                        <div>
                          <h5 className="font-medium mb-2">
                            Apple Calendar (iOS/macOS):
                          </h5>
                          <ol className="ml-4 list-decimal space-y-1">
                            <li>{`Open Calendar app`}</li>
                            <li>
                              <span className="sm:hidden">
                                {/* Show on small screens, assuming the user is on an iPhone */}
                                {`Tap Calendars → Add Calendar → Add Subscription`}
                              </span>
                              <span className="hidden sm:inline">
                                {/* Show to desktop users, assuming the user is on a Mac */}
                                {`Go to File → New Calendar Subscription`}
                              </span>
                            </li>
                            <li>{`Paste the URL above`}</li>
                            <li>{`Click Subscribe`}</li>
                          </ol>
                        </div>

                        <div>
                          <h5 className="font-medium mb-2">Google Calendar:</h5>
                          <ol className="ml-4 list-decimal space-y-1">
                            <li>{`Open Google Calendar`}</li>
                            <li>{`Click the + next to "Other calendars"`}</li>
                            <li>{`Select "From URL"`}</li>
                            <li>{`Paste the URL above`}</li>
                            <li>{`Click "Add calendar"`}</li>
                          </ol>
                        </div>

                        <div>
                          <h5 className="font-medium mb-2">Outlook:</h5>
                          <ol className="ml-4 list-decimal space-y-1">
                            <li>{`Open Outlook Calendar`}</li>
                            <li>
                              {`Click "Add Calendar" → "Subscribe from web"`}
                            </li>
                            <li>{`Paste the URL above`}</li>
                            <li>{`Click "OK"`}</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
