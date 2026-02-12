import { TravelSegment, getTravelIcon } from "@/data/mockEvents";

interface TravelIndicatorProps {
  segment: TravelSegment;
}

const TravelIndicator = ({ segment }: TravelIndicatorProps) => {
  return (
    <div className="flex items-center gap-2 py-1.5 px-4">
      <div className="flex-1 h-px bg-border" />
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
        <span>{getTravelIcon(segment.method)}</span>
        <span>{segment.duration}</span>
        {segment.distance && (
          <span className="opacity-60">· {segment.distance}</span>
        )}
      </div>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
};

export default TravelIndicator;
