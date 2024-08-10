export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center w-full justify-center gap-4 py-8 md:py-10">
      {children}
    </section>
  );
}
