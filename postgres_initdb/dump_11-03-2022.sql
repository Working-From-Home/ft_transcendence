--
-- PostgreSQL database dump
--

-- Dumped from database version 14.1
-- Dumped by pg_dump version 14.1

-- Started on 2022-03-11 09:57:29 UTC

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
-- TOC entry 3473 (class 0 OID 0)
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
-- TOC entry 3474 (class 0 OID 0)
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
-- TOC entry 3475 (class 0 OID 0)
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
-- TOC entry 3476 (class 0 OID 0)
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
    xp integer DEFAULT 0 NOT NULL,
    victories integer DEFAULT 0 NOT NULL,
    losses integer DEFAULT 0 NOT NULL,
    CONSTRAINT "CHK_adfd86107a516a476bf6faa77f" CHECK ((victories >= 0)),
    CONSTRAINT "CHK_e59446df59ee39832f7d44a879" CHECK ((xp >= 0)),
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
    password character varying,
    role public.user_role_enum DEFAULT 'user'::public.user_role_enum NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    banned boolean DEFAULT false NOT NULL,
    "twoFaEnabled" boolean DEFAULT false NOT NULL,
    "twoFaSecret" text,
    "googleAccessToken" text,
    "fortyTwoAccessToken" text,
    "googleSub" text,
    "fortyTwoSub" text,
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
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_channel OWNER TO pong;

--
-- TOC entry 225 (class 1259 OID 16481)
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
-- TOC entry 3477 (class 0 OID 0)
-- Dependencies: 225
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pong
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- TOC entry 226 (class 1259 OID 16482)
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
-- TOC entry 3227 (class 2604 OID 16486)
-- Name: achievement id; Type: DEFAULT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.achievement ALTER COLUMN id SET DEFAULT nextval('public.achievement_id_seq'::regclass);


--
-- TOC entry 3231 (class 2604 OID 16487)
-- Name: channel id; Type: DEFAULT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.channel ALTER COLUMN id SET DEFAULT nextval('public.channel_id_seq'::regclass);


--
-- TOC entry 3236 (class 2604 OID 16488)
-- Name: game id; Type: DEFAULT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.game ALTER COLUMN id SET DEFAULT nextval('public.game_id_seq'::regclass);


--
-- TOC entry 3239 (class 2604 OID 16489)
-- Name: message id; Type: DEFAULT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.message ALTER COLUMN id SET DEFAULT nextval('public.message_id_seq'::regclass);


--
-- TOC entry 3250 (class 2604 OID 16490)
-- Name: user id; Type: DEFAULT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- TOC entry 3451 (class 0 OID 16405)
-- Dependencies: 209
-- Data for Name: achievement; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.achievement (id, title, description) FROM stdin;
1	Tyson Fury	Win 30 games in a row.
2	Pilier de bar	Play 15 games each day for one month
3	Bienvenu	Create an account
\.


