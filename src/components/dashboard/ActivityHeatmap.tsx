import { useMemo } from "react";
import { useContributionActivity, type ActivityDay } from "@/hooks/useContributions";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const WEEKS = 52;
const DAYS = 7;
const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];
const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 10) return 3;
  return 4;
}

const LEVEL_CLASSES = [
  "bg-muted/50",
  "bg-primary/20",
  "bg-primary/40",
  "bg-primary/60",
  "bg-primary/90",
];

export function ActivityHeatmap() {
  const { data: activity, isLoading } = useContributionActivity();

  const { grid, monthPositions } = useMemo(() => {
    const actMap = new Map<string, ActivityDay>();
    activity?.forEach((a) => actMap.set(a.activity_date, a));

    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - WEEKS * 7 + 1);
    // Align to Sunday
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const grid: { date: string; count: number; level: number }[][] = [];
    const monthPositions: { label: string; col: number }[] = [];
    let lastMonth = -1;

    for (let w = 0; w < WEEKS; w++) {
      const week: typeof grid[0] = [];
      for (let d = 0; d < DAYS; d++) {
        const current = new Date(startDate);
        current.setDate(current.getDate() + w * 7 + d);
        const dateStr = current.toISOString().split("T")[0];
        const dayData = actMap.get(dateStr);
        const count = dayData?.total_count ?? 0;

        if (d === 0 && current.getMonth() !== lastMonth) {
          lastMonth = current.getMonth();
          monthPositions.push({ label: MONTH_LABELS[lastMonth], col: w });
        }

        week.push({ date: dateStr, count, level: getLevel(count) });
      }
      grid.push(week);
    }

    return { grid, monthPositions };
  }, [activity]);

  if (isLoading) {
    return <div className="h-32 rounded-xl border border-border bg-card/50 animate-pulse" />;
  }

  return (
    <div className="rounded-xl border border-border bg-card/50 p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Contribution Activity</h3>
      <div className="overflow-x-auto">
        <div className="inline-flex flex-col gap-1 min-w-fit">
          {/* Month labels */}
          <div className="flex ml-8">
            {monthPositions.map((m, i) => (
              <span
                key={i}
                className="text-[10px] text-muted-foreground"
                style={{ position: "relative", left: `${m.col * 14}px`, marginRight: "-10px" }}
              >
                {m.label}
              </span>
            ))}
          </div>

          <div className="flex gap-[1px]">
            {/* Day labels */}
            <div className="flex flex-col gap-[1px] mr-1 justify-start">
              {DAY_LABELS.map((label, i) => (
                <span key={i} className="text-[10px] text-muted-foreground h-[12px] w-6 leading-[12px]">
                  {label}
                </span>
              ))}
            </div>

            {/* Grid */}
            {grid.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[1px]">
                {week.map((day, di) => (
                  <Tooltip key={`${wi}-${di}`}>
                    <TooltipTrigger asChild>
                      <div
                        className={`h-[12px] w-[12px] rounded-[2px] ${LEVEL_CLASSES[day.level]} transition-colors`}
                      />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      <p className="font-medium">{day.count} contributions</p>
                      <p className="text-muted-foreground">{day.date}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-1 mt-2 ml-8">
            <span className="text-[10px] text-muted-foreground mr-1">Less</span>
            {LEVEL_CLASSES.map((cls, i) => (
              <div key={i} className={`h-[12px] w-[12px] rounded-[2px] ${cls}`} />
            ))}
            <span className="text-[10px] text-muted-foreground ml-1">More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
