import { ListItem } from "@music/components/ListItem";

interface IndexPageProps {
  title: string;
  items: Array<{
    slug: string;
    title: string;
    href: string;
    stats: string[];
  }>;
}

export function IndexPage({ title, items }: IndexPageProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{title}</h1>

      <div className="grid gap-4">
        {items.map((item) => (
          <ListItem
            key={item.slug}
            title={item.title}
            href={item.href}
            stats={item.stats}
          />
        ))}
      </div>
    </div>
  );
}
