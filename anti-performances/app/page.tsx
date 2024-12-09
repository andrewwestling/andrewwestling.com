import Link from "next/link";
import database from "@/database";
import { getDateFromFilename, formatConcertTitle } from "@/lib/helpers";

export default function HomePage() {
  return (
    <div className="py-8">
      <div className="grid gap-12">
        {/* Concerts */}
        <section>
          <h2 className="text-2xl font-bold mb-4">
            <Link href="/concerts">Concerts</Link>
          </h2>
          <div className="grid gap-4">
            {database.concert.map((concert) => {
              const group = database.group.find(
                (g) => g.title === concert.frontmatter.group
              );
              const concertDate = getDateFromFilename(concert.slug);
              if (!concertDate) return null;

              const displayTitle = formatConcertTitle(concert.title, group);

              return (
                <div key={concert.slug}>
                  <Link href={`/concerts/${concertDate}`}>{displayTitle}</Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* Groups */}
        <section>
          <h2 className="text-2xl font-bold mb-4">
            <Link href="/groups">Groups</Link>
          </h2>
          <div className="grid gap-4">
            {database.group.map((group) => (
              <div key={group.slug}>
                <Link href={`/groups/${group.slug}`}>{group.title}</Link>
                <span className="text-muted ml-2">
                  {group.frontmatter.location}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Conductors */}
        <section>
          <h2 className="text-2xl font-bold mb-4">
            <Link href="/conductors">Conductors</Link>
          </h2>
          <div className="grid gap-4">
            {database.conductor.map((conductor) => (
              <div key={conductor.slug}>
                <Link href={`/conductors/${conductor.slug}`}>
                  {conductor.title}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Works */}
        <section>
          <h2 className="text-2xl font-bold mb-4">
            <Link href="/works">Works</Link>
          </h2>
          <div className="grid gap-4">
            {database.work.map((work) => {
              const composer = database.composer.find(
                (c) => c.title === work.frontmatter.composer
              );
              return (
                <div key={work.slug}>
                  <Link href={`/works/${work.slug}`}>{work.title}</Link>
                  {composer && (
                    <span className="text-muted ml-2">
                      by{" "}
                      <Link href={`/composers/${composer.slug}`}>
                        {composer.title}
                      </Link>
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Composers */}
        <section>
          <h2 className="text-2xl font-bold mb-4">
            <Link href="/composers">Composers</Link>
          </h2>
          <div className="grid gap-4">
            {database.composer.map((composer) => {
              const works = database.work.filter(
                (w) => w.frontmatter.composer === composer.title
              );
              return (
                <div key={composer.slug}>
                  <Link href={`/composers/${composer.slug}`}>
                    {composer.title}
                  </Link>
                  <span className="text-muted ml-2">
                    ({works.length} work{works.length !== 1 ? "s" : ""})
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
