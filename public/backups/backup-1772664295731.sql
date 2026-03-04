--
-- PostgreSQL database dump
--

\restrict F1DiaD7QYdn8iFUdnmheyhN0LibNNGmP7CmfhZILsBNIt9M2nOLj6thYfqmsnvI

-- Dumped from database version 17.8 (6108b59)
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.usuarios DROP CONSTRAINT IF EXISTS usuarios_rol_id_roles_id_fk;
ALTER TABLE IF EXISTS ONLY public.publicaciones DROP CONSTRAINT IF EXISTS publicaciones_id_autor_fkey;
ALTER TABLE IF EXISTS ONLY public.cursos DROP CONSTRAINT IF EXISTS cursos_id_instructor_fkey;
ALTER TABLE IF EXISTS ONLY public.academia_infantil DROP CONSTRAINT IF EXISTS academia_infantil_id_autor_fkey;
ALTER TABLE IF EXISTS ONLY public.usuarios DROP CONSTRAINT IF EXISTS usuarios_pkey;
ALTER TABLE IF EXISTS ONLY public.usuarios DROP CONSTRAINT IF EXISTS usuarios_correo_unique;
ALTER TABLE IF EXISTS ONLY public.servicios DROP CONSTRAINT IF EXISTS servicios_pkey;
ALTER TABLE IF EXISTS ONLY public.roles DROP CONSTRAINT IF EXISTS roles_pkey;
ALTER TABLE IF EXISTS ONLY public.roles DROP CONSTRAINT IF EXISTS roles_nombre_unique;
ALTER TABLE IF EXISTS ONLY public.publicaciones DROP CONSTRAINT IF EXISTS publicaciones_pkey;
ALTER TABLE IF EXISTS ONLY public.medicos DROP CONSTRAINT IF EXISTS medicos_pkey;
ALTER TABLE IF EXISTS ONLY public.intentos_recuperacion DROP CONSTRAINT IF EXISTS intentos_recuperacion_pkey;
ALTER TABLE IF EXISTS ONLY public.cursos DROP CONSTRAINT IF EXISTS cursos_pkey;
ALTER TABLE IF EXISTS ONLY public.backups DROP CONSTRAINT IF EXISTS backups_pkey;
ALTER TABLE IF EXISTS ONLY public.academia_infantil DROP CONSTRAINT IF EXISTS academia_infantil_pkey;
ALTER TABLE IF EXISTS public.usuarios ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.servicios ALTER COLUMN id_servicio DROP DEFAULT;
ALTER TABLE IF EXISTS public.roles ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.publicaciones ALTER COLUMN id_publicacion DROP DEFAULT;
ALTER TABLE IF EXISTS public.medicos ALTER COLUMN id_medico DROP DEFAULT;
ALTER TABLE IF EXISTS public.intentos_recuperacion ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.cursos ALTER COLUMN id_curso DROP DEFAULT;
ALTER TABLE IF EXISTS public.backups ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.academia_infantil ALTER COLUMN id_guia DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.usuarios_id_seq;
DROP TABLE IF EXISTS public.usuarios;
DROP SEQUENCE IF EXISTS public.servicios_id_servicio_seq;
DROP TABLE IF EXISTS public.servicios;
DROP SEQUENCE IF EXISTS public.roles_id_seq;
DROP TABLE IF EXISTS public.roles;
DROP SEQUENCE IF EXISTS public.publicaciones_id_publicacion_seq;
DROP TABLE IF EXISTS public.publicaciones;
DROP SEQUENCE IF EXISTS public.medicos_id_medico_seq;
DROP TABLE IF EXISTS public.medicos;
DROP SEQUENCE IF EXISTS public.intentos_recuperacion_id_seq;
DROP TABLE IF EXISTS public.intentos_recuperacion;
DROP SEQUENCE IF EXISTS public.cursos_id_curso_seq;
DROP TABLE IF EXISTS public.cursos;
DROP SEQUENCE IF EXISTS public.backups_id_seq;
DROP TABLE IF EXISTS public.backups;
DROP SEQUENCE IF EXISTS public.academia_infantil_id_guia_seq;
DROP TABLE IF EXISTS public.academia_infantil;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: academia_infantil; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.academia_infantil (
    id_guia integer NOT NULL,
    titulo_guia character varying(255) NOT NULL,
    descripcion_corta text,
    id_autor integer,
    fecha_publicacion date DEFAULT CURRENT_DATE,
    url_imagen text,
    etiquetas text
);


