import { DispatchProvider } from "./DispatchContext";

export default function DispatchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DispatchProvider>{children}</DispatchProvider>;
}
