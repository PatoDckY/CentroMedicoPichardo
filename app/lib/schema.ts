import { relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  boolean,
  varchar,
  date,
  numeric,
} from "drizzle-orm/pg-core";

// 1. Tabla Roles
export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  nombre: text("nombre").notNull().unique(),
});

// 2. Tabla Usuarios
export const usuarios = pgTable("usuarios", {
  id: serial("id").primaryKey(),
  nombre: text("nombre").notNull(),
  apellidoPaterno: text("apellidoPaterno").notNull(),
  apellidoMaterno: text("apellidoMaterno"),
  edad: integer("edad").notNull(),
  sexo: text("sexo").notNull(),
  telefono: text("telefono").notNull(),
  correo: text("correo").notNull().unique(),
  contrasena: text("contrasena").notNull(),
  resetToken: text("reset_token"),
  resetTokenExpiry: timestamp("reset_token_expiry"),
  intentosFallidos: integer("intentos_fallidos").default(0),
  bloqueadoHasta: timestamp("bloqueado_hasta"),
  versionToken: integer("version_token").default(1),
  mfaHabilitado: boolean("mfa_habilitado").default(false),
  secretoMfa: text("secreto_mfa"),
  rolId: integer("rol_id")
    .notNull()
    .references(() => roles.id),
  activo: boolean("activo").default(true), // 👈 Borrado lógico para usuarios
});

// NUEVA TABLA PARA RATE LIMITING
export const intentosRecuperacion = pgTable("intentos_recuperacion", {
  id: serial("id").primaryKey(),
  identificador: text("identificador").notNull(),
  conteo: integer("conteo").default(0),
  ultimoIntento: timestamp("ultimo_intento").defaultNow(),
  bloqueadoHasta: timestamp("bloqueado_hasta"),
});

// ================================
// 4. TABLA MEDICOS
// ================================
export const medicos = pgTable("medicos", {
  idMedico: serial("id_medico").primaryKey(),
  nombreCompleto: varchar("nombre_completo", { length: 255 }).notNull(),
  especialidad: varchar("especialidad", { length: 255 }).notNull(),
  hospitalClinica: varchar("hospital_clinica", { length: 255 }).default(
    "Centro Médico Pichardo",
  ),
  direccion: text("direccion"),
  urlFoto: text("url_foto"),
  activo: boolean("activo").default(true), // 👈 Agregado
});

// ================================
// 5. TABLA CURSOS
// ================================
export const cursos = pgTable("cursos", {
  idCurso: serial("id_curso").primaryKey(),
  tituloCurso: varchar("titulo_curso", { length: 255 }).notNull(),
  descripcion: text("descripcion"),
  idInstructor: integer("id_instructor").references(() => medicos.idMedico),
  categoria: varchar("categoria", { length: 100 }),
  fechaInicio: date("fecha_inicio"),
  fechaFin: date("fecha_fin"),
  horario: varchar("horario", { length: 100 }),
  modalidad: varchar("modalidad", { length: 50 }),
  dirigidoA: varchar("dirigido_a", { length: 255 }),
  cupoMaximo: integer("cupo_maximo"),
  ubicacion: varchar("ubicacion", { length: 255 }),
  costo: numeric("costo", { precision: 10, scale: 2 }).default("0.00"),
  urlImagenPortada: text("url_imagen_portada"),
  activo: boolean("activo").default(true), // 👈 Agregado
});

// ================================
// 6. TABLA ACADEMIA INFANTIL
// ================================
export const academiaInfantil = pgTable("academia_infantil", {
  id_guia: serial("id_guia").primaryKey(),
  tituloGuia: varchar("titulo_guia", { length: 255 }).notNull(),
  descripcionCorta: text("descripcion_corta"),
  idAutor: integer("id_autor"),
  fechaPublicacion: date("fecha_publicacion").defaultNow(),
  urlImagen: text("url_imagen"),
  etiquetas: text("etiquetas"),
  descripcionLarga: text("descripcion_larga"),
  activo: boolean("activo").default(true), // 👈 Agregado
});

// ================================
// 7. TABLA SERVICIOS
// ================================
export const servicios = pgTable("servicios", {
  idServicio: serial("id_servicio").primaryKey(),
  tituloServicio: varchar("titulo_servicio", { length: 255 }).notNull(),
  descripcion: text("descripcion"),
  ubicacion: varchar("ubicacion", { length: 255 }),
  urlImage: text("url_image"),
  textoAlt: varchar("texto_alt", { length: 255 }),
  disenoTipo: varchar("diseno_tipo", { length: 20 }).default("vertical"),
  activo: boolean("activo").default(true), // 👈 Agregado
});

// ================================
// 8. TABLA NOSOTROS
// ================================
export const nosotros = pgTable("nosotros", {
  id: serial("id").primaryKey(),
  mision: text("mision").notNull(),
  vision: text("vision").notNull(),
  valores: text("valores").array().notNull(),
  nuestraHistoria: text("nuestra_historia").notNull(),
  compromiso: text("compromiso").notNull(),
  urlImagen: text("url_imagen"),
});

// ================================
// 9. TABLA PUBLICACIONES (Blog)
// ================================
export const publicaciones = pgTable("publicaciones", {
  idPublicacion: serial("id_publicacion").primaryKey(),
  tituloNoticia: varchar("titulo_noticia", { length: 255 }).notNull(),
  resumenBajada: text("resumen_bajada").notNull(),
  idAutor: integer("id_autor").notNull(),
  fechaPublicacion: date("fecha_publicacion").notNull(),
  etiquetas: text("etiquetas"),
  urlImagen: text("url_imagen"),
  contenidoCompleto: text("contenido_completo").notNull(),
  activo: boolean("activo").default(true), // 👈 Agregado
});

// ================================
// RELACIONES
// ================================
export const usuariosRelations = relations(usuarios, ({ one }) => ({
  rol: one(roles, {
    fields: [usuarios.rolId],
    references: [roles.id],
  }),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  usuarios: many(usuarios),
}));

export const cursosRelations = relations(cursos, ({ one }) => ({
  instructor: one(medicos, {
    fields: [cursos.idInstructor],
    references: [medicos.idMedico],
  }),
}));

export const medicosRelations = relations(medicos, ({ many }) => ({
  cursos: many(cursos),
}));