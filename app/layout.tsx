import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ConfigureAmplify from './components/ConfigureAmplify';
import AuthenticatorWrapper from "./AuthenticatorWrapper";
import "@aws-amplify/ui-react/styles.css";
import "./app.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "S3 Image & Document Processor",
  description: "Procesador de imágenes y documentos con IA nativa",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConfigureAmplify />
        <AuthenticatorWrapper>{children}</AuthenticatorWrapper>
      </body>
    </html>
  );
}
