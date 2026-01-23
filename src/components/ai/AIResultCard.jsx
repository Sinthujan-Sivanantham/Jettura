import { Card, CardContent } from "@/components/ui/card";
import ResultHeader from "./result/ResultHeader";
import ResultItinerary from "./result/ResultItinerary";
import ResultMapPreview from "./result/ResultMapPreview";

export default function AIResultCard({ route }) {
  return (
    <Card className="overflow-hidden border-none bg-white dark:bg-zinc-900 shadow-2xl rounded-[3rem]">

      <ResultHeader route={route} />

      <CardContent className="p-0 grid grid-cols-1 lg:grid-cols-2">
        <ResultItinerary steps={route.steps} />
        <ResultMapPreview route={route} />
      </CardContent>
    </Card>
  );
}