--
-- Name: academia_infantil_id_guia_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.academia_infantil_id_guia_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: academia_infantil_id_guia_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.academia_infantil_id_guia_seq OWNED BY public.academia_infantil.id_guia;


--
-- Name: backups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.backups (
    id integer NOT NULL,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tipo character varying(20) NOT NULL,
    "tamaño" character varying(20),
    archivo_path text,
    estado character varying(20) DEFAULT 'exitoso'::character varying
);


--
-- Name: backups_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.backups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: backups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.backups_id_seq OWNED BY public.backups.id;


--
-- Name: cursos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cursos (
    id_curso integer NOT NULL,
    titulo_curso character varying(200) NOT NULL,
    descripcion text,
    id_instructor integer,
    categoria character varying(50),
    fecha_inicio date,
    fecha_fin date,
    horario character varying(50),
    modalidad character varying(20),
    dirigido_a character varying(50),
    cupo_maximo integer,
    ubicacion character varying(150),
    costo numeric(10,2) DEFAULT 0.00,
    url_imagen_portada text
);


--
-- Name: cursos_id_curso_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cursos_id_curso_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cursos_id_curso_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cursos_id_curso_seq OWNED BY public.cursos.id_curso;


--
-- Name: intentos_recuperacion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.intentos_recuperacion (
    id integer NOT NULL,
    identificador text NOT NULL,
    conteo integer DEFAULT 0,
    ultimo_intento timestamp without time zone DEFAULT now(),
    bloqueado_hasta timestamp without time zone
);


--
-- Name: intentos_recuperacion_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.intentos_recuperacion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: intentos_recuperacion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.intentos_recuperacion_id_seq OWNED BY public.intentos_recuperacion.id;


--
-- Name: medicos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.medicos (
    id_medico integer NOT NULL,
    nombre_completo character varying(150) NOT NULL,
    especialidad character varying(100) NOT NULL,
    hospital_clinica character varying(150) DEFAULT 'Centro Médico Pichardo'::character varying,
    direccion text,
    url_foto text
);


--
-- Name: medicos_id_medico_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.medicos_id_medico_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: medicos_id_medico_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.medicos_id_medico_seq OWNED BY public.medicos.id_medico;


--
-- Name: publicaciones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.publicaciones (
    id_publicacion integer NOT NULL,
    titulo_noticia character varying(255) NOT NULL,
    resumen_bajada text,
    id_autor integer,
    fecha_publicacion date DEFAULT CURRENT_DATE,
    etiquetas text,
    url_imagen text,
    contenido_completo text
);


--
-- Name: publicaciones_id_publicacion_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.publicaciones_id_publicacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: publicaciones_id_publicacion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.publicaciones_id_publicacion_seq OWNED BY public.publicaciones.id_publicacion;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    nombre text NOT NULL
);


--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: servicios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.servicios (
    id_servicio integer NOT NULL,
    titulo_servicio character varying(150) NOT NULL,
    descripcion text,
    ubicacion character varying(200),
    url_image text,
    texto_alt character varying(150)
);


--
-- Name: servicios_id_servicio_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.servicios_id_servicio_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: servicios_id_servicio_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.servicios_id_servicio_seq OWNED BY public.servicios.id_servicio;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nombre text NOT NULL,
    "apellidoPaterno" text NOT NULL,
    "apellidoMaterno" text,
    edad integer NOT NULL,
    sexo text NOT NULL,
    telefono text NOT NULL,
    correo text NOT NULL,
    contrasena text NOT NULL,
    rol_id integer NOT NULL,
    reset_token text,
    reset_token_expiry timestamp without time zone,
    intentos_fallidos integer DEFAULT 0,
    bloqueado_hasta timestamp without time zone,
    version_token integer DEFAULT 1,
    mfa_habilitado boolean DEFAULT false,
    secreto_mfa text
);


