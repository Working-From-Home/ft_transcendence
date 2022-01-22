--
-- PostgreSQL database dump
--

-- Dumped from database version 14.1
-- Dumped by pg_dump version 14.1

-- Started on 2022-01-03 19:24:03 UTC

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
-- TOC entry 839 (class 1247 OID 16386)
-- Name: friendship_status_enum; Type: TYPE; Schema: public; Owner: pong
--

CREATE TYPE public.friendship_status_enum AS ENUM (
    'accepted',
    'pending'
);


ALTER TYPE public.friendship_status_enum OWNER TO pong;

--
-- TOC entry 842 (class 1247 OID 16392)
-- Name: user_channel_role_enum; Type: TYPE; Schema: public; Owner: pong
--

CREATE TYPE public.user_channel_role_enum AS ENUM (
    'admin',
    'user'
);


ALTER TYPE public.user_channel_role_enum OWNER TO pong;

--
-- TOC entry 845 (class 1247 OID 16398)
-- Name: user_role_enum; Type: TYPE; Schema: public; Owner: pong
--

CREATE TYPE public.user_role_enum AS ENUM (
    'owner',
    'admin',
    'user'
);


ALTER TYPE public.user_role_enum OWNER TO pong;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 209 (class 1259 OID 16405)
-- Name: achievement; Type: TABLE; Schema: public; Owner: pong
--

CREATE TABLE public.achievement (
    id integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL
);


ALTER TABLE public.achievement OWNER TO pong;

--
-- TOC entry 210 (class 1259 OID 16410)
-- Name: achievement_id_seq; Type: SEQUENCE; Schema: public; Owner: pong
--

CREATE SEQUENCE public.achievement_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.achievement_id_seq OWNER TO pong;

--
-- TOC entry 3468 (class 0 OID 0)
-- Dependencies: 210
-- Name: achievement_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pong
--

ALTER SEQUENCE public.achievement_id_seq OWNED BY public.achievement.id;


--
-- TOC entry 211 (class 1259 OID 16411)
-- Name: avatar; Type: TABLE; Schema: public; Owner: pong
--

CREATE TABLE public.avatar (
    "userId" integer NOT NULL,
    filename character varying NOT NULL,
    mimetype character varying NOT NULL,
    data bytea NOT NULL
);


ALTER TABLE public.avatar OWNER TO pong;

--
-- TOC entry 212 (class 1259 OID 16416)
-- Name: blocked; Type: TABLE; Schema: public; Owner: pong
--

CREATE TABLE public.blocked (
    "applicantId" integer NOT NULL,
    "recipientId" integer NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "CHK_732bf9de1d3591f54547d90ecb" CHECK (("applicantId" <> "recipientId"))
);


ALTER TABLE public.blocked OWNER TO pong;

--
-- TOC entry 213 (class 1259 OID 16421)
-- Name: channel; Type: TABLE; Schema: public; Owner: pong
--

CREATE TABLE public.channel (
    id integer NOT NULL,
    "isDm" boolean NOT NULL,
    title text,
    password text,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "ownerId" integer
);


ALTER TABLE public.channel OWNER TO pong;

--
-- TOC entry 214 (class 1259 OID 16427)
-- Name: channel_id_seq; Type: SEQUENCE; Schema: public; Owner: pong
--

CREATE SEQUENCE public.channel_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.channel_id_seq OWNER TO pong;

--
-- TOC entry 3469 (class 0 OID 0)
-- Dependencies: 214
-- Name: channel_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pong
--

ALTER SEQUENCE public.channel_id_seq OWNED BY public.channel.id;


--
-- TOC entry 215 (class 1259 OID 16428)
-- Name: friendship; Type: TABLE; Schema: public; Owner: pong
--

CREATE TABLE public.friendship (
    "applicantId" integer NOT NULL,
    "recipientId" integer NOT NULL,
    status public.friendship_status_enum DEFAULT 'pending'::public.friendship_status_enum NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "CHK_ac3b3c200d186e7e536ce4521b" CHECK (("applicantId" <> "recipientId"))
);


ALTER TABLE public.friendship OWNER TO pong;

--
-- TOC entry 216 (class 1259 OID 16434)
-- Name: game; Type: TABLE; Schema: public; Owner: pong
--

