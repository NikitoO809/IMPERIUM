// Inyecta datos estructurados (JSON-LD, schema.org) en la página para que los
// buscadores entiendan el contenido. Acepta un objeto o un array de objetos.
// El contenido es nuestro (no entrada de usuario sin filtrar); aun así escapamos
// '<' para que ningún texto pueda cerrar el <script> antes de tiempo.
export function JsonLd({ schema }: { schema: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
    />
  );
}
