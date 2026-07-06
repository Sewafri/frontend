import { Navbar } from "./_components/navbar";
import Footer from "./_components/footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#000000]">
      <Navbar />
      <main className="pt-24">{children}</main>
      <Footer />
    </div>
  );
}
