// app/test-404/page.tsx
import { notFound } from 'next/navigation';

export default function Test404Page() {
  notFound(); // Esto activará la página 404
  return <div>Este texto no se verá</div>;
}