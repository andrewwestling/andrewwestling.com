import Link from "next/link";
import database from "@/database";

export default function ConductorsPage() {
  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold mb-6">Conductors</h1>

      <div className="grid gap-4">
        {database.conductor.map((conductor) => {
          // Find all concerts for this conductor
          const concerts = database.concert.filter((c) => {
            const conductors = Array.isArray(c.frontmatter.conductor)
              ? c.frontmatter.conductor
              : [c.frontmatter.conductor];
            return conductors.includes(conductor.title);
          });

          return (
            <div key={conductor.slug}>
              <Link href={`/conductors/${conductor.slug}`}>
                {conductor.title}
              </Link>
              <span className="text-muted ml-2">
                ({concerts.length} concert{concerts.length !== 1 ? "s" : ""})
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
