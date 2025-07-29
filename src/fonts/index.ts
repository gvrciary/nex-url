import localFont from "next/font/local";

export const generalSansVariable = localFont({
  variable: "--font-general-variable",
  src: "./GeneralSansVariable.woff2",
  weight: "100 900",
  display: "swap",
  preload: true,
});