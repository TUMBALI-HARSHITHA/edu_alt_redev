import { describe, it, expect, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useIsMobile } from "../useIsMobile";
function setViewport(width) {
  window.innerWidth = width;
  window.matchMedia = (query) => ({
    matches: width < 768,
    media: query,
    onchange: null,
    addListener: () => {
    },
    removeListener: () => {
    },
    addEventListener: () => {
    },
    removeEventListener: () => {
    },
    dispatchEvent: () => false
  });
}
describe("useIsMobile", () => {
  beforeEach(() => {
    setViewport(1024);
  });
  it("returns false on desktop viewport", () => {
    setViewport(1024);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });
  it("returns true on mobile viewport", () => {
    setViewport(375);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });
  it("uses custom breakpoint", () => {
    setViewport(800);
    const { result } = renderHook(() => useIsMobile(1024));
    expect(result.current).toBe(true);
  });
});
