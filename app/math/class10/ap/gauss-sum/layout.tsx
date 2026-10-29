import type { Metadata } from "next";
import "katex/dist/katex.min.css";
import "./gauss.css";

export const metadata: Metadata = {
  title: "The Gauss Lab | Aishwaryam Lab",
  description:
    "A 35-minute, interactive Class X NCERT discovery lesson: from equal pairs to the sum of an arithmetic progression.",
};

export default function GaussLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
