--
-- PostgreSQL database dump
--

-- Dumped from database version 14.1
-- Dumped by pg_dump version 14.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA public;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: messages; Type: TABLE; Schema: public; Owner: stevenkneiser
--

CREATE TABLE public.messages (
    id bigint NOT NULL,
    sender_id integer,
    recipient_id integer,
    content character varying(2048) NOT NULL
);


ALTER TABLE public.messages OWNER TO stevenkneiser;

--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: stevenkneiser
--

CREATE SEQUENCE public.messages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.messages_id_seq OWNER TO stevenkneiser;

--
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: stevenkneiser
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: stevenkneiser
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.users OWNER TO stevenkneiser;

--
-- Name: users_id_seq1; Type: SEQUENCE; Schema: public; Owner: stevenkneiser
--

CREATE SEQUENCE public.users_id_seq1
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq1 OWNER TO stevenkneiser;

--
-- Name: users_id_seq1; Type: SEQUENCE OWNED BY; Schema: public; Owner: stevenkneiser
--

ALTER SEQUENCE public.users_id_seq1 OWNED BY public.users.id;


--
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: stevenkneiser
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: stevenkneiser
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq1'::regclass);


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: stevenkneiser
--

COPY public.messages (id, sender_id, recipient_id, content) FROM stdin;
1	1	5	nice.
5	5	6	you're one to talk ;)
7	6	7	Who do you even think you are?
8	10	8	send me money now plz thx bye
9	7	5	random random 123456789012345678901234567890123456789012567890134567890 
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: stevenkneiser
--

COPY public.users (id, name) FROM stdin;
1	Socrates
2	Socrates
5	Plato
6	Aristotle
7	Steven
8	Socrates
9	Alexander The Great
10	random disinformation bot
\.


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: stevenkneiser
--

SELECT pg_catalog.setval('public.messages_id_seq', 9, true);


--
-- Name: users_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: stevenkneiser
--

SELECT pg_catalog.setval('public.users_id_seq1', 10, true);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: stevenkneiser
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey2; Type: CONSTRAINT; Schema: public; Owner: stevenkneiser
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey2 PRIMARY KEY (id);


--
-- Name: messages fk_recipient; Type: FK CONSTRAINT; Schema: public; Owner: stevenkneiser
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT fk_recipient FOREIGN KEY (recipient_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: messages fk_sender; Type: FK CONSTRAINT; Schema: public; Owner: stevenkneiser
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT fk_sender FOREIGN KEY (sender_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

