SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

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

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: organizations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."organizations" ("id", "name", "slug", "industry", "size", "website", "created_at", "updated_at") VALUES
	('00000000-0000-0000-0000-000000000001', 'Test Corporation', 'test-corp', 'Technology', 'large', NULL, '2025-08-25 02:34:55.291596+00', '2025-08-25 02:34:55.291596+00'),
	('00000000-0000-0000-0000-000000000002', 'Demo Industries', 'demo-ind', 'Manufacturing', 'medium', NULL, '2025-08-25 02:34:55.291596+00', '2025-08-25 02:34:55.291596+00'),
	('org_31lxFCIlO4T3LC6GM7WZjdQIsI5', 'ORGANIZATION C', 'organization-c', NULL, NULL, NULL, '2025-08-25 08:59:15.299918+00', '2025-08-25 16:19:44.896126+00'),
	('org_31mooa3wYsA7IcG6MpuNyd9RFeb', 'XYZ Operations Inc.', 'xyz-operations-inc', NULL, NULL, NULL, '2025-08-25 16:19:45.212858+00', '2025-08-25 17:16:39.527678+00'),
	('org_31luEYOGGPlg2DLPPB85tYiLPYF', 'ESG Advising LLC', 'esg-advising-llc', NULL, NULL, NULL, '2025-08-25 08:38:10.744706+00', '2025-08-25 08:42:06.235523+00'),
	('org_31lv9uuuDcrnFGgQPAlVMQvNgGA', 'Some Good', 'some-good', NULL, NULL, NULL, '2025-08-25 08:42:06.435021+00', '2025-08-25 08:43:54.043545+00'),
	('org_31lvNX2Q25U3MVqIkTf4t0VfsGt', 'Organization B', 'organization-b', NULL, NULL, NULL, '2025-08-25 08:43:54.338056+00', '2025-08-25 18:41:21.665486+00');


--
-- Data for Name: organization_invitations; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."profiles" ("id", "email", "full_name", "avatar_url", "department", "is_verified", "created_at", "updated_at") VALUES
	('user_31kyaEY7CrL3UW7gyV7wRTrnqCg', 'michaeljwillis@me.com', NULL, NULL, NULL, false, '2025-08-25 08:48:38.374456+00', '2025-08-25 17:16:39.685229+00'),
	('user_31l2Om4kvaC0aFKdvxW1XVmI7Hp', 'michaeljwillis@gmail.com', 'Michael Willis', NULL, NULL, false, '2025-08-25 08:38:11.09023+00', '2025-08-25 18:41:21.976506+00');


--
-- Data for Name: organization_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."organization_members" ("id", "organization_id", "user_id", "role", "joined_at") VALUES
	('b67e321a-3b56-495e-b63d-a927258ab652', 'org_31luEYOGGPlg2DLPPB85tYiLPYF', 'user_31l2Om4kvaC0aFKdvxW1XVmI7Hp', 'admin', '2025-08-25 08:41:30.478918+00'),
	('3abc41c1-ca2e-419d-95ba-62c45b350e92', 'org_31lv9uuuDcrnFGgQPAlVMQvNgGA', 'user_31l2Om4kvaC0aFKdvxW1XVmI7Hp', 'admin', '2025-08-25 08:42:06.547882+00'),
	('46c7a22a-dc5d-40fe-906d-13a301ded53b', 'org_31lvNX2Q25U3MVqIkTf4t0VfsGt', 'user_31l2Om4kvaC0aFKdvxW1XVmI7Hp', 'admin', '2025-08-25 08:43:54.452291+00'),
	('17e8f1a4-a4ea-4973-9e78-f5d855f8a982', 'org_31lvNX2Q25U3MVqIkTf4t0VfsGt', 'user_31kyaEY7CrL3UW7gyV7wRTrnqCg', 'member', '2025-08-25 08:48:38.389845+00'),
	('32ff917d-c65e-4d2b-93e6-742541b3197a', 'org_31lxFCIlO4T3LC6GM7WZjdQIsI5', 'user_31kyaEY7CrL3UW7gyV7wRTrnqCg', 'admin', '2025-08-25 08:59:15.44982+00'),
	('2cb82cac-0dd2-41b8-ae4a-4928d98216ef', 'org_31mooa3wYsA7IcG6MpuNyd9RFeb', 'user_31kyaEY7CrL3UW7gyV7wRTrnqCg', 'admin', '2025-08-25 16:19:45.346063+00');


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: iceberg_namespaces; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: iceberg_tables; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 1, false);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;
