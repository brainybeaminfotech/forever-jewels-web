/**
 * schema.org structured data. `<` is escaped so no value (product names and descriptions come
 * from the API) can close the script tag early.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
  );
}