--
-- TOC entry 3453 (class 0 OID 16411)
-- Dependencies: 211
-- Data for Name: avatar; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.avatar ("userId", filename, mimetype, data) FROM stdin;
11	unchanged_orange.png	image/png	\\x89504e470d0a1a0a0000000d49484452000000c8000000c808030000009a865eac0000000467414d410000b18f0bfc61050000001274455874536f667477617265004a64656e7469636f6e9bca097e00000219504c544500000059bec759bec759bec759bec759bec759bec759bec759bec759bec72e848c2e848c2e848c2e848c2e848c2e848c2e848c2e848c2e848c59bdc659bec759bec72e848b2e848c2e848c2d848c59bec759bec759bec759bec72e848c2e848c2e848c59bdc759bdc759bec759bec759bec72e848c2e848c2e848c58bec759bdc659bec759bec759bec759bec72e848c2e848c2e848c2e848c59bec759bec759bec72d848c2e848c2e848c2e848c59bec758bec72e848c2e848c2d848c59bec759bec759bec62d848b2e848c2e848c59bec759bec72d848c2e848b59bec759bec62e848c2e848c59bec758bdc659bec72e848c2e848c58bec659bec72e848c2d848c59bec72e848c58bec759bec72d848c2e848c59bec659bdc72d848c58bec759bec759bec62e848c58bdc72e848b58bec758bec658bdc759bdc659bec62e848c59bec759bec759bec758bdc659bec758bec759bec759bec759bec759bec759bdc759bec72d848c59bec759bec659bec759bec759bdc758bdc72e838c2d848c2e848c58bec759bec658bec759bdc759bdc758bec658bec759bec659bec658bec759bdc72d848c59bec759bec658bec658bec658bec758bec62d848c58bec759bec62e848b59bec659bec658bdc759bec659bdc658bec759bdc759bdc658bec758bec758bec659bec658bdc658bdc659bdc659bec759bec758bec758bec758bec62e848b58bec659bdc759bec659bdc758bec62e838c58bec60fc74e1d000000b374524e53003379bfccffd2b87f263379bfccffd2b87f264ec5594ec559d24e2cb91c2cb91cb939e8eb3939e8eb39e84cf8f2384cf8f2381be91f1be91f1b06ba06bababa535453545354c9c9c93f2b3f2b2b7a727a727ab2b2b2d5d5eaf1eaf1eaead5b97ac9c91bf2f238e8391c4ead1af06801c3293bfd960ee4e851f068c3297f2b7aea0ee4511aad681af8013bd52b0efdd53b96c339067f39510ee42906f8c3f0e47f963b2906019f1301681ae8f868add23953e8e19e16ad0000062449444154789ced9d777b1b4510c60fc8065172a1180c21109a4d5380d01135f4de31254068a1c4128a6d211c29946042b70909815042ef1d3e21922ce96edbedecdef81af3fb337eb333afa4db9b9ddbe7d6f3088220088220088220088220082260bffd0f58c6d8f2034b079994071f72e80adf5f79d8e147e029e1d10d1cb99c0d19392a4a79f44a7fc8e83191ca63a1ca55e0e8068e5bc638561faf539eb0c2e75873627ca518fd246d7413279fc2044e1d532bc74ff3054e1f8fab3ce34c6874136795c591185b7bb64a79ceb96276bebfeebc784a787413e75f208fd4f9542e9495175d2c67d7f9a42f9195978295f0e8262a23aa9118bb4c525e3eaacacef7af002baf0447bfcadec8d5ea91185b2f2aaf5167e7fbd78acaebc04a6df4ebad8ddca01b6a4454dea84b6f5454de0456c2a39bb859371263b7f0ca5b75d9f9fe6daeca88e8b75b1ab9433fd49dbcf22e7d7a77bb2aef01473772af7ea8d5bcf23e7d7a6b78e5fd60253cba91b5faa12678e53a7d7a0fb82ae1d18d3ca81fea215ef9b03ebd0daeca47c0d18d3c5a1423283fadc7c0caa5fb69455c6e1b7925fc62872b112ff6c7f543e56bfa85df9212be210ab763334fe846928a842775d94985075c8957a258148df0523095a2b130657cca0baba7d01656c92d759f062f75373de3e2c3f3c69e953e91049b0fcf815b1f66c486ccc6e775ca6cb7833c9b16d96670830eae446bd0752948cb94200882c80793aa5a2feda45ca8d60a62c47ba12846ea5b0a62c49b92171269a7e448a928462a139934022fb9874ccfa0197188ae663378974298069211f812cc007c59caf36213c3886b7499f197a08d0291590423f03685097893476632b69138d179e0cd3405d5ad318dc09b7e26e08d5025ad784662460f036f382ba9b7631989193d0cfc11809a6de53846e2460f803f94d1f1720c2311d15fb11c0afe984c47a852b136f26aece843e00f2eb504958aad0f8ce803e08f92f5349c8d6044eff39a7ea80de6ffbdc8f6d75d8d6044ef03dfa510c19ca5913726f18de07cb93b6c8cd4dfac0d94883f2d9ccbedad1adcc8543b50225eecf1a7df1e2da8914ae9ed901271fa8d7f43ecf14e1b66e4ddf7b81f6144f4f72d8d601509bd9e8a4934df5810a605bc1205ad6c2b998dcc060b4aece81e5e215df9c060a41a5e846147ef126b611562e7429491ee9cab2af8f11656788bcd0f238c4ced624c690471a9eb79bb9d9b0f1cf34ddd5f3eda23b657437ffc18adf980d690f944f3efd3524b92fbeef0da411e628b4c666f436c484af31b6a74b4a6a5c0dca7b20d797e5baae86854958fe832d2ee86536fa91ed0e5cfc8676d8d8d7c19f9bca4d81b9743238a39378f46b6abe6dc1c1a996b46da48c98821a7e65c2a5939106963a6319f767e60a27c4cec4c3b3b0bf436be2855d24ece06ad8f7ddbd24ecd0e8d8d2f5bf5b433b344ed63b29a765e1af485b4cac657c8736e223b1f641bd8736e423b1f241f13d39a71669720ba0d869d0fe29cfbb576ce6dba7c51c9ed7ce07d6c99d28fc4bec18f0ec7d8a00bdbd81a39e7b2996f6da327b9f3013ee7762e1fcb5b7da23b1f86368c756e4753c28e0ec6dcd887cfb91d55f93be4e850000f7a0c732e6f84edb3295c92ddf9d04daf5cfa1e3058cf71cb227ab23b1f0c73ae68a466518425bbf381d55a3fc006eb4f6da8d1a1001ed9fff81374b0feb400af54b2b6f361c0609a06572a99dbf9d06770c369a4101df1720b8ccc00a66aece8483b1f16090a7d60a592bd9d0f821168a592c19d0f3d022365d88d278b3b1fba84eae4f6cf4947c7dc7b105eb9fc927874ac9d0f1e6fa4f66bd2d111179b6123d04a0573e7c3f86fd227e2b6fce78c402b950cee7c108c34f7261bbd074e8b8c3702af5432b7f34130b200ad5432b7f3413062dd53c90ca211b627ed8c1c918cfc9eb347410324236c57de1e062d221b617fa49d93130a23363d95eca030c2fe4c3b2982200822110af2eab6557f05b7b0029d7691d7d71bfe4da75df874dac500bc97b2c25f549bf1d7e4c25f1d0c6f38ff0356d26917128539eda230af5ba7d32ec2d0691774da850c9d7611864ebba0d32e14c08b84ffe16917a9148d8529e30b738c601697ba9b9c96ba9e37f6aff4896896fff0b743eccec46917793dfcd4a3d32ed09474da05411004411004411004411004a1e43fa3655b3faf46cd450000000049454e44ae426082
12	premier_moccasin.png	image/png	\\x89504e470d0a1a0a0000000d49484452000000c8000000c808030000009a865eac0000000467414d410000b18f0bfc61050000001274455874536f667477617265004a64656e7469636f6e9bca097e00000015504c544500000059a0c7accfe3accfe3accfe359a0c74646469c52940d0000000774524e53007fffbf3fffffb1747c5e0000053149444154789ced9ddb72db300c449348e9ff7f721bd58945121217172e110ff7b153033ddeda96c0d5e0ed6d696969696969696969696929b1dedfa53ffd10b489afdf37e9ef4ac2bb9b383e3fa55ad23f64bf2881a2e0dd6d1c622dd810050adeddc821d5521802a3e0ddad1c422d9521200adeddccd1d6521a02a1e0dded1c4d2db521000adeddc151d73218d245c1bb7b38aa5a26433a287877174759cb68c82d0adeddc751d4321b7283827777729c6b390cb944c1bb7b394eb55c865ca0e0dddd1ccf5a4e434414bcbb9fe3a796db100105ef1ec0f15d2bc0900605ef1ec1f1a81562488582770fe1f85f2bc8900205ef1ec371d40a33e48482770fe2f8aa1568c80f0ade3d8ae35fad50431e2878f72120218628bb87d53afdd78a3244d53daad6f9c31e6788a27b50adf3d76fa42178f7985ac50f62a82170f7905ac5254ab02168f7885ae54563b42160f7805ae5657cbc2158777fadeac66a8021507777adea5677882148776fad7af830c610a0bbb3563d0e1a6548bfbbaf5633a01b6648b7bbab5633321d6848afbba7563bc41e6948a7bba3567bac30d690fbeef65ac241cf60436ebb9b6b09476fc30db9eb6ead251d868e37e4a6bbb196548961c875775b2db112c590cbee5d7d0822bdf76fde8c4421e945acf7fe4b8e8c44a9a9861cb266242a4d36e4902923516bba2187f4198946090c39a4cc48b44a61c8214d46425012430ec1190949690c39846524442532e41090919095ca9043bd8cc485921972e8362371a574861cbace485c2aa121872e3212d7b21af2c7282b8a0e4461c8781021238182683e210c903a230183683e211c9022230183a8beb25820cf8c040ea2facae2813c32123888ee378409f285a200d1fd86704100190d490ca2fc514f0ba2bdca4a0ba2bdcaca0aa2beeccd0aa2beec4d0aa2bf0f490aa2bf0fc90962b831cc0962b8314c0962b9534f0962b953cf08621a9d6404318d4e1282d8665909416cb3ac7c20c6e1623e10e370311d8875da9b0ec43aed4d0762151964dc749d0c32eebc830bb2f70774567141b61701d98191a955541064f66b15136447a6f1563141b61701d9a1f311ab8820d8418f553c901d3b7ab38a07b2bd08c80e1e865a4503414f75ad62813c0cf9fd20db8b807c1bf2eb41f00887551c901f437e3bc8f622204f43fa205be6b9962eaf654361809c0cc14235161406c8a605b1a01040ce86e031272d0a01c41aced4a18c07290c51863353a54c373b88f51b6c884a430c8f5d64417125b113a15486d89e43cc8052a7fcbb2f904012a0d4865841a6a3781fbbc882d218e2019989d23ed2d37dc91dc83494d6102fc82414ff3356395004432240f828d2f37bdd1721206414c99028102a8aed814a4971fb263a12df9ce1db2e0648ca338cdf76112f29cf40d876112f21cfc0d876112e21cf40d97611ae36cfc0d97611ad36cf40da7611ad26cfc0da7611ac26cf40db7611ac3acfc0db7611ab3acf40dc7611ab2acfc0dc7611aa2acf40dd7611aa32cfc0dd7611a932cf40de7611a922cfc0de7611a822cf40df7611a8739e81bfed224ee73cc3846d17713ae519666cbb08e3384d49a66cbb089ba36c434034db2e62508a3cc3ac6d171128659e61dab60b374a9d6798b7edc289d2e419666dbb70a208798649db2e9c28529e61cab60b278a9c6798b1edc289729167e06fbb70a25ce619e8db2e9c28d77906f2b60b27ca5d9e81bbedc289729b67606ebb70a274f20cc46d174e945e9e81b6edc289d2cf33b0b65d3851803c0367db4557f728509e81b2ed02d01d0a9667206cbb40406e50d03cc3f86d1718c8250a9c67a0c5159696969696969696969696964cfa0bf24dab49c2e05db60000000049454e44ae426082
\.


