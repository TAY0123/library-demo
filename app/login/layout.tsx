export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex w-full flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg w-full">{children}</div>
    </section>
  );
}
