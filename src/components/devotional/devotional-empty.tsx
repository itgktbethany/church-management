import {
  Card,
  CardContent,
} from "@/components/ui/card";

export default function DevotionalEmpty() {
  return (
    <Card>
      <CardContent className="flex min-h-[300px] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            No devotional today
          </h1>

          <p className="mt-2 text-muted-foreground">
            Please come back tomorrow.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}