--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- Name: academia_infantil id_guia; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.academia_infantil ALTER COLUMN id_guia SET DEFAULT nextval('public.academia_infantil_id_guia_seq'::regclass);


--
-- Name: backups id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.backups ALTER COLUMN id SET DEFAULT nextval('public.backups_id_seq'::regclass);


--
-- Name: cursos id_curso; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cursos ALTER COLUMN id_curso SET DEFAULT nextval('public.cursos_id_curso_seq'::regclass);


--
-- Name: intentos_recuperacion id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.intentos_recuperacion ALTER COLUMN id SET DEFAULT nextval('public.intentos_recuperacion_id_seq'::regclass);


--
-- Name: medicos id_medico; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicos ALTER COLUMN id_medico SET DEFAULT nextval('public.medicos_id_medico_seq'::regclass);


--
-- Name: publicaciones id_publicacion; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publicaciones ALTER COLUMN id_publicacion SET DEFAULT nextval('public.publicaciones_id_publicacion_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: servicios id_servicio; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.servicios ALTER COLUMN id_servicio SET DEFAULT nextval('public.servicios_id_servicio_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- Data for Name: academia_infantil; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.academia_infantil (id_guia, titulo_guia, descripcion_corta, id_autor, fecha_publicacion, url_imagen, etiquetas) FROM stdin;
\.


--
-- Data for Name: backups; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.backups (id, fecha, tipo, "tamaño", archivo_path, estado) FROM stdin;
\.


--
-- Data for Name: cursos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cursos (id_curso, titulo_curso, descripcion, id_instructor, categoria, fecha_inicio, fecha_fin, horario, modalidad, dirigido_a, cupo_maximo, ubicacion, costo, url_imagen_portada) FROM stdin;
\.


--
-- Data for Name: intentos_recuperacion; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.intentos_recuperacion (id, identificador, conteo, ultimo_intento, bloqueado_hasta) FROM stdin;
2	jesushfernandezh@gmail.com	1	2025-12-01 00:12:14.964	\N
3	jesushfh123@gmail.com	1	2025-12-01 00:12:46.053	\N
1	jesusf1705dck@gmail.com	3	2025-12-01 00:14:19.72	2025-12-01 03:14:19.72
\.


--
-- Data for Name: medicos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.medicos (id_medico, nombre_completo, especialidad, hospital_clinica, direccion, url_foto) FROM stdin;
\.


--
-- Data for Name: publicaciones; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.publicaciones (id_publicacion, titulo_noticia, resumen_bajada, id_autor, fecha_publicacion, etiquetas, url_imagen, contenido_completo) FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.roles (id, nombre) FROM stdin;
1	cliente
2	admin
\.


--
-- Data for Name: servicios; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.servicios (id_servicio, titulo_servicio, descripcion, ubicacion, url_image, texto_alt) FROM stdin;
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.usuarios (id, nombre, "apellidoPaterno", "apellidoMaterno", edad, sexo, telefono, correo, contrasena, rol_id, reset_token, reset_token_expiry, intentos_fallidos, bloqueado_hasta, version_token, mfa_habilitado, secreto_mfa) FROM stdin;
1	Admin	Sistema	Principal	30	Masculino	0000000000	admin@test.com	$2b$10$Pj/8.W.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0	2	\N	\N	0	\N	1	f	\N
13	Jesus	Fernandez	Fernandez	20	masculino	7713039166	jesushfh123@gmail.com	$2b$10$e4daBPIwI6SeF7BAlAKutuMKyb3cSLs6XNYrOJvdd0l3Xde0J7y.2	2	\N	\N	0	\N	1	f	\N
11	Jesus	Fernandez	Hernandez	20	masculino	7713039166	jesushfernandezh@gmail.com	$2b$10$IepTxpop8Z3OZOtBQJycIOU61QPBFvhodGaR9Xz6de8ecfbgKRVzS	1	\N	\N	0	\N	1	f	\N
3	Jesus	Fernandez	Hernandez	20	masculino	7713039166	jesusf1705dck@gmail.com	$2b$10$Zw869fxEHny1dVA8zZiqK.S7ry4g5mtPFRQ/pWTKq1MCsoMRRH2Ry	2	2eb109f1547fe8556839dedffd4ccd113c73c0bb6cd41ce5c410030ac83a9bdf	2025-12-01 00:29:20.02	0	\N	1	f	\N
14	j	j	j	18	masculino	1234567890	j@gmail.com	$2b$10$icHzpXAZkLRh09v9IgDn/upekYA.IhUzx3m9E5wQQsejJaDsWvSaS	1	\N	\N	0	\N	1	f	\N
15	Prueba_ED	Prueba1	Prueba11	20	femenino	7594856452	20230015@uthh.edu.mx	$2b$10$ekle/mrRdPOspslN4.JywuwfEKMTAd54sG6mwABM7laIhWEM5EH2a	1	\N	\N	1	\N	1	f	\N
16	Luis Jesus	Chavez	Vargas	20	masculino	7717205499	chavezvargasluisjesus@gmail.com	$2b$10$j4ou3VPT8OwpUdvMB90Iz.0PbcVWyIHwR79.GCrYJO6iJWfooTseC	2	\N	\N	0	\N	1	f	\N
\.


--
-- Name: academia_infantil_id_guia_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.academia_infantil_id_guia_seq', 1, false);


--
-- Name: backups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.backups_id_seq', 5, true);


--
-- Name: cursos_id_curso_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cursos_id_curso_seq', 1, false);


--
-- Name: intentos_recuperacion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.intentos_recuperacion_id_seq', 3, true);


--
-- Name: medicos_id_medico_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.medicos_id_medico_seq', 1, false);


--
-- Name: publicaciones_id_publicacion_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.publicaciones_id_publicacion_seq', 1, false);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.roles_id_seq', 1, false);