CREATE TABLE public.game (
    id integer NOT NULL,
    "winnerScore" integer NOT NULL,
    "looserScore" integer NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "looserId" integer,
    "winnerId" integer,
    CONSTRAINT "CHK_0756be2e801db4ccd2f3b6a017" CHECK (("winnerId" <> "looserId"))
);


ALTER TABLE public.game OWNER TO pong;

--
-- TOC entry 217 (class 1259 OID 16439)
-- Name: game_id_seq; Type: SEQUENCE; Schema: public; Owner: pong
--

CREATE SEQUENCE public.game_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.game_id_seq OWNER TO pong;

--
-- TOC entry 3470 (class 0 OID 0)
-- Dependencies: 217
-- Name: game_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pong
--

ALTER SEQUENCE public.game_id_seq OWNED BY public.game.id;


--
-- TOC entry 218 (class 1259 OID 16440)
-- Name: message; Type: TABLE; Schema: public; Owner: pong
--

CREATE TABLE public.message (
    id integer NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "channelId" integer,
    "userId" integer
);


ALTER TABLE public.message OWNER TO pong;

--
-- TOC entry 219 (class 1259 OID 16446)
-- Name: message_id_seq; Type: SEQUENCE; Schema: public; Owner: pong
--

CREATE SEQUENCE public.message_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.message_id_seq OWNER TO pong;

--
-- TOC entry 3471 (class 0 OID 0)
-- Dependencies: 219
-- Name: message_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pong
--

ALTER SEQUENCE public.message_id_seq OWNED BY public.message.id;


--
-- TOC entry 220 (class 1259 OID 16447)
-- Name: stats; Type: TABLE; Schema: public; Owner: pong
--

CREATE TABLE public.stats (
    "userId" integer NOT NULL,
    level integer DEFAULT 0 NOT NULL,
    victories integer DEFAULT 0 NOT NULL,
    losses integer DEFAULT 0 NOT NULL,
    CONSTRAINT "CHK_adfd86107a516a476bf6faa77f" CHECK ((victories >= 0)),
    CONSTRAINT "CHK_ddb6741edef3917d6104c692f3" CHECK (((level >= 0) AND (level <= 42))),
    CONSTRAINT "CHK_ea77d62bbffd22d4071eb57490" CHECK ((losses >= 0))
);


ALTER TABLE public.stats OWNER TO pong;

--
-- TOC entry 221 (class 1259 OID 16456)
-- Name: typeorm_metadata; Type: TABLE; Schema: public; Owner: pong
--

CREATE TABLE public.typeorm_metadata (
    type character varying NOT NULL,
    database character varying,
    schema character varying,
    "table" character varying,
    name character varying,
    value text
);


ALTER TABLE public.typeorm_metadata OWNER TO pong;

--
-- TOC entry 222 (class 1259 OID 16461)
-- Name: user; Type: TABLE; Schema: public; Owner: pong
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    email character varying NOT NULL,
    username character varying NOT NULL,
    password character varying NOT NULL,
    role public.user_role_enum DEFAULT 'user'::public.user_role_enum NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    banned boolean DEFAULT false NOT NULL,
    "twoFaEnabled" boolean DEFAULT false NOT NULL,
    "twoFaSecret" text,
    "oauthToken" text,
    CONSTRAINT "CHK_f3c4b3e747d310ffb0f9d865ec" CHECK (
CASE
    WHEN ((role = 'owner'::public.user_role_enum) OR (role = 'admin'::public.user_role_enum)) THEN (banned IS NOT TRUE)
    ELSE NULL::boolean
END)
);


ALTER TABLE public."user" OWNER TO pong;

--
-- TOC entry 223 (class 1259 OID 16471)
-- Name: user_achievements; Type: TABLE; Schema: public; Owner: pong
--

CREATE TABLE public.user_achievements (
    "userId" integer NOT NULL,
    "achievementId" integer NOT NULL
);


ALTER TABLE public.user_achievements OWNER TO pong;

--
-- TOC entry 224 (class 1259 OID 16474)
-- Name: user_channel; Type: TABLE; Schema: public; Owner: pong
--

CREATE TABLE public.user_channel (
    "userId" integer NOT NULL,
    "channelId" integer NOT NULL,
    role public.user_channel_role_enum DEFAULT 'user'::public.user_channel_role_enum NOT NULL,
    "hasLeft" boolean DEFAULT false NOT NULL,
    "bannedUntil" timestamp with time zone,
    "mutedUntil" timestamp with time zone,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "CHK_f88f9d3ddefc6dc88f09e93572" CHECK (
CASE
    WHEN ("bannedUntil" > CURRENT_TIMESTAMP) THEN ("hasLeft" IS TRUE)
    ELSE NULL::boolean
END)
);