--
-- TOC entry 3454 (class 0 OID 16416)
-- Dependencies: 212
-- Data for Name: blocked; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.blocked ("applicantId", "recipientId", "createdAt") FROM stdin;
1	5	2022-01-03 18:30:41.220742+00
2	4	2022-01-03 18:30:41.220742+00
7	1	2022-01-03 18:30:41.220742+00
\.


--
-- TOC entry 3455 (class 0 OID 16421)
-- Dependencies: 213
-- Data for Name: channel; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.channel (id, "isDm", title, password, "createdAt", "ownerId") FROM stdin;
1	f	L equipe	\N	2021-12-08 01:44:32.883044+00	1
2	f	L equipe 2	\N	2021-12-08 00:44:32.883044+00	2
3	t	\N	\N	2021-12-08 11:57:52.883044+00	2
4	f	Anniv Pierre 2019	\N	2019-01-08 11:57:52.883044+00	3
5	f	Anniversaire Pierre 2020	\N	2020-01-07 11:58:31.883044+00	3
6	f	test		2022-03-11 09:38:40.545022+00	11
\.


--
-- TOC entry 3457 (class 0 OID 16428)
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
-- TOC entry 3458 (class 0 OID 16434)
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
-- TOC entry 3460 (class 0 OID 16440)
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
23	test	2022-03-11 09:42:44.076316+00	6	11
24	et moi	2022-03-11 09:42:59.009908+00	6	12
\.


