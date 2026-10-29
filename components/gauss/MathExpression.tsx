import katex from "katex";

export function MathExpression({
  tex,
  className = "",
  display = true,
}: {
  tex: string;
  className?: string;
  display?: boolean;
}) {
  return (
    <span
      className={`ap-math ${className}`}
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(tex, {
          displayMode: display,
          throwOnError: false,
          output: "htmlAndMathml",
          strict: "ignore",
        }),
      }}
    />
  );
}
