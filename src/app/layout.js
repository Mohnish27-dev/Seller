import "./globals.css";
import { Poppins } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Ladies Garments - Beautiful Fashion for Women",
  description: "Shop the latest collection of ladies garments - Salwar, Suits, Kurti, Maxi, Gown, Leggings and more. Quality fabrics at affordable prices.",
  keywords: "ladies garments, women fashion, salwar, suit, kurti, maxi, gown, legging, online shopping",
  openGraph: {
    title: "Ladies Garments - Beautiful Fashion for Women",
    description: "Shop the latest collection of ladies garments",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} min-h-screen flex flex-col`}>
        <Providers>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
