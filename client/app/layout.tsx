import "./globals.css";

import { getUser } from "@/lib/providers/auth";
import NavBar from "@/components/NavBar";
import { AppProviders } from "@/lib/providers/AppProviders";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg" sizes="any" />
      </head>
      <body className="bg-gray-900 flex flex-col min-h-dvh">
        <AppProviders user={user}>
          <NavBar />
          <div className="grid bg-gray-200 gap-1 flex-1">{children}</div>
          <footer className="min-w-xs bg-black text-white text-sm text-center p-4">
            Feedbaker by Svetlana Teryaeva
            <br />
            2025
          </footer>
          <ReactQueryDevtools initialIsOpen={false} />
        </AppProviders>
      </body>
    </html>
  );
}