ALTER TABLE public.user_channel OWNER TO pong;

--
-- TOC entry 225 (class 1259 OID 16480)
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: pong
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO pong;

--
-- TOC entry 3472 (class 0 OID 0)
-- Dependencies: 225
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pong
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- TOC entry 226 (class 1259 OID 16481)
-- Name: users_in_channel; Type: VIEW; Schema: public; Owner: pong
--

CREATE VIEW public.users_in_channel AS
 SELECT uc."userId",
    uc."channelId",
    (uc."userId" = c."ownerId") AS "isOwner",
    (uc.role = 'admin'::public.user_channel_role_enum) AS "isAdmin",
    uc."mutedUntil" AS muteduntil
   FROM (public.user_channel uc
     JOIN public.channel c ON ((uc."channelId" = c.id)))
  WHERE (uc."hasLeft" = false);


ALTER TABLE public.users_in_channel OWNER TO pong;

--
-- TOC entry 3227 (class 2604 OID 16485)
-- Name: achievement id; Type: DEFAULT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.achievement ALTER COLUMN id SET DEFAULT nextval('public.achievement_id_seq'::regclass);


--
-- TOC entry 3231 (class 2604 OID 16486)
-- Name: channel id; Type: DEFAULT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.channel ALTER COLUMN id SET DEFAULT nextval('public.channel_id_seq'::regclass);


--
-- TOC entry 3236 (class 2604 OID 16487)
-- Name: game id; Type: DEFAULT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.game ALTER COLUMN id SET DEFAULT nextval('public.game_id_seq'::regclass);


--
-- TOC entry 3239 (class 2604 OID 16488)
-- Name: message id; Type: DEFAULT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.message ALTER COLUMN id SET DEFAULT nextval('public.message_id_seq'::regclass);


--
-- TOC entry 3250 (class 2604 OID 16489)
-- Name: user id; Type: DEFAULT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- TOC entry 3446 (class 0 OID 16405)
-- Dependencies: 209
-- Data for Name: achievement; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.achievement (id, title, description) FROM stdin;
1	Tyson Fury	Win 30 games in a row.
2	Pilier de bar	Play 15 games each day for one month
3	Bienvenu	Create an account
\.


--
-- TOC entry 3448 (class 0 OID 16411)
-- Dependencies: 211
-- Data for Name: avatar; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.avatar ("userId", filename, mimetype, data) FROM stdin;
\.


--
-- TOC entry 3449 (class 0 OID 16416)
-- Dependencies: 212
-- Data for Name: blocked; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.blocked ("applicantId", "recipientId", "createdAt") FROM stdin;
1	5	2022-01-03 18:30:41.220742+00
2	4	2022-01-03 18:30:41.220742+00
7	1	2022-01-03 18:30:41.220742+00
\.


--
-- TOC entry 3450 (class 0 OID 16421)
-- Dependencies: 213
-- Data for Name: channel; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.channel (id, "isDm", title, password, "createdAt", "ownerId") FROM stdin;
1	f	L equipe	\N	2021-12-08 01:44:32.883044+00	1
2	f	L equipe 2	\N	2021-12-08 00:44:32.883044+00	2
3	t	\N	\N	2021-12-08 11:57:52.883044+00	2
4	f	Anniv Pierre 2019	\N	2019-01-08 11:57:52.883044+00	3
5	f	Anniversaire Pierre 2020	\N	2020-01-07 11:58:31.883044+00	3
\.


--
-- TOC entry 3452 (class 0 OID 16428)
-- Dependencies: 215
-- Data for Name: friendship; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.friendship ("applicantId", "recipientId", status, "createdAt") FROM stdin;
1	2	accepted	2022-01-03 18:30:41.220742+00
1	3	accepted	2022-01-03 18:30:41.220742+00
1	4	pending	2022-01-03 18:30:41.220742+00
2	3	pending	2022-01-03 18:30:41.220742+00
2	5	accepted	2022-01-03 18:30:41.220742+00
3	4	accepted	2022-01-03 18:30:41.220742+00
3	5	pending	2022-01-03 18:30:41.220742+00
4	5	accepted	2022-01-03 18:30:41.220742+00
6	1	accepted	2022-01-03 18:30:41.220742+00
6	3	pending	2022-01-03 18:30:41.220742+00
\.


