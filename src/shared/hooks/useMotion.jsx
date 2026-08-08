import React from "react";
import { motion } from "framer-motion";
import { useIsMobile } from "./useIsMobile";
function withoutAnimationProps(props) {
  const animKeys = ["initial", "animate", "whileInView", "viewport", "transition", "whileHover", "exit", "layout", "variants", "onAnimationComplete"];
  const rest = {};
  for (const key of Object.keys(props)) {
    if (!animKeys.includes(key)) {
      rest[key] = props[key];
    }
  }
  return rest;
}
const MotionDiv = ({ children, ...props }) => {
  const isMobile = useIsMobile();
  if (isMobile) {
    return React.createElement("div", withoutAnimationProps(props), children);
  }
  return React.createElement(motion.div, props, children);
};
const MotionH1 = ({ children, ...props }) => {
  const isMobile = useIsMobile();
  if (isMobile) {
    return React.createElement("h1", withoutAnimationProps(props), children);
  }
  return React.createElement(motion.h1, props, children);
};
const MotionP = ({ children, ...props }) => {
  const isMobile = useIsMobile();
  if (isMobile) {
    return React.createElement("p", withoutAnimationProps(props), children);
  }
  return React.createElement(motion.p, props, children);
};
export {
  MotionDiv,
  MotionH1,
  MotionP
};
