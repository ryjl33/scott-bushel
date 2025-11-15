import { Card, CardContent } from "@/components/ui/card";

interface InsightCardProps {
  insight: string;
}

export const InsightCard = ({ insight }: InsightCardProps) => {
  return (
    <Card className="card-hover">
      <CardContent className="p-4">
        <p className="text-sm leading-relaxed">{insight}</p>
      </CardContent>
    </Card>
  );
};