--
-- TOC entry 3453 (class 0 OID 16434)
-- Dependencies: 216
-- Data for Name: game; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.game (id, "winnerScore", "looserScore", "createdAt", "looserId", "winnerId") FROM stdin;
1	3	0	2022-01-03 18:30:41.220742+00	2	1
2	3	2	2022-01-03 18:30:41.220742+00	1	2
3	3	2	2022-01-03 18:30:41.220742+00	2	4
4	3	1	2022-01-03 18:30:41.220742+00	4	5
\.


--
-- TOC entry 3455 (class 0 OID 16440)
-- Dependencies: 218
-- Data for Name: message; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.message (id, content, "createdAt", "channelId", "userId") FROM stdin;
1	bob: hello l equipe ! premier message	2021-12-08 01:45:32.883044+00	1	1
2	marie: hola, second message	2021-12-08 02:05:35.883044+00	1	2
3	jacques: Hi !, third one	2021-12-08 03:46:01.883044+00	1	3
4	bob: I have muted you jacques :p ! 4	2021-12-08 01:47:42.883044+00	1	1
5	marie: 5	2021-12-08 01:49:32.883044+00	1	2
6	bob: 6	2021-12-08 01:51:29.883044+00	1	1
7	bob: 7	2021-12-08 01:53:11.883044+00	1	1
8	bob: 8	2021-12-08 01:54:02.883044+00	1	1
9	marie: hello l equipe 2 ! premier message	2021-12-08 01:45:32.883044+00	2	2
10	stef: hola, second message	2021-12-08 01:49:32.883044+00	2	4
11	alice: Hi !, third one	2021-12-08 01:50:32.883044+00	2	5
12	bob: 4	2021-12-08 01:52:32.883044+00	2	2
13	marie: I have banned alice. 5	2021-12-08 01:55:32.883044+00	2	4
14	marie: 6	2021-12-08 01:56:32.883044+00	2	2
15	marie: 7	2021-12-08 01:56:35.883044+00	2	2
16	marie: 8	2021-12-08 01:57:40.883044+00	2	2
17	marie: Hi first dm message 1	2021-12-08 01:57:40.883044+00	3	2
18	jacques: Hi 2	2021-12-08 11:57:40.883044+00	3	3
19	jacques: How are u 3. (last message ever)	2021-12-08 11:58:20.883044+00	3	3
20	jacques: Idees de cadeau pour 2019 ?	2019-12-08 11:58:20.883044+00	4	3
21	marie: npm install ft_transcendence, bonne idee non ? (last message ever)	2019-12-08 12:05:04.883044+00	4	2
22	jacques: Idees de cadeau pour 2020 ? (last message ever)	2020-01-07 11:58:20.883044+00	5	3
\.


--
-- TOC entry 3457 (class 0 OID 16447)
-- Dependencies: 220
-- Data for Name: stats; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.stats ("userId", level, victories, losses) FROM stdin;
1	42	15	7
2	23	150	97
3	9	15	90
4	1	2	2
5	8	5	5
6	12	12	5
7	14	15	5
8	4	10	2
9	14	15	5
\.


--
-- TOC entry 3458 (class 0 OID 16456)
-- Dependencies: 221
-- Data for Name: typeorm_metadata; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.typeorm_metadata (type, database, schema, "table", name, value) FROM stdin;
VIEW	\N	public	\N	users_in_channel	SELECT uc."userId" AS "userId",\n\t\t\t\t\t\tuc."channelId" AS "channelId",\n\t\t\t\t\t\t(uc."userId" = c."ownerId") AS "isOwner",\n\t\t\t\t\t\t(uc."role" = 'admin') AS "isAdmin",\n\t\t\t\t\t\tuc."mutedUntil" AS mutedUntil\n\t\t\tFROM "user_channel" "uc"\n\t\t\t\tINNER JOIN "channel" AS "c" ON uc."channelId" = c."id"\n\t\t\tWHERE "hasLeft" = FALSE
\.