--
-- TOC entry 3462 (class 0 OID 16447)
-- Dependencies: 220
-- Data for Name: stats; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.stats ("userId", xp, victories, losses) FROM stdin;
1	42	15	7
2	23	150	97
3	9	15	90
4	1	2	2
5	8	5	5
6	12	12	5
7	14	15	5
8	4	10	2
9	14	15	5
11	0	0	0
12	0	0	0
\.


--
-- TOC entry 3463 (class 0 OID 16456)
-- Dependencies: 221
-- Data for Name: typeorm_metadata; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.typeorm_metadata (type, database, schema, "table", name, value) FROM stdin;
VIEW	\N	public	\N	users_in_channel	SELECT uc."userId" AS "userId",\n\t\t\t\t\t\tuc."channelId" AS "channelId",\n\t\t\t\t\t\t(uc."userId" = c."ownerId") AS "isOwner",\n\t\t\t\t\t\t(uc."role" = 'admin') AS "isAdmin",\n\t\t\t\t\t\tuc."mutedUntil" AS mutedUntil\n\t\t\tFROM "user_channel" "uc"\n\t\t\t\tINNER JOIN "channel" AS "c" ON uc."channelId" = c."id"\n\t\t\tWHERE "hasLeft" = FALSE
\.


--
-- TOC entry 3464 (class 0 OID 16461)
-- Dependencies: 222
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public."user" (id, email, username, password, role, "createdAt", banned, "twoFaEnabled", "twoFaSecret", "googleAccessToken", "fortyTwoAccessToken", "googleSub", "fortyTwoSub") FROM stdin;
1	bob@bob.com	bob	fake_user_so_invalid_token	owner	2022-01-03 18:30:41.220742+00	f	f	\N	\N	\N	\N	\N
2	marie@email.com	marie	fake_user_so_invalid_token	admin	2022-01-03 18:30:41.220742+00	f	f	\N	\N	\N	\N	\N
3	jacques@email.com	jacques	fake_user_so_invalid_token	user	2022-01-03 18:30:41.220742+00	f	f	\N	\N	\N	\N	\N
4	stef@mail.com	stef	fake_user_so_invalid_token	user	2022-01-03 18:30:41.220742+00	f	f	\N	\N	\N	\N	\N
5	alice@mail.com	alice	fake_user_so_invalid_token	user	2022-01-03 18:30:41.220742+00	f	f	\N	\N	\N	\N	\N
6	pierre@mail.com	pierre	fake_user_so_invalid_token	user	2022-01-03 18:30:41.220742+00	f	f	\N	\N	\N	\N	\N
7	jean@mail.com	jean	fake_user_so_invalid_token	user	2022-01-03 18:30:41.220742+00	f	f	\N	\N	\N	\N	\N
8	bad-user@mail.com	bad-user	fake_user_so_invalid_token	user	2022-01-03 18:30:41.220742+00	t	f	\N	\N	\N	\N	\N
9	val@mail.com	val	fake_user_so_invalid_token	user	2022-01-03 18:30:41.220742+00	f	f	\N	\N	\N	\N	\N
11	test@gmail.com	precious_amaranth	cd0dc48e92359923.14e85dff9aa6b84451b5f4563980703942d62dbabf38e4124bf0df4d6f6e3002	user	2022-03-11 09:38:04.098912+00	f	f	\N	\N	\N	\N	\N
12	92.alex.ds@gmail.com	magnetic_indigo	9eab327122543d19.0363b07b0de0b99a845bccb67fd7510991730dabb35f4f7323383a12473d0293	user	2022-03-11 09:42:00.1431+00	f	f	\N	\N	\N	\N	\N
\.


