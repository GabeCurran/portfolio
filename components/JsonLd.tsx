// Renders a JSON-LD structured-data script tag. Server component — the markup
// is baked into the static HTML so crawlers see it without running JS.

export default function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
