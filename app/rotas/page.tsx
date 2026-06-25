import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { RotasView } from "../../components/RotasView";

function RotasLoading() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f4f8fc] text-brand-primary">
      <Loader2 className="animate-spin" size={28} />
    </main>
  );
}

export default function RotasPage() {
  return (
    <Suspense fallback={<RotasLoading />}>
      <RotasView />
    </Suspense>
  );
}
