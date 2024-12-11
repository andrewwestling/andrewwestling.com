interface VenueStatsProps {
  location?: string | null;
  concertCount: number;
}

export const VenueStats = ({ location, concertCount }: VenueStatsProps) => {
  return (
    <div className="text-muted text-sm">
      {location && <>{location}</>}
      {location && concertCount > 0 && " • "}
      {concertCount > 0 && (
        <>
          {concertCount} concert
          {concertCount !== 1 ? "s" : ""}
        </>
      )}
    </div>
  );
};
