import { Inter } from "next/font/google";
import Providers from "./Providers";
import "@/styles/index.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Jettura – Dein KI-Reiseplaner",
  description:
    "Finde günstige Flüge, Hotels und eSIMs. Dein KI-gestützter Reiseplaner für smarte Reisen.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
