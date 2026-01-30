// app/test-server-error/page.tsx
export default function TestServerErrorPage() {
  // Esto causará un error 500 al renderizar
  const invalidData: any = null;
  return <div>{invalidData.property.noExiste}</div>;
}