import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { RecargaView } from "./RecargaView";

function RecargaLoading() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f4f8fc] text-brand-primary">
      <Loader2 className="animate-spin" size={28} />
    </main>
  );
}

export default function RecargaPage() {
  return (
    <Suspense fallback={<RecargaLoading />}>
      <RecargaView />
    </Suspense>
  );
}