--
-- TOC entry 3465 (class 0 OID 16471)
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
-- TOC entry 3466 (class 0 OID 16474)
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
11	6	admin	f	\N	\N	2022-03-11 09:38:40.545022+00
12	6	user	f	\N	\N	2022-03-11 09:42:20.382769+00
\.


--
-- TOC entry 3478 (class 0 OID 0)
-- Dependencies: 210
-- Name: achievement_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pong
--

SELECT pg_catalog.setval('public.achievement_id_seq', 3, true);


--
-- TOC entry 3479 (class 0 OID 0)
-- Dependencies: 214
-- Name: channel_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pong
--

SELECT pg_catalog.setval('public.channel_id_seq', 6, true);


--
-- TOC entry 3480 (class 0 OID 0)
-- Dependencies: 217
-- Name: game_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pong
--

SELECT pg_catalog.setval('public.game_id_seq', 4, true);


--
-- TOC entry 3481 (class 0 OID 0)
-- Dependencies: 219
-- Name: message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pong
--

SELECT pg_catalog.setval('public.message_id_seq', 24, true);


--
-- TOC entry 3482 (class 0 OID 0)
-- Dependencies: 225
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pong
--

SELECT pg_catalog.setval('public.user_id_seq', 12, true);


--
-- TOC entry 3275 (class 2606 OID 16492)
-- Name: stats PK_071bcb8dd9f9511a3880c34c385; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.stats
    ADD CONSTRAINT "PK_071bcb8dd9f9511a3880c34c385" PRIMARY KEY ("userId");


