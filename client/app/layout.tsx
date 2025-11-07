import "./globals.css";

import { Toaster } from "react-hot-toast";
import { getUser } from "@/lib/providers/auth";
import { AuthProvider } from "@/lib/providers/AuthContext";
import NavBar from "@/components/NavBar";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  DehydratedState,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/queryKeys";
import { ReactQueryProvider } from "@/lib/react-query/ReactQueryProvider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  const queryClient = new QueryClient();
  queryClient.setQueryData(queryKeys.users.all, user);
  const dehydratedState: DehydratedState = dehydrate(queryClient);

  return (
    <html lang="en">
      <body className="bg-gray-900 flex flex-col min-h-dvh">
        <ReactQueryProvider dehydratedState={dehydratedState}>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <AuthProvider user={user}>
              <Toaster position="top-right" />
              <NavBar />

              <div className="grid bg-gray-200 gap-1 flex-1">{children}</div>

              <footer className="min-w-xs text-white text-sm text-center p-4">
                Feedbaker by Svetlana Teryaeva
                <br />
                2025
              </footer>
            </AuthProvider>
          </HydrationBoundary>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
