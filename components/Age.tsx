"use client";
import { useEffect, useRef } from "react";
import { startLifespanSecondsTicker, parseDob, LifespanOptions } from "./age";

type Props = Omit<LifespanOptions, "fps"> & { className?: string; fps?: number };

export default function Age({ dob, expectancyYears = 80, fps = 10, className }: Props) {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!spanRef.current) return;
    const stop = startLifespanSecondsTicker(spanRef.current, {
      dob: parseDob(dob),
      expectancyYears,
      fps,
    });
    return () => stop();
  }, [dob, expectancyYears, fps]);

  return <span ref={spanRef} className={className ?? "text-accent font-semibold"} />;
}