--
-- TOC entry 3271 (class 2606 OID 16494)
-- Name: game PK_352a30652cd352f552fef73dec5; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.game
    ADD CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY (id);


--
-- TOC entry 3256 (class 2606 OID 16496)
-- Name: achievement PK_441339f40e8ce717525a381671e; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.achievement
    ADD CONSTRAINT "PK_441339f40e8ce717525a381671e" PRIMARY KEY (id);


--
-- TOC entry 3264 (class 2606 OID 16498)
-- Name: blocked PK_544e5194f95d3a44fa407fc40e3; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.blocked
    ADD CONSTRAINT "PK_544e5194f95d3a44fa407fc40e3" PRIMARY KEY ("applicantId", "recipientId");


--
-- TOC entry 3267 (class 2606 OID 16500)
-- Name: channel PK_590f33ee6ee7d76437acf362e39; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.channel
    ADD CONSTRAINT "PK_590f33ee6ee7d76437acf362e39" PRIMARY KEY (id);


--
-- TOC entry 3269 (class 2606 OID 16502)
-- Name: friendship PK_62ef30a48ad5af9df3d269420c3; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.friendship
    ADD CONSTRAINT "PK_62ef30a48ad5af9df3d269420c3" PRIMARY KEY ("applicantId", "recipientId");


--
-- TOC entry 3260 (class 2606 OID 16504)
-- Name: avatar PK_b6abb9e4579bb7fca4d823a5e66; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.avatar
    ADD CONSTRAINT "PK_b6abb9e4579bb7fca4d823a5e66" PRIMARY KEY ("userId");


--
-- TOC entry 3273 (class 2606 OID 16506)
-- Name: message PK_ba01f0a3e0123651915008bc578; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY (id);


--
-- TOC entry 3293 (class 2606 OID 16508)
-- Name: user_achievements PK_c1acd69cf91b1e353634c152dd7; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT "PK_c1acd69cf91b1e353634c152dd7" PRIMARY KEY ("userId", "achievementId");


