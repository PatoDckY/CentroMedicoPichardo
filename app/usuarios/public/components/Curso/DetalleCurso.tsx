"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DetalleCursoView from "./DetalleCursoView";

export default function DetalleCurso() {

  const params = useParams();
  console.log("PARAMS:", params);

  const id = params?.id;

  const [curso, setCurso] = useState<any>(null);

  useEffect(() => {

    if (!id) return;

    const cargarCurso = async () => {

      try {

        const res = await fetch(`/api/cursos/${id}`);
        const data = await res.json();

        setCurso(data);

      } catch (error) {
        console.error("Error cargando curso:", error);
      }

    };

    cargarCurso();

  }, [id]);

  if (!curso) {
    return <p style={{ textAlign: "center" }}>Cargando curso...</p>;
  }

  return (
    <DetalleCursoView
      titulo={curso.tituloCurso}
      instructor="Instructor del curso"
      descripcionCompleta={curso.descripcion}
      horario={curso.horario}
      ubicacion={curso.ubicacion}
      fechaInicio={curso.fechaInicio}
      fechaFin={curso.fechaFin}
      cupoMaximo={curso.cupoMaximo}
      cupoInscrito={5}
      dirigidoA={curso.dirigidoA}
      costo={curso.costo}
      imagenes={[
        {
          src: curso.urlImagenPortada,
          descripcion: "Imagen del curso"
        }
      ]}
      onAdquirir={() => alert("Ir a pago")}
    />
  );
}