export function ShamoolFooter() {
  return (
    <footer className="mx-auto mt-16 max-w-3xl border-t border-neutral-200 px-6 py-8">
      <p className="text-sm leading-relaxed text-neutral-700">
        🤲 25% of our sales go to the{" "}
        <span className="font-medium">Shamool Foundation</span> in Lahore —
        funding free education, learning materials, and daily meals for
        underprivileged children.{" "}
        <a
          href="https://shamoolfoundation.com"
          className="text-neutral-900 underline underline-offset-2 hover:no-underline"
          rel="noopener"
        >
          → Learn more
        </a>
      </p>
    </footer>
  );
}