--
-- TOC entry 3459 (class 0 OID 16461)
-- Dependencies: 222
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public."user" (id, email, username, password, role, "createdAt", banned, "twoFaEnabled", "twoFaSecret", "oauthToken") FROM stdin;
1	bob@bob.com	bob	fake_user_so_invalid_token	owner	2022-01-03 18:30:41.220742+00	f	f	\N	\N
2	marie@email.com	marie	fake_user_so_invalid_token	admin	2022-01-03 18:30:41.220742+00	f	f	\N	\N
3	jacques@email.com	jacques	fake_user_so_invalid_token	user	2022-01-03 18:30:41.220742+00	f	f	\N	\N
4	stef@mail.com	stef	fake_user_so_invalid_token	user	2022-01-03 18:30:41.220742+00	f	f	\N	\N
5	alice@mail.com	alice	fake_user_so_invalid_token	user	2022-01-03 18:30:41.220742+00	f	f	\N	\N
6	pierre@mail.com	pierre	fake_user_so_invalid_token	user	2022-01-03 18:30:41.220742+00	f	f	\N	\N
7	jean@mail.com	jean	fake_user_so_invalid_token	user	2022-01-03 18:30:41.220742+00	f	f	\N	\N
8	bad-user@mail.com	bad-user	fake_user_so_invalid_token	user	2022-01-03 18:30:41.220742+00	t	f	\N	\N
9	val@mail.com	val	fake_user_so_invalid_token	user	2022-01-03 18:30:41.220742+00	f	f	\N	\N
\.


--
-- TOC entry 3460 (class 0 OID 16471)
-- Dependencies: 223
-- Data for Name: user_achievements; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.user_achievements ("userId", "achievementId") FROM stdin;
1	3
2	3
3	3
4	3
5	3
1	2
2	2
3	2
1	1
2	1
\.


--
-- TOC entry 3461 (class 0 OID 16474)
-- Dependencies: 224
-- Data for Name: user_channel; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.user_channel ("userId", "channelId", role, "hasLeft", "bannedUntil", "mutedUntil", "createdAt") FROM stdin;
1	1	admin	f	\N	\N	2021-12-08 01:44:32.883044+00
2	1	admin	f	\N	\N	2021-12-08 02:05:40.883044+00
3	1	user	f	\N	2025-12-08 01:45:32.883044+00	2021-12-08 03:45:01.883044+00
2	2	admin	f	\N	\N	2021-12-08 00:44:32.883044+00
4	2	user	f	\N	\N	2021-12-08 01:46:32.883044+00
5	2	user	t	3021-12-08 01:45:32.883044+00	\N	2021-12-08 01:48:32.883044+00
2	3	admin	f	\N	\N	2021-12-08 01:56:40.883044+00
3	3	user	f	\N	\N	2021-12-08 01:56:40.883044+00
3	4	admin	f	\N	\N	2019-01-08 11:57:52.883044+00
1	4	admin	f	\N	\N	2019-01-08 12:04:14.883044+00
2	4	admin	f	\N	\N	2019-01-08 11:59:54.883044+00
3	5	admin	f	\N	\N	2020-01-07 11:58:31.883044+00
1	5	admin	f	\N	\N	2020-01-07 16:42:42.883044+00
2	5	admin	f	\N	\N	2020-01-07 15:06:25.883044+00
4	5	user	f	\N	2025-12-08 01:45:32.883044+00	2020-01-08 12:50:02.883044+00
\.


--
-- TOC entry 3473 (class 0 OID 0)
-- Dependencies: 210
-- Name: achievement_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pong
--

SELECT pg_catalog.setval('public.achievement_id_seq', 3, true);


--
-- TOC entry 3474 (class 0 OID 0)
-- Dependencies: 214
-- Name: channel_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pong
--

SELECT pg_catalog.setval('public.channel_id_seq', 5, true);


--
-- TOC entry 3475 (class 0 OID 0)
-- Dependencies: 217
-- Name: game_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pong
--

SELECT pg_catalog.setval('public.game_id_seq', 4, true);


--
-- TOC entry 3476 (class 0 OID 0)
-- Dependencies: 219
-- Name: message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pong
--

SELECT pg_catalog.setval('public.message_id_seq', 22, true);


--
-- TOC entry 3477 (class 0 OID 0)
-- Dependencies: 225
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pong
--

SELECT pg_catalog.setval('public.user_id_seq', 9, true);


--
-- TOC entry 3276 (class 2606 OID 16491)
-- Name: stats PK_071bcb8dd9f9511a3880c34c385; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.stats
    ADD CONSTRAINT "PK_071bcb8dd9f9511a3880c34c385" PRIMARY KEY ("userId");


