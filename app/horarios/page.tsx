import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { HorariosView } from "../../components/HorariosView";

function HorariosLoading() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f4f8fc] text-brand-primary">
      <Loader2 className="animate-spin" size={28} />
    </main>
  );
}

export default function HorariosPage() {
  return (
    <Suspense fallback={<HorariosLoading />}>
      <HorariosView />
    </Suspense>
  );
}