--
-- TOC entry 3281 (class 2606 OID 16510)
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- TOC entry 3295 (class 2606 OID 16512)
-- Name: user_channel PK_dd2c8ff53b41e5f896d802dbe85; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.user_channel
    ADD CONSTRAINT "PK_dd2c8ff53b41e5f896d802dbe85" PRIMARY KEY ("userId", "channelId");


--
-- TOC entry 3277 (class 2606 OID 16514)
-- Name: stats UQ_071bcb8dd9f9511a3880c34c385; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.stats
    ADD CONSTRAINT "UQ_071bcb8dd9f9511a3880c34c385" UNIQUE ("userId");


--
-- TOC entry 3283 (class 2606 OID 16516)
-- Name: user UQ_1132e9fb7a2bb725a1fed6996c7; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_1132e9fb7a2bb725a1fed6996c7" UNIQUE ("googleSub");


--
-- TOC entry 3285 (class 2606 OID 16518)
-- Name: user UQ_78a916df40e02a9deb1c4b75edb; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE (username);


--
-- TOC entry 3262 (class 2606 OID 16520)
-- Name: avatar UQ_b6abb9e4579bb7fca4d823a5e66; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.avatar
    ADD CONSTRAINT "UQ_b6abb9e4579bb7fca4d823a5e66" UNIQUE ("userId");


--
-- TOC entry 3287 (class 2606 OID 16522)
-- Name: user UQ_c98a14e4b84cb502f75039aec28; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_c98a14e4b84cb502f75039aec28" UNIQUE ("fortyTwoSub");


--
-- TOC entry 3258 (class 2606 OID 16524)
-- Name: achievement UQ_d348405b3018bb2266e67affcd4; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.achievement
    ADD CONSTRAINT "UQ_d348405b3018bb2266e67affcd4" UNIQUE (title);


--
-- TOC entry 3289 (class 2606 OID 16526)
-- Name: user UQ_e12875dfb3b1d92d7d7c5377e22; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email);


--
-- TOC entry 3278 (class 1259 OID 16527)
-- Name: IDX_1132e9fb7a2bb725a1fed6996c; Type: INDEX; Schema: public; Owner: pong
--

CREATE INDEX "IDX_1132e9fb7a2bb725a1fed6996c" ON public."user" USING btree ("googleSub");


--
-- TOC entry 3290 (class 1259 OID 16528)
-- Name: IDX_3ac6bc9da3e8a56f3f7082012d; Type: INDEX; Schema: public; Owner: pong
--

CREATE INDEX "IDX_3ac6bc9da3e8a56f3f7082012d" ON public.user_achievements USING btree ("userId");


--
-- TOC entry 3265 (class 1259 OID 16529)
-- Name: IDX_5577bed8fb22d8661602fafd09; Type: INDEX; Schema: public; Owner: pong
--

CREATE INDEX "IDX_5577bed8fb22d8661602fafd09" ON public.channel USING btree (title);


--
-- TOC entry 3291 (class 1259 OID 16530)
-- Name: IDX_6a5a5816f54d0044ba5f3dc2b7; Type: INDEX; Schema: public; Owner: pong
--

CREATE INDEX "IDX_6a5a5816f54d0044ba5f3dc2b7" ON public.user_achievements USING btree ("achievementId");


--
-- TOC entry 3279 (class 1259 OID 16531)
-- Name: IDX_c98a14e4b84cb502f75039aec2; Type: INDEX; Schema: public; Owner: pong
--

CREATE INDEX "IDX_c98a14e4b84cb502f75039aec2" ON public."user" USING btree ("fortyTwoSub");


--
-- TOC entry 3306 (class 2606 OID 16532)
-- Name: stats FK_071bcb8dd9f9511a3880c34c385; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.stats
    ADD CONSTRAINT "FK_071bcb8dd9f9511a3880c34c385" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- TOC entry 3309 (class 2606 OID 16537)
