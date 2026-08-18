import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const stats = [
  { label: "Total forms", value: "24", change: "+3 this month" },
  { label: "Submissions", value: "1,204", change: "+18.2%" },
  { label: "Completion rate", value: "76%", change: "+4.1%" },
  { label: "Active templates", value: "9", change: "+1 this month" },
];

export default function DashboardPage() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader>
            <CardDescription>{stat.label}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {stat.value}
            </CardTitle>
            <CardAction>
              <Badge variant="secondary">{stat.change}</Badge>
            </CardAction>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
