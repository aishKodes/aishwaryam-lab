export default function GaussLoading() {
  return (
    <main
      className="ap-lab"
      style={{ padding: 40, justifyContent: "center", alignItems: "center" }}
      aria-busy="true"
    >
      <p role="status">Preparing the Gauss Lab…</p>
    </main>
  );
}