-- Name: user_channel FK_0a7960363de8a8af7253a934e67; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.user_channel
    ADD CONSTRAINT "FK_0a7960363de8a8af7253a934e67" FOREIGN KEY ("channelId") REFERENCES public.channel(id) ON DELETE CASCADE;


--
-- TOC entry 3307 (class 2606 OID 16542)
-- Name: user_achievements FK_3ac6bc9da3e8a56f3f7082012dd; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT "FK_3ac6bc9da3e8a56f3f7082012dd" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3300 (class 2606 OID 16547)
-- Name: friendship FK_40a876257fa07c2a89b75f1b53d; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.friendship
    ADD CONSTRAINT "FK_40a876257fa07c2a89b75f1b53d" FOREIGN KEY ("recipientId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- TOC entry 3304 (class 2606 OID 16552)
-- Name: message FK_446251f8ceb2132af01b68eb593; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT "FK_446251f8ceb2132af01b68eb593" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE SET NULL;


--
-- TOC entry 3297 (class 2606 OID 16557)
-- Name: blocked FK_4843b3c73d560d25ece2c91739a; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.blocked
    ADD CONSTRAINT "FK_4843b3c73d560d25ece2c91739a" FOREIGN KEY ("recipientId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- TOC entry 3310 (class 2606 OID 16562)
-- Name: user_channel FK_4e2726725e7890ce4bc31e0ed4f; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.user_channel
    ADD CONSTRAINT "FK_4e2726725e7890ce4bc31e0ed4f" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- TOC entry 3305 (class 2606 OID 16567)
-- Name: message FK_5fdbbcb32afcea663c2bea2954f; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT "FK_5fdbbcb32afcea663c2bea2954f" FOREIGN KEY ("channelId") REFERENCES public.channel(id) ON DELETE CASCADE;


--
-- TOC entry 3308 (class 2606 OID 16572)
-- Name: user_achievements FK_6a5a5816f54d0044ba5f3dc2b74; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT "FK_6a5a5816f54d0044ba5f3dc2b74" FOREIGN KEY ("achievementId") REFERENCES public.achievement(id);


--
-- TOC entry 3301 (class 2606 OID 16577)
-- Name: friendship FK_940ce313c862033898f3523b3b9; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.friendship
    ADD CONSTRAINT "FK_940ce313c862033898f3523b3b9" FOREIGN KEY ("applicantId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- TOC entry 3296 (class 2606 OID 16582)
-- Name: avatar FK_b6abb9e4579bb7fca4d823a5e66; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.avatar
    ADD CONSTRAINT "FK_b6abb9e4579bb7fca4d823a5e66" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- TOC entry 3298 (class 2606 OID 16587)
-- Name: blocked FK_bbcd5996b5d4ce61cb0527bb75f; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.blocked
    ADD CONSTRAINT "FK_bbcd5996b5d4ce61cb0527bb75f" FOREIGN KEY ("applicantId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- TOC entry 3299 (class 2606 OID 16592)
-- Name: channel FK_bdfef605fedc02f3f9d60f1bc07; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.channel
    ADD CONSTRAINT "FK_bdfef605fedc02f3f9d60f1bc07" FOREIGN KEY ("ownerId") REFERENCES public."user"(id) ON DELETE SET NULL;


--
-- TOC entry 3302 (class 2606 OID 16597)
-- Name: game FK_c9a88636f232892a7ac8eaec0e7; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.game
    ADD CONSTRAINT "FK_c9a88636f232892a7ac8eaec0e7" FOREIGN KEY ("looserId") REFERENCES public."user"(id) ON DELETE SET NULL;


--
-- TOC entry 3303 (class 2606 OID 16602)
-- Name: game FK_cd57acb58d1147c23da5cd09cae; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.game
    ADD CONSTRAINT "FK_cd57acb58d1147c23da5cd09cae" FOREIGN KEY ("winnerId") REFERENCES public."user"(id) ON DELETE SET NULL;


-- Completed on 2022-03-11 09:57:30 UTC

--
-- PostgreSQL database dump complete
--