--
-- TOC entry 3272 (class 2606 OID 16493)
-- Name: game PK_352a30652cd352f552fef73dec5; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.game
    ADD CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY (id);


--
-- TOC entry 3257 (class 2606 OID 16495)
-- Name: achievement PK_441339f40e8ce717525a381671e; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.achievement
    ADD CONSTRAINT "PK_441339f40e8ce717525a381671e" PRIMARY KEY (id);


--
-- TOC entry 3265 (class 2606 OID 16497)
-- Name: blocked PK_544e5194f95d3a44fa407fc40e3; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.blocked
    ADD CONSTRAINT "PK_544e5194f95d3a44fa407fc40e3" PRIMARY KEY ("applicantId", "recipientId");


--
-- TOC entry 3268 (class 2606 OID 16499)
-- Name: channel PK_590f33ee6ee7d76437acf362e39; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.channel
    ADD CONSTRAINT "PK_590f33ee6ee7d76437acf362e39" PRIMARY KEY (id);


--
-- TOC entry 3270 (class 2606 OID 16501)
-- Name: friendship PK_62ef30a48ad5af9df3d269420c3; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.friendship
    ADD CONSTRAINT "PK_62ef30a48ad5af9df3d269420c3" PRIMARY KEY ("applicantId", "recipientId");


--
-- TOC entry 3261 (class 2606 OID 16503)
-- Name: avatar PK_b6abb9e4579bb7fca4d823a5e66; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.avatar
    ADD CONSTRAINT "PK_b6abb9e4579bb7fca4d823a5e66" PRIMARY KEY ("userId");


--
-- TOC entry 3274 (class 2606 OID 16505)
-- Name: message PK_ba01f0a3e0123651915008bc578; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY (id);


--
-- TOC entry 3288 (class 2606 OID 16507)
-- Name: user_achievements PK_c1acd69cf91b1e353634c152dd7; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT "PK_c1acd69cf91b1e353634c152dd7" PRIMARY KEY ("userId", "achievementId");


--
-- TOC entry 3280 (class 2606 OID 16509)
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- TOC entry 3290 (class 2606 OID 16511)
-- Name: user_channel PK_dd2c8ff53b41e5f896d802dbe85; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.user_channel
    ADD CONSTRAINT "PK_dd2c8ff53b41e5f896d802dbe85" PRIMARY KEY ("userId", "channelId");


--
-- TOC entry 3278 (class 2606 OID 16597)
-- Name: stats UQ_071bcb8dd9f9511a3880c34c385; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.stats
    ADD CONSTRAINT "UQ_071bcb8dd9f9511a3880c34c385" UNIQUE ("userId");


--
-- TOC entry 3282 (class 2606 OID 16513)
-- Name: user UQ_78a916df40e02a9deb1c4b75edb; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE (username);


--
-- TOC entry 3263 (class 2606 OID 16599)
-- Name: avatar UQ_b6abb9e4579bb7fca4d823a5e66; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.avatar
    ADD CONSTRAINT "UQ_b6abb9e4579bb7fca4d823a5e66" UNIQUE ("userId");


--
-- TOC entry 3259 (class 2606 OID 16515)
-- Name: achievement UQ_d348405b3018bb2266e67affcd4; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.achievement
    ADD CONSTRAINT "UQ_d348405b3018bb2266e67affcd4" UNIQUE (title);


--
-- TOC entry 3284 (class 2606 OID 16517)
-- Name: user UQ_e12875dfb3b1d92d7d7c5377e22; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email);


--
-- TOC entry 3285 (class 1259 OID 16518)
-- Name: IDX_3ac6bc9da3e8a56f3f7082012d; Type: INDEX; Schema: public; Owner: pong
--

CREATE INDEX "IDX_3ac6bc9da3e8a56f3f7082012d" ON public.user_achievements USING btree ("userId");


--
-- TOC entry 3266 (class 1259 OID 16519)
-- Name: IDX_5577bed8fb22d8661602fafd09; Type: INDEX; Schema: public; Owner: pong
--

CREATE INDEX "IDX_5577bed8fb22d8661602fafd09" ON public.channel USING btree (title);


--
-- TOC entry 3286 (class 1259 OID 16520)
-- Name: IDX_6a5a5816f54d0044ba5f3dc2b7; Type: INDEX; Schema: public; Owner: pong
--

CREATE INDEX "IDX_6a5a5816f54d0044ba5f3dc2b7" ON public.user_achievements USING btree ("achievementId");


