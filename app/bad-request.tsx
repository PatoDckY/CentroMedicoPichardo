// app/bad-request.tsx
export default function BadRequest() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-red-600">400</h1>
      <p className="text-xl mt-4">Solicitud incorrecta</p>
      <p className="text-gray-600 mt-2">
        La solicitud no pudo ser procesada por el servidor.
      </p>
    </div>
  );
}