--
-- Name: servicios_id_servicio_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.servicios_id_servicio_seq', 1, false);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 16, true);


--
-- Name: academia_infantil academia_infantil_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.academia_infantil
    ADD CONSTRAINT academia_infantil_pkey PRIMARY KEY (id_guia);


--
-- Name: backups backups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.backups
    ADD CONSTRAINT backups_pkey PRIMARY KEY (id);


--
-- Name: cursos cursos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cursos
    ADD CONSTRAINT cursos_pkey PRIMARY KEY (id_curso);


--
-- Name: intentos_recuperacion intentos_recuperacion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.intentos_recuperacion
    ADD CONSTRAINT intentos_recuperacion_pkey PRIMARY KEY (id);


--
-- Name: medicos medicos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicos
    ADD CONSTRAINT medicos_pkey PRIMARY KEY (id_medico);


--
-- Name: publicaciones publicaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publicaciones
    ADD CONSTRAINT publicaciones_pkey PRIMARY KEY (id_publicacion);


--
-- Name: roles roles_nombre_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_nombre_unique UNIQUE (nombre);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: servicios servicios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.servicios
    ADD CONSTRAINT servicios_pkey PRIMARY KEY (id_servicio);


--
-- Name: usuarios usuarios_correo_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_correo_unique UNIQUE (correo);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: academia_infantil academia_infantil_id_autor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.academia_infantil
    ADD CONSTRAINT academia_infantil_id_autor_fkey FOREIGN KEY (id_autor) REFERENCES public.medicos(id_medico);


--
-- Name: cursos cursos_id_instructor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cursos
    ADD CONSTRAINT cursos_id_instructor_fkey FOREIGN KEY (id_instructor) REFERENCES public.medicos(id_medico);


--
-- Name: publicaciones publicaciones_id_autor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publicaciones
    ADD CONSTRAINT publicaciones_id_autor_fkey FOREIGN KEY (id_autor) REFERENCES public.medicos(id_medico);


--
-- Name: usuarios usuarios_rol_id_roles_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_rol_id_roles_id_fk FOREIGN KEY (rol_id) REFERENCES public.roles(id);


--
-- PostgreSQL database dump complete
--

\unrestrict F1DiaD7QYdn8iFUdnmheyhN0LibNNGmP7CmfhZILsBNIt9M2nOLj6thYfqmsnvI

