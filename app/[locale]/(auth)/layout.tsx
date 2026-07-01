export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5F5F5] px-4 py-10">
      {children}
    </main>
  );
}