--
-- TOC entry 3301 (class 2606 OID 16601)
-- Name: stats FK_071bcb8dd9f9511a3880c34c385; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.stats
    ADD CONSTRAINT "FK_071bcb8dd9f9511a3880c34c385" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- TOC entry 3304 (class 2606 OID 16526)
-- Name: user_channel FK_0a7960363de8a8af7253a934e67; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.user_channel
    ADD CONSTRAINT "FK_0a7960363de8a8af7253a934e67" FOREIGN KEY ("channelId") REFERENCES public.channel(id) ON DELETE CASCADE;


--
-- TOC entry 3302 (class 2606 OID 16531)
-- Name: user_achievements FK_3ac6bc9da3e8a56f3f7082012dd; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT "FK_3ac6bc9da3e8a56f3f7082012dd" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3295 (class 2606 OID 16536)
-- Name: friendship FK_40a876257fa07c2a89b75f1b53d; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.friendship
    ADD CONSTRAINT "FK_40a876257fa07c2a89b75f1b53d" FOREIGN KEY ("recipientId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- TOC entry 3299 (class 2606 OID 16541)
-- Name: message FK_446251f8ceb2132af01b68eb593; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT "FK_446251f8ceb2132af01b68eb593" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE SET NULL;


--
-- TOC entry 3292 (class 2606 OID 16546)
-- Name: blocked FK_4843b3c73d560d25ece2c91739a; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.blocked
    ADD CONSTRAINT "FK_4843b3c73d560d25ece2c91739a" FOREIGN KEY ("recipientId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- TOC entry 3305 (class 2606 OID 16551)
-- Name: user_channel FK_4e2726725e7890ce4bc31e0ed4f; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.user_channel
    ADD CONSTRAINT "FK_4e2726725e7890ce4bc31e0ed4f" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- TOC entry 3300 (class 2606 OID 16556)
-- Name: message FK_5fdbbcb32afcea663c2bea2954f; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT "FK_5fdbbcb32afcea663c2bea2954f" FOREIGN KEY ("channelId") REFERENCES public.channel(id) ON DELETE CASCADE;


--
-- TOC entry 3303 (class 2606 OID 16561)
-- Name: user_achievements FK_6a5a5816f54d0044ba5f3dc2b74; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT "FK_6a5a5816f54d0044ba5f3dc2b74" FOREIGN KEY ("achievementId") REFERENCES public.achievement(id);


--
-- TOC entry 3296 (class 2606 OID 16566)
-- Name: friendship FK_940ce313c862033898f3523b3b9; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.friendship
    ADD CONSTRAINT "FK_940ce313c862033898f3523b3b9" FOREIGN KEY ("applicantId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- TOC entry 3291 (class 2606 OID 16606)
-- Name: avatar FK_b6abb9e4579bb7fca4d823a5e66; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.avatar
    ADD CONSTRAINT "FK_b6abb9e4579bb7fca4d823a5e66" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- TOC entry 3293 (class 2606 OID 16576)
-- Name: blocked FK_bbcd5996b5d4ce61cb0527bb75f; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.blocked
    ADD CONSTRAINT "FK_bbcd5996b5d4ce61cb0527bb75f" FOREIGN KEY ("applicantId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- TOC entry 3294 (class 2606 OID 16581)
-- Name: channel FK_bdfef605fedc02f3f9d60f1bc07; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.channel
    ADD CONSTRAINT "FK_bdfef605fedc02f3f9d60f1bc07" FOREIGN KEY ("ownerId") REFERENCES public."user"(id) ON DELETE SET NULL;


--
-- TOC entry 3297 (class 2606 OID 16586)
-- Name: game FK_c9a88636f232892a7ac8eaec0e7; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.game
    ADD CONSTRAINT "FK_c9a88636f232892a7ac8eaec0e7" FOREIGN KEY ("looserId") REFERENCES public."user"(id) ON DELETE SET NULL;


--
-- TOC entry 3298 (class 2606 OID 16591)
-- Name: game FK_cd57acb58d1147c23da5cd09cae; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.game
    ADD CONSTRAINT "FK_cd57acb58d1147c23da5cd09cae" FOREIGN KEY ("winnerId") REFERENCES public."user"(id) ON DELETE SET NULL;


-- Completed on 2022-01-03 19:24:04 UTC

--
-- PostgreSQL database dump complete
--

