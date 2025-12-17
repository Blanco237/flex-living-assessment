"use client";

import { useState, useRef, useEffect } from "react";
import type { Review } from "@/types";
import { Star } from "lucide-react";
import { format } from "date-fns";

interface PublicReviewCardProps {
  review: Review;
}

export function PublicReviewCard({ review }: PublicReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current && !isExpanded) {
        const hasOverflowContent =
          textRef.current.scrollHeight > textRef.current.clientHeight;
        setHasOverflow(hasOverflowContent);
      }
    };

    const timeoutId = setTimeout(checkOverflow, 0);

    window.addEventListener("resize", checkOverflow);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", checkOverflow);
    };
  }, [review.review, isExpanded]);

  return (
    <div className="space-y-3 pb-6 ">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-base">{review.guestName}</span>
            <span className="text-gray-500">·</span>
            <span className="text-sm text-gray-600">
              {format(new Date(review.submittedAt), "MMMM yyyy")}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(review.rating)
                    ? "fill-black text-black"
                    : "fill-none text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="text-sm leading-relaxed text-gray-700">
        <p ref={textRef} className={isExpanded ? "" : "line-clamp-3"}>
          {review.review}
        </p>
        {hasOverflow && !isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="text-blue-600 hover:underline mt-1"
          >
            Show more
          </button>
        )}
        {hasOverflow && isExpanded && (
          <button
            onClick={() => setIsExpanded(false)}
            className="text-blue-600 hover:underline mt-2 block"
          >
            Show less
          </button>
        )}
      </div>
    </div>
  );
}
