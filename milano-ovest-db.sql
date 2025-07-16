/*
 Navicat Premium Dump SQL

 Source Server         : milano-ovest
 Source Server Type    : PostgreSQL
 Source Server Version : 150008 (150008)
 Source Host           : aws-0-eu-central-1.pooler.supabase.com:6543
 Source Catalog        : postgres
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 150008 (150008)
 File Encoding         : 65001

 Date: 16/07/2025 18:39:22
*/


-- ----------------------------
-- Type structure for gender_enum
-- ----------------------------
DROP TYPE IF EXISTS "public"."gender_enum";
CREATE TYPE "public"."gender_enum" AS ENUM (
  'maschile',
  'femminile',
  'non-binary'
);
ALTER TYPE "public"."gender_enum" OWNER TO "postgres";

-- ----------------------------
-- Type structure for user_status
-- ----------------------------
DROP TYPE IF EXISTS "public"."user_status";
CREATE TYPE "public"."user_status" AS ENUM (
  'active',
  'waiting-for-approval',
  'disabled',
  'banned'
);
ALTER TYPE "public"."user_status" OWNER TO "postgres";

-- ----------------------------
-- Type structure for venue_types
-- ----------------------------
DROP TYPE IF EXISTS "public"."venue_types";
CREATE TYPE "public"."venue_types" AS ENUM (
  'small',
  'medium',
  'big'
);
ALTER TYPE "public"."venue_types" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for artist_notes_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."artist_notes_id_seq";
CREATE SEQUENCE "public"."artist_notes_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."artist_notes_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for artists_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."artists_id_seq";
CREATE SEQUENCE "public"."artists_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."artists_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for countries_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."countries_id_seq";
CREATE SEQUENCE "public"."countries_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."countries_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for languages_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."languages_id_seq";
CREATE SEQUENCE "public"."languages_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."languages_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for profile_notes_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."profile_notes_id_seq";
CREATE SEQUENCE "public"."profile_notes_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."profile_notes_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for profiles_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."profiles_id_seq";
CREATE SEQUENCE "public"."profiles_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."profiles_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for subdivisions_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."subdivisions_id_seq";
CREATE SEQUENCE "public"."subdivisions_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."subdivisions_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for venues_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."venues_id_seq";
CREATE SEQUENCE "public"."venues_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."venues_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for zones_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."zones_id_seq";
CREATE SEQUENCE "public"."zones_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."zones_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Table structure for accounts
-- ----------------------------
DROP TABLE IF EXISTS "public"."accounts";
CREATE TABLE "public"."accounts" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "account_id" text COLLATE "pg_catalog"."default" NOT NULL,
  "provider_id" text COLLATE "pg_catalog"."default" NOT NULL,
  "user_id" text COLLATE "pg_catalog"."default" NOT NULL,
  "access_token" text COLLATE "pg_catalog"."default",
  "refresh_token" text COLLATE "pg_catalog"."default",
  "id_token" text COLLATE "pg_catalog"."default",
  "access_token_expires_at" timestamp(6),
  "refresh_token_expires_at" timestamp(6),
  "scope" text COLLATE "pg_catalog"."default",
  "password" text COLLATE "pg_catalog"."default",
  "created_at" timestamp(6) NOT NULL,
  "updated_at" timestamp(6) NOT NULL
)
;
ALTER TABLE "public"."accounts" OWNER TO "postgres";

-- ----------------------------
-- Records of accounts
-- ----------------------------
BEGIN;
INSERT INTO "public"."accounts" ("id", "account_id", "provider_id", "user_id", "access_token", "refresh_token", "id_token", "access_token_expires_at", "refresh_token_expires_at", "scope", "password", "created_at", "updated_at") VALUES ('SjkiH3D2HsT2xvWeONlEp3awGGs2xrLF', 'rSPIrm15X59BvoBSUzjFOrRxZWx2MmFx', 'credential', 'rSPIrm15X59BvoBSUzjFOrRxZWx2MmFx', NULL, NULL, NULL, NULL, NULL, NULL, 'baadf382ebfe0cd1d82e885d8da62652:93d8eef3ebc9f3ce2d3c89263995106d26913d84165f847c92e0948a50bb648544d582fc43f540e289db4e2dd34c682d7f6fb99de9c83a0fa251bd6ddfea852c', '2025-07-16 13:10:44.923', '2025-07-16 13:10:44.923');
INSERT INTO "public"."accounts" ("id", "account_id", "provider_id", "user_id", "access_token", "refresh_token", "id_token", "access_token_expires_at", "refresh_token_expires_at", "scope", "password", "created_at", "updated_at") VALUES ('NRMJCx2LePFrGnMa1X1U11fdUGFFg1h3', 'pnFs4BxumJttWrUuZ3lbt7TBrhlJMde3', 'credential', 'pnFs4BxumJttWrUuZ3lbt7TBrhlJMde3', NULL, NULL, NULL, NULL, NULL, NULL, 'c2d921c09302ca9ef39704329d87277e:2d6673c8aed58295a84951429aebb9240a14e43b53da0744172037ae73c9a32990be66b9cd7d253185b29635f0c705ce4e0c9cd5526e323aa82b4155878a2c27', '2025-07-16 13:56:08.786', '2025-07-16 13:56:08.786');
INSERT INTO "public"."accounts" ("id", "account_id", "provider_id", "user_id", "access_token", "refresh_token", "id_token", "access_token_expires_at", "refresh_token_expires_at", "scope", "password", "created_at", "updated_at") VALUES ('Xrd8RtpQHI8mRqvqf2hXKPyKiDqqZh0X', '7FfguPdOCplD0CSxSsKsOlTcIvkzjn2K', 'credential', '7FfguPdOCplD0CSxSsKsOlTcIvkzjn2K', NULL, NULL, NULL, NULL, NULL, NULL, 'e7e08c0b52a683427845c857613b26b6:d1c74bd72cd4c99daa8ac2b70de54fbca971c636b150fb2d26c625c405eb9a32a848bac569afc07576dd566c2a99b0300271463cc56465f19ff2d10364c0ffc3', '2025-06-23 14:21:03.757', '2025-06-23 14:21:03.757');
INSERT INTO "public"."accounts" ("id", "account_id", "provider_id", "user_id", "access_token", "refresh_token", "id_token", "access_token_expires_at", "refresh_token_expires_at", "scope", "password", "created_at", "updated_at") VALUES ('EEgjd6GeAVKlW5G5dpiTtKiFvzPxqxfs', 'qPSsbIL4EOqM48BsrcjvQBJd43UGQwvx', 'credential', 'qPSsbIL4EOqM48BsrcjvQBJd43UGQwvx', NULL, NULL, NULL, NULL, NULL, NULL, 'a408d5361faed7d121bef0859f13c79a:a0f2e3fe1ff38e6606f4a69695a1737cf676d663e679064eff636a553f3bdb81cbf30fab19c97bdf5269df0d7ac87e1e48818068d2b7bdf54670ca248099a1fd', '2025-06-23 14:21:40.179', '2025-06-23 14:21:40.179');
INSERT INTO "public"."accounts" ("id", "account_id", "provider_id", "user_id", "access_token", "refresh_token", "id_token", "access_token_expires_at", "refresh_token_expires_at", "scope", "password", "created_at", "updated_at") VALUES ('0xW3RhHOSg9JUX3FYBSgdQ79TZ5bj2ZX', 'BTw1kpUUysVHkNTHr8aIsa9WFcwg4KUj', 'credential', 'BTw1kpUUysVHkNTHr8aIsa9WFcwg4KUj', NULL, NULL, NULL, NULL, NULL, NULL, '1ede1bdd5730aa14f030f93a6a80f406:00ce6543d38c51f489c0386a192aef5a38e03ebbf3ea467eff71bc6a5622c0a9cd1a9d9803b553d2df7a066431b4e4d31cfcdbb6d9c275c82179a0529ab749b6', '2025-05-23 18:11:18.465', '2025-05-23 18:11:18.465');
INSERT INTO "public"."accounts" ("id", "account_id", "provider_id", "user_id", "access_token", "refresh_token", "id_token", "access_token_expires_at", "refresh_token_expires_at", "scope", "password", "created_at", "updated_at") VALUES ('cz2ZO70Xc8t6MoGuuPBwlNJxBd6uwPT1', '7Raq7QuyjE7ym59FhIiR59efYAlvOeJp', 'credential', '7Raq7QuyjE7ym59FhIiR59efYAlvOeJp', NULL, NULL, NULL, NULL, NULL, NULL, '99e9e3e1b7be792316fa8128711bdcaf:05114f3668997c2923ca5c4596078ef1be6c98e2b88cb531247c553bd29b5a116c2967c6e60597f7e8c036690e1215cd6698de28a7c928af666432f8f3be87e6', '2025-06-25 08:38:26.289', '2025-06-25 08:38:26.289');
INSERT INTO "public"."accounts" ("id", "account_id", "provider_id", "user_id", "access_token", "refresh_token", "id_token", "access_token_expires_at", "refresh_token_expires_at", "scope", "password", "created_at", "updated_at") VALUES ('ajHZkCd8tk7wPMcLkfcCK1GjqHBpFdD1', 'UegmCXJMVpje71qgOqTjRA5ZB9W8YirZ', 'credential', 'UegmCXJMVpje71qgOqTjRA5ZB9W8YirZ', NULL, NULL, NULL, NULL, NULL, NULL, '68fa29ec54d24d519e55f765a1737451:941954cf850ec5c0c1377611902d822ead6ee099e897685af0ad0b1e2308a737d5fa204e126f196bcd39c4451b65ec55eb4133832c62b32ee18f13600ed5d6ca', '2025-06-25 08:38:59.428', '2025-06-25 08:38:59.428');
INSERT INTO "public"."accounts" ("id", "account_id", "provider_id", "user_id", "access_token", "refresh_token", "id_token", "access_token_expires_at", "refresh_token_expires_at", "scope", "password", "created_at", "updated_at") VALUES ('qsLYvl0R9N9FBSHqQyggmFdHPsoW7fyU', 'WOIITxYuXrybPj7IdeiPw5VQUhtttefl', 'credential', 'WOIITxYuXrybPj7IdeiPw5VQUhtttefl', NULL, NULL, NULL, NULL, NULL, NULL, 'cbfe559bd5e94b4e79e036eb2350f397:587dd19eaa37c344004cd2eb8f7376101f77569b2848b4672a2fc4461d5fc024b9844339ad6a79fae502bc5adb0a022fdb1405786333e9324948e242e53f80e5', '2025-06-25 08:39:21.477', '2025-06-25 08:39:21.477');
INSERT INTO "public"."accounts" ("id", "account_id", "provider_id", "user_id", "access_token", "refresh_token", "id_token", "access_token_expires_at", "refresh_token_expires_at", "scope", "password", "created_at", "updated_at") VALUES ('cG2lVThLuk2pPVKeG39MLZ4EN9cTdQZH', 'XKhiGjTht1pd4Ge7oB1m1TTHCsHvwjNA', 'credential', 'XKhiGjTht1pd4Ge7oB1m1TTHCsHvwjNA', NULL, NULL, NULL, NULL, NULL, NULL, '5daadf02454095c1215192ca2a397f81:1552f44b38f83871a80a24e18bf1185037137dfcec3f1293ecb4837d505be072556f51c78aa44ebf1a267eb58ad1b071d44a06e0c7e62c8176af3c9178cf1c72', '2025-06-25 08:41:05.991', '2025-06-25 08:41:05.991');
INSERT INTO "public"."accounts" ("id", "account_id", "provider_id", "user_id", "access_token", "refresh_token", "id_token", "access_token_expires_at", "refresh_token_expires_at", "scope", "password", "created_at", "updated_at") VALUES ('aL7unpwZjVkpxCUWkbkGl8Fnrd1iHWI4', '42El0wMZG4fdVf7lp7d5v7ccvHZJywv6', 'credential', '42El0wMZG4fdVf7lp7d5v7ccvHZJywv6', NULL, NULL, NULL, NULL, NULL, NULL, 'f1b5948ad41f8b238bb8430e328778be:a4e605d9b56a02f866732aade8113e24d20add8d66209a64923b60b99e00cdde54fc5672a2c2cf094392bee3ebba94758bd74c9637fd96b617e2925e92cf5257', '2025-06-27 13:43:22.055', '2025-06-27 13:43:22.055');
INSERT INTO "public"."accounts" ("id", "account_id", "provider_id", "user_id", "access_token", "refresh_token", "id_token", "access_token_expires_at", "refresh_token_expires_at", "scope", "password", "created_at", "updated_at") VALUES ('Nawze14ru9nkjxADBFM6xWvHOlnxkALZ', 'f8NbEUJ88icpxntUkpj8m1bChJjRZrKM', 'credential', 'f8NbEUJ88icpxntUkpj8m1bChJjRZrKM', NULL, NULL, NULL, NULL, NULL, NULL, 'fb9d5b4e926dcc5d4a3fc3f73abe2f6e:25bef1560eed40a715f7545f114a9d6803fa3bbd723e4d1f4e40444e802afcd7bdee59e5023a2f5b0e6aef03aace90500c605a46f234d671251d515adc295167', '2025-06-27 14:17:49.682', '2025-06-27 14:17:49.682');
INSERT INTO "public"."accounts" ("id", "account_id", "provider_id", "user_id", "access_token", "refresh_token", "id_token", "access_token_expires_at", "refresh_token_expires_at", "scope", "password", "created_at", "updated_at") VALUES ('bFmm8sdVCSS6D5wDNArG7R3Ioczri9xj', '31RubGSMGbYAnuvGbZCAjFBgJoV8P1t8', 'credential', '31RubGSMGbYAnuvGbZCAjFBgJoV8P1t8', NULL, NULL, NULL, NULL, NULL, NULL, '55d7e0c629bfff1a36a71e7e02be5cc3:a900480bcf67778f74e6428a039643510558b23b99d0c49fd36a648ae44602aa561a0430660bdfcf6f3077cfd281daadf72db098457f1a57e5715177faa9d12b', '2025-06-27 14:32:11.214', '2025-06-27 14:32:11.214');
INSERT INTO "public"."accounts" ("id", "account_id", "provider_id", "user_id", "access_token", "refresh_token", "id_token", "access_token_expires_at", "refresh_token_expires_at", "scope", "password", "created_at", "updated_at") VALUES ('Dn5Vx1g4mTFIFTcZBONk9oYboCsWXRin', 'DLQWfgizkAZDfFXqTJ2RbtV84QD4rIoO', 'credential', 'DLQWfgizkAZDfFXqTJ2RbtV84QD4rIoO', NULL, NULL, NULL, NULL, NULL, NULL, '787c416b586a07772137a18c4cebbcbc:5ac17cc8e5e3af9983c625e1e022f7cb38e3c3e3e9ae34dee0d7d1b4a02a191e5058e142a08305a96e03d40d532a87c1459d277a68f270d346e7a45a5be0788f', '2025-06-27 15:24:57.528', '2025-06-27 15:24:57.528');
INSERT INTO "public"."accounts" ("id", "account_id", "provider_id", "user_id", "access_token", "refresh_token", "id_token", "access_token_expires_at", "refresh_token_expires_at", "scope", "password", "created_at", "updated_at") VALUES ('su2lEvsHmrCFNWama1zswcmWl4b2QBCw', 'vEn3AdwfLK5k7RB9a1baOkGfxI9HVTMB', 'credential', 'vEn3AdwfLK5k7RB9a1baOkGfxI9HVTMB', NULL, NULL, NULL, NULL, NULL, NULL, '0fdad9f8dafcf9b7039b67fead8bad7b:1b961528a7e3ce9242d14d7663dc9fe78d3fc2ac4c87238ea30499579d1d88a1a190d8e1a77fc722288450d934916c867505f21fc73feca90e6621acd2082563', '2025-06-27 17:31:08.46', '2025-06-27 17:31:08.46');
INSERT INTO "public"."accounts" ("id", "account_id", "provider_id", "user_id", "access_token", "refresh_token", "id_token", "access_token_expires_at", "refresh_token_expires_at", "scope", "password", "created_at", "updated_at") VALUES ('jsn8NcHVW0f48pdaPc26xIMJym867S6c', 'KDyIv0QgZ55zXJfhnG8RW55CLpTTy2BH', 'credential', 'KDyIv0QgZ55zXJfhnG8RW55CLpTTy2BH', NULL, NULL, NULL, NULL, NULL, NULL, 'ddb1f7299da81a4602a088c85b0c3e66:160c420df11f196b2fc9da50466fd4e8ced370fd097f6e058b9a071e798269a9868bfd7f727a426ef9e7306861a7c29c918de56ca89c04c9c3598ed341866e2f', '2025-06-28 16:02:45.523', '2025-06-28 16:02:45.523');
INSERT INTO "public"."accounts" ("id", "account_id", "provider_id", "user_id", "access_token", "refresh_token", "id_token", "access_token_expires_at", "refresh_token_expires_at", "scope", "password", "created_at", "updated_at") VALUES ('4AyIHO4eaMXfavRtf78s31XZroKuyhKg', 'tVG7xjyBrvQ6X4HYe0QufaG7tbMopbzc', 'credential', 'tVG7xjyBrvQ6X4HYe0QufaG7tbMopbzc', NULL, NULL, NULL, NULL, NULL, NULL, 'a1dd9838caf898e391c386f3558a9731:0204e56400c35b7e5c2cd84cbbfd84b7a885873bfb7350e4e0dc99edfe15d06cff1f0f7900f459dab804247b3d4ac756ceb365baace2825a350aea5a2e3bb033', '2025-06-30 15:31:46.67', '2025-06-30 15:31:46.67');
INSERT INTO "public"."accounts" ("id", "account_id", "provider_id", "user_id", "access_token", "refresh_token", "id_token", "access_token_expires_at", "refresh_token_expires_at", "scope", "password", "created_at", "updated_at") VALUES ('buAHmLMbvnJ0AIVZt4Ov6BFyOVnEUJpQ', 'mPrOgzzpapfxM19TH2yN5ScE2u56DbvN', 'credential', 'mPrOgzzpapfxM19TH2yN5ScE2u56DbvN', NULL, NULL, NULL, NULL, NULL, NULL, '31a2197e59712acbaf87a1032ea52ae7:16da471c6da1867cf9d79a46425c46674a0519089b082cfef25bb679b222c89c65232585467e1c42f704f88ae5cc536f15aef2d4c5e431c7a3e2240d1f7d07f7', '2025-07-02 09:09:32.167', '2025-07-02 09:09:32.167');
INSERT INTO "public"."accounts" ("id", "account_id", "provider_id", "user_id", "access_token", "refresh_token", "id_token", "access_token_expires_at", "refresh_token_expires_at", "scope", "password", "created_at", "updated_at") VALUES ('XAQzjkzrLGFYLenfJcNR7dBmNonAk7ZS', 'SmdtueaEdRV68DkwVeR19r3lPJT7HUzN', 'credential', 'SmdtueaEdRV68DkwVeR19r3lPJT7HUzN', NULL, NULL, NULL, NULL, NULL, NULL, '83d99ea8385a319cf7cdae361173d238:d59f505062316a188137e0cf3870771ca32908eb8025bee2d667f5efda4bab62a0a4d851119d2baa6f4f48c31ad056d87bc9615ea7576afa044b3814b3eb2ec9', '2025-07-02 10:37:54.452', '2025-07-02 10:37:54.452');
INSERT INTO "public"."accounts" ("id", "account_id", "provider_id", "user_id", "access_token", "refresh_token", "id_token", "access_token_expires_at", "refresh_token_expires_at", "scope", "password", "created_at", "updated_at") VALUES ('YLhiHOgYH13KXdM8dN4CAIMPHToPpxW8', '1UkQ6Ei67EpxKUVplZYBWAFSjYFQttF4', 'credential', '1UkQ6Ei67EpxKUVplZYBWAFSjYFQttF4', NULL, NULL, NULL, NULL, NULL, NULL, '299ec3581330808562a3439712e45e03:907ff1d2b3ab66c0da722e2464b74783b480709d371ceedbd5755896d2bbaeb732925bec8ef178ed260411c53a9314e97b92a3e4d8499bc0338e67e77f6c8137', '2025-07-02 10:38:01.936', '2025-07-02 10:38:01.936');
INSERT INTO "public"."accounts" ("id", "account_id", "provider_id", "user_id", "access_token", "refresh_token", "id_token", "access_token_expires_at", "refresh_token_expires_at", "scope", "password", "created_at", "updated_at") VALUES ('vVVT5o5OTYtM0qtYkrBtOY2DITkSURIt', 'FFGOqQg6LPsHgvNfvzv38eRkRRjqvt3r', 'credential', 'FFGOqQg6LPsHgvNfvzv38eRkRRjqvt3r', NULL, NULL, NULL, NULL, NULL, NULL, '05539fa2e04892cf61caf3d558bd3007:ea85ccb5a78622959e4d18f696c8321b995607e2d0d229aa6a7532ee906da313031436595b7b0c295e8d20f5a9613971399f16f6309067435e8636b5a7a1e755', '2025-07-03 12:20:56.224', '2025-07-03 12:20:56.224');
INSERT INTO "public"."accounts" ("id", "account_id", "provider_id", "user_id", "access_token", "refresh_token", "id_token", "access_token_expires_at", "refresh_token_expires_at", "scope", "password", "created_at", "updated_at") VALUES ('2A5JT72OC1qbYHNp7MV6ZdQ5DDrUCuQr', 'Km5T0SK9jetTWkkZZPyTohMCMOLkLkUq', 'credential', 'Km5T0SK9jetTWkkZZPyTohMCMOLkLkUq', NULL, NULL, NULL, NULL, NULL, NULL, '09f45a0de9dd8af9b8234e2ac099e870:579966d0264d42c4599d5eccb9df821848f2fe3a4a9a04b6a9472c348aa11d37801ab3c46e1b4cc5f86e74ea444d7d2f8460addacfb08c98127eaecd4b4fe1db', '2025-07-03 13:45:10.353', '2025-07-03 13:45:10.353');
INSERT INTO "public"."accounts" ("id", "account_id", "provider_id", "user_id", "access_token", "refresh_token", "id_token", "access_token_expires_at", "refresh_token_expires_at", "scope", "password", "created_at", "updated_at") VALUES ('8owRJx83r95xdRVrpsWTmPLQBkzTDpOe', 'R4uoTk62O7IBBYS3ZlNZ1cs0kEaZtoPR', 'credential', 'R4uoTk62O7IBBYS3ZlNZ1cs0kEaZtoPR', NULL, NULL, NULL, NULL, NULL, NULL, '394b4bf04c71921470e21e3807c6fb58:95d458565f8ee2425f3266125ec6954fe865728ec919c06f999e90038e8defc28d05c69c833c93c554eb0ea3108e5c2ac00d9d25e4f3ef4b0cf550c30dcee777', '2025-07-14 14:06:27.497', '2025-07-14 14:06:27.497');
INSERT INTO "public"."accounts" ("id", "account_id", "provider_id", "user_id", "access_token", "refresh_token", "id_token", "access_token_expires_at", "refresh_token_expires_at", "scope", "password", "created_at", "updated_at") VALUES ('mfjYBkshZnrdK6o4GwVCA3zQiip9xSrr', 'g77jHRUgKH4OcwLMb754iySw14EbVOPZ', 'credential', 'g77jHRUgKH4OcwLMb754iySw14EbVOPZ', NULL, NULL, NULL, NULL, NULL, NULL, '54b404b44f1547542773e509729ce735:2af9ece34d431871cf3bebef00dbf0b34aaf93611357766f6b757a25d263cc220055777d5fed52ab23e09e1ef38ba881c1c570c9740d3146cfc1e68e551fdfd1', '2025-07-16 15:07:35.692', '2025-07-16 15:07:35.692');
INSERT INTO "public"."accounts" ("id", "account_id", "provider_id", "user_id", "access_token", "refresh_token", "id_token", "access_token_expires_at", "refresh_token_expires_at", "scope", "password", "created_at", "updated_at") VALUES ('BlSZq5ljVizQDxnlLKDIvxSve3AtS0qp', 'LORjajcme6wepJzYSpyj7t3JkvAglQfH', 'credential', 'LORjajcme6wepJzYSpyj7t3JkvAglQfH', NULL, NULL, NULL, NULL, NULL, NULL, 'ecb2a43cd8aaba92eac5b2f302dc8eb7:acf70739d425f70c6a883a426e54977b58a96748cce69a7d67a46ae8ea84a41f176ea5b7676a189f086d3b18d38e0cda2d6989b3310a725895a40916e92a9239', '2025-07-16 15:16:34.755', '2025-07-16 15:16:34.755');
COMMIT;

-- ----------------------------
-- Table structure for artist_languages
-- ----------------------------
DROP TABLE IF EXISTS "public"."artist_languages";
CREATE TABLE "public"."artist_languages" (
  "artist_id" int4 NOT NULL,
  "language_id" int4 NOT NULL,
  "created_at" timestamp(6) NOT NULL DEFAULT now()
)
;
ALTER TABLE "public"."artist_languages" OWNER TO "postgres";

-- ----------------------------
-- Records of artist_languages
-- ----------------------------
BEGIN;
INSERT INTO "public"."artist_languages" ("artist_id", "language_id", "created_at") VALUES (1, 73, '2025-07-09 15:45:55.254926');
INSERT INTO "public"."artist_languages" ("artist_id", "language_id", "created_at") VALUES (2, 73, '2025-07-14 09:05:45.704061');
INSERT INTO "public"."artist_languages" ("artist_id", "language_id", "created_at") VALUES (2, 70, '2025-07-14 09:05:45.704061');
INSERT INTO "public"."artist_languages" ("artist_id", "language_id", "created_at") VALUES (3, 151, '2025-07-16 13:42:08.967014');
INSERT INTO "public"."artist_languages" ("artist_id", "language_id", "created_at") VALUES (4, 10, '2025-07-16 15:13:17.217923');
COMMIT;

-- ----------------------------
-- Table structure for artist_notes
-- ----------------------------
DROP TABLE IF EXISTS "public"."artist_notes";
CREATE TABLE "public"."artist_notes" (
  "id" int4 NOT NULL DEFAULT nextval('artist_notes_id_seq'::regclass),
  "writer_id" text COLLATE "pg_catalog"."default" NOT NULL,
  "artist_id" int4 NOT NULL,
  "content" text COLLATE "pg_catalog"."default" NOT NULL,
  "created_at" timestamp(6) NOT NULL DEFAULT now()
)
;
ALTER TABLE "public"."artist_notes" OWNER TO "postgres";

-- ----------------------------
-- Records of artist_notes
-- ----------------------------
BEGIN;
INSERT INTO "public"."artist_notes" ("id", "writer_id", "artist_id", "content", "created_at") VALUES (3, 'BTw1kpUUysVHkNTHr8aIsa9WFcwg4KUj', 3, 'Dario è molto bravo', '2025-07-16 13:44:03.635905');
COMMIT;

-- ----------------------------
-- Table structure for artist_zones
-- ----------------------------
DROP TABLE IF EXISTS "public"."artist_zones";
CREATE TABLE "public"."artist_zones" (
  "artist_id" int4 NOT NULL,
  "zone_id" int4 NOT NULL,
  "created_at" timestamp(6) NOT NULL DEFAULT now()
)
;
ALTER TABLE "public"."artist_zones" OWNER TO "postgres";

-- ----------------------------
-- Records of artist_zones
-- ----------------------------
BEGIN;
INSERT INTO "public"."artist_zones" ("artist_id", "zone_id", "created_at") VALUES (1, 2, '2025-07-14 08:50:37.908538');
INSERT INTO "public"."artist_zones" ("artist_id", "zone_id", "created_at") VALUES (1, 1, '2025-07-14 08:50:37.908538');
INSERT INTO "public"."artist_zones" ("artist_id", "zone_id", "created_at") VALUES (2, 4, '2025-07-14 09:05:45.704061');
INSERT INTO "public"."artist_zones" ("artist_id", "zone_id", "created_at") VALUES (2, 3, '2025-07-14 09:05:45.704061');
INSERT INTO "public"."artist_zones" ("artist_id", "zone_id", "created_at") VALUES (2, 1, '2025-07-14 09:05:45.704061');
INSERT INTO "public"."artist_zones" ("artist_id", "zone_id", "created_at") VALUES (2, 2, '2025-07-14 09:05:45.704061');
INSERT INTO "public"."artist_zones" ("artist_id", "zone_id", "created_at") VALUES (3, 4, '2025-07-16 13:42:08.967014');
INSERT INTO "public"."artist_zones" ("artist_id", "zone_id", "created_at") VALUES (4, 4, '2025-07-16 15:13:17.217923');
INSERT INTO "public"."artist_zones" ("artist_id", "zone_id", "created_at") VALUES (4, 2, '2025-07-16 15:13:17.217923');
INSERT INTO "public"."artist_zones" ("artist_id", "zone_id", "created_at") VALUES (4, 1, '2025-07-16 15:13:17.217923');
COMMIT;

-- ----------------------------
-- Table structure for artists
-- ----------------------------
DROP TABLE IF EXISTS "public"."artists";
CREATE TABLE "public"."artists" (
  "id" int4 NOT NULL DEFAULT nextval('artists_id_seq'::regclass),
  "email" text COLLATE "pg_catalog"."default" NOT NULL,
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "surname" text COLLATE "pg_catalog"."default" NOT NULL,
  "stage_name" text COLLATE "pg_catalog"."default" NOT NULL,
  "phone" text COLLATE "pg_catalog"."default" NOT NULL,
  "avatar_url" text COLLATE "pg_catalog"."default" NOT NULL,
  "status" "public"."user_status" NOT NULL,
  "birth_date" date NOT NULL,
  "birth_place" text COLLATE "pg_catalog"."default" NOT NULL,
  "address" text COLLATE "pg_catalog"."default" NOT NULL,
  "country_id" int4 NOT NULL,
  "subdivision_id" int4 NOT NULL,
  "city" text COLLATE "pg_catalog"."default" NOT NULL,
  "zip_code" varchar(10) COLLATE "pg_catalog"."default" NOT NULL,
  "gender" "public"."gender_enum" NOT NULL,
  "tour_manager_name" text COLLATE "pg_catalog"."default" NOT NULL,
  "tour_manager_surname" text COLLATE "pg_catalog"."default" NOT NULL,
  "tour_manager_email" text COLLATE "pg_catalog"."default" NOT NULL,
  "tour_manager_phone" text COLLATE "pg_catalog"."default" NOT NULL,
  "company" text COLLATE "pg_catalog"."default" NOT NULL,
  "tax_code" text COLLATE "pg_catalog"."default" NOT NULL,
  "ipi_code" text COLLATE "pg_catalog"."default" NOT NULL,
  "bic_code" text COLLATE "pg_catalog"."default",
  "aba_routing_number" varchar(20) COLLATE "pg_catalog"."default",
  "iban" text COLLATE "pg_catalog"."default" NOT NULL,
  "sdi_recipient_code" text COLLATE "pg_catalog"."default",
  "billing_address" text COLLATE "pg_catalog"."default" NOT NULL,
  "billing_country_id" int4 NOT NULL,
  "billing_subdivision_id" int4 NOT NULL,
  "billing_city" text COLLATE "pg_catalog"."default" NOT NULL,
  "billing_zip_code" varchar(10) COLLATE "pg_catalog"."default" NOT NULL,
  "billing_email" text COLLATE "pg_catalog"."default" NOT NULL,
  "billing_pec" text COLLATE "pg_catalog"."default" NOT NULL,
  "billing_phone" text COLLATE "pg_catalog"."default" NOT NULL,
  "taxable_invoice" bool NOT NULL DEFAULT false,
  "tiktok_url" text COLLATE "pg_catalog"."default",
  "tiktok_username" text COLLATE "pg_catalog"."default",
  "tiktok_followers" int4,
  "tiktok_created_at" date,
  "facebook_url" text COLLATE "pg_catalog"."default",
  "facebook_username" text COLLATE "pg_catalog"."default",
  "facebook_followers" int4,
  "facebook_created_at" date,
  "instagram_url" text COLLATE "pg_catalog"."default",
  "instagram_username" text COLLATE "pg_catalog"."default",
  "instagram_followers" int4,
  "instagram_created_at" date,
  "x_url" text COLLATE "pg_catalog"."default",
  "x_username" text COLLATE "pg_catalog"."default",
  "x_followers" int4,
  "x_created_at" date,
  "created_at" timestamp(6) NOT NULL DEFAULT now(),
  "updated_at" timestamp(6) NOT NULL DEFAULT now(),
  "slug" uuid NOT NULL DEFAULT gen_random_uuid()
)
;
ALTER TABLE "public"."artists" OWNER TO "postgres";

-- ----------------------------
-- Records of artists
-- ----------------------------
BEGIN;
INSERT INTO "public"."artists" ("id", "email", "name", "surname", "stage_name", "phone", "avatar_url", "status", "birth_date", "birth_place", "address", "country_id", "subdivision_id", "city", "zip_code", "gender", "tour_manager_name", "tour_manager_surname", "tour_manager_email", "tour_manager_phone", "company", "tax_code", "ipi_code", "bic_code", "aba_routing_number", "iban", "sdi_recipient_code", "billing_address", "billing_country_id", "billing_subdivision_id", "billing_city", "billing_zip_code", "billing_email", "billing_pec", "billing_phone", "taxable_invoice", "tiktok_url", "tiktok_username", "tiktok_followers", "tiktok_created_at", "facebook_url", "facebook_username", "facebook_followers", "facebook_created_at", "instagram_url", "instagram_username", "instagram_followers", "instagram_created_at", "x_url", "x_username", "x_followers", "x_created_at", "created_at", "updated_at", "slug") VALUES (3, 'dario.rosso@gmail.com', 'Dario', 'Rosso', 'Dosso', '+981239847', 'https://mzmigzmqxpmypbmvklfh.supabase.co/storage/v1/object/public/milano-ovest-admin/avatars/1752673174072-8a34014b-be95-4e41-835a-7b6d931f7e9e.jpeg', 'active', '1990-04-12', 'Milano', 'Via Franco Sacchetti', 18, 228, 'Romaaa', '00137', 'maschile', 'Leonardo', 'Selmini', 'leoanrdo@gmail.com', '+39 345373467364', 'MIlano Ovest', 'FML12K3F21ONF', '123456789', NULL, NULL, 'IT1294812938479182', 'F12FF21', 'Via duomo 1', 110, 1428, 'Milano', '20129', 'wow@srl.com', 'pec@oihe.it', '+39123441234', 't', 'https://www.tiktok.com/@brainrot_pocket', 'brainrot_pocket', 100, '2023-09-10', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-16 13:42:08.967014', '2025-07-16 13:43:40.525', '3a73b098-0b66-488f-a4d6-aa1e632f27ce');
INSERT INTO "public"."artists" ("id", "email", "name", "surname", "stage_name", "phone", "avatar_url", "status", "birth_date", "birth_place", "address", "country_id", "subdivision_id", "city", "zip_code", "gender", "tour_manager_name", "tour_manager_surname", "tour_manager_email", "tour_manager_phone", "company", "tax_code", "ipi_code", "bic_code", "aba_routing_number", "iban", "sdi_recipient_code", "billing_address", "billing_country_id", "billing_subdivision_id", "billing_city", "billing_zip_code", "billing_email", "billing_pec", "billing_phone", "taxable_invoice", "tiktok_url", "tiktok_username", "tiktok_followers", "tiktok_created_at", "facebook_url", "facebook_username", "facebook_followers", "facebook_created_at", "instagram_url", "instagram_username", "instagram_followers", "instagram_created_at", "x_url", "x_username", "x_followers", "x_created_at", "created_at", "updated_at", "slug") VALUES (4, 'pero@gmail.com', 'Giovanni', 'mario', 'Pero', '+39 1239847487', 'https://mzmigzmqxpmypbmvklfh.supabase.co/storage/v1/object/public/milano-ovest-admin/avatars/1752678719807-person.png', 'disabled', '1998-01-10', 'Milano', 'Via roma 1', 110, 1428, 'Torino', '20129', 'non-binary', 'Leo', 'Selmi', 'leoanrdo@gmail.com', '+39 345373467364', 'Filli S.r.l.', 'SLMLRD98H11I690N', '123456789', 'I1H2B341', NULL, 'IT12938479182734', NULL, 'Via piero 1', 86, 1078, 'Milano', '20129', 'wow@srl.com', 'info@pec.it', '+39123441234', 't', 'https://www.tiktok.com/@brainrot_pocket', 'brainrot_pocket', 100, '2024-06-11', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-16 15:13:17.217923', '2025-07-16 15:14:45.008', '27d10464-e1b2-478e-bac2-59ea35b41e28');
INSERT INTO "public"."artists" ("id", "email", "name", "surname", "stage_name", "phone", "avatar_url", "status", "birth_date", "birth_place", "address", "country_id", "subdivision_id", "city", "zip_code", "gender", "tour_manager_name", "tour_manager_surname", "tour_manager_email", "tour_manager_phone", "company", "tax_code", "ipi_code", "bic_code", "aba_routing_number", "iban", "sdi_recipient_code", "billing_address", "billing_country_id", "billing_subdivision_id", "billing_city", "billing_zip_code", "billing_email", "billing_pec", "billing_phone", "taxable_invoice", "tiktok_url", "tiktok_username", "tiktok_followers", "tiktok_created_at", "facebook_url", "facebook_username", "facebook_followers", "facebook_created_at", "instagram_url", "instagram_username", "instagram_followers", "instagram_created_at", "x_url", "x_username", "x_followers", "x_created_at", "created_at", "updated_at", "slug") VALUES (2, 'alice@mariani.it', 'Mario', 'Rosso', 'Letumtum', '+393453822689', 'https://mzmigzmqxpmypbmvklfh.supabase.co/storage/v1/object/public/milano-ovest-admin/avatars/1752483887471-1024x1024bb.png', 'active', '1998-06-11', 'Milano', 'Via Giuseppe 1', 110, 1428, 'Milano', '20129', 'non-binary', 'Mario', 'Rossi', 'leonardo@filli.it', '+38123456789', 'Mokka', 'SLMLRD98H11I690N', '123451234444', NULL, NULL, 'IT19287344711223', '1234142', 'Via duomo 1', 110, 1420, 'Milano', '20129', 'leonardo+1@filli.it', 'pec@filli.it', '+381234976', 't', 'https://www.tiktok.com/@brainrot_pocket', 'brainrot_pocket', 10, '2024-06-11', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-14 09:05:45.704061', '2025-07-15 16:19:39.67', '6312f4c4-11a9-4434-b2c8-8e15e380cea8');
INSERT INTO "public"."artists" ("id", "email", "name", "surname", "stage_name", "phone", "avatar_url", "status", "birth_date", "birth_place", "address", "country_id", "subdivision_id", "city", "zip_code", "gender", "tour_manager_name", "tour_manager_surname", "tour_manager_email", "tour_manager_phone", "company", "tax_code", "ipi_code", "bic_code", "aba_routing_number", "iban", "sdi_recipient_code", "billing_address", "billing_country_id", "billing_subdivision_id", "billing_city", "billing_zip_code", "billing_email", "billing_pec", "billing_phone", "taxable_invoice", "tiktok_url", "tiktok_username", "tiktok_followers", "tiktok_created_at", "facebook_url", "facebook_username", "facebook_followers", "facebook_created_at", "instagram_url", "instagram_username", "instagram_followers", "instagram_created_at", "x_url", "x_username", "x_followers", "x_created_at", "created_at", "updated_at", "slug") VALUES (1, 'leonardo@filli.it', 'Leonardo', 'Selmini', 'Leopardo', '+393453822689', 'https://mzmigzmqxpmypbmvklfh.supabase.co/storage/v1/object/public/milano-ovest-admin/avatars/1751910425922-pexels-graphicgumcom-1123982.jpg', 'active', '1998-06-11', 'Milano', 'Via Giuseppe 1', 110, 1428, 'Milano', '20129', 'non-binary', 'Mario', 'Rossi', 'leonardo@filli.it', '+38123456789', 'Mokka', 'SLMLRD98H11I690N', '123456776668', NULL, NULL, 'IT19287344711223', '123456A', 'Via duomo 1', 110, 1427, 'Milano', '20129', 'fatturazione@filli.it', 'pec@filli.it', '+381234976', 'f', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-07 17:48:17.126883', '2025-07-16 10:33:51.279', '9865749b-5e2b-4734-9ec0-64ae3ac67172');
COMMIT;

-- ----------------------------
-- Table structure for countries
-- ----------------------------
DROP TABLE IF EXISTS "public"."countries";
CREATE TABLE "public"."countries" (
  "id" int4 NOT NULL DEFAULT nextval('countries_id_seq'::regclass),
  "code" varchar(2) COLLATE "pg_catalog"."default" NOT NULL,
  "name" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "created_at" timestamp(6) NOT NULL DEFAULT now(),
  "is_eu" bool NOT NULL DEFAULT false
)
;
ALTER TABLE "public"."countries" OWNER TO "postgres";

-- ----------------------------
-- Records of countries
-- ----------------------------
BEGIN;
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (1, 'AD', 'Andorra', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (2, 'AE', 'Emirati Arabi Uniti', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (3, 'AF', 'Afghanistan', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (4, 'AG', 'Antigua e Barbuda', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (6, 'AL', 'Albania', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (7, 'AM', 'Armenia', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (8, 'AO', 'Angola', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (10, 'AR', 'Argentina', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (13, 'AU', 'Australia', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (16, 'AZ', 'Azerbaigian', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (17, 'BA', 'Bosnia ed Erzegovina', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (18, 'BB', 'Barbados', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (19, 'BD', 'Bangladesh', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (21, 'BF', 'Burkina Faso', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (23, 'BH', 'Bahrein', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (24, 'BI', 'Burundi', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (25, 'BJ', 'Benin', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (28, 'BN', 'Brunei', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (29, 'BO', 'Bolivia', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (31, 'BR', 'Brasile', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (32, 'BS', 'Bahamas', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (33, 'BT', 'Bhutan', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (35, 'BW', 'Botswana', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (36, 'BY', 'Bielorussia', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (37, 'BZ', 'Belize', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (38, 'CA', 'Canada', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (40, 'CD', 'Repubblica Democratica del Congo', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (41, 'CF', 'Repubblica Centrafricana', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (43, 'CH', 'Svizzera', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (44, 'CI', 'Costa d''Avorio', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (46, 'CL', 'Cile', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (47, 'CM', 'Camerun', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (48, 'CN', 'Cina', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (49, 'CO', 'Colombia', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (50, 'CR', 'Costa Rica', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (51, 'CU', 'Cuba', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (52, 'CV', 'Capo Verde', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (58, 'DJ', 'Gibuti', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (60, 'DM', 'Dominica', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (61, 'DO', 'Repubblica Dominicana', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (62, 'DZ', 'Algeria', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (63, 'EC', 'Ecuador', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (65, 'EG', 'Egitto', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (67, 'ER', 'Eritrea', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (69, 'ET', 'Etiopia', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (71, 'FJ', 'Figi', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (73, 'FM', 'Stati Federati di Micronesia', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (76, 'GA', 'Gabon', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (77, 'GB', 'Regno Unito', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (78, 'GD', 'Grenada', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (79, 'GE', 'Georgia', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (82, 'GH', 'Ghana', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (85, 'GM', 'Gambia', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (86, 'GN', 'Guinea', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (88, 'GQ', 'Guinea Equatoriale', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (91, 'GT', 'Guatemala', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (93, 'GW', 'Guinea‑Bissau', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (94, 'GY', 'Guyana', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (97, 'HN', 'Honduras', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (99, 'HT', 'Haiti', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (101, 'ID', 'Indonesia', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (103, 'IL', 'Israele', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (105, 'IN', 'India', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (107, 'IQ', 'Iraq', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (108, 'IR', 'Iran', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (109, 'IS', 'Islanda', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (112, 'JM', 'Jamaica', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (113, 'JO', 'Giordania', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (114, 'JP', 'Giappone', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (115, 'KE', 'Kenya', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (116, 'KG', 'Kirgizistan', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (117, 'KH', 'Cambogia', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (118, 'KI', 'Kiribati', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (119, 'KM', 'Comore', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (120, 'KN', 'Saint Kitts e Nevis', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (121, 'KP', 'Corea del Nord', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (122, 'KR', 'Corea del Sud', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (123, 'KW', 'Kuwait', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (125, 'KZ', 'Kazakistan', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (126, 'LA', 'Laos', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (127, 'LB', 'Libano', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (128, 'LC', 'Santa Lucia', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (129, 'LI', 'Liechtenstein', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (130, 'LK', 'Sri Lanka', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (131, 'LR', 'Liberia', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (132, 'LS', 'Lesotho', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (136, 'LY', 'Libia', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (137, 'MA', 'Marocco', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (138, 'MC', 'Monaco', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (139, 'MD', 'Moldova', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (140, 'ME', 'Montenegro', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (142, 'MG', 'Madagascar', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (143, 'MH', 'Isole Marshall', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (12, 'AT', 'Austria', '2025-06-26 10:49:22.475192', 't');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (20, 'BE', 'Belgio', '2025-06-26 10:49:22.475192', 't');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (22, 'BG', 'Bulgaria', '2025-06-26 10:49:22.475192', 't');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (55, 'CY', 'Cipro', '2025-06-26 10:49:22.475192', 't');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (56, 'CZ', 'Repubblica Ceca', '2025-06-26 10:49:22.475192', 't');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (57, 'DE', 'Germania', '2025-06-26 10:49:22.475192', 't');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (59, 'DK', 'Danimarca', '2025-06-26 10:49:22.475192', 't');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (64, 'EE', 'Estonia', '2025-06-26 10:49:22.475192', 't');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (68, 'ES', 'Spagna', '2025-06-26 10:49:22.475192', 't');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (70, 'FI', 'Finlandia', '2025-06-26 10:49:22.475192', 't');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (75, 'FR', 'Francia', '2025-06-26 10:49:22.475192', 't');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (89, 'GR', 'Grecia', '2025-06-26 10:49:22.475192', 't');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (98, 'HR', 'Croazia', '2025-06-26 10:49:22.475192', 't');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (100, 'HU', 'Ungheria', '2025-06-26 10:49:22.475192', 't');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (102, 'IE', 'Irlanda', '2025-06-26 10:49:22.475192', 't');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (110, 'IT', 'Italia', '2025-06-26 10:49:22.475192', 't');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (133, 'LT', 'Lituania', '2025-06-26 10:49:22.475192', 't');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (134, 'LU', 'Lussemburgo', '2025-06-26 10:49:22.475192', 't');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (135, 'LV', 'Lettonia', '2025-06-26 10:49:22.475192', 't');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (144, 'MK', 'Macedonia del Nord', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (145, 'ML', 'Mali', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (146, 'MM', 'Myanmar', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (147, 'MN', 'Mongolia', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (151, 'MR', 'Mauritania', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (154, 'MU', 'Mauritius', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (155, 'MV', 'Maldive', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (156, 'MW', 'Malawi', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (157, 'MX', 'Messico', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (158, 'MY', 'Malaysia', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (159, 'MZ', 'Mozambico', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (160, 'NA', 'Namibia', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (162, 'NE', 'Niger', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (164, 'NG', 'Nigeria', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (165, 'NI', 'Nicaragua', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (167, 'NO', 'Norvegia', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (168, 'NP', 'Nepal', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (169, 'NR', 'Nauru', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (171, 'NZ', 'Nuova Zelanda', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (172, 'OM', 'Oman', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (173, 'PA', 'Panamá', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (174, 'PE', 'Perù', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (176, 'PG', 'Papua Nuova Guinea', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (177, 'PH', 'Filippine', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (178, 'PK', 'Pakistan', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (183, 'PS', 'Stato della Palestina', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (185, 'PW', 'Palau', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (186, 'PY', 'Paraguay', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (187, 'QA', 'Qatar', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (190, 'RS', 'Serbia', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (191, 'RU', 'Russia', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (192, 'RW', 'Ruanda', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (193, 'SA', 'Arabia Saudita', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (194, 'SB', 'Isole Salomone', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (195, 'SC', 'Seychelles', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (196, 'SD', 'Sudan', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (198, 'SG', 'Singapore', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (203, 'SL', 'Sierra Leone', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (204, 'SM', 'San Marino', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (205, 'SN', 'Senegal', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (206, 'SO', 'Somalia', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (207, 'SR', 'Suriname', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (208, 'SS', 'Sudan del Sud', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (209, 'ST', 'São Tomé e Príncipe', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (210, 'SV', 'El Salvador', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (212, 'SY', 'Siria', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (213, 'SZ', 'eSwatini', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (215, 'TD', 'Ciad', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (217, 'TG', 'Togo', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (218, 'TH', 'Thailandia', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (219, 'TJ', 'Tagikistan', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (221, 'TL', 'Timor‑Est', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (222, 'TM', 'Turkmenistan', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (223, 'TN', 'Tunisia', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (224, 'TO', 'Tonga', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (225, 'TR', 'Turchia', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (226, 'TT', 'Trinidad e Tobago', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (227, 'TV', 'Tuvalu', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (228, 'TW', 'Taiwan', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (229, 'TZ', 'Tanzania', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (230, 'UA', 'Ucraina', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (231, 'UG', 'Uganda', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (233, 'US', 'Stati Uniti d’America', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (234, 'UY', 'Uruguay', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (235, 'UZ', 'Uzbekistan', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (236, 'VA', 'Città del Vaticano', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (237, 'VC', 'Saint Vincent e Grenadine', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (238, 'VE', 'Venezuela', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (241, 'VN', 'Vietnam', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (242, 'VU', 'Vanuatu', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (244, 'WS', 'Samoa', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (245, 'YE', 'Yemen', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (247, 'ZA', 'Sudafrica', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (248, 'ZM', 'Zambia', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (249, 'ZW', 'Zimbabwe', '2025-06-26 10:49:22.475192', 'f');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (153, 'MT', 'Malta', '2025-06-26 10:49:22.475192', 't');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (166, 'NL', 'Paesi Bassi', '2025-06-26 10:49:22.475192', 't');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (179, 'PL', 'Polonia', '2025-06-26 10:49:22.475192', 't');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (184, 'PT', 'Portogallo', '2025-06-26 10:49:22.475192', 't');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (189, 'RO', 'Romania', '2025-06-26 10:49:22.475192', 't');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (197, 'SE', 'Svezia', '2025-06-26 10:49:22.475192', 't');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (200, 'SI', 'Slovenia', '2025-06-26 10:49:22.475192', 't');
INSERT INTO "public"."countries" ("id", "code", "name", "created_at", "is_eu") VALUES (202, 'SK', 'Slovacchia', '2025-06-26 10:49:22.475192', 't');
COMMIT;

-- ----------------------------
-- Table structure for languages
-- ----------------------------
DROP TABLE IF EXISTS "public"."languages";
CREATE TABLE "public"."languages" (
  "id" int4 NOT NULL DEFAULT nextval('languages_id_seq'::regclass),
  "code" varchar(2) COLLATE "pg_catalog"."default" NOT NULL,
  "name" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "created_at" timestamp(6) NOT NULL DEFAULT now()
)
;
ALTER TABLE "public"."languages" OWNER TO "postgres";

-- ----------------------------
-- Records of languages
-- ----------------------------
BEGIN;
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (1, 'AA', 'Afar', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (2, 'AB', 'Abcaso', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (3, 'AE', 'Avestico', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (4, 'AF', 'Afrikaans', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (5, 'AK', 'Akan', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (6, 'AM', 'Amarico', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (7, 'AN', 'Aragonese', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (8, 'AR', 'Arabo', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (9, 'AS', 'Assamese', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (10, 'AV', 'Avaro', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (11, 'AY', 'Aymara', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (12, 'AZ', 'Azerbaigiano', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (13, 'BA', 'Baschiro', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (14, 'BE', 'Bielorusso', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (15, 'BG', 'Bulgaro', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (16, 'BH', 'Biharo', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (17, 'BI', 'Bislamo', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (18, 'BM', 'Bambara', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (19, 'BN', 'Bengalese', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (20, 'BO', 'Tibetano', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (21, 'BR', 'Bretone', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (22, 'BS', 'Bosniaco', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (23, 'CA', 'Catalano', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (24, 'CE', 'Ceceno', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (25, 'CH', 'Chamorro', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (26, 'CO', 'Corsico', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (27, 'CR', 'Cree', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (28, 'CS', 'Ceco', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (29, 'CU', 'Slavo ecclesiastico antico', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (30, 'CV', 'Ciuvascio', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (31, 'CY', 'Gallese', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (32, 'DA', 'Danese', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (33, 'DE', 'Tedesco', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (34, 'DV', 'Maldiviano', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (35, 'DZ', 'Dzongkha', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (36, 'EE', 'Ewe', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (37, 'EL', 'Greco', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (38, 'EN', 'Inglese', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (39, 'EO', 'Esperanto', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (40, 'ES', 'Spagnolo', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (41, 'ET', 'Estone', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (42, 'EU', 'Basco', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (43, 'FA', 'Persiano', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (44, 'FF', 'Fula', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (45, 'FI', 'Finlandese', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (46, 'FJ', 'Figiano', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (47, 'FO', 'Faroense', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (48, 'FR', 'Francese', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (49, 'FY', 'Frisone occidentale', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (50, 'GA', 'Irlandese', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (51, 'GD', 'Gaelico', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (52, 'GL', 'Galiziano', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (53, 'GN', 'Guaraní', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (54, 'GU', 'Gujarati', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (55, 'GV', 'Mannese', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (56, 'HA', 'Hausa', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (57, 'HE', 'Ebraico', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (58, 'HI', 'Hindi', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (59, 'HO', 'Hiri Motu', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (60, 'HR', 'Croato', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (61, 'HT', 'Haitiano', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (62, 'HU', 'Ungherese', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (63, 'HY', 'Armeno', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (64, 'HZ', 'Herero', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (65, 'IA', 'Interlingua', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (66, 'IN', 'Indonesiano', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (67, 'IE', 'Interlingua (de Wahl)', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (68, 'IG', 'Igbo', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (69, 'II', 'Sichuanese', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (70, 'IK', 'Inupiaq', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (71, 'IO', 'Ido', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (72, 'IS', 'Islandese', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (73, 'IT', 'Italiano', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (74, 'IU', 'Inuktitut', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (75, 'JA', 'Giapponese', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (76, 'JV', 'Giavanese', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (77, 'KA', 'Georgiano', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (78, 'KG', 'Kongo', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (79, 'KI', 'Kikuyu', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (80, 'KJ', 'Kwanyama', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (81, 'KK', 'Kazaco', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (82, 'KL', 'Groenlandese', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (83, 'KM', 'Cambogiano', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (84, 'KN', 'Kannada', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (85, 'KO', 'Coreano', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (86, 'KR', 'Kanuri', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (87, 'KS', 'Kashmiri', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (88, 'KU', 'Curdo', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (89, 'KV', 'Komi', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (90, 'KW', 'Cornico', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (91, 'KY', 'Kirghisa', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (92, 'LA', 'Latino', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (93, 'LB', 'Lussemburghese', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (94, 'LG', 'Luganda', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (95, 'LI', 'Limburghese', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (96, 'LN', 'Lingala', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (97, 'LO', 'Lao', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (98, 'LT', 'Lituano', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (99, 'LU', 'Luba-Katanga', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (100, 'LV', 'Lettone', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (101, 'MG', 'Malgascio', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (102, 'MH', 'Marshallese', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (103, 'MI', 'Māori', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (104, 'MK', 'Macedone', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (105, 'ML', 'Malayalam', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (106, 'MN', 'Mongolo', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (107, 'MO', 'Moldavo', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (108, 'MR', 'Marathi', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (109, 'MS', 'Malese', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (110, 'MT', 'Maltese', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (111, 'MY', 'Birmano', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (112, 'NA', 'Nauruano', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (113, 'NB', 'Norvegese Bokmål', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (114, 'ND', 'Ndebele del nord', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (115, 'NE', 'Nepalese', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (116, 'NG', 'Ndongo', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (117, 'NL', 'Olandese', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (118, 'NN', 'Norvegese Nynorsk', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (119, 'NO', 'Norvegese', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (120, 'NR', 'Ndebele del sud', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (121, 'NV', 'Navajo', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (122, 'NY', 'Chewa', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (123, 'OC', 'Occitano', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (124, 'OJ', 'Ojibwe', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (125, 'OM', 'Oromonico', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (126, 'OR', 'Odia', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (127, 'OS', 'Osseto', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (128, 'PA', 'Punjabi', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (129, 'PI', 'Pāli', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (130, 'PL', 'Polacco', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (131, 'PS', 'Pashto', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (132, 'PT', 'Portoghese', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (133, 'QU', 'Quechua', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (134, 'RM', 'Romancio', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (135, 'RN', 'Kirundi', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (136, 'RO', 'Rumeno', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (137, 'RU', 'Russo', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (138, 'RW', 'Kinyarwanda', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (139, 'SA', 'Sanscrito', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (140, 'SC', 'Sardo', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (141, 'SD', 'Sindhi', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (142, 'SE', 'Northern Sami', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (143, 'SG', 'Sango', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (144, 'SI', 'Singalese', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (145, 'SK', 'Slovacco', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (146, 'SL', 'Sloveno', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (147, 'SM', 'Samoano', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (148, 'SN', 'Shona', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (149, 'SO', 'Somalo', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (150, 'SQ', 'Albanese', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (151, 'SR', 'Serbo', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (152, 'SS', 'Swati', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (153, 'ST', 'Sotho del sud', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (154, 'SU', 'Sundanese', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (155, 'SV', 'Svedese', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (156, 'SW', 'Swahili', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (157, 'TA', 'Tamil', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (158, 'TE', 'Telugu', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (159, 'TG', 'Tagico', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (160, 'TH', 'Thailandese', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (161, 'TI', 'Tigrino', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (162, 'TK', 'Turkmeno', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (163, 'TL', 'Tagalog', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (164, 'TN', 'Tswano', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (165, 'TO', 'Tongano', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (166, 'TR', 'Turco', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (167, 'TS', 'Tsonga', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (168, 'TT', 'Tartaro', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (169, 'TW', 'Twi', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (170, 'TY', 'Tahitiano', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (171, 'UG', 'Uiguro', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (172, 'UK', 'Ucraino', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (173, 'UR', 'Urdu', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (174, 'UZ', 'Uzbeco', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (175, 'VE', 'Venda', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (176, 'VI', 'Vietnamita', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (177, 'VO', 'Volapük', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (178, 'WO', 'Wolof', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (179, 'XH', 'Xhosa', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (180, 'YI', 'Yiddish', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (181, 'YO', 'Yoruba', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (182, 'ZA', 'Zhuang', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (183, 'ZH', 'Chinese', '2025-06-26 12:56:11.191422');
INSERT INTO "public"."languages" ("id", "code", "name", "created_at") VALUES (184, 'ZU', 'Zulu', '2025-06-26 12:56:11.191422');
COMMIT;

-- ----------------------------
-- Table structure for manager_artists
-- ----------------------------
DROP TABLE IF EXISTS "public"."manager_artists";
CREATE TABLE "public"."manager_artists" (
  "manager_profile_id" int4 NOT NULL,
  "artist_id" int4 NOT NULL,
  "created_at" timestamp(6) NOT NULL DEFAULT now()
)
;
ALTER TABLE "public"."manager_artists" OWNER TO "postgres";

-- ----------------------------
-- Records of manager_artists
-- ----------------------------
BEGIN;
INSERT INTO "public"."manager_artists" ("manager_profile_id", "artist_id", "created_at") VALUES (7, 2, '2025-07-15 16:19:39.659757');
INSERT INTO "public"."manager_artists" ("manager_profile_id", "artist_id", "created_at") VALUES (5, 1, '2025-07-16 10:33:51.332359');
INSERT INTO "public"."manager_artists" ("manager_profile_id", "artist_id", "created_at") VALUES (12, 3, '2025-07-16 13:42:08.967014');
INSERT INTO "public"."manager_artists" ("manager_profile_id", "artist_id", "created_at") VALUES (14, 4, '2025-07-16 15:13:17.217923');
COMMIT;

-- ----------------------------
-- Table structure for profile_languages
-- ----------------------------
DROP TABLE IF EXISTS "public"."profile_languages";
CREATE TABLE "public"."profile_languages" (
  "profile_id" int4 NOT NULL,
  "language_id" int4 NOT NULL,
  "created_at" timestamp(6) NOT NULL DEFAULT now()
)
;
ALTER TABLE "public"."profile_languages" OWNER TO "postgres";

-- ----------------------------
-- Records of profile_languages
-- ----------------------------
BEGIN;
INSERT INTO "public"."profile_languages" ("profile_id", "language_id", "created_at") VALUES (3, 73, '2025-06-27 17:31:08.200154');
INSERT INTO "public"."profile_languages" ("profile_id", "language_id", "created_at") VALUES (5, 73, '2025-07-02 08:18:13.45794');
INSERT INTO "public"."profile_languages" ("profile_id", "language_id", "created_at") VALUES (6, 38, '2025-07-02 09:14:46.938849');
INSERT INTO "public"."profile_languages" ("profile_id", "language_id", "created_at") VALUES (6, 73, '2025-07-02 09:14:46.938849');
INSERT INTO "public"."profile_languages" ("profile_id", "language_id", "created_at") VALUES (7, 73, '2025-07-02 10:37:52.752057');
INSERT INTO "public"."profile_languages" ("profile_id", "language_id", "created_at") VALUES (8, 73, '2025-07-02 16:12:42.143399');
INSERT INTO "public"."profile_languages" ("profile_id", "language_id", "created_at") VALUES (9, 71, '2025-07-03 12:20:54.714591');
INSERT INTO "public"."profile_languages" ("profile_id", "language_id", "created_at") VALUES (9, 73, '2025-07-03 12:20:54.714591');
INSERT INTO "public"."profile_languages" ("profile_id", "language_id", "created_at") VALUES (10, 73, '2025-07-03 13:48:02.431473');
INSERT INTO "public"."profile_languages" ("profile_id", "language_id", "created_at") VALUES (4, 3, '2025-07-04 13:21:37.918426');
INSERT INTO "public"."profile_languages" ("profile_id", "language_id", "created_at") VALUES (11, 48, '2025-07-14 15:02:21.349445');
INSERT INTO "public"."profile_languages" ("profile_id", "language_id", "created_at") VALUES (12, 151, '2025-07-16 13:31:55.197639');
INSERT INTO "public"."profile_languages" ("profile_id", "language_id", "created_at") VALUES (13, 73, '2025-07-16 13:56:08.02869');
INSERT INTO "public"."profile_languages" ("profile_id", "language_id", "created_at") VALUES (14, 73, '2025-07-16 15:10:04.020952');
INSERT INTO "public"."profile_languages" ("profile_id", "language_id", "created_at") VALUES (14, 1, '2025-07-16 15:10:04.020952');
INSERT INTO "public"."profile_languages" ("profile_id", "language_id", "created_at") VALUES (15, 12, '2025-07-16 15:17:06.105678');
COMMIT;

-- ----------------------------
-- Table structure for profile_notes
-- ----------------------------
DROP TABLE IF EXISTS "public"."profile_notes";
CREATE TABLE "public"."profile_notes" (
  "id" int4 NOT NULL DEFAULT nextval('profile_notes_id_seq'::regclass),
  "writer_id" text COLLATE "pg_catalog"."default" NOT NULL,
  "receiver_profile_id" int4 NOT NULL,
  "content" text COLLATE "pg_catalog"."default" NOT NULL,
  "created_at" timestamp(6) NOT NULL DEFAULT now()
)
;
ALTER TABLE "public"."profile_notes" OWNER TO "postgres";

-- ----------------------------
-- Records of profile_notes
-- ----------------------------
BEGIN;
INSERT INTO "public"."profile_notes" ("id", "writer_id", "receiver_profile_id", "content", "created_at") VALUES (19, 'BTw1kpUUysVHkNTHr8aIsa9WFcwg4KUj', 11, 'Ciao questa è una nota su un venue manager', '2025-07-14 14:58:11.736202');
INSERT INTO "public"."profile_notes" ("id", "writer_id", "receiver_profile_id", "content", "created_at") VALUES (20, 'BTw1kpUUysVHkNTHr8aIsa9WFcwg4KUj', 12, 'Parla solo serbo, molto competente ☺️', '2025-07-16 13:32:32.669416');
INSERT INTO "public"."profile_notes" ("id", "writer_id", "receiver_profile_id", "content", "created_at") VALUES (22, 'BTw1kpUUysVHkNTHr8aIsa9WFcwg4KUj', 15, 'è molto competente 😂', '2025-07-16 15:16:53.421582');
COMMIT;

-- ----------------------------
-- Table structure for profiles
-- ----------------------------
DROP TABLE IF EXISTS "public"."profiles";
CREATE TABLE "public"."profiles" (
  "id" int4 NOT NULL DEFAULT nextval('profiles_id_seq'::regclass),
  "user_id" text COLLATE "pg_catalog"."default" NOT NULL,
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "surname" text COLLATE "pg_catalog"."default" NOT NULL,
  "phone" text COLLATE "pg_catalog"."default" NOT NULL,
  "avatar_url" text COLLATE "pg_catalog"."default" NOT NULL,
  "birth_date" date NOT NULL,
  "birth_place" text COLLATE "pg_catalog"."default" NOT NULL,
  "address" text COLLATE "pg_catalog"."default" NOT NULL,
  "country_id" int4 NOT NULL,
  "subdivision_id" int4 NOT NULL,
  "city" text COLLATE "pg_catalog"."default" NOT NULL,
  "zip_code" varchar(10) COLLATE "pg_catalog"."default" NOT NULL,
  "gender" "public"."gender_enum" NOT NULL,
  "company" text COLLATE "pg_catalog"."default",
  "tax_code" text COLLATE "pg_catalog"."default",
  "ipi_code" text COLLATE "pg_catalog"."default",
  "bic_code" text COLLATE "pg_catalog"."default",
  "aba_routing_number" varchar(20) COLLATE "pg_catalog"."default",
  "iban" text COLLATE "pg_catalog"."default",
  "sdi_recipient_code" text COLLATE "pg_catalog"."default",
  "billing_address" text COLLATE "pg_catalog"."default",
  "billing_country_id" int4,
  "billing_subdivision_id" int4,
  "billing_city" text COLLATE "pg_catalog"."default",
  "billing_zip_code" varchar(10) COLLATE "pg_catalog"."default",
  "billing_email" text COLLATE "pg_catalog"."default",
  "billing_pec" text COLLATE "pg_catalog"."default",
  "billing_phone" text COLLATE "pg_catalog"."default",
  "taxable_invoice" bool DEFAULT false,
  "created_at" timestamp(6) NOT NULL DEFAULT now(),
  "updated_at" timestamp(6) NOT NULL DEFAULT now()
)
;
ALTER TABLE "public"."profiles" OWNER TO "postgres";

-- ----------------------------
-- Records of profiles
-- ----------------------------
BEGIN;
INSERT INTO "public"."profiles" ("id", "user_id", "name", "surname", "phone", "avatar_url", "birth_date", "birth_place", "address", "country_id", "subdivision_id", "city", "zip_code", "gender", "company", "tax_code", "ipi_code", "bic_code", "aba_routing_number", "iban", "sdi_recipient_code", "billing_address", "billing_country_id", "billing_subdivision_id", "billing_city", "billing_zip_code", "billing_email", "billing_pec", "billing_phone", "taxable_invoice", "created_at", "updated_at") VALUES (3, 'vEn3AdwfLK5k7RB9a1baOkGfxI9HVTMB', 'Leo', 'Sel', '+393453822689', 'https://mzmigzmqxpmypbmvklfh.supabase.co/storage/v1/object/public/milano-ovest-admin/avatars/1751045387528-snaptik-7515337443390852374-2.jpeg', '1998-06-11', 'milano', 'via duomo ', 110, 1428, 'milano', '20129', 'femminile', 'Filli', 'SLMLRD98H11I690N', '12345', 'ij1h24314213412', '1234543', 'IT19287344711223', '1234142', 'Via roma 1', 1, 1426, 'milano', '20129', 'leonardo+1@filli.it', 'leonardo+1@filli.it', '+3934536354736', 'f', '2025-06-27 17:31:08.200154', '2025-06-27 17:31:08.200154');
INSERT INTO "public"."profiles" ("id", "user_id", "name", "surname", "phone", "avatar_url", "birth_date", "birth_place", "address", "country_id", "subdivision_id", "city", "zip_code", "gender", "company", "tax_code", "ipi_code", "bic_code", "aba_routing_number", "iban", "sdi_recipient_code", "billing_address", "billing_country_id", "billing_subdivision_id", "billing_city", "billing_zip_code", "billing_email", "billing_pec", "billing_phone", "taxable_invoice", "created_at", "updated_at") VALUES (9, 'FFGOqQg6LPsHgvNfvzv38eRkRRjqvt3r', 'Alice', 'Mariani', '+393453822678', 'https://mzmigzmqxpmypbmvklfh.supabase.co/storage/v1/object/public/milano-ovest-admin/avatars/1751545005801-snaptik-7515337443390852374-2.jpeg', '1999-02-27', 'Milano', 'Via Giuseppe 1', 110, 1428, 'Milano', '20129', 'femminile', 'Mokka', 'SLMLRD98H11I690N', '123451234444', NULL, NULL, 'IT19287344711223', NULL, 'Via duomo 1', 57, 731, 'Milano', '20129', 'fatturazione@filli.it', 'pec@filli.it', '+381234976', 't', '2025-07-03 12:20:54.714591', '2025-07-03 12:20:54.714591');
INSERT INTO "public"."profiles" ("id", "user_id", "name", "surname", "phone", "avatar_url", "birth_date", "birth_place", "address", "country_id", "subdivision_id", "city", "zip_code", "gender", "company", "tax_code", "ipi_code", "bic_code", "aba_routing_number", "iban", "sdi_recipient_code", "billing_address", "billing_country_id", "billing_subdivision_id", "billing_city", "billing_zip_code", "billing_email", "billing_pec", "billing_phone", "taxable_invoice", "created_at", "updated_at") VALUES (5, 'tVG7xjyBrvQ6X4HYe0QufaG7tbMopbzc', 'Selpino', 'Selpini', '+393453822689', 'https://mzmigzmqxpmypbmvklfh.supabase.co/storage/v1/object/public/milano-ovest-admin/avatars/1751444291428-logo-voiello.png', '1998-06-11', 'Milano', 'via duomo', 110, 1428, 'milano', '20129', 'femminile', 'Filli', 'SLMLRD98H11I690N', '123451234444', 'IJ1H24314213412', '1234543', 'IT19287344711223', '1234142', 'Via roma 1', 110, 1428, 'milano', '20129', 'leonardo+1@filli.it', 'leonardo+1@filli.it', '+3934536354736', 'f', '2025-06-30 15:31:46.420978', '2025-06-30 15:31:46.420978');
INSERT INTO "public"."profiles" ("id", "user_id", "name", "surname", "phone", "avatar_url", "birth_date", "birth_place", "address", "country_id", "subdivision_id", "city", "zip_code", "gender", "company", "tax_code", "ipi_code", "bic_code", "aba_routing_number", "iban", "sdi_recipient_code", "billing_address", "billing_country_id", "billing_subdivision_id", "billing_city", "billing_zip_code", "billing_email", "billing_pec", "billing_phone", "taxable_invoice", "created_at", "updated_at") VALUES (6, 'mPrOgzzpapfxM19TH2yN5ScE2u56DbvN', 'Sofia', 'Mariani', '+39 345383748', 'https://mzmigzmqxpmypbmvklfh.supabase.co/storage/v1/object/public/milano-ovest-admin/avatars/1751447237476-snaptik-7515337443390852374-2.jpeg', '1999-02-27', 'Como', 'Via Giuseppe Compagnoni 11', 110, 1428, 'Milano', '20129', 'femminile', 'Filli s.r.l', 'SLMLRD98H11I690N', '123456789', '1234AAAA', '1234567', 'IT19287344711223', '1234142', 'Via Giuseppe Compagnoni 11', 110, 1428, 'Milano', '20129', 'alice@filli.it', 'fatturazione@filli.it', '+38 12345123', 't', '2025-07-02 09:09:30.817959', '2025-07-02 09:09:30.817959');
INSERT INTO "public"."profiles" ("id", "user_id", "name", "surname", "phone", "avatar_url", "birth_date", "birth_place", "address", "country_id", "subdivision_id", "city", "zip_code", "gender", "company", "tax_code", "ipi_code", "bic_code", "aba_routing_number", "iban", "sdi_recipient_code", "billing_address", "billing_country_id", "billing_subdivision_id", "billing_city", "billing_zip_code", "billing_email", "billing_pec", "billing_phone", "taxable_invoice", "created_at", "updated_at") VALUES (7, 'SmdtueaEdRV68DkwVeR19r3lPJT7HUzN', 'Leonardo', 'Selmini', '+393453822678', 'https://mzmigzmqxpmypbmvklfh.supabase.co/storage/v1/object/public/milano-ovest-admin/avatars/1751452497730-snaptik-7515337443390852374-2.jpeg', '1998-06-11', 'Milano', 'Via Giuseppe 1', 110, 1428, 'Milano', '20129', 'non-binary', 'Filli srl', 'SLMLRD98H11I690N', '123456788', 'IJ1H24314213412', '12345', 'IT19287344711223', '123456A', 'Via duomo 1', 110, 1428, 'Milano', '20129', 'fatturazione@filli.it', 'pec@filli.it', '+381234976', 't', '2025-07-02 10:37:52.752057', '2025-07-02 10:37:52.752057');
INSERT INTO "public"."profiles" ("id", "user_id", "name", "surname", "phone", "avatar_url", "birth_date", "birth_place", "address", "country_id", "subdivision_id", "city", "zip_code", "gender", "company", "tax_code", "ipi_code", "bic_code", "aba_routing_number", "iban", "sdi_recipient_code", "billing_address", "billing_country_id", "billing_subdivision_id", "billing_city", "billing_zip_code", "billing_email", "billing_pec", "billing_phone", "taxable_invoice", "created_at", "updated_at") VALUES (10, 'Km5T0SK9jetTWkkZZPyTohMCMOLkLkUq', 'Leonardo', 'Selmini', '+393453822689', 'https://mzmigzmqxpmypbmvklfh.supabase.co/storage/v1/object/public/milano-ovest-admin/avatars/1751545005801-snaptik-7515337443390852374-2.jpeg', '1998-06-11', 'Milano', 'Via Giuseppe 1', 115, 1531, 'Milano', '20129', 'femminile', 'Mokka', 'SLMLRD98H11I690N', '123456789', NULL, NULL, 'IT19287344711223', NULL, 'Via duomo 1', 12, 135, 'Milano', '20129', 'leonardo+1@filli.it', 'pec@filli.it', '+3934536354736', 't', '2025-07-03 13:45:10.116669', '2025-07-03 13:45:10.116669');
INSERT INTO "public"."profiles" ("id", "user_id", "name", "surname", "phone", "avatar_url", "birth_date", "birth_place", "address", "country_id", "subdivision_id", "city", "zip_code", "gender", "company", "tax_code", "ipi_code", "bic_code", "aba_routing_number", "iban", "sdi_recipient_code", "billing_address", "billing_country_id", "billing_subdivision_id", "billing_city", "billing_zip_code", "billing_email", "billing_pec", "billing_phone", "taxable_invoice", "created_at", "updated_at") VALUES (13, 'pnFs4BxumJttWrUuZ3lbt7TBrhlJMde3', 'Filippo', 'Bertossi', '+39 1239847487', 'https://mzmigzmqxpmypbmvklfh.supabase.co/storage/v1/object/public/milano-ovest-admin/avatars/1752674108568-whatsapp-image-2025-07-09-at-10-28-22.jpeg', '2001-04-14', 'Milano', 'Via duomo 1', 10, 118, 'Pedras', '401829', 'non-binary', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'f', '2025-07-16 13:56:08.02869', '2025-07-16 13:56:08.02869');
INSERT INTO "public"."profiles" ("id", "user_id", "name", "surname", "phone", "avatar_url", "birth_date", "birth_place", "address", "country_id", "subdivision_id", "city", "zip_code", "gender", "company", "tax_code", "ipi_code", "bic_code", "aba_routing_number", "iban", "sdi_recipient_code", "billing_address", "billing_country_id", "billing_subdivision_id", "billing_city", "billing_zip_code", "billing_email", "billing_pec", "billing_phone", "taxable_invoice", "created_at", "updated_at") VALUES (14, 'g77jHRUgKH4OcwLMb754iySw14EbVOPZ', 'Gianna', 'Verde', '+39 1239847487', 'https://mzmigzmqxpmypbmvklfh.supabase.co/storage/v1/object/public/milano-ovest-admin/avatars/1752678356456-person.png', '1998-06-11', 'Milano', 'Via duomo 1', 110, 1433, 'Milano', '20129', 'femminile', 'Filli S.r.l.', 'SLMLRD98H11I690N', '123456789', NULL, NULL, 'IT12934791283749812734', 'ANC1283', 'Via roma 1', 110, 1435, 'Milano', '20129', 'wow@srl.com', 'ciao@eagle.it', '+39123441234', 't', '2025-07-16 15:07:34.95187', '2025-07-16 15:10:04.068');
INSERT INTO "public"."profiles" ("id", "user_id", "name", "surname", "phone", "avatar_url", "birth_date", "birth_place", "address", "country_id", "subdivision_id", "city", "zip_code", "gender", "company", "tax_code", "ipi_code", "bic_code", "aba_routing_number", "iban", "sdi_recipient_code", "billing_address", "billing_country_id", "billing_subdivision_id", "billing_city", "billing_zip_code", "billing_email", "billing_pec", "billing_phone", "taxable_invoice", "created_at", "updated_at") VALUES (8, '1UkQ6Ei67EpxKUVplZYBWAFSjYFQttF4', 'Leonardo', 'Pessina', '+393453822678', 'https://mzmigzmqxpmypbmvklfh.supabase.co/storage/v1/object/public/milano-ovest-admin/avatars/1751452497730-snaptik-7515337443390852374-2.jpeg', '1998-06-11', 'Milano', 'Via Giuseppe 1', 110, 1428, 'Milano', '20129', 'non-binary', 'Mokka', 'SLMLRD98H11I690N', '123456788', 'IJ1H24314213412', '1234543', 'IT19287344711223', NULL, 'Via duomo 1', 233, 3611, 'Milano', '20129', 'fatturazione@filli.it', 'pec@filli.it', '+381234976', 't', '2025-07-02 10:38:00.596004', '2025-07-02 10:38:00.596004');
INSERT INTO "public"."profiles" ("id", "user_id", "name", "surname", "phone", "avatar_url", "birth_date", "birth_place", "address", "country_id", "subdivision_id", "city", "zip_code", "gender", "company", "tax_code", "ipi_code", "bic_code", "aba_routing_number", "iban", "sdi_recipient_code", "billing_address", "billing_country_id", "billing_subdivision_id", "billing_city", "billing_zip_code", "billing_email", "billing_pec", "billing_phone", "taxable_invoice", "created_at", "updated_at") VALUES (4, 'KDyIv0QgZ55zXJfhnG8RW55CLpTTy2BH', 'Bianca', 'Sperini', '+393453822689', 'https://mzmigzmqxpmypbmvklfh.supabase.co/storage/v1/object/public/milano-ovest-admin/avatars/1751120520189-snaptik-7515337443390852374-2.jpeg', '1998-06-11', 'milano', 'Via Giuseppe 11', 110, 1428, 'milano', '20129', 'non-binary', 'Filli', 'SLMLRD98H11I690N', '123456776668', NULL, NULL, 'IT19287344711223', '123456A', 'Via roma 1', 110, 1428, 'milano', '20129', 'leonardo+1@filli.it', 'leonardo+1@filli.it', '+3934536354736', 'f', '2025-06-28 16:02:43.204041', '2025-07-04 13:22:01.841');
INSERT INTO "public"."profiles" ("id", "user_id", "name", "surname", "phone", "avatar_url", "birth_date", "birth_place", "address", "country_id", "subdivision_id", "city", "zip_code", "gender", "company", "tax_code", "ipi_code", "bic_code", "aba_routing_number", "iban", "sdi_recipient_code", "billing_address", "billing_country_id", "billing_subdivision_id", "billing_city", "billing_zip_code", "billing_email", "billing_pec", "billing_phone", "taxable_invoice", "created_at", "updated_at") VALUES (15, 'LORjajcme6wepJzYSpyj7t3JkvAglQfH', 'Bianca', 'Rossi', '+39 3453822689', 'https://mzmigzmqxpmypbmvklfh.supabase.co/storage/v1/object/public/milano-ovest-admin/avatars/1752678967068-whatsapp-image-2025-07-09-at-10-28-22-1-.jpeg', '1998-06-11', 'Milano', 'Via piero 1', 110, 1428, 'Milano', '20129', 'femminile', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'f', '2025-07-16 15:16:34.006301', '2025-07-16 15:17:06.152');
INSERT INTO "public"."profiles" ("id", "user_id", "name", "surname", "phone", "avatar_url", "birth_date", "birth_place", "address", "country_id", "subdivision_id", "city", "zip_code", "gender", "company", "tax_code", "ipi_code", "bic_code", "aba_routing_number", "iban", "sdi_recipient_code", "billing_address", "billing_country_id", "billing_subdivision_id", "billing_city", "billing_zip_code", "billing_email", "billing_pec", "billing_phone", "taxable_invoice", "created_at", "updated_at") VALUES (11, 'R4uoTk62O7IBBYS3ZlNZ1cs0kEaZtoPR', 'Marco', 'Pedro', '+393453822689', 'https://mzmigzmqxpmypbmvklfh.supabase.co/storage/v1/object/public/milano-ovest-admin/avatars/1752501941089-440a0f2f-e239-49c6-b0b5-74bd5edd9753-spark-clipboard.png', '1998-06-19', 'Milano', 'Via Giuseppe Compagnoni 11', 110, 1428, 'Milano', '20129', 'maschile', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'f', '2025-07-14 14:06:26.122707', '2025-07-14 15:02:21.321');
INSERT INTO "public"."profiles" ("id", "user_id", "name", "surname", "phone", "avatar_url", "birth_date", "birth_place", "address", "country_id", "subdivision_id", "city", "zip_code", "gender", "company", "tax_code", "ipi_code", "bic_code", "aba_routing_number", "iban", "sdi_recipient_code", "billing_address", "billing_country_id", "billing_subdivision_id", "billing_city", "billing_zip_code", "billing_email", "billing_pec", "billing_phone", "taxable_invoice", "created_at", "updated_at") VALUES (12, 'rSPIrm15X59BvoBSUzjFOrRxZWx2MmFx', 'Emilia', 'Rosanna', '+39 1239847487', 'https://mzmigzmqxpmypbmvklfh.supabase.co/storage/v1/object/public/milano-ovest-admin/avatars/1752671193952-person.png', '2000-08-24', 'Milano', 'Via Franco Sacchetti', 59, 750, 'Petro', '00137', 'femminile', 'Wow srl', 'SLMLRD98H11I690N', '123456789', NULL, NULL, 'IT12120394120348102394810293', NULL, 'Via Franco Sacchetti', 59, 750, 'Guagua', '00137', 'wow@srl.com', 'wow@pec.com', '+39123441234', 't', '2025-07-16 13:10:44.240228', '2025-07-16 13:31:55.244');
COMMIT;

-- ----------------------------
-- Table structure for sessions
-- ----------------------------
DROP TABLE IF EXISTS "public"."sessions";
CREATE TABLE "public"."sessions" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "expires_at" timestamp(6) NOT NULL,
  "token" text COLLATE "pg_catalog"."default" NOT NULL,
  "created_at" timestamp(6) NOT NULL,
  "updated_at" timestamp(6) NOT NULL,
  "ip_address" text COLLATE "pg_catalog"."default",
  "user_agent" text COLLATE "pg_catalog"."default",
  "user_id" text COLLATE "pg_catalog"."default" NOT NULL,
  "impersonated_by" text COLLATE "pg_catalog"."default"
)
;
ALTER TABLE "public"."sessions" OWNER TO "postgres";

-- ----------------------------
-- Records of sessions
-- ----------------------------
BEGIN;
INSERT INTO "public"."sessions" ("id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id", "impersonated_by") VALUES ('T6PR2neZNap72lW9S8g3TXi7adNRlLgc', '2025-05-30 18:11:18.509', 'SOj8kMTi0YrOXtA3at5PR1HPd3cYGvjT', '2025-05-23 18:11:18.509', '2025-05-23 18:11:18.509', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36', 'BTw1kpUUysVHkNTHr8aIsa9WFcwg4KUj', NULL);
INSERT INTO "public"."sessions" ("id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id", "impersonated_by") VALUES ('AwuYSkHiKjzl8ymL1jW5J7AHidONUOcT', '2025-05-30 18:40:29.626', 'i6dIU9lMwsVVQX6r79AY2naxA8iPMtLE', '2025-05-23 18:40:29.626', '2025-05-23 18:40:29.626', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36', 'BTw1kpUUysVHkNTHr8aIsa9WFcwg4KUj', NULL);
INSERT INTO "public"."sessions" ("id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id", "impersonated_by") VALUES ('IWmBxVAi7JREQQeQ0gO8My7VYN2Qp2Nh', '2025-05-30 18:41:30.947', 'N4F8ek2urXuYFA5jfoZ99qnlRmuQqUZA', '2025-05-23 18:41:30.947', '2025-05-23 18:41:30.947', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36', 'BTw1kpUUysVHkNTHr8aIsa9WFcwg4KUj', NULL);
INSERT INTO "public"."sessions" ("id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id", "impersonated_by") VALUES ('QuXmJfUAhW38Z5lCENEO2qE51dFVNmV9', '2025-05-30 18:42:07.357', 'xoXhDlDVkZWf98owg25xFZOFB78Opw1Y', '2025-05-23 18:42:07.358', '2025-05-23 18:42:07.358', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36', 'BTw1kpUUysVHkNTHr8aIsa9WFcwg4KUj', NULL);
INSERT INTO "public"."sessions" ("id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id", "impersonated_by") VALUES ('Y3bexE5y3WakCXPOFykwbUa0Gmoniwr8', '2025-05-30 18:43:36.317', 'bqaZ10RWQrL7CaMwYp3C1hKsvU3SesKH', '2025-05-23 18:43:36.317', '2025-05-23 18:43:36.317', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36', 'BTw1kpUUysVHkNTHr8aIsa9WFcwg4KUj', NULL);
INSERT INTO "public"."sessions" ("id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id", "impersonated_by") VALUES ('0wZwILF8JMchE1TYlNgvgpO6ihB4sQiq', '2025-05-30 18:45:48.814', 'haA5rcoIuYs1oj93cyM2ZpihRKYtdBww', '2025-05-23 18:45:48.815', '2025-05-23 18:45:48.815', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36', 'BTw1kpUUysVHkNTHr8aIsa9WFcwg4KUj', NULL);
INSERT INTO "public"."sessions" ("id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id", "impersonated_by") VALUES ('YsP74QwAqMIM1DpWIfHhwyzKidGQMStU', '2025-06-02 08:53:45.611', 'wEkVCAcKb3HnioutgfoMwouoAoSMqkXo', '2025-05-26 08:53:45.613', '2025-05-26 08:53:45.613', '', '', 'BTw1kpUUysVHkNTHr8aIsa9WFcwg4KUj', NULL);
INSERT INTO "public"."sessions" ("id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id", "impersonated_by") VALUES ('JZJoa8wl5Vn4QPr52kb7ofCfJvxqwO7f', '2025-06-02 08:54:54.995', 'UOeMllNSQrQNfL6sPmmR2ZjRtkfra3xM', '2025-05-26 08:54:55.005', '2025-05-26 08:54:55.005', '', '', 'BTw1kpUUysVHkNTHr8aIsa9WFcwg4KUj', NULL);
INSERT INTO "public"."sessions" ("id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id", "impersonated_by") VALUES ('q6vp6s7o1aG3fAhdP7cGQWSMLNo855AO', '2025-06-02 09:00:06.025', '4cqCJanlyZCB5L4z5qJBGvJoYilJYwQ3', '2025-05-26 09:00:06.028', '2025-05-26 09:00:06.028', '', '', 'BTw1kpUUysVHkNTHr8aIsa9WFcwg4KUj', NULL);
INSERT INTO "public"."sessions" ("id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id", "impersonated_by") VALUES ('Ri6pjQdk12wTCauKtTMd4ys1cTiWQxJU', '2025-06-02 09:06:03.9', '9OWTeqFmkhs6JK5S12PJ7uzXHriBG4Cg', '2025-05-26 09:06:03.901', '2025-05-26 09:06:03.901', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36', 'BTw1kpUUysVHkNTHr8aIsa9WFcwg4KUj', NULL);
INSERT INTO "public"."sessions" ("id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id", "impersonated_by") VALUES ('ne4uTZJRTpqYUH0auzBxGYVow7tD3AmU', '2025-06-02 09:08:56.72', '8kvoqf1tNUFM1FXT8VIjgydDOyDj8HWj', '2025-05-26 09:08:56.72', '2025-05-26 09:08:56.72', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36', 'BTw1kpUUysVHkNTHr8aIsa9WFcwg4KUj', NULL);
INSERT INTO "public"."sessions" ("id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id", "impersonated_by") VALUES ('5vVbewUMOasaAgRlgXjUx1pp1Oz44sD2', '2025-06-02 09:27:25.879', 'tsxjsL8BHdvlmJeg5pT5i1y77MFUk8fz', '2025-05-26 09:27:25.88', '2025-05-26 09:27:25.88', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36', 'BTw1kpUUysVHkNTHr8aIsa9WFcwg4KUj', NULL);
INSERT INTO "public"."sessions" ("id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id", "impersonated_by") VALUES ('mtBO8Fp1RhANFlA1TXQdsXyVY2PeKuvd', '2025-06-02 14:34:20.952', 'BsplLcTRPizXncQO8lhVa7R29nD2gVjT', '2025-05-26 14:34:20.959', '2025-05-26 14:34:20.959', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36', 'BTw1kpUUysVHkNTHr8aIsa9WFcwg4KUj', NULL);
INSERT INTO "public"."sessions" ("id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id", "impersonated_by") VALUES ('7wfJhFhGg3ApDtrHDYw4MQmbLEUZhmCP', '2025-06-02 14:36:16.196', 'hx7jy8LZdsPnfehN3U5DAtk4VarEsIlj', '2025-05-26 14:36:16.197', '2025-05-26 14:36:16.197', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36', 'BTw1kpUUysVHkNTHr8aIsa9WFcwg4KUj', NULL);
INSERT INTO "public"."sessions" ("id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id", "impersonated_by") VALUES ('dQaKjgBUFHuEsOBZiGZzf2Fcpt8z23vx', '2025-06-25 16:06:03.67', '5YyeASxxqZkwv5h6i3BxXua4QOtTVG7k', '2025-05-26 16:06:03.671', '2025-05-26 16:06:03.671', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36', 'BTw1kpUUysVHkNTHr8aIsa9WFcwg4KUj', NULL);
INSERT INTO "public"."sessions" ("id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id", "impersonated_by") VALUES ('lTyaDezy8csHD1rycRHSJIbdIy8LCOmE', '2025-06-25 16:09:25.721', '88ArTKmQYGML2WXED2U5GW17ZuMIMutm', '2025-05-26 16:09:25.722', '2025-05-26 16:09:25.722', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36', 'BTw1kpUUysVHkNTHr8aIsa9WFcwg4KUj', NULL);
INSERT INTO "public"."sessions" ("id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id", "impersonated_by") VALUES ('PYD6KpyvpgX5PYay94KIG2Kn1NMJWZrm', '2025-06-27 14:02:17.608', 'nVpmsJnNcO7nutIeXckka21prgAblpUq', '2025-05-28 14:02:17.61', '2025-05-28 14:02:17.61', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36', 'BTw1kpUUysVHkNTHr8aIsa9WFcwg4KUj', NULL);
INSERT INTO "public"."sessions" ("id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id", "impersonated_by") VALUES ('Yifu7nMIJE6mvjin4RllZKvgDGAblKiw', '2025-07-10 08:43:54.243', 'V4g30kCuBqIu9LDBB0EDyeHaMYAnR2dr', '2025-06-10 08:43:54.246', '2025-06-10 08:43:54.246', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 'BTw1kpUUysVHkNTHr8aIsa9WFcwg4KUj', NULL);
INSERT INTO "public"."sessions" ("id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id", "impersonated_by") VALUES ('SrXwsSx6VUUe3FQMwvDtKW33WbeGJR7q', '2025-07-10 08:58:13.884', 'QUVIQaxyDAbpBbwrsFtNIHdah9ctM2cN', '2025-06-10 08:58:13.885', '2025-06-10 08:58:13.885', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 'BTw1kpUUysVHkNTHr8aIsa9WFcwg4KUj', NULL);
INSERT INTO "public"."sessions" ("id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id", "impersonated_by") VALUES ('JkaCvfJPjDtR1rkcUVFPuBa8KCYxb71E', '2025-07-10 10:45:01.175', 'iaexCcoSIimHunX68QDCmJFtjcBowvUU', '2025-06-10 10:45:01.176', '2025-06-10 10:45:01.176', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 'BTw1kpUUysVHkNTHr8aIsa9WFcwg4KUj', NULL);
INSERT INTO "public"."sessions" ("id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id", "impersonated_by") VALUES ('haJRktdCdNmFmayRtKlN5EwJyHn690B3', '2025-07-10 10:47:57.552', 'TNcqjV3lr0AoRHU4LezeWOa2DeClMlmg', '2025-06-10 10:47:57.555', '2025-06-10 10:47:57.555', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 'BTw1kpUUysVHkNTHr8aIsa9WFcwg4KUj', NULL);
INSERT INTO "public"."sessions" ("id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id", "impersonated_by") VALUES ('TnKoc3GuGppT7cyXxqFrgTf70ecqOEB5', '2025-07-10 11:02:34.031', 'm3Oplmp4j8JH6lj7PN5F4hdu4666qvow', '2025-06-10 11:02:34.035', '2025-06-10 11:02:34.035', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 'BTw1kpUUysVHkNTHr8aIsa9WFcwg4KUj', NULL);
INSERT INTO "public"."sessions" ("id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id", "impersonated_by") VALUES ('rEdI2LXFNz8S0tqoDnaT41EGsCThA8eL', '2025-07-23 08:28:00.317', 'fpvDdGgomOA2GfZrRvKRjqnCjstPWAAM', '2025-06-19 14:08:58.084', '2025-06-19 14:08:58.084', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 'BTw1kpUUysVHkNTHr8aIsa9WFcwg4KUj', NULL);
INSERT INTO "public"."sessions" ("id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id", "impersonated_by") VALUES ('sK2TAYI3y6cluzx3xWobxytnq6kDxWS0', '2025-07-18 13:23:39.834', 'YYyfplZTdfqCbk0GWx4WFLvuBUGg7uAo', '2025-06-10 13:22:31.018', '2025-06-10 13:22:31.018', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 'BTw1kpUUysVHkNTHr8aIsa9WFcwg4KUj', NULL);
INSERT INTO "public"."sessions" ("id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id", "impersonated_by") VALUES ('YSZukMvx8V6hW5vJJ8uLcqcOELAu4p23', '2025-07-18 13:28:12.031', '0qxRw1sExX29xbOuOEpUWFjWfqNGAJUx', '2025-06-18 13:28:12.038', '2025-06-18 13:28:12.038', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 'BTw1kpUUysVHkNTHr8aIsa9WFcwg4KUj', NULL);
INSERT INTO "public"."sessions" ("id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id", "impersonated_by") VALUES ('I9Qks9B08eFGntEakmqCoOrsUcacS5xl', '2025-07-18 13:31:18.826', 'NYRBXHGX3UdU4rnCrL5kUEmj8LubvUQD', '2025-06-18 13:31:18.826', '2025-06-18 13:31:18.826', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 'BTw1kpUUysVHkNTHr8aIsa9WFcwg4KUj', NULL);
INSERT INTO "public"."sessions" ("id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id", "impersonated_by") VALUES ('C8yR5l8OWDLjVVE73wgMCKNj3NT9QFE8', '2025-07-23 14:21:03.806', '1UjWgDIIiOzfw0Afd3TL5ZhZtyabgb3h', '2025-06-23 14:21:03.806', '2025-06-23 14:21:03.806', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', '7FfguPdOCplD0CSxSsKsOlTcIvkzjn2K', NULL);
INSERT INTO "public"."sessions" ("id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id", "impersonated_by") VALUES ('ksjxsLIyoeLhOgV991UJeIVLXvZkBrpX', '2025-07-23 14:00:35.911', 'U7dSD2WP8wa6WWqsdqQucg8R0cuMZFMm', '2025-06-23 14:00:35.912', '2025-06-23 14:00:35.912', '93.66.97.218', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 'BTw1kpUUysVHkNTHr8aIsa9WFcwg4KUj', NULL);
INSERT INTO "public"."sessions" ("id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id", "impersonated_by") VALUES ('6USkVwm3zS5kBnKymMyEZMMyif5dDz0U', '2025-07-23 14:21:40.438', 'wBVoKbV6VnKBSVcy6tidDqwdBWVRs2Fi', '2025-06-23 14:21:40.438', '2025-06-23 14:21:40.438', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 'qPSsbIL4EOqM48BsrcjvQBJd43UGQwvx', NULL);
INSERT INTO "public"."sessions" ("id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id", "impersonated_by") VALUES ('nNSsiIu5zbxk0xDeTjpJNc4bFqnWx0yB', '2025-07-23 14:23:31.486', '7dvmLneXnd7pA6x3AnBjilpA5lqxaqKs', '2025-06-23 14:23:31.488', '2025-06-23 14:23:31.488', '93.66.97.218', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 'qPSsbIL4EOqM48BsrcjvQBJd43UGQwvx', NULL);
INSERT INTO "public"."sessions" ("id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id", "impersonated_by") VALUES ('qroROW8NWi5NJM00mtmlNhKhWMkfxCNJ', '2025-07-23 14:42:43.18', 'Vxa4pL9qqJFYdDH1RMiKXIR0FdkkabyQ', '2025-06-23 14:42:43.18', '2025-06-23 14:42:43.18', '93.66.97.218', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 'BTw1kpUUysVHkNTHr8aIsa9WFcwg4KUj', NULL);
INSERT INTO "public"."sessions" ("id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id", "impersonated_by") VALUES ('ShNr7tZ0CX9kZVK3A2WPMIo2fuCw7F5J', '2025-07-25 09:14:42.02', '4C3UP36GEMHCEAupOy8GMHkM9yW10bpd', '2025-06-25 09:14:42.021', '2025-06-25 09:14:42.021', '93.39.156.46', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'XKhiGjTht1pd4Ge7oB1m1TTHCsHvwjNA', NULL);
INSERT INTO "public"."sessions" ("id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id", "impersonated_by") VALUES ('jfHkw1Um0upRrs93u0FpjoaCchRhca8u', '2025-07-27 13:25:11.205', 'uv6gH21F6YSuc0ZVfW7Y2E3kEFHIq66h', '2025-06-27 13:25:11.205', '2025-06-27 13:25:11.205', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'BTw1kpUUysVHkNTHr8aIsa9WFcwg4KUj', NULL);
INSERT INTO "public"."sessions" ("id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id", "impersonated_by") VALUES ('wxINyU1TOC5KKaGMoU5DNXsL3hNTKxAz', '2025-07-27 13:43:22.101', 'QyugHql5APwJDKf2x2fr6Ko4LZU0GaBv', '2025-06-27 13:43:22.101', '2025-06-27 13:43:22.101', '', '', '42El0wMZG4fdVf7lp7d5v7ccvHZJywv6', NULL);
INSERT INTO "public"."sessions" ("id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id", "impersonated_by") VALUES ('VBCvFnHOiOVZUSC9WQ7EZkcFGOVpRiwH', '2025-08-15 15:04:47.132', 'RHK0CrVZMliZ6Wv86DCbtsENRUE1nay5', '2025-07-16 15:04:47.132', '2025-07-16 15:04:47.132', '93.71.65.227', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 'BTw1kpUUysVHkNTHr8aIsa9WFcwg4KUj', NULL);
INSERT INTO "public"."sessions" ("id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id", "impersonated_by") VALUES ('odqVtSgYrUjouX28ENuWniwM6ZwOt8s2', '2025-08-02 09:10:19.509', 'ebOtWv8vPJueXXccM3oaabuy8UUjzK1F', '2025-06-24 10:25:07.419', '2025-06-24 10:25:07.419', '94.84.47.142', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'qPSsbIL4EOqM48BsrcjvQBJd43UGQwvx', NULL);
INSERT INTO "public"."sessions" ("id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id", "impersonated_by") VALUES ('qxLSdO9jclM7uD2CYGF2jM7kFpd3Grmi', '2025-08-15 13:02:32.272', 'UjIX4Fk8WUu8PuFX6E1rpJq8qPL8yZFQ', '2025-07-16 13:02:32.272', '2025-07-16 13:02:32.272', '93.71.65.227', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 'BTw1kpUUysVHkNTHr8aIsa9WFcwg4KUj', NULL);
COMMIT;

-- ----------------------------
-- Table structure for subdivisions
-- ----------------------------
DROP TABLE IF EXISTS "public"."subdivisions";
CREATE TABLE "public"."subdivisions" (
  "id" int4 NOT NULL DEFAULT nextval('subdivisions_id_seq'::regclass),
  "country_id" int4 NOT NULL,
  "name" varchar(200) COLLATE "pg_catalog"."default" NOT NULL,
  "created_at" timestamp(6) NOT NULL DEFAULT now()
)
;
ALTER TABLE "public"."subdivisions" OWNER TO "postgres";

-- ----------------------------
-- Records of subdivisions
-- ----------------------------
BEGIN;
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1, 1, 'Andorra la Vella', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2, 1, 'Sant Julià de Lòria', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3, 1, 'parrocchia di Canillo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (4, 1, 'parrocchia di Encamp', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (5, 1, 'parrocchia di Escaldes-Engordany', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (6, 1, 'parrocchia di La Massana', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (7, 1, 'parrocchia di Ordino', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (8, 2, 'Ash Shāriqah', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (9, 2, 'Emirato di Abu Dhabi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (10, 3, 'Badakhshan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (11, 3, 'Badghis', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (12, 3, 'Baghlan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (13, 3, 'Balkh', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (14, 3, 'Daikondi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (15, 3, 'Faryab', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (16, 3, 'Ghowr', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (17, 3, 'Helmand', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (18, 3, 'Jowzjan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (19, 3, 'Kapisa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (20, 3, 'Konar', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (21, 3, 'Laghman', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (22, 3, 'Lowgar', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (23, 3, 'Nangarhar', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (24, 3, 'Nurestan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (25, 3, 'Oruzgan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (26, 3, 'Paktia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (27, 3, 'Paktika', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (28, 3, 'Panjshir', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (29, 3, 'Parwān', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (30, 3, 'Provincia di Sar-e Pol', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (31, 3, 'Samangan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (32, 3, 'Takhar', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (33, 3, 'Wardak', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (34, 3, 'Wilāyat-e Nīmrōz', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (35, 3, 'Zabol', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (36, 3, 'provincia di Bamiyan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (37, 3, 'provincia di Farah', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (38, 3, 'provincia di Ghazni', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (39, 3, 'provincia di Herat', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (40, 3, 'provincia di Kabul', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (41, 3, 'provincia di Kandahar', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (42, 3, 'provincia di Khowst', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (43, 3, 'provincia di Konduz', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (44, 4, 'Barbuda', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (45, 4, 'Redonda', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (46, 4, 'Saint George', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (47, 4, 'Saint John', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (48, 4, 'Saint Mary', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (49, 4, 'Saint Paul', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (50, 4, 'Saint Peter', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (51, 4, 'Saint Philip', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (66, 6, 'Qarku i Beratit', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (67, 6, 'Qarku i Dibrës', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (68, 6, 'Qarku i Durrësit', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (69, 6, 'Qarku i Elbasanit', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (70, 6, 'Qarku i Fierit', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (71, 6, 'Qarku i Gjirokastrës', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (72, 6, 'Qarku i Korçës', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (73, 6, 'Qarku i Kukësit', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (74, 6, 'Qarku i Lezhës', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (75, 6, 'Qarku i Shkodrës', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (76, 6, 'Qarku i Vlorës', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (77, 6, 'Tirana', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (78, 7, 'Aragatsotn', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (79, 7, 'Erevan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (80, 7, 'Gegharkunik', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (81, 7, 'Lori', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (82, 7, 'Syunik', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (83, 7, 'Vayots Dzor', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (84, 7, 'provincia di Ararat', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (85, 7, 'provincia di Armavir', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (86, 7, 'provincia di Kotayk''', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (87, 7, 'provincia di Shirak', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (88, 7, 'provincia di Tavowš', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (89, 8, 'Cuando Cubango', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (90, 8, 'Provincia di Cabinda', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (91, 8, 'Província do Bié', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (92, 8, 'provincia del Bengo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (93, 8, 'provincia del Cunene', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (94, 8, 'provincia dello Zaire', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (95, 8, 'provincia di Benguela', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (96, 8, 'provincia di Cuanza Nord', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (97, 8, 'provincia di Cuanza Sud', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (98, 8, 'provincia di Huambo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (99, 8, 'provincia di Huíla', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (100, 8, 'provincia di Luanda', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (101, 8, 'provincia di Lunda Nord', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (102, 8, 'provincia di Lunda Sud', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (103, 8, 'provincia di Malanje', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (104, 8, 'provincia di Moxico', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (105, 8, 'provincia di Namibe', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (106, 8, 'provincia di Uíge', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (107, 10, 'Buenos Aires', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (108, 10, 'Catamarca', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (109, 10, 'Chaco', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (110, 10, 'Chubut', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (111, 10, 'Ciudad Autónoma de Buenos Aires', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (112, 10, 'Corrientes', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (113, 10, 'Córdoba', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (114, 10, 'Entre Ríos', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (115, 10, 'Formosa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (116, 10, 'Jujuy', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (117, 10, 'La Pampa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (118, 10, 'La Rioja', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (119, 10, 'Mendoza', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (120, 10, 'Misiones', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (121, 10, 'Neuquén', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (122, 10, 'Río Negro', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (123, 10, 'Salta', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (124, 10, 'San Juan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (125, 10, 'San Luis', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (126, 10, 'Santa Cruz', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (127, 10, 'Santa Fe', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (128, 10, 'Santiago del Estero', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (129, 10, 'Tucumán', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (130, 10, 'provincia di Terra del Fuoco', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (131, 12, 'Alta Austria', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (132, 12, 'Bassa Austria', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (133, 12, 'Burgenland', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (134, 12, 'Carinzia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (135, 12, 'Salisburghese', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (136, 12, 'Stiria', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (137, 12, 'Tirolo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (138, 12, 'Vienna', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (139, 12, 'Vorarlberg', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (140, 13, 'Australia Occidentale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (141, 13, 'Nuovo Galles del Sud', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (142, 13, 'State of Queensland', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (143, 13, 'State of South Australia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (144, 13, 'Tasmania', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (145, 13, 'Territorio del Nord', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (146, 13, 'Territorio della Capitale Australiana', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (147, 13, 'Victoria', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (151, 16, 'Absheron Rayon', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (152, 16, 'Aghdam Rayon', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (153, 16, 'Aghdash Rayon', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (154, 16, 'Aghjabadi Rayon', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (155, 16, 'Aghstafa Rayon', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (156, 16, 'Baku City', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (157, 16, 'Beylagan Rayon', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (158, 16, 'Dashkasan Rayon', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (159, 16, 'Ganja City', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (160, 16, 'Gobustan Rayon', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (161, 16, 'Goychay Rayon', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (162, 16, 'Goygol Rayon', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (163, 16, 'Hajigabul Rayon', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (164, 16, 'Imishli Rayon', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (165, 16, 'Khachmaz Rayon', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (166, 16, 'Khizi Rayon', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (167, 16, 'Lankaran Rayon', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (168, 16, 'Lankaran Sahari', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (169, 16, 'Laçın Rayonu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (170, 16, 'Mingacevir City', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (171, 16, 'Neftchala Rayon', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (172, 16, 'Oghuz Rayon', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (173, 16, 'Qakh Rayon', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (174, 16, 'Qazakh Rayon', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (175, 16, 'Quba Rayon', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (176, 16, 'Qubadli Rayon', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (177, 16, 'Repubblica Autonoma di Nakhchivan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (178, 16, 'Samukh Rayon', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (179, 16, 'Shaki Rayon', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (180, 16, 'Shaki city', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (181, 16, 'Shamakhi Rayon', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (182, 16, 'Shamkir Rayon', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (183, 16, 'Shirvan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (184, 16, 'Shusha', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (185, 16, 'Siazan Rayon', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (186, 16, 'Sumqayit City', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (187, 16, 'Ujar Rayon', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (188, 16, 'Xankandi Sahari', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (189, 16, 'Yevlakh City', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (190, 16, 'Yevlakh Rayon', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (191, 16, 'Zardab Rayon', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (192, 16, 'distretto di Astara', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (193, 16, 'distretto di Ağsu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (194, 16, 'distretto di Balakən', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (195, 16, 'distretto di Biləsuvar', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (196, 16, 'distretto di Bərdə', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (197, 16, 'distretto di Cəbrayıl', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (198, 16, 'distretto di Cəlilabad', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (199, 16, 'distretto di Füzuli', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (200, 16, 'distretto di Goranboy', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (201, 16, 'distretto di Gədəbəy', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (202, 16, 'distretto di Kürdəmir', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (203, 16, 'distretto di Kəlbəcər', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (204, 16, 'distretto di Lerik', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (205, 16, 'distretto di Qusar', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (206, 16, 'distretto di Qəbələ', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (207, 16, 'distretto di Sabirabad', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (208, 16, 'distretto di Tovuz', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (209, 16, 'distretto di Tərtər', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (210, 16, 'distretto di Xocavənd', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (211, 16, 'distretto di Yardımlı', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (212, 16, 'distretto di Zaqatala', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (213, 16, 'distretto di Zəngilan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (214, 16, 'distretto di Şabran', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (215, 16, 'Şuşa Rayonu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (216, 17, 'Distretto di Brčko', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (217, 17, 'Federazione di Bosnia ed Erzegovina', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (218, 17, 'Repubblica Serba di Bosnia ed Erzegovina', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (219, 18, 'Christ Church', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (220, 18, 'Saint Andrew', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (221, 18, 'Saint George', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (222, 18, 'Saint James', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (223, 18, 'Saint John', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (224, 18, 'Saint Joseph', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (225, 18, 'Saint Lucy', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (226, 18, 'Saint Michael', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (227, 18, 'Saint Peter', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (228, 18, 'Saint Philip', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (229, 18, 'Saint Thomas', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (230, 19, 'Divisione di Chittagong', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (231, 19, 'Mymensingh Division', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (232, 19, 'divisione di Barisal', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (233, 19, 'divisione di Dacca', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (234, 19, 'divisione di Khulna', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (235, 19, 'divisione di Rajshahi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (236, 19, 'divisione di Rangpur', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (237, 19, 'divisione di Sylhet', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (238, 20, 'Regione di Bruxelles-Capitale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (239, 20, 'Regione fiamminga', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (240, 20, 'Vallonia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (241, 21, 'regione degli Alti Bacini', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (242, 21, 'regione del Centro', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (243, 21, 'regione del Centro-Est', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (244, 21, 'regione del Centro-Nord', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (245, 21, 'regione del Centro-Ovest', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (246, 21, 'regione del Centro-Sud', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (247, 21, 'regione del Nord', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (248, 21, 'regione del Sahel', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (249, 21, 'regione del Sud-Ovest', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (250, 21, 'regione dell''Altopiano Centrale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (251, 21, 'regione dell''Est', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (252, 21, 'regione delle Cascate', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (253, 21, 'regione di Boucle du Mouhoun', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (254, 22, 'Blagoevgrad', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (255, 22, 'Burgas', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (256, 22, 'Distretto di Gabrovo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (257, 22, 'Distretto di Sofia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (258, 22, 'Haskovo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (259, 22, 'Lovech', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (260, 22, 'Oblast Dobrich', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (261, 22, 'Oblast Kardzhali', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (262, 22, 'Oblast Kyustendil', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (263, 22, 'Oblast Montana', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (264, 22, 'Oblast Pleven', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (265, 22, 'Oblast Razgrad', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (266, 22, 'Oblast Ruse', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (267, 22, 'Oblast Shumen', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (268, 22, 'Oblast Silistra', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (269, 22, 'Oblast Sliven', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (270, 22, 'Oblast Smolyan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (271, 22, 'Oblast Stara Zagora', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (272, 22, 'Oblast Targovishte', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (273, 22, 'Oblast Veliko Tarnovo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (274, 22, 'Oblast Vidin', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (275, 22, 'Oblast Vratsa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (276, 22, 'Oblast Yambol', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (277, 22, 'Pazardzhik', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (278, 22, 'Pernik', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (279, 22, 'Plovdiv', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (280, 22, 'Sofia-Grad', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (281, 22, 'Varna', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (282, 23, 'Governatorato Meridionale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (283, 23, 'Governatorato Settentrionale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (284, 23, 'Governatorato della Capitale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (285, 23, 'Governatorato di Muharraq', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (286, 24, 'provincia di Bubanza', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (287, 24, 'provincia di Bujumbura Mairie', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (288, 24, 'provincia di Bujumbura Rurale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (289, 24, 'provincia di Bururi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (290, 24, 'provincia di Cankuzo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (291, 24, 'provincia di Cibitoke', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (292, 24, 'provincia di Gitega', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (293, 24, 'provincia di Karuzi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (294, 24, 'provincia di Kayanza', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (295, 24, 'provincia di Kirundo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (296, 24, 'provincia di Makamba', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (297, 24, 'provincia di Muramvya', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (298, 24, 'provincia di Muyinga', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (299, 24, 'provincia di Mwaro', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (300, 24, 'provincia di Ngozi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (301, 24, 'provincia di Rumonge', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (302, 24, 'provincia di Rutana', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (303, 24, 'provincia di Ruyigi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (304, 25, 'dipartimento del Litorale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (305, 25, 'dipartimento dell''Altopiano', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (306, 25, 'dipartimento dell''Atlantico', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (307, 25, 'dipartimento delle Colline', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (308, 25, 'dipartimento di Alibori', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (309, 25, 'dipartimento di Atakora', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (310, 25, 'dipartimento di Borgou', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (311, 25, 'dipartimento di Donga', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (312, 25, 'dipartimento di Kouffo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (313, 25, 'dipartimento di Mono', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (314, 25, 'dipartimento di Ouémé', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (315, 25, 'dipartimento di Zou', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (327, 28, 'Belait', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (328, 28, 'Temburong', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (329, 28, 'Tutong', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (330, 28, 'distretto di Brunei-Muara', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (331, 29, 'Departamento de Cochabamba', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (332, 29, 'Departamento de Pando', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (333, 29, 'La Paz', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (334, 29, 'dipartimento di Beni', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (335, 29, 'dipartimento di Chuquisaca', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (336, 29, 'dipartimento di Oruro', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (337, 29, 'dipartimento di Potosí', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (338, 29, 'dipartimento di Santa Cruz', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (339, 29, 'dipartimento di Tarija', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (343, 31, 'Acre', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (344, 31, 'Alagoas', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (345, 31, 'Amapá', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (346, 31, 'Amazonas', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (347, 31, 'Bahia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (348, 31, 'Ceará', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (349, 31, 'Distretto Federale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (350, 31, 'Espírito Santo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (351, 31, 'Goiás', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (352, 31, 'Maranhão', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (353, 31, 'Mato Grosso', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (354, 31, 'Mato Grosso do Sul', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (355, 31, 'Paraná', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (356, 31, 'Paraíba', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (357, 31, 'Pará', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (358, 31, 'Piauí', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (359, 31, 'Rio Grande do Norte', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (360, 31, 'Rio Grande do Sul', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (361, 31, 'Rio de Janeiro', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (362, 31, 'Rondônia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (363, 31, 'Roraima', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (364, 31, 'San Paolo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (365, 31, 'Santa Catarina', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (366, 31, 'Sergipe', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (367, 31, 'Stato di Minas Gerais', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (368, 31, 'Stato di Pernambuco', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (369, 31, 'Tocantins', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (370, 32, 'Acklins Island District', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (371, 32, 'Bimini', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (372, 32, 'Cat', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (373, 32, 'Central Abaco', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (374, 32, 'Central Andros', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (375, 32, 'Central Eleuthera', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (376, 32, 'Crooked Island and Long Cay District', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (377, 32, 'Distretto di Berry Islands', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (378, 32, 'Distretto di Black Point', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (379, 32, 'East Grand Bahama', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (380, 32, 'Exuma', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (381, 32, 'Freeport', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (382, 32, 'Grand Cay', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (383, 32, 'Great Inagua', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (384, 32, 'Harbour Island', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (385, 32, 'Hope Town', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (386, 32, 'Long Island', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (387, 32, 'Mangrove Cay', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (388, 32, 'Mayaguana District', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (389, 32, 'Moore’s Island District', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (390, 32, 'New Providence District', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (391, 32, 'North Abaco', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (392, 32, 'North Andros', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (393, 32, 'North Eleuthera', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (394, 32, 'Ragged Island', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (395, 32, 'Rum Cay', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (396, 32, 'San Salvador District', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (397, 32, 'South Abaco', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (398, 32, 'South Andros', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (399, 32, 'South Eleuthera', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (400, 32, 'Spanish Wells', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (401, 32, 'West Grand Bahama', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (402, 33, 'Bumthang Dzongkhag', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (403, 33, 'Chhukha Dzongkhag', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (404, 33, 'Dagana Dzongkhag', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (405, 33, 'Gasa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (406, 33, 'Haa Dzongkhag', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (407, 33, 'Lhuentse Dzongkhag', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (408, 33, 'Mongar Dzongkhag', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (409, 33, 'Paro Dzongkhag', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (410, 33, 'Pemagatshel Dzongkhag', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (411, 33, 'Punakha Dzongkhag', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (412, 33, 'Samdrup Jongkhar Dzongkhag', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (413, 33, 'Samtse Dzongkhag', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (414, 33, 'Sarpang Dzongkhag', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (415, 33, 'Thimphu Dzongkhag', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (416, 33, 'Trashi Yangste', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (417, 33, 'Trashigang Dzongkhag', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (418, 33, 'Trongsa Dzongkhag', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (419, 33, 'Tsirang Dzongkhag', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (420, 33, 'Wangdue Phodrang Dzongkhag', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (421, 33, 'Zhemgang Dzongkhag', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (422, 35, 'Chobe District', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (423, 35, 'City of Francistown', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (424, 35, 'Gaborone', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (425, 35, 'Jwaneng', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (426, 35, 'Lobatse', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (427, 35, 'North East District', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (428, 35, 'Selibe Phikwe', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (429, 35, 'South East District', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (430, 35, 'Sowa Town', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (431, 35, 'distretto Centrale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (432, 35, 'distretto Meridionale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (433, 35, 'distretto Nordoccidentale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (434, 35, 'distretto di Ghanzi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (435, 35, 'distretto di Kgalagadi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (436, 35, 'distretto di Kgatleng', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (437, 35, 'distretto di Kweneng', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (438, 36, 'Brest Oblast', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (439, 36, 'Grodno Oblast', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (440, 36, 'Homyel’ Voblasc’', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (441, 36, 'Minsk', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (442, 36, 'Mogilyov Oblast', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (443, 36, 'Regione di Minsk', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (444, 36, 'Regione di Vicebsk', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (445, 37, 'distretto di Belize', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (446, 37, 'distretto di Cayo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (447, 37, 'distretto di Corozal', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (448, 37, 'distretto di Orange Walk', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (449, 37, 'distretto di Stann Creek', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (450, 37, 'distretto di Toledo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (451, 38, 'Alberta', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (452, 38, 'Columbia Britannica', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (453, 38, 'Isola del Principe Edoardo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (454, 38, 'Manitoba', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (455, 38, 'Newfoundland and Labrador', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (456, 38, 'Northwest Territories', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (457, 38, 'Nunavut', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (458, 38, 'Nuova Scozia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (459, 38, 'Nuovo Brunswick', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (460, 38, 'Ontario', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (461, 38, 'Saskatchewan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (462, 38, 'Yukon', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (463, 40, 'East Kasai', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (464, 40, 'Haut-Lomani', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (465, 40, 'Haut-Uélé', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (466, 40, 'Kasai Province', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (467, 40, 'Kinshasa City', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (468, 40, 'Kwango', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (469, 40, 'Lomami', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (470, 40, 'Lualaba', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (471, 40, 'Mongala', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (472, 40, 'Province du Haut-Katanga', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (473, 40, 'Province du Kongo Central', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (474, 40, 'Province du Nord-Ubangi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (475, 40, 'Province du Sud-Ubangi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (476, 40, 'Provincia del Kasai Centrale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (477, 40, 'Provincia di Kwilu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (478, 40, 'Provincia di Mai-Ndombe', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (479, 40, 'Provincia di Sankuru', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (480, 40, 'Provincia di Tshopo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (481, 40, 'Provincia di Tshuapa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (482, 40, 'provincia del Basso Uele', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (483, 40, 'provincia del Kivu Nord', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (484, 40, 'provincia del Kivu Sud', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (485, 40, 'provincia dell''Equatore', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (486, 40, 'provincia dell''Ituri', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (487, 40, 'provincia di Maniema', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (488, 40, 'provincia di Tanganyika', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (489, 41, 'Commune de Bangui', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (490, 41, 'Lim-Pendé', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (491, 41, 'Mambéré', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (492, 41, 'Ouham-Fafa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (493, 41, 'Prefettura di Mbomou', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (494, 41, 'Préfecture de la Nana-Grébizi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (495, 41, 'prefettura di Bamingui-Bangoran', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (496, 41, 'prefettura di Basse-Kotto', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (497, 41, 'prefettura di Haut-Mbomou', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (498, 41, 'prefettura di Haute-Kotto', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (499, 41, 'prefettura di Kémo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (500, 41, 'prefettura di Lobaye', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (501, 41, 'prefettura di Mambéré-Kadéï', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (502, 41, 'prefettura di Nana-Mambéré', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (503, 41, 'prefettura di Ombella-M''Poko', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (504, 41, 'prefettura di Ouaka', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (505, 41, 'prefettura di Ouham', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (506, 41, 'prefettura di Ouham-Pendé', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (507, 41, 'prefettura di Sangha-Mbaéré', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (508, 41, 'prefettura di Vakaga', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (521, 43, 'Appenzello Esterno', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (522, 43, 'Appenzello Interno', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (523, 43, 'Argovia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (524, 43, 'Basilea Campagna', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (525, 43, 'Basilea Città', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (526, 43, 'Berna', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (527, 43, 'Canton Turgovia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (528, 43, 'Cantone dei Grigioni', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (529, 43, 'Friburgo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (530, 43, 'Ginevra', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (531, 43, 'Giura', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (532, 43, 'Glarona', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (533, 43, 'Lucerna', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (534, 43, 'Neuchâtel', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (535, 43, 'Nidvaldo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (536, 43, 'Obvaldo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (537, 43, 'San Gallo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (538, 43, 'Sciaffusa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (539, 43, 'Soletta', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (540, 43, 'Svitto', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (541, 43, 'Ticino', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (542, 43, 'Uri', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (543, 43, 'Vallese', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (544, 43, 'Vaud', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (545, 43, 'Zugo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (546, 43, 'Zurigo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (547, 44, 'Abidjan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (548, 44, 'Comoé', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (549, 44, 'Distretto di Bas-Sassandra', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (550, 44, 'Distretto di Denguélé', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (551, 44, 'Distretto di Lacs', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (552, 44, 'Distretto di Lagunes', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (553, 44, 'Distretto di Savanes', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (554, 44, 'Distretto di Vallée du Bandama', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (555, 44, 'Distretto di Zanzan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (556, 44, 'Gôh-Djiboua', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (557, 44, 'Montagnes', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (558, 44, 'Sassandra-Marahoué', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (559, 44, 'Woroba', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (560, 44, 'Yamoussoukro Autonomous District', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (572, 46, 'Regione di Ñuble', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (573, 46, 'Región Aysén', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (574, 46, 'Región de Antofagasta', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (575, 46, 'Región de Atacama', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (576, 46, 'Región de Magallanes y Antártica Chilena', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (577, 46, 'Región de Valparaíso', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (578, 46, 'Región de la Araucanía', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (579, 46, 'Región del Biobío', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (580, 46, 'Región del Maule', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (581, 46, 'regione Metropolitana di Santiago', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (582, 46, 'regione del Libertador General Bernardo O''Higgins', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (583, 46, 'regione di Arica e Parinacota', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (584, 46, 'regione di Coquimbo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (585, 46, 'regione di Los Lagos', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (586, 46, 'regione di Los Ríos', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (587, 46, 'regione di Tarapacá', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (588, 47, 'North-West Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (589, 47, 'South-West Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (590, 47, 'regione Centrale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (591, 47, 'regione del Litorale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (592, 47, 'regione del Nord', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (593, 47, 'regione del Sud', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (594, 47, 'regione dell''Est', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (595, 47, 'regione dell''Estremo Nord', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (596, 47, 'regione dell''Ovest', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (597, 47, 'regione di Adamaoua', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (598, 48, 'Anhui', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (599, 48, 'Beijing Shi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (600, 48, 'Chongqing Shi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (601, 48, 'Fujian', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (602, 48, 'Gansu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (603, 48, 'Guangdong', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (604, 48, 'Guangxi Zhuang Autonomous Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (605, 48, 'Guizhou', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (606, 48, 'Hainan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (607, 48, 'Hebei Sheng', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (608, 48, 'Henan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (609, 48, 'Hubei', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (610, 48, 'Hunan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (611, 48, 'Hēilóngjiāng', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (612, 48, 'Jiangsu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (613, 48, 'Jiangxi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (614, 48, 'Jilin', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (615, 48, 'Liaoning', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (616, 48, 'Mongolia Interna', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (617, 48, 'Ningxia Hui Autonomous Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (618, 48, 'Qinghai', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (619, 48, 'Shaanxi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (620, 48, 'Shandong', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (621, 48, 'Shanghai Shi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (622, 48, 'Shanxi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (623, 48, 'Sichuan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (624, 48, 'Tianjin Shi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (625, 48, 'Tibet Autonomous Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (626, 48, 'Xinjiang Uyghur Autonomous Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (627, 48, 'Yunnan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (628, 48, 'Zhejiang', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (629, 49, 'Departamento de Bolívar', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (630, 49, 'Departamento de Boyacá', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (631, 49, 'Departamento de Córdoba', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (632, 49, 'Departamento de Nariño', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (633, 49, 'Departamento del Atlántico', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (634, 49, 'Departamento del Caquetá', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (635, 49, 'Departamento del Chocó', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (636, 49, 'Departamento del Vaupés', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (637, 49, 'Distrito Capital de Bogotá', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (638, 49, 'Providencia y Santa Catalina, Departamento de Archipiélago de San Andrés', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (639, 49, 'dipartimento di Amazonas', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (640, 49, 'dipartimento di Antioquia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (641, 49, 'dipartimento di Arauca', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (642, 49, 'dipartimento di Caldas', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (643, 49, 'dipartimento di Casanare', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (644, 49, 'dipartimento di Cauca', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (645, 49, 'dipartimento di Cesar', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (646, 49, 'dipartimento di Cundinamarca', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (647, 49, 'dipartimento di Guainía', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (648, 49, 'dipartimento di Guaviare', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (649, 49, 'dipartimento di Huila', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (650, 49, 'dipartimento di La Guajira', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (651, 49, 'dipartimento di Magdalena', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (652, 49, 'dipartimento di Meta', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (653, 49, 'dipartimento di Norte de Santander', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (654, 49, 'dipartimento di Putumayo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (655, 49, 'dipartimento di Quindío', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (656, 49, 'dipartimento di Risaralda', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (657, 49, 'dipartimento di Santander', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (658, 49, 'dipartimento di Sucre', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (659, 49, 'dipartimento di Tolima', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (660, 49, 'dipartimento di Valle del Cauca', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (661, 49, 'dipartimento di Vichada', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (662, 50, 'Provincia de San José', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (663, 50, 'Provincia di Limón', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (664, 50, 'provincia di Alajuela', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (665, 50, 'provincia di Cartago', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (666, 50, 'provincia di Guanacaste', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (667, 50, 'provincia di Heredia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (668, 50, 'provincia di Puntarenas', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (669, 51, 'La Habana', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (670, 51, 'Municipio Especial Isla de la Juventud', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (671, 51, 'Provincia de Camagüey', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (672, 51, 'Provincia de Pinar del Río', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (673, 51, 'provincia di Artemisa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (674, 51, 'provincia di Ciego de Ávila', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (675, 51, 'provincia di Cienfuegos', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (676, 51, 'provincia di Granma', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (677, 51, 'provincia di Guantánamo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (678, 51, 'provincia di Holguín', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (679, 51, 'provincia di Las Tunas', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (680, 51, 'provincia di Matanzas', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (681, 51, 'provincia di Mayabeque', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (682, 51, 'provincia di Sancti Spíritus', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (683, 51, 'provincia di Santiago di Cuba', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (684, 51, 'provincia di Villa Clara', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (685, 52, 'Concelho da Boa Vista', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (686, 52, 'Concelho da Brava', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (687, 52, 'Concelho da Praia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (688, 52, 'Concelho da Ribeira Brava', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (689, 52, 'Concelho da Ribeira Grande', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (690, 52, 'Concelho de Ribeira Grande de Santiago', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (691, 52, 'Concelho de Santa Catarina', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (692, 52, 'Concelho de Santa Catarina do Fogo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (693, 52, 'Concelho de Santa Cruz', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (694, 52, 'Concelho de São Domingos', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (695, 52, 'Concelho de São Miguel', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (696, 52, 'Concelho de São Salvador do Mundo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (697, 52, 'Concelho de São Vicente', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (698, 52, 'Concelho do Maio', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (699, 52, 'Concelho do Paul', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (700, 52, 'Concelho do Porto Novo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (701, 52, 'Concelho do São Filipe', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (702, 52, 'Concelho do Tarrafal', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (703, 52, 'Concelho do Tarrafal de São Nicolau', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (704, 52, 'Concelho dos Mosteiros', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (705, 52, 'Sal Municipality', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (706, 52, 'São Lourenço dos Órgãos', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (707, 55, 'distretto di Famagosta', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (708, 55, 'distretto di Kyrenia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (709, 55, 'distretto di Larnaca', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (710, 55, 'distretto di Limassol', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (711, 55, 'distretto di Nicosia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (712, 55, 'distretto di Pafo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (713, 56, 'Boemia centrale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (714, 56, 'Boemia meridionale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (715, 56, 'Karlovarský kraj', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (716, 56, 'Kraj Vysočina', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (717, 56, 'Královéhradecký kraj', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (718, 56, 'Liberecký kraj', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (719, 56, 'Moravia meridionale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (720, 56, 'Moravskoslezský kraj', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (721, 56, 'Olomoucký kraj', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (722, 56, 'Pardubický kraj', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (723, 56, 'Plzeňský kraj', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (724, 56, 'Praga', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (725, 56, 'Zlínský kraj', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (726, 56, 'Ústecký kraj', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (727, 57, 'Assia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (728, 57, 'Baden-Württemberg', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (729, 57, 'Bassa Sassonia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (730, 57, 'Baviera', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (731, 57, 'Brandeburgo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (732, 57, 'Città stato Berlino', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (733, 57, 'Città stato di Amburgo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (734, 57, 'Città stato di Brema', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (735, 57, 'Meclemburgo-Pomerania Anteriore', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (736, 57, 'Renania Settentrionale-Vestfalia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (737, 57, 'Renania-Palatinato', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (738, 57, 'Saarland', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (739, 57, 'Sassonia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (740, 57, 'Sassonia-Anhalt', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (741, 57, 'Schleswig-Holstein', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (742, 57, 'Turingia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (743, 58, 'Djibouti Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (744, 58, 'regione di Ali Sabieh', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (745, 58, 'regione di Arta', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (746, 58, 'regione di Dikhil', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (747, 58, 'regione di Obock', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (748, 58, 'regione di Tagiura', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (749, 59, 'Danimarca meridionale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (750, 59, 'Jutland centrale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (751, 59, 'Jutland settentrionale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (752, 59, 'Region Hovedstaden', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (753, 59, 'Selandia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (754, 60, 'Parrocchia di Saint Andrew', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (755, 60, 'Parrocchia di Saint David', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (756, 60, 'Parrocchia di Saint George', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (757, 60, 'Parrocchia di Saint John', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (758, 60, 'Parrocchia di Saint Joseph', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (759, 60, 'Parrocchia di Saint Luke', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (760, 60, 'Parrocchia di Saint Mark', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (761, 60, 'Parrocchia di Saint Patrick', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (762, 60, 'Parrocchia di Saint Paul', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (763, 60, 'Parrocchia di Saint Peter', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (764, 61, 'Dajabón', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (765, 61, 'Distrito Nacional', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (766, 61, 'El Seibo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (767, 61, 'Elías Piña', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (768, 61, 'La Vega', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (769, 61, 'Monseñor Nouel', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (770, 61, 'Peravia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (771, 61, 'Provincia María Trinidad Sánchez', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (772, 61, 'Provincia Sánchez Ramírez', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (773, 61, 'Provincia de Hermanas Mirabal', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (774, 61, 'Provincia de San José de Ocoa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (775, 61, 'San Cristóbal', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (776, 61, 'Santiago Rodríguez', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (777, 61, 'provincia di Azua', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (778, 61, 'provincia di Baoruco', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (779, 61, 'provincia di Barahona', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (780, 61, 'provincia di Duarte', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (781, 61, 'provincia di Espaillat', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (782, 61, 'provincia di Hato Mayor', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (783, 61, 'provincia di Independencia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (784, 61, 'provincia di La Altagracia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (785, 61, 'provincia di La Romana', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (786, 61, 'provincia di Monte Plata', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (787, 61, 'provincia di Montecristi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (788, 61, 'provincia di Pedernales', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (789, 61, 'provincia di Puerto Plata', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (790, 61, 'provincia di Samaná', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (791, 61, 'provincia di San Juan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (792, 61, 'provincia di San Pedro de Macorís', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (793, 61, 'provincia di Santiago', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (794, 61, 'provincia di Santo Domingo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (795, 61, 'provincia di Valverde', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (796, 62, 'Bordj Badji Mokhtar', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (797, 62, 'Djanet', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (798, 62, 'El Menia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (799, 62, 'El Mghair', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (800, 62, 'In Guezzam', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (801, 62, 'In Salah', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (802, 62, 'Ouled Djellal', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (803, 62, 'Provincia di Béni Abbès', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (804, 62, 'Timimoun', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (805, 62, 'Touggourt', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (806, 62, 'Wilaya de Bejaïa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (807, 62, 'Wilaya de Boumerdes', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (808, 62, 'Wilaya de Ghardaïa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (809, 62, 'Wilaya de Médéa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (810, 62, 'Wilaya de Saïda', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (811, 62, 'Wilaya de Tipaza', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (812, 62, 'provincia di ''Ayn Defla', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (813, 62, 'provincia di Adrar', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (814, 62, 'provincia di Algeri', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (815, 62, 'provincia di Annaba', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (816, 62, 'provincia di Aïn Témouchent', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (817, 62, 'provincia di Batna', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (818, 62, 'provincia di Biskra', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (819, 62, 'provincia di Blida', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (820, 62, 'provincia di Bordj Bou Arreridj', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (821, 62, 'provincia di Bouira', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (822, 62, 'provincia di Béchar', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (823, 62, 'provincia di Chlef', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (824, 62, 'provincia di Costantina', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (825, 62, 'provincia di Djelfa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (826, 62, 'provincia di El Bayadh', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (827, 62, 'provincia di El Oued', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (828, 62, 'provincia di El Tarf', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (829, 62, 'provincia di Guelma', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (830, 62, 'provincia di Illizi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (831, 62, 'provincia di Jijel', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (832, 62, 'provincia di Khenchela', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (833, 62, 'provincia di Laghouat', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (834, 62, 'provincia di M''Sila', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (835, 62, 'provincia di Mascara', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (836, 62, 'provincia di Mila', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (837, 62, 'provincia di Mostaganem', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (838, 62, 'provincia di Naâma', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (839, 62, 'provincia di Orano', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (840, 62, 'provincia di Ouargla', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (841, 62, 'provincia di Oum el-Bouaghi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (842, 62, 'provincia di Relizane', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (843, 62, 'provincia di Sidi Bel Abbes', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (844, 62, 'provincia di Skikda', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (845, 62, 'provincia di Souk Ahras', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (846, 62, 'provincia di Sétif', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (847, 62, 'provincia di Tamanrasset', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (848, 62, 'provincia di Tiaret', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (849, 62, 'provincia di Tindouf', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (850, 62, 'provincia di Tissemsilt', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (851, 62, 'provincia di Tizi Ouzou', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (852, 62, 'provincia di Tlemcen', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (853, 62, 'provincia di Tébessa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (854, 63, 'Cañar', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (855, 63, 'Provincia de Bolívar', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (856, 63, 'Provincia de Cotopaxi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (857, 63, 'Provincia de Galápagos', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (858, 63, 'Provincia de Los Ríos', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (859, 63, 'Provincia de Manabí', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (860, 63, 'Provincia de Sucumbíos', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (861, 63, 'provincia del Carchi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (862, 63, 'provincia del Chimborazo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (863, 63, 'provincia del Guayas', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (864, 63, 'provincia del Napo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (865, 63, 'provincia del Pastaza', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (866, 63, 'provincia del Pichincha', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (867, 63, 'provincia del Tungurahua', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (868, 63, 'provincia dell''Imbabura', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (869, 63, 'provincia di Azuay', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (870, 63, 'provincia di El Oro', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (871, 63, 'provincia di Esmeraldas', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (872, 63, 'provincia di Loja', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (873, 63, 'provincia di Morona-Santiago', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (874, 63, 'provincia di Orellana', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1495, 114, 'prefettura di Iwate', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (875, 63, 'provincia di Santa Elena', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (876, 63, 'provincia di Santo Domingo de los Tsáchilas', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (877, 63, 'provincia di Zamora Chinchipe', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (878, 64, 'Harjumaa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (879, 64, 'Hiiumaa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (880, 64, 'Ida-Virumaa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (881, 64, 'Järvamaa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (882, 64, 'Jõgevamaa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (883, 64, 'Lääne-Virumaa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (884, 64, 'Läänemaa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (885, 64, 'Pärnumaa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (886, 64, 'Põlvamaa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (887, 64, 'Raplamaa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (888, 64, 'Saaremaa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (889, 64, 'Tartumaa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (890, 64, 'Valgamaa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (891, 64, 'Viljandimaa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (892, 64, 'Võrumaa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (893, 65, 'Governatorato del Cairo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (894, 65, 'Governatorato del Mar Rosso', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (895, 65, 'Governatorato del Sinai del Nord', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (896, 65, 'Governatorato del Sinai del Sud', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (897, 65, 'Governatorato di Alessandria', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (898, 65, 'Governatorato di Assuan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (899, 65, 'Governatorato di Asyut', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (900, 65, 'Governatorato di Buhayra', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (901, 65, 'Governatorato di Damietta', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (902, 65, 'Governatorato di Daqahliyya', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (903, 65, 'Governatorato di Faiyum', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (904, 65, 'Governatorato di Gharbiyya', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (905, 65, 'Governatorato di Giza', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (906, 65, 'Governatorato di Ismailia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (907, 65, 'Governatorato di Kafr el-Sheikh', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (908, 65, 'Governatorato di Luxor', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (909, 65, 'Governatorato di Matruh', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (910, 65, 'Governatorato di Minya', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (911, 65, 'Governatorato di Porto Said', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (912, 65, 'Governatorato di Qena', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (913, 65, 'Governatorato di Sohag', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (914, 65, 'Governatorato di Suez', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (915, 65, 'Governatorato di Wadi al-Jadid', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (916, 65, 'Governatorato di al-Manufiyya', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (917, 65, 'Governatorato di al-Qalyūbiyya', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (918, 65, 'Muḩāfaz̧at Banī Suwayf', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (919, 65, 'Muḩāfaz̧at ash Sharqīyah', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (920, 67, 'Regione del Mar Rosso Meridionale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (921, 67, 'Regione del Mar Rosso Settentrionale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (922, 67, 'regione Centrale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (923, 67, 'regione del Sud', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (924, 67, 'regione dell''Anseba', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (925, 67, 'regione di Gasc-Barca', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (926, 68, 'Andalusia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (927, 68, 'Aragona', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (928, 68, 'Asturie', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (929, 68, 'Cantabria', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (930, 68, 'Castiglia e León', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (931, 68, 'Castiglia-La Mancia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (932, 68, 'Catalogna', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (933, 68, 'Ceuta', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (934, 68, 'Estremadura', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (935, 68, 'Galizia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (936, 68, 'Isole Baleari', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (937, 68, 'Isole Canarie', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (938, 68, 'La Rioja', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (939, 68, 'Madrid', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (940, 68, 'Melilla', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (941, 68, 'Murcia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (942, 68, 'Navarra', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (943, 68, 'Paesi Baschi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (944, 68, 'Valenza', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (945, 69, 'Addis Ababa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (946, 69, 'Central Ethiopia Regional State', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (947, 69, 'Dire Daua', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (948, 69, 'Oromia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (949, 69, 'Sidama Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (950, 69, 'South Ethiopia Regional State', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (951, 69, 'South West Ethiopia Peoples'' Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (952, 69, 'regione Benisciangul-Gumus', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (953, 69, 'regione degli Afar', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (954, 69, 'regione degli Amara', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (955, 69, 'regione dei Somali', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (956, 69, 'regione dei Tigrè', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (957, 69, 'regione di Gambella', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (958, 69, 'regione di Harar', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (959, 70, 'Carelia settentrionale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (960, 70, 'Finlandia Centrale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (961, 70, 'Kainuu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (962, 70, 'Kanta-Häme', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (963, 70, 'Kymenlaakso', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (964, 70, 'Ostrobotnia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (965, 70, 'Ostrobotnia centrale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (966, 70, 'Ostrobotnia meridionale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (967, 70, 'Ostrobotnia settentrionale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (968, 70, 'Paijat-Hame Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (969, 70, 'Pirkanmaa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (970, 70, 'Regione della Lapponia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (971, 70, 'Satakunta', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (972, 70, 'Savo meridionale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (973, 70, 'Savo settentrionale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (974, 70, 'South Karelia Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (975, 70, 'Uusimaa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (976, 70, 'Varsinais-Suomi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (977, 71, 'Rotuma', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (978, 71, 'divisione Centrale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (979, 71, 'divisione Nord', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (980, 71, 'divisione Occidentale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (981, 71, 'divisione Orientale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (982, 73, 'Chuuk', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (983, 73, 'Pohnpei', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (984, 73, 'State of Kosrae', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (985, 73, 'Yap', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (992, 75, 'Alsazia-Champagne-Ardenne-Lorena', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (993, 75, 'Alvernia-Rodano-Alpi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (994, 75, 'Aquitania-Limosino-Poitou-Charentes', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (995, 75, 'Borgogna-Franca Contea', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (996, 75, 'Bretagna', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (997, 75, 'Centro-Valle della Loira', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (998, 75, 'Corsica', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (999, 75, 'Nord-Passo di Calais-Piccardia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1000, 75, 'Normandia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1001, 75, 'Occitanie', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1002, 75, 'Paesi della Loira', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1003, 75, 'Provenza-Alpi-Costa Azzurra', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1004, 75, 'Île-de-France', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1005, 76, 'Estuaire', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1006, 76, 'Haut-Ogooué', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1007, 76, 'Moyen-Ogooué', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1008, 76, 'Ogooué-Ivindo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1009, 76, 'Province de la Ngounié', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1010, 76, 'Province de l’Ogooué-Lolo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1011, 76, 'Woleu-Ntem', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1012, 76, 'provincia di Nyanga', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1013, 76, 'provincia di Ogooué-Maritime', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1014, 77, 'Galles', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1015, 77, 'Inghilterra', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1016, 77, 'Irlanda del Nord', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1017, 77, 'Scozia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1018, 78, 'Carriacou and Petite Martinique', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1019, 78, 'Parrocchia di Saint Andrew', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1020, 78, 'Parrocchia di Saint David', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1021, 78, 'Parrocchia di Saint George', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1022, 78, 'Parrocchia di Saint John', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1023, 78, 'Parrocchia di Saint Mark', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1024, 78, 'Parrocchia di Saint Patrick', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1025, 79, 'Abcasia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1026, 79, 'Agiaria', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1027, 79, 'Cachezia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1028, 79, 'Guria', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1029, 79, 'Imerezia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1030, 79, 'Kvemo Kartli', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1031, 79, 'Mingrelia-Alta Svanezia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1032, 79, 'Mtskheta-Mtianeti', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1033, 79, 'Racha-Lechkhumi e Kvemo Svaneti', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1034, 79, 'Samtskhe-Javakheti', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1035, 79, 'Shida Kartli', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1036, 79, 'Tbilisi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1049, 82, 'Ahafo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1050, 82, 'Ashanti Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1051, 82, 'Bono', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1052, 82, 'Bono East', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1053, 82, 'Central Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1054, 82, 'Eastern Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1055, 82, 'Greater Accra Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1056, 82, 'North East', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1057, 82, 'Northern Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1058, 82, 'Oti', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1059, 82, 'Savannah', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1060, 82, 'Upper East Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1061, 82, 'Upper West Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1062, 82, 'Volta Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1063, 82, 'Western North', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1064, 82, 'Western Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1070, 85, 'Banjul', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1071, 85, 'West Coast', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1072, 85, 'divisione del Central River', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1073, 85, 'divisione del Lower River', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1074, 85, 'divisione del North Bank', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1075, 85, 'divisione dell''Upper River', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1076, 86, 'Conakry Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1077, 86, 'regione di Boké', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1078, 86, 'regione di Faranah', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1079, 86, 'regione di Kankan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1080, 86, 'regione di Kindia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1081, 86, 'regione di Labé', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1082, 86, 'regione di Mamou', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1083, 86, 'regione di Nzérékoré', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1085, 88, 'Djibloho', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1086, 88, 'Provincia de Annobón', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1087, 88, 'Provincia de Bioko Norte', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1088, 88, 'Provincia de Bioko Sur', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1089, 88, 'Provincia de Centro Sur', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1090, 88, 'Provincia de Kié-Ntem', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1091, 88, 'Provincia de Litoral', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1092, 88, 'Provincia de Wele-Nzas', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1093, 89, 'Attica', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1094, 89, 'Creta', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1095, 89, 'Egeo Meridionale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1096, 89, 'Egeo Settentrionale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1097, 89, 'Epiro', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1098, 89, 'Grecia Centrale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1099, 89, 'Grecia Occidentale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1100, 89, 'Isole Ionie', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1101, 89, 'Macedonia Centrale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1102, 89, 'Macedonia Occidentale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1103, 89, 'Macedonia Orientale e Tracia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1104, 89, 'Monte Athos', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1105, 89, 'Peloponneso', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1106, 89, 'Tessaglia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1107, 91, 'Departamento de Escuintla', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1108, 91, 'Departamento de Huehuetenango', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1109, 91, 'Departamento de Jalapa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1110, 91, 'Departamento de Jutiapa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1111, 91, 'Departamento de Retalhuleu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1112, 91, 'Departamento de Suchitepéquez', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1113, 91, 'Departamento de Totonicapán', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1114, 91, 'dipartimento di Alta Verapaz', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1115, 91, 'dipartimento di Baja Verapaz', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1116, 91, 'dipartimento di Chimaltenango', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1117, 91, 'dipartimento di Chiquimula', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1118, 91, 'dipartimento di El Progreso', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1119, 91, 'dipartimento di Guatemala', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1120, 91, 'dipartimento di Izabal', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1121, 91, 'dipartimento di Petén', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1122, 91, 'dipartimento di Quetzaltenango', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1123, 91, 'dipartimento di Quiché', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1124, 91, 'dipartimento di Sacatepéquez', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1125, 91, 'dipartimento di San Marcos', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1126, 91, 'dipartimento di Santa Rosa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1127, 91, 'dipartimento di Sololá', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1128, 91, 'dipartimento di Zacapa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1148, 93, 'Bafatá', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1149, 93, 'Bissau Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1150, 93, 'Cacheu Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1151, 93, 'Gabú', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1152, 93, 'Oio Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1153, 93, 'Regione di Biombo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1154, 93, 'Regione di Bolama', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1155, 93, 'Regione di Quinara', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1156, 93, 'Regione di Tombali', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1157, 94, 'Alto Demerara-Berbice', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1158, 94, 'Alto Takutu-Alto Essequibo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1159, 94, 'Barima-Waini', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1160, 94, 'Cuyuni-Mazaruni', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1161, 94, 'Demerara-Mahaica', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1162, 94, 'East Berbice-Corentyne Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1163, 94, 'Isole Essequibo-Demerara Occidentale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1164, 94, 'Mahaica-Berbice', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1165, 94, 'Pomeroon-Supenaam', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1166, 94, 'Potaro-Siparuni', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1185, 97, 'Departamento de Islas de la Bahía', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1186, 97, 'Departamento de Santa Bárbara', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1187, 97, 'dipartimento di Atlántida', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1188, 97, 'dipartimento di Choluteca', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1189, 97, 'dipartimento di Colón', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1190, 97, 'dipartimento di Comayagua', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1191, 97, 'dipartimento di Copán', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1192, 97, 'dipartimento di Cortés', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1193, 97, 'dipartimento di El Paraíso', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1194, 97, 'dipartimento di Francisco Morazán', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1195, 97, 'dipartimento di Gracias a Dios', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1196, 97, 'dipartimento di Intibucá', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1197, 97, 'dipartimento di La Paz', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1198, 97, 'dipartimento di Lempira', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1199, 97, 'dipartimento di Ocotepeque', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1200, 97, 'dipartimento di Olancho', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1201, 97, 'dipartimento di Valle', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1202, 97, 'dipartimento di Yoro', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1203, 98, 'Bjelovar e Bilogora', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1204, 98, 'Brod e Posavina', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1205, 98, 'Istria', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1206, 98, 'Karlovac', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1207, 98, 'Koprivnica e Krizevci', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1208, 98, 'Krapina e Zagorje', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1209, 98, 'Lika e Segna', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1210, 98, 'Litoraneo-montana', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1211, 98, 'Međimurje', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1212, 98, 'Osijek e Baranja', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1213, 98, 'Pozega e Slavonia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1214, 98, 'Raguseo-narentana', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1215, 98, 'Sebenico e Tenin', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1216, 98, 'Sisak e Moslavina', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1217, 98, 'Spalatino-dalmata', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1218, 98, 'Varazdin', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1219, 98, 'Virovitica e Podravina', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1220, 98, 'Vukovar e Sirmia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1221, 98, 'Zagabria', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1222, 98, 'Zagabria', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1223, 98, 'Zaratina', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1224, 99, 'dipartimento del Centro', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1225, 99, 'dipartimento del Nord', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1226, 99, 'dipartimento del Nordest', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1227, 99, 'dipartimento del Nordovest', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1228, 99, 'dipartimento del Sud', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1229, 99, 'dipartimento del Sudest', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1230, 99, 'dipartimento dell''Artibonite', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1231, 99, 'dipartimento dell''Ovest', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1232, 99, 'dipartimento di Grand''Anse', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1233, 99, 'dipartimento di Nippes', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1234, 100, 'Budapest', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1235, 100, 'Csongrád megye', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1236, 100, 'Komárom-Esztergom', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1237, 100, 'Nógrád megye', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1238, 100, 'Provincia di Baranya', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1239, 100, 'Provincia di Borsod-Abaúj-Zemplén', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1240, 100, 'Provincia di Bács-Kiskun', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1241, 100, 'Provincia di Békés', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1242, 100, 'Provincia di Fejér', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1243, 100, 'Provincia di Győr-Moson-Sopron', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1244, 100, 'Provincia di Szabolcs-Szatmár-Bereg', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1245, 100, 'Veszprém megye', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1246, 100, 'contea di Hajdú-Bihar', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1247, 100, 'contea di Pest', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1248, 100, 'provincia di Heves', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1249, 100, 'provincia di Jász-Nagykun-Szolnok', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1250, 100, 'provincia di Somogy', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1251, 100, 'provincia di Tolna', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1252, 100, 'provincia di Vas', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1253, 100, 'provincia di Zala', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1254, 101, 'Banten', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1255, 101, 'Central Papua', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1256, 101, 'Daerah Istimewa Yogyakarta', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1257, 101, 'Daerah Khusus Ibukota Jakarta', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1258, 101, 'East Nusa Tenggara', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1259, 101, 'Giava Occidentale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1260, 101, 'Giava Orientale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1261, 101, 'Highland Papua', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1262, 101, 'Kepulauan Bangka Belitung', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1263, 101, 'Nanggroe Aceh Darussalam Province', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1264, 101, 'North Kalimantan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1265, 101, 'North Maluku', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1266, 101, 'Propinsi Bengkulu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1267, 101, 'Provinsi Bali', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1268, 101, 'Provinsi Gorontalo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1269, 101, 'Provinsi Jambi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1270, 101, 'Provinsi Jawa Tengah', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1271, 101, 'Provinsi Kalimantan Barat', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1272, 101, 'Provinsi Kalimantan Selatan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1273, 101, 'Provinsi Kalimantan Tengah', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1274, 101, 'Provinsi Kalimantan Timur', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1275, 101, 'Provinsi Kepulauan Riau', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1276, 101, 'Provinsi Lampung', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1277, 101, 'Provinsi Maluku', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1278, 101, 'Provinsi Papua', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1279, 101, 'Provinsi Papua Barat', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1280, 101, 'Provinsi Riau', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1281, 101, 'Provinsi Sulawesi Barat', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1282, 101, 'Provinsi Sumatera Barat', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1283, 101, 'Southwest Papua', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1284, 101, 'Sulawesi Centrale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1285, 101, 'Sulawesi Meridionale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1286, 101, 'Sulawesi Settentrionale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1287, 101, 'Sulawesi Tenggara', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1288, 101, 'Sumatra Meridionale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1289, 101, 'Sumatra Settentrionale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1290, 101, 'West Nusa Tenggara', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1291, 102, 'Connacht', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1292, 102, 'Leinster', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1293, 102, 'Munster', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1294, 102, 'Ulster', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1295, 103, 'Judea and Samaria Area', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1296, 103, 'distretto Centrale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1297, 103, 'distretto Nord', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1298, 103, 'distretto Sud', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1299, 103, 'distretto di Gerusalemme', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1300, 103, 'distretto di Haifa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1301, 103, 'distretto di Tel Aviv', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1326, 105, 'Andamane e Nicobare', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1327, 105, 'Assam', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1328, 105, 'Bengala occidentale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1329, 105, 'Dadra and Nagar Haveli and Daman and Diu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1330, 105, 'Goa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1331, 105, 'Ladakh', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1332, 105, 'Madhya Pradesh', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1333, 105, 'Manipur', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1334, 105, 'Meghālaya', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1335, 105, 'Mizoram', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1336, 105, 'National Capital Territory of Delhi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1337, 105, 'Sikkim', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1338, 105, 'State of Andhra Pradesh', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1339, 105, 'State of Arunāchal Pradesh', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1340, 105, 'State of Bihar', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1341, 105, 'State of Chhattīsgarh', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1342, 105, 'State of Gujarāt', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1343, 105, 'State of Haryāna', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1344, 105, 'State of Himāchal Pradesh', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1345, 105, 'State of Jammu and Kashmīr', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1346, 105, 'State of Jhārkhand', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1347, 105, 'State of Karnataka', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1348, 105, 'State of Kerala', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1349, 105, 'State of Mahārāshtra', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1350, 105, 'State of Nāgāland', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1351, 105, 'State of Odisha', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1352, 105, 'State of Punjab', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1353, 105, 'State of Rājasthān', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1354, 105, 'State of Tamil Nādu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1355, 105, 'State of Telangāna', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1356, 105, 'State of Uttarākhand', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1357, 105, 'Tripura', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1358, 105, 'Union Territory of Chandigarh', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1359, 105, 'Union Territory of Lakshadweep', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1360, 105, 'Union Territory of Puducherry', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1361, 105, 'Uttar Pradesh', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1362, 107, 'An Najaf', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1363, 107, 'Erbil', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1364, 107, 'Halabja Governorate', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1365, 107, 'Kirkuk', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1366, 107, 'Muhafazat Wasit', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1367, 107, 'Muḩāfaz̧at Bābil', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1368, 107, 'Muḩāfaz̧at Karbalā’', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1369, 107, 'Muḩāfaz̧at Nīnawá', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1370, 107, 'Muḩāfaz̧at al Başrah', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1371, 107, 'Muḩāfaz̧at al Qādisīyah', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1372, 107, 'Muḩāfaz̧at as Sulaymānīyah', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1373, 107, 'governatorato di Baghdad', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1374, 107, 'governatorato di Dahuk', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1375, 107, 'governatorato di Dhi Qar', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1376, 107, 'governatorato di Diyala', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1377, 107, 'governatorato di Maysan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1378, 107, 'governatorato di Salah al-Din', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1379, 107, 'governatorato di al-Anbar', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1380, 107, 'governatorato di al-Muthanna', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1381, 108, 'Azerbaigian occidentale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1382, 108, 'Azerbaigian orientale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1383, 108, 'Bushehr', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1384, 108, 'Golestan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1385, 108, 'Hormozgan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1386, 108, 'Khorasan meridionale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1387, 108, 'Khorasan settentrionale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1388, 108, 'Khuzestan Province', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1389, 108, 'Kurdistan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1390, 108, 'Lorestan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1391, 108, 'Mazandaran', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1392, 108, 'Razavi Khorasan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1393, 108, 'Sistan e Baluchistan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1394, 108, 'provincia di Alborz', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1395, 108, 'provincia di Ardabil', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1396, 108, 'provincia di Chahar Mahal e Bakhtiari', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1397, 108, 'provincia di Esfahan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1398, 108, 'provincia di Fars', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1399, 108, 'provincia di Gilan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1400, 108, 'provincia di Hamadan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1401, 108, 'provincia di Ilam', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1402, 108, 'provincia di Kerman', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1403, 108, 'provincia di Kermanshah', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1404, 108, 'provincia di Kohgiluyeh e Buyer Ahmad', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1405, 108, 'provincia di Markazi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1406, 108, 'provincia di Qazvin', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1407, 108, 'provincia di Qom', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1408, 108, 'provincia di Semnan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1409, 108, 'provincia di Teheran', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1410, 108, 'provincia di Yazd', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1411, 108, 'provincia di Zanjan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1412, 109, 'Est', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1413, 109, 'Fiordi occidentali', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1414, 109, 'Nordest', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1415, 109, 'Nordovest', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1416, 109, 'Ovest', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1417, 109, 'Penisola meridionale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1418, 109, 'Regione della capitale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1419, 109, 'Suðurland', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1420, 110, 'Abruzzo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1421, 110, 'Basilicata', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1422, 110, 'Calabria', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1423, 110, 'Campania', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1424, 110, 'Emilia-Romagna', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1425, 110, 'Friuli Venezia Giulia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1426, 110, 'Lazio', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1427, 110, 'Liguria', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1428, 110, 'Lombardia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1429, 110, 'Marche', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1430, 110, 'Molise', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1431, 110, 'Piemonte', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1432, 110, 'Puglia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1433, 110, 'Sardegna', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1434, 110, 'Sicilia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1435, 110, 'Toscana', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1436, 110, 'Trentino-Alto Adige', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1437, 110, 'Umbria', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1438, 110, 'Valle d’Aosta', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1439, 110, 'Veneto', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1452, 112, 'parrocchia di Clarendon', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1453, 112, 'parrocchia di Hanover', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1454, 112, 'parrocchia di Kingston', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1455, 112, 'parrocchia di Manchester', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1456, 112, 'parrocchia di Portland', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1457, 112, 'parrocchia di Saint Andrew', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1458, 112, 'parrocchia di Saint Ann', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1459, 112, 'parrocchia di Saint Catherine', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1460, 112, 'parrocchia di Saint Elizabeth', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1461, 112, 'parrocchia di Saint James', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1462, 112, 'parrocchia di Saint Mary', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1463, 112, 'parrocchia di Saint Thomas', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1464, 112, 'parrocchia di Trelawny', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1465, 112, 'parrocchia di Westmoreland', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1466, 113, 'Al Karak', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1467, 113, 'Muḩāfaz̧at al ‘Aqabah', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1468, 113, 'Muḩāfaz̧at az Zarqā’', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1469, 113, 'governatorato di Ajlun', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1470, 113, 'governatorato di Amman', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1471, 113, 'governatorato di Balqa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1472, 113, 'governatorato di Irbid', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1473, 113, 'governatorato di Jerash', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1474, 113, 'governatorato di Ma''an', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1475, 113, 'governatorato di Madaba', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1476, 113, 'governatorato di Mafraq', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1477, 113, 'governatorato di al-Tafila', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1478, 114, 'Hokkaido', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1479, 114, 'Prefettura di Gifu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1480, 114, 'Prefettura di Wakayama', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1481, 114, 'Tokyo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1482, 114, 'prefettura di Aichi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1483, 114, 'prefettura di Akita', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1484, 114, 'prefettura di Aomori', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1485, 114, 'prefettura di Chiba', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1486, 114, 'prefettura di Ehime', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1487, 114, 'prefettura di Fukui', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1488, 114, 'prefettura di Fukuoka', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1489, 114, 'prefettura di Fukushima', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1490, 114, 'prefettura di Gunma', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1491, 114, 'prefettura di Hiroshima', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1492, 114, 'prefettura di Hyōgo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1493, 114, 'prefettura di Ibaraki', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1494, 114, 'prefettura di Ishikawa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1496, 114, 'prefettura di Kagawa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1497, 114, 'prefettura di Kagoshima', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1498, 114, 'prefettura di Kanagawa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1499, 114, 'prefettura di Kumamoto', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1500, 114, 'prefettura di Kyoto', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1501, 114, 'prefettura di Kōchi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1502, 114, 'prefettura di Mie', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1503, 114, 'prefettura di Miyagi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1504, 114, 'prefettura di Miyazaki', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1505, 114, 'prefettura di Nagano', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1506, 114, 'prefettura di Nagasaki', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1507, 114, 'prefettura di Nara', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1508, 114, 'prefettura di Niigata', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1509, 114, 'prefettura di Okayama', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1510, 114, 'prefettura di Okinawa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1511, 114, 'prefettura di Osaka', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1512, 114, 'prefettura di Saga', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1513, 114, 'prefettura di Saitama', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1514, 114, 'prefettura di Shiga', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1515, 114, 'prefettura di Shimane', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1516, 114, 'prefettura di Shizuoka', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1517, 114, 'prefettura di Tochigi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1518, 114, 'prefettura di Tokushima', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1519, 114, 'prefettura di Tottori', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1520, 114, 'prefettura di Toyama', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1521, 114, 'prefettura di Yamagata', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1522, 114, 'prefettura di Yamaguchi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1523, 114, 'prefettura di Yamanashi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1524, 114, 'prefettura di Ōita', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1525, 115, 'Contea di Bomet', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1526, 115, 'Contea di Bungoma', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1527, 115, 'Contea di Busia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1528, 115, 'Contea di Homa Bay', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1529, 115, 'Contea di Kajiado', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1530, 115, 'Contea di Kakamega', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1531, 115, 'Contea di Kericho', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1532, 115, 'Contea di Kisii', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1533, 115, 'Contea di Kisumu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1534, 115, 'Contea di Kitui', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1535, 115, 'Contea di Machakos', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1536, 115, 'Contea di Makueni', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1537, 115, 'Contea di Migori', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1538, 115, 'Contea di Nairobi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1539, 115, 'Contea di Nakuru', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1540, 115, 'Contea di Narok', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1541, 115, 'Contea di Nyamira', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1542, 115, 'Contea di Siaya', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1543, 115, 'Contea di Turkana', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1544, 115, 'Contea di Vihiga', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1545, 115, 'Contea di West Pokot', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1546, 115, 'Elegeyo-Marakwet', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1547, 115, 'Lamu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1548, 115, 'Murang''A', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1549, 115, 'Nandi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1550, 115, 'Taita Taveta', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1551, 115, 'Tharaka - Nithi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1552, 115, 'Trans Nzoia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1553, 115, 'contea di Baringo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1554, 115, 'contea di Embu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1555, 115, 'contea di Garissa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1556, 115, 'contea di Isiolo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1557, 115, 'contea di Kiambu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1558, 115, 'contea di Kilifi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1559, 115, 'contea di Kirinyaga', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1560, 115, 'contea di Kwale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1561, 115, 'contea di Laikipia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1562, 115, 'contea di Mandera', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1563, 115, 'contea di Marsabit', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1564, 115, 'contea di Meru', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1565, 115, 'contea di Mombasa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1566, 115, 'contea di Nyandarua', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1567, 115, 'contea di Nyeri', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1568, 115, 'contea di Samburu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1569, 115, 'contea di Tana River', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1570, 115, 'contea di Uasin Gishu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1571, 115, 'contea di Wajir', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1572, 116, 'Gorod Bishkek', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1573, 116, 'Osh City', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1574, 116, 'provincia di Batken', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1575, 116, 'provincia di Naryn', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1576, 116, 'provincia di Oš', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1577, 116, 'provincia di Talas', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1578, 116, 'provincia di Ysykköl', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1579, 116, 'provincia di Čuj', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1580, 116, 'provincia di Žalalabad', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1581, 117, 'Kep', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1582, 117, 'Kratie', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1583, 117, 'Mondolkiri', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1584, 117, 'Pailin', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1585, 117, 'Phnom Penh', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1586, 117, 'Preah Sihanouk', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1587, 117, 'Provincia di Koh Kong', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1588, 117, 'Siem Reap', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1589, 117, 'Takeo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1590, 117, 'Tboung Khmum', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1591, 117, 'provincia di Banteay Meanchey', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1592, 117, 'provincia di Battambang', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1593, 117, 'provincia di Kampong Cham', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1594, 117, 'provincia di Kampong Chhnang', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1595, 117, 'provincia di Kampong Speu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1596, 117, 'provincia di Kampong Thom', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1597, 117, 'provincia di Kampot', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1598, 117, 'provincia di Kandal', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1599, 117, 'provincia di Preah Vihear', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1600, 117, 'provincia di Prey Veng', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1601, 117, 'provincia di Pursat', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1602, 117, 'provincia di Ratanakiri', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1603, 117, 'provincia di Stung Treng', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1604, 117, 'provincia di Svay Rieng', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1605, 117, 'Ŏtâr Méanchey', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1606, 118, 'Gilbert Islands', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1607, 118, 'Isole della Fenice', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1608, 118, 'Line Islands', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1609, 119, 'Grande Comore', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1610, 119, 'Mohéli', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1611, 119, 'Ndzuwani', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1612, 120, 'Christ Church Nichola Town', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1613, 120, 'Saint Anne Sandy Point', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1614, 120, 'Saint George Basseterre', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1615, 120, 'Saint George Gingerland', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1616, 120, 'Saint James Windward', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1617, 120, 'Saint John Capesterre', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1618, 120, 'Saint John Figtree', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1619, 120, 'Saint Mary Cayon', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1620, 120, 'Saint Paul Capesterre', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1621, 120, 'Saint Paul Charlestown', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1622, 120, 'Saint Peter Basseterre', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1623, 120, 'Saint Thomas Lowland', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1624, 120, 'Saint Thomas Middle Island', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1625, 120, 'Trinity Palmetto Point', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1626, 121, 'Chagang-do', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1627, 121, 'Hwanghae-bukto', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1628, 121, 'Hwanghae-namdo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1629, 121, 'Kaesong', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1630, 121, 'Kangwŏn-do', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1631, 121, 'Nampo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1632, 121, 'North Hamgyong Province', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1633, 121, 'North Pyongan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1634, 121, 'Pyongyang', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1635, 121, 'Rasŏn', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1636, 121, 'Ryanggang', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1637, 121, 'South Hamgyong', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1638, 121, 'South Pyongan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1639, 122, 'Busan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1640, 122, 'Chungcheongbuk-do', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1641, 122, 'Chungcheongnam-do', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1642, 122, 'Daegu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1643, 122, 'Daejeon', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1644, 122, 'Gangwon', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1645, 122, 'Gwangju', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1646, 122, 'Gyeonggi-do', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1647, 122, 'Gyeongsangbuk-do', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1648, 122, 'Gyeongsangnam-do', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1649, 122, 'Incheon', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1650, 122, 'Jeju-do', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1651, 122, 'Jeollanam-do', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1652, 122, 'Jeonbuk', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1653, 122, 'Sejong-si', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1654, 122, 'Seul', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1655, 122, 'Ulsan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1663, 123, 'Al Asimah Governorate', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1664, 123, 'Al-Ahmad', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1665, 123, 'Al-Farwaniyah', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1666, 123, 'Al-Jahra', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1667, 123, 'Muḩāfaz̧at Mubārak al Kabīr', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1668, 123, 'Muḩāfaz̧at Ḩawallī', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1675, 125, 'Abai Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1676, 125, 'Aktyubinskaya Oblast’', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1677, 125, 'Almaty', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1678, 125, 'Almaty Oblysy', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1679, 125, 'Aqmola Oblysy', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1680, 125, 'Astana', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1681, 125, 'Atyrau Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1682, 125, 'Baikonur', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1683, 125, 'East Kazakhstan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1684, 125, 'Jetisu Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1685, 125, 'Mangistauskaya Oblast’', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1686, 125, 'North Kazakhstan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1687, 125, 'Qostanay Oblysy', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1688, 125, 'Qyzylorda Oblysy', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1689, 125, 'Shymkent', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1690, 125, 'Turkistan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1691, 125, 'Ulytau Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1692, 125, 'West Kazakhstan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1693, 125, 'Zhambyl Oblysy', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1694, 125, 'regione di Karaganda', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1695, 125, 'regione di Pavlodar', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1696, 126, 'Attapu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1697, 126, 'Houaphan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1698, 126, 'Khouèng Oudômxai', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1699, 126, 'Khouèng Phôngsali', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1700, 126, 'Khouèng Xékong', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1701, 126, 'Louangnamtha', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1702, 126, 'Xaignabouli', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1703, 126, 'Xaisomboun Province', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1704, 126, 'Xiangkhouang', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1705, 126, 'prefettura di Vientiane', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1706, 126, 'provincia di Bokeo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1707, 126, 'provincia di Bolikhamxai', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1708, 126, 'provincia di Champasak', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1709, 126, 'provincia di Khammouan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1710, 126, 'provincia di Luang Prabang', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1711, 126, 'provincia di Salavan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1712, 126, 'provincia di Savannakhet', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1713, 126, 'provincia di Vientiane', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1714, 127, 'Beyrouth', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1715, 127, 'Governatorato di Baalbek-Hermel', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1716, 127, 'Mohafazat Aakkâr', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1717, 127, 'Mohafazat Béqaa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1718, 127, 'Mohafazat Liban-Nord', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1719, 127, 'Mohafazat Mont-Liban', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1720, 127, 'Mohafazat Nabatîyé', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1721, 127, 'governatorato del Sud Libano', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1722, 128, 'Anse-la-Raye', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1723, 128, 'Canaries', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1724, 128, 'Gros-Islet', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1725, 128, 'Soufrière', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1726, 128, 'Vieux-Fort', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1727, 128, 'quartiere di Castries', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1728, 128, 'quartiere di Choiseul', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1729, 128, 'quartiere di Dennery', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1730, 128, 'quartiere di Laborie', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1731, 128, 'quartiere di Micoud', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1732, 129, 'Balzers', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1733, 129, 'Eschen', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1734, 129, 'Gamprin', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1735, 129, 'Mauren', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1736, 129, 'Planken', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1737, 129, 'Ruggell', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1738, 129, 'Schaan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1739, 129, 'Schellenberg', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1740, 129, 'Triesen', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1741, 129, 'Triesenberg', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1742, 129, 'Vaduz', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1743, 130, 'Sabaragamuwa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1744, 130, 'Uva', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1745, 130, 'provincia Centrale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1746, 130, 'provincia Centro-Settentrionale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1747, 130, 'provincia Meridionale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1748, 130, 'provincia Nord-Occidentale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1749, 130, 'provincia Occidentale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1750, 130, 'provincia Orientale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1751, 130, 'provincia Settentrionale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1752, 131, 'contea di Bomi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1753, 131, 'contea di Bong', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1754, 131, 'contea di Gbarpolu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1755, 131, 'contea di Grand Bassa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1756, 131, 'contea di Grand Cape Mount', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1757, 131, 'contea di Grand Gedeh', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1758, 131, 'contea di Grand Kru', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1759, 131, 'contea di Lofa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1760, 131, 'contea di Margibi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1761, 131, 'contea di Maryland', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1762, 131, 'contea di Montserrado', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1763, 131, 'contea di Nimba', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1764, 131, 'contea di River Cess', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1765, 131, 'contea di River Gee', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1766, 131, 'contea di Sinoe', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1767, 132, 'distretto di Berea', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1768, 132, 'distretto di Butha-Buthe', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1769, 132, 'distretto di Leribe', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1770, 132, 'distretto di Mafeteng', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1771, 132, 'distretto di Maseru', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1772, 132, 'distretto di Mohale''s Hoek', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1773, 132, 'distretto di Mokhotlong', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1774, 132, 'distretto di Qacha''s Nek', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1775, 132, 'distretto di Quthing', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1776, 132, 'distretto di Thaba-Tseka', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1777, 133, 'contea di Alytus', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1778, 133, 'contea di Kaunas', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1779, 133, 'contea di Klaipėda', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1780, 133, 'contea di Marijampolė', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1781, 133, 'contea di Panevėžys', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1782, 133, 'contea di Tauragė', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1783, 133, 'contea di Telšiai', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1784, 133, 'contea di Utena', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1785, 133, 'contea di Vilnius', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1786, 133, 'contea di Šiauliai', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1787, 134, 'Canton d''Echternach', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1788, 134, 'Canton d''Esch-sur-Alzette', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1789, 134, 'Capellen', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1790, 134, 'Clervaux', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1791, 134, 'Diekirch', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1792, 134, 'Grevenmacher', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1793, 134, 'Luxembourg', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1794, 134, 'Mersch', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1795, 134, 'Redange', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1796, 134, 'Remich', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1797, 134, 'Vianden', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1798, 134, 'Wiltz', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1799, 135, 'Aizkraukles novads', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1800, 135, 'Alūksne', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1801, 135, 'Augšdaugava Municipality', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1802, 135, 'Balvu Novads', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1803, 135, 'Bauskas Novads', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1804, 135, 'Comune di Gulbene', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1805, 135, 'Comune di Olaine', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1806, 135, 'Comune di Valka', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1807, 135, 'Cēsu Novads', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1808, 135, 'Daugavpils', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1809, 135, 'Dobeles novads', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1810, 135, 'Jelgava', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1811, 135, 'Jelgavas novads', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1812, 135, 'Jēkabpils (comune)', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1813, 135, 'Jūrmala', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1814, 135, 'Krāslavas novads', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1815, 135, 'Kuldīgas novads', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1816, 135, 'Liepāja', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1817, 135, 'Limbažu novads', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1818, 135, 'Ludzas novads', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1819, 135, 'Līvāni', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1820, 135, 'Madona Municipality', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1821, 135, 'Mārupes Novads', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1822, 135, 'Ogres novads', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1823, 135, 'Preiļi Municipality', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1824, 135, 'Ropaži', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1825, 135, 'Rēzekne', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1826, 135, 'Rēzeknes Novads', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1827, 135, 'Rīga', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1828, 135, 'Saldus Municipality', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1829, 135, 'Saulkrastu Novads', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1830, 135, 'Siguldas Novads', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1831, 135, 'Smiltenes Novads', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1832, 135, 'Talsi Municipality', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1833, 135, 'Tukums', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1834, 135, 'Valmiera', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1835, 135, 'Varakļāni', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1836, 135, 'Ventspils', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1837, 135, 'Ventspils', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1838, 135, 'comune della Curlandia meridionale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1839, 135, 'comune di Salaspils', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1840, 135, 'Ādažu Novads', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1841, 135, 'Ķekava', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1842, 136, 'Al Buţnān', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1843, 136, 'Al Jabal al Akhḑar', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1844, 136, 'Al Jafārah', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1845, 136, 'Al Marj', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1846, 136, 'Al Marqab', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1847, 136, 'Al Wāḩāt', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1848, 136, 'An Nuqāţ al Khams', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1849, 136, 'Az Zāwiyah', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1850, 136, 'Darnah', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1851, 136, 'Distretto di Giofra', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1852, 136, 'Ghāt', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1853, 136, 'Nālūt', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1854, 136, 'Sha‘bīyat Banghāzī', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1855, 136, 'Sha‘bīyat Mişrātah', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1856, 136, 'Surt', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1857, 136, 'Tripoli', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1858, 136, 'Wādī al Ḩayāt', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1859, 136, 'Wādī ash Shāţi’', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1860, 136, 'distretto di Cufra', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1861, 136, 'distretto di Murzuch', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1862, 136, 'distretto di Sebha', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1863, 136, 'distretto di al-Jabal al-Gharbi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1864, 137, 'Béni Mellal-Khénifra', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1865, 137, 'Casablanca-Settat', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1866, 137, 'Dakhla-Oued Ed-Dahab', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1867, 137, 'Drâa-Tafilalet', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1868, 137, 'Fès-Meknès', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1869, 137, 'Guelmim-Oued Noun', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1870, 137, 'Laâyoune-Sakia El Hamra', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1871, 137, 'Marrakesh-Safi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1872, 137, 'Rabat-Salé-Kénitra', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1873, 137, 'Regione Orientale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1874, 137, 'Souss-Massa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1875, 137, 'Tanger-Tetouan-Al Hoceima', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1876, 138, 'Commune de Monaco', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1877, 139, 'Administrative-Territorial Units of the Left Bank of the Dniester', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1878, 139, 'Distretto di Orhei', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1879, 139, 'Distretto di Ungheni', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1880, 139, 'Gagauzia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1881, 139, 'Municipiul Bender', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1882, 139, 'Municipiul Bălţi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1883, 139, 'Municipiul Chişinău', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1884, 139, 'Raionul Călăraşi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1885, 139, 'Raionul Căuşeni', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1886, 139, 'Raionul Drochia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1887, 139, 'Raionul Edineţ', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1888, 139, 'Raionul Ocniţa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1889, 139, 'Raionul Ștefan Vodă', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1890, 139, 'distretto di Anenii Noi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1891, 139, 'distretto di Basarabeasca', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1892, 139, 'distretto di Briceni', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1893, 139, 'distretto di Cahul', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1894, 139, 'distretto di Cantemir', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1895, 139, 'distretto di Cimișlia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1896, 139, 'distretto di Criuleni', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1897, 139, 'distretto di Dondușeni', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1898, 139, 'distretto di Dubăsari', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1899, 139, 'distretto di Florești', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1900, 139, 'distretto di Fălești', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1901, 139, 'distretto di Glodeni', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1902, 139, 'distretto di Hîncești', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1903, 139, 'distretto di Ialoveni', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1904, 139, 'distretto di Leova', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1905, 139, 'distretto di Nisporeni', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1906, 139, 'distretto di Rezina', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1907, 139, 'distretto di Rîșcani', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1908, 139, 'distretto di Soroca', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1909, 139, 'distretto di Strășeni', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1910, 139, 'distretto di Sîngerei', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1911, 139, 'distretto di Taraclia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1912, 139, 'distretto di Telenești', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1913, 139, 'distretto di Șoldănești', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1914, 140, 'Andrijevica', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1915, 140, 'Bar', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1916, 140, 'Berane', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1917, 140, 'Bijelo Polje', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1918, 140, 'Budva', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1919, 140, 'Castelnuovo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1920, 140, 'Cattaro', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1921, 140, 'Cetinje', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1922, 140, 'Danilovgrad', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1923, 140, 'Gusinje', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1924, 140, 'Mojkovac', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1925, 140, 'Opština Kolašin', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1926, 140, 'Opština Nikšić', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1927, 140, 'Opština Plav', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1928, 140, 'Opština Plužine', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1929, 140, 'Opština Rožaje', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1930, 140, 'Opština Šavnik', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1931, 140, 'Opština Žabljak', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1932, 140, 'Petnjica', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1933, 140, 'Pljevlja', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1934, 140, 'Podgorica', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1935, 140, 'Tivat', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1936, 140, 'Tuzi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1937, 140, 'Ulcinj', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1938, 140, 'Zeta', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1939, 142, 'Alaotra Mangoro Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1940, 142, 'Amoron''i Mania Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1941, 142, 'Analamanga Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1942, 142, 'Analanjirofo Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1943, 142, 'Androy Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1944, 142, 'Anosy Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1945, 142, 'Atsimo-Andrefana Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1946, 142, 'Atsimo-Atsinanana Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1947, 142, 'Atsinanana Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1948, 142, 'Betsiboka Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1949, 142, 'Boeny Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1950, 142, 'Bongolava Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1951, 142, 'Diana Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1952, 142, 'Fitovinany Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1953, 142, 'Haute Matsiatra Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1954, 142, 'Ihorombe Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1955, 142, 'Itasy Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1956, 142, 'Melaky Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1957, 142, 'Menabe Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1958, 142, 'Sava Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1959, 142, 'Sofia Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1960, 142, 'Vakinankaratra Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1961, 142, 'Vatovavy Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1962, 143, 'Ailinginae Atoll', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1963, 143, 'Ailinglaplap Atoll', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1964, 143, 'Ailuk Atoll', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1965, 143, 'Arno Atoll', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1966, 143, 'Aur Atoll', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1967, 143, 'Bikar Atoll', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1968, 143, 'Bikini Atoll', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1969, 143, 'Bokak Atoll', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1970, 143, 'Ebon Atoll', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1971, 143, 'Enewetak Atoll', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1972, 143, 'Erikub Atoll', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1973, 143, 'Jabat Island', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1974, 143, 'Jaluit Atoll', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1975, 143, 'Jemo Island', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1976, 143, 'Kili Island', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1977, 143, 'Kwajalein Atoll', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1978, 143, 'Lae Atoll', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1979, 143, 'Lib Island', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1980, 143, 'Likiep Atoll', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1981, 143, 'Majuro Atoll', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1982, 143, 'Maloelap Atoll', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1983, 143, 'Mejit Island', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1984, 143, 'Mili Atoll', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1985, 143, 'Namdrik Atoll', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1986, 143, 'Namu Atoll', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1987, 143, 'Rongelap Atoll', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1988, 143, 'Rongrik Atoll', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1989, 143, 'Taka Atoll', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1990, 143, 'Ujae Atoll', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1991, 143, 'Ujelang Atoll', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1992, 143, 'Utrik Atoll', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1993, 143, 'Wotho Atoll', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1994, 143, 'Wotje Atoll', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1995, 144, 'Berovo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1996, 144, 'Bitola', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1997, 144, 'Bogdanci', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1998, 144, 'Bogovinje', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (1999, 144, 'Bosilovo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2000, 144, 'Brvenica', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2001, 144, 'Debar', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2002, 144, 'Debarca', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2003, 144, 'Demir Hisar', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2004, 144, 'Demir Kapija', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2005, 144, 'Dolneni', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2006, 144, 'Gevgelija', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2007, 144, 'Gostivar', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2008, 144, 'Grad Skopje', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2009, 144, 'Gradsko', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2010, 144, 'Ilinden', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2011, 144, 'Jegunovce', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2012, 144, 'Karbinci', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2013, 144, 'Kavadarci', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2014, 144, 'Kratovo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2015, 144, 'Kriva Palanka', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2016, 144, 'Kumanovo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2017, 144, 'Lozovo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2018, 144, 'Makedonska Kamenica', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2019, 144, 'Makedonski Brod', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2020, 144, 'Mavrovo e Rostuša', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2021, 144, 'Mogila', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2022, 144, 'Negotino', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2023, 144, 'Novaci', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2024, 144, 'Novo Selo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2025, 144, 'Ohrid', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2026, 144, 'Opština Aračinovo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2027, 144, 'Opština Centar Župa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2028, 144, 'Opština Delčevo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2029, 144, 'Opština Dojran', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2030, 144, 'Opština Kičevo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2031, 144, 'Opština Konče', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2032, 144, 'Opština Kočani', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2033, 144, 'Opština Krivogaštani', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2034, 144, 'Opština Kruševo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2035, 144, 'Opština Lipkovo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2036, 144, 'Opština Pehčevo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2037, 144, 'Opština Probištip', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2038, 144, 'Opština Radoviš', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2039, 144, 'Opština Rankovce', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2040, 144, 'Opština Sopište', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2041, 144, 'Opština Staro Nagoričane', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2042, 144, 'Opština Studeničani', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2043, 144, 'Opština Vevčani', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2044, 144, 'Opština Vrapčište', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2045, 144, 'Opština Čučer-Sandevo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2046, 144, 'Opština Štip', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2047, 144, 'Opština Želino', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2048, 144, 'Petrovec', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2049, 144, 'Plasnica', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2050, 144, 'Prilep', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2051, 144, 'Resen', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2052, 144, 'Rosoman', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2053, 144, 'Struga', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2054, 144, 'Strumica', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2055, 144, 'Sveti Nikole', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2056, 144, 'Tearce', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2057, 144, 'Tetovo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2058, 144, 'Valandovo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2059, 144, 'Vasilevo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2060, 144, 'Veles', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2061, 144, 'Zelenikovo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2062, 144, 'Zrnovci', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2063, 144, 'Čaška', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2064, 144, 'Češinovo-Obleševo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2065, 145, 'Bamako', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2066, 145, 'Ménaka Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2067, 145, 'Taoudénit Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2068, 145, 'Tombouctou Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2069, 145, 'regione di Gao', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2070, 145, 'regione di Kayes', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2071, 145, 'regione di Kidal', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2072, 145, 'regione di Koulikoro', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2073, 145, 'regione di Mopti', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2074, 145, 'regione di Sikasso', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2075, 145, 'regione di Ségou', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2076, 146, 'Ayeyarwady Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2077, 146, 'Magway Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2078, 146, 'Mon State', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2079, 146, 'Nay Pyi Taw', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2080, 146, 'Rakhine State', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2081, 146, 'Stato Chin', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2082, 146, 'Stato Kachin', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2083, 146, 'Stato Karen', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2084, 146, 'Stato Kayah', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2085, 146, 'Stato Shan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2086, 146, 'regione di Bago', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2087, 146, 'regione di Mandalay', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2088, 146, 'regione di Sagaing', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2089, 146, 'regione di Tanintharyi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2090, 146, 'regione di Yangon', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2091, 147, 'Bayan-Ölgiy Aymag', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2092, 147, 'Bayanhongor Aymag', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2093, 147, 'Central Aymag', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2094, 147, 'Darhan-Uul Aymag', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2095, 147, 'Dundgovĭ Aymag', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2096, 147, 'Dzavhan Aymag', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2097, 147, 'Govĭ-Sumber', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2098, 147, 'Hentiy Aymag', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2099, 147, 'Hovd', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2100, 147, 'Hövsgöl Aymag', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2101, 147, 'Orhon Aymag', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2102, 147, 'South Khangay', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2103, 147, 'Sühbaatar Aymag', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2104, 147, 'Ulaanbaatar Hot', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2105, 147, 'provincia del Dornod', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2106, 147, 'provincia del Dornogov''', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2107, 147, 'provincia del Gov''-Altaj', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2108, 147, 'provincia del Sėlėngė', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2109, 147, 'provincia dell''Arhangaj', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2110, 147, 'provincia dell''Uvs', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2111, 147, 'provincia dell''Ômnôgov''', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2112, 147, 'provincia di Bulgan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2126, 151, 'Adrar', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2127, 151, 'Nouakchott Nord', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2128, 151, 'Nouakchott Ouest', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2129, 151, 'Nouakchott Sud', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2130, 151, 'regione di Assaba', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2131, 151, 'regione di Brakna', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2132, 151, 'regione di Dakhlet-Nouadhibou', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2133, 151, 'regione di Gorgol', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2134, 151, 'regione di Guidimagha', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2135, 151, 'regione di Hodh-Charghi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2136, 151, 'regione di Hodh-Gharbi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2137, 151, 'regione di Inchiri', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2138, 151, 'regione di Tagant', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2139, 151, 'regione di Tiris-Zemmour', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2140, 151, 'regione di Trarza', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2144, 153, 'Attard', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2145, 153, 'Balzan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2146, 153, 'Birkirkara', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2147, 153, 'Birżebbuġa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2148, 153, 'Bormla', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2149, 153, 'Dingli', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2150, 153, 'Għajnsielem', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2151, 153, 'Il-Birgu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2152, 153, 'Il-Fgura', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2153, 153, 'Il-Fontana', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2154, 153, 'Il-Furjana', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2155, 153, 'Il-Gudja', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2156, 153, 'Il-Gżira', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2157, 153, 'Il-Kalkara', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2158, 153, 'Il-Marsa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2159, 153, 'Il-Mellieħa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2160, 153, 'Il-Mosta', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2161, 153, 'Il-Munxar', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2162, 153, 'Il-Qala', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2163, 153, 'Il-Qrendi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2164, 153, 'Il-Ħamrun', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2165, 153, 'In-Nadur', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2166, 153, 'In-Naxxar', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2167, 153, 'Ir-Rabat', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2168, 153, 'Is-Siġġiewi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2169, 153, 'Is-Swieqi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2170, 153, 'Ix-Xagħra', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2171, 153, 'Ix-Xewkija', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2172, 153, 'Ix-Xgħajra', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2173, 153, 'Iż-Żebbuġ', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2174, 153, 'Iż-Żejtun', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2175, 153, 'Iż-Żurrieq', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2176, 153, 'Kirkop', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2177, 153, 'L-Għarb', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2178, 153, 'L-Għasri', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2179, 153, 'L-Iklin', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2180, 153, 'L-Imdina', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2181, 153, 'L-Imqabba', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2182, 153, 'L-Imsida', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2183, 153, 'L-Imtarfa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2184, 153, 'L-Imġarr', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2185, 153, 'L-Isla', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2186, 153, 'Lija', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2187, 153, 'Luqa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2188, 153, 'Marsaskala', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2189, 153, 'Marsaxlokk', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2190, 153, 'Paola', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2191, 153, 'Pembroke', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2192, 153, 'Qormi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2193, 153, 'Safi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2194, 153, 'Saint John', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2195, 153, 'Saint Julian''s', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2196, 153, 'Saint Lawrence', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2197, 153, 'Saint Lucia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2198, 153, 'Saint Paul’s Bay', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2199, 153, 'Saint Venera', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2200, 153, 'Sannat', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2201, 153, 'Tal-Pietà', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2202, 153, 'Tarxien', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2203, 153, 'Tas-Sliema', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2204, 153, 'Ta’ Kerċem', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2205, 153, 'Ta’ Xbiex', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2206, 153, 'Valletta', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2207, 153, 'Victoria', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2208, 153, 'Ħal Għargħur', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2209, 153, 'Ħal Għaxaq', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2210, 153, 'Ħaż-Żabbar', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2211, 153, 'Ħaż-Żebbuġ', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2212, 154, 'Agalega Islands', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2213, 154, 'Black River District', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2214, 154, 'Cargados Carajos', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2215, 154, 'Flacq District', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2216, 154, 'Grand Port District', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2217, 154, 'Moka District', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2218, 154, 'Pamplemousses District', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2219, 154, 'Plaines Wilhems District', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2220, 154, 'Port Louis District', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2221, 154, 'Rivière du Rempart District', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2222, 154, 'Rodrigues', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2223, 154, 'Savanne District', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2224, 155, 'Addu Atoll', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2225, 155, 'Alifu Atholhu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2226, 155, 'Baa Atholhu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2227, 155, 'Dhaalu Atholhu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2228, 155, 'Faafu Atholhu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2229, 155, 'Gaafu Alifu Atholhu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2230, 155, 'Gaafu Dhaalu Atholhu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2231, 155, 'Gnaviyani Atoll', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2232, 155, 'Haa Alifu Atholhu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2233, 155, 'Haa Dhaalu Atholhu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2234, 155, 'Kaafu Atoll', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2235, 155, 'Laamu Atholhu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2236, 155, 'Lhaviyani Atholhu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2237, 155, 'Maale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2238, 155, 'Meemu Atholhu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2239, 155, 'Noonu Atoll', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2240, 155, 'Raa Atholhu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2241, 155, 'Shaviyani Atholhu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2242, 155, 'Southern Ari Atoll', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2243, 155, 'Thaa Atholhu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2244, 155, 'Vaavu Atholhu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2245, 156, 'regione Centrale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2246, 156, 'regione Meridionale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2247, 156, 'regione Settentrionale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2248, 157, 'Aguascalientes', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2249, 157, 'Bassa California', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2250, 157, 'Bassa California del Sud', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2251, 157, 'Campeche', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2252, 157, 'Chiapas', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2253, 157, 'Città del Messico', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2254, 157, 'Coahuila', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2255, 157, 'Colima', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2256, 157, 'Durango', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2257, 157, 'Guanajuato', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2258, 157, 'Guerrero', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2259, 157, 'Hidalgo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2260, 157, 'Jalisco', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2261, 157, 'Messico', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2262, 157, 'Michoacán', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2263, 157, 'Morelos', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2264, 157, 'Nayarit', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2265, 157, 'Nuevo León', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2266, 157, 'Oaxaca', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2267, 157, 'Puebla', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2268, 157, 'Querétaro', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2269, 157, 'Quintana Roo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2270, 157, 'San Luis Potosí', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2271, 157, 'Sinaloa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2272, 157, 'Sonora', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2273, 157, 'Tabasco', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2274, 157, 'Tamaulipas', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2275, 157, 'Tlaxcala', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2276, 157, 'Veracruz', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2277, 157, 'Yucatán', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2278, 157, 'Zacatecas', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2279, 158, 'Johor', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2280, 158, 'Kedah', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2281, 158, 'Kelantan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2282, 158, 'Kuala Lumpur', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2283, 158, 'Labuan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2284, 158, 'Melaka', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2285, 158, 'Negeri Sembilan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2286, 158, 'Pahang', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2287, 158, 'Penang', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2288, 158, 'Perak', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2289, 158, 'Perlis', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2290, 158, 'Putrajaya', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2291, 158, 'Sabah', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2292, 158, 'Sarawak', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2293, 158, 'Selangor', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2294, 158, 'Terengganu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2295, 159, 'Cidade de Maputo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2296, 159, 'Manica Province', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2297, 159, 'provincia di Cabo Delgado', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2298, 159, 'provincia di Gaza', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2299, 159, 'provincia di Inhambane', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2300, 159, 'provincia di Maputo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2301, 159, 'provincia di Nampula', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2302, 159, 'provincia di Niassa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2303, 159, 'provincia di Sofala', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2304, 159, 'provincia di Tete', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2305, 159, 'provincia di Zambezia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2306, 160, 'Regione del Kavango Occidentale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2307, 160, 'Regione del Kavango Orientale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2308, 160, 'Regione di ǁKaras', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2309, 160, 'regione degli Erongo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2310, 160, 'regione del Kunene', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2311, 160, 'regione dell''Oshana', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2312, 160, 'regione dello Zambesi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2313, 160, 'regione di Hardap', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2314, 160, 'regione di Khomas', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2315, 160, 'regione di Ohangwena', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2316, 160, 'regione di Omaheke', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2317, 160, 'regione di Omusati', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2318, 160, 'regione di Oshikoto', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2319, 160, 'regione di Otjozondjupa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2323, 162, 'Niamey', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2324, 162, 'regione di Agadez', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2325, 162, 'regione di Diffa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2326, 162, 'regione di Dosso', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2327, 162, 'regione di Maradi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2328, 162, 'regione di Tahoua', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2329, 162, 'regione di Tillabéri', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2330, 162, 'regione di Zinder', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2331, 164, 'Abia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2332, 164, 'Adamawa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2333, 164, 'Akwa Ibom', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2334, 164, 'Anambra', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2335, 164, 'Bauchi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2336, 164, 'Bayelsa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2337, 164, 'Benue', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2338, 164, 'Borno', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2339, 164, 'Cross River', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2340, 164, 'Delta', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2341, 164, 'Ebonyi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2342, 164, 'Edo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2343, 164, 'Ekiti', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2344, 164, 'Enugu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2345, 164, 'Gombe', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2346, 164, 'Imo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2347, 164, 'Jigawa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2348, 164, 'Kaduna', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2349, 164, 'Kano', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2350, 164, 'Katsina', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2351, 164, 'Kebbi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2352, 164, 'Kogi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2353, 164, 'Kwara', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2354, 164, 'Lagos', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2355, 164, 'Nassarawa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2356, 164, 'Niger', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2357, 164, 'Ogun', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2358, 164, 'Ondo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2359, 164, 'Osun', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2360, 164, 'Oyo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2361, 164, 'Plateau', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2362, 164, 'Rivers', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2363, 164, 'Sokoto State', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2364, 164, 'Taraba', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2365, 164, 'Territorio della Capitale Federale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2366, 164, 'Yobe', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2367, 164, 'Zamfara', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2368, 165, 'Departamento de Managua', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2369, 165, 'dipartimento di Boaco', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2370, 165, 'dipartimento di Carazo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2371, 165, 'dipartimento di Chinandega', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2372, 165, 'dipartimento di Chontales', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2373, 165, 'dipartimento di Estelí', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2374, 165, 'dipartimento di Granada', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2375, 165, 'dipartimento di Jinotega', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2376, 165, 'dipartimento di León', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2377, 165, 'dipartimento di Madriz', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2378, 165, 'dipartimento di Masaya', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2379, 165, 'dipartimento di Matagalpa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2380, 165, 'dipartimento di Nueva Segovia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2381, 165, 'dipartimento di Rivas', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2382, 165, 'dipartimento di Río San Juan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2383, 165, 'regione Autonoma Atlantico Nord', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2384, 165, 'regione Autonoma Atlantico Sud', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2385, 166, 'Brabante Settentrionale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2386, 166, 'Drenthe', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2387, 166, 'Flevoland', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2388, 166, 'Frisia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2389, 166, 'Gheldria', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2390, 166, 'Limburgo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2391, 166, 'Olanda Meridionale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2392, 166, 'Olanda Settentrionale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2393, 166, 'Overijssel', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2394, 166, 'Provincia di Groningen', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2395, 166, 'Utrecht', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2396, 166, 'Zelanda', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2397, 167, 'Agder', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2398, 167, 'Akershus', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2399, 167, 'Buskerud fylke', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2400, 167, 'Finnmark', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2401, 167, 'Innlandet', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2402, 167, 'Møre og Romsdal fylke', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2403, 167, 'Nordland', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2404, 167, 'Oslo County', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2405, 167, 'Rogaland', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2406, 167, 'Telemark', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2407, 167, 'Troms', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2408, 167, 'Trøndelag', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2409, 167, 'Vestfold', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2410, 167, 'Vestland', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2411, 167, 'Østfold', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2412, 168, 'Bagmati Province', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2413, 168, 'Gandaki Pradesh', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2414, 168, 'Karnali Province', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2415, 168, 'Koshi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2416, 168, 'Lumbini Province', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2417, 168, 'Madhesh', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2418, 168, 'Sudurpashchim Pradesh', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2419, 169, 'Aiwo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2420, 169, 'Anabar', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2421, 169, 'Anetan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2422, 169, 'Anibare', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2423, 169, 'Baiti', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2424, 169, 'Boe', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2425, 169, 'Buada', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2426, 169, 'Denigomodu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2427, 169, 'Ewa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2428, 169, 'Ijuw', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2429, 169, 'Meneng', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2430, 169, 'Nibok', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2431, 169, 'Uaboe', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2432, 169, 'Yaren', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2433, 171, 'Auckland', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2434, 171, 'Baia dell''Abbondanza', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2435, 171, 'Canterbury', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2436, 171, 'Chatham Islands', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2437, 171, 'Gisborne', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2438, 171, 'Hawke''s Bay', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2439, 171, 'Marlborough', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2440, 171, 'Nelson', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2441, 171, 'Northland', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2442, 171, 'Otago', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2443, 171, 'Southland', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2444, 171, 'Taranaki', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2445, 171, 'Tasman', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2446, 171, 'Waikato', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2447, 171, 'Wellington', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2448, 171, 'West Coast', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2449, 172, 'Al Batinah North Governorate', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2450, 172, 'Al Batinah South Governorate', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2451, 172, 'Ash Sharqiyah North Governorate', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2452, 172, 'Ash Sharqiyah South', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2453, 172, 'Dhofar', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2454, 172, 'Governatorato di Musandam', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2455, 172, 'governatorato di Mascate', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2456, 172, 'governatorato di al-Buraymi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2457, 172, 'governatorato di al-Dakhiliyya', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2458, 172, 'governatorato di al-Wusta', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2459, 172, 'governatorato di al-Zahira', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2460, 173, 'Emberá-Wounaan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2461, 173, 'Kuna Yala', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2462, 173, 'Naso Tjër Di', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2463, 173, 'Ngäbe-Buglé', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2464, 173, 'Panamá Oeste', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2465, 173, 'Provincia de Coclé', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2466, 173, 'Provincia de Colón', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2467, 173, 'Provincia de Panamá', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2468, 173, 'Provincia del Darién', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2469, 173, 'provincia di Bocas del Toro', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2470, 173, 'provincia di Chiriquí', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2471, 173, 'provincia di Herrera', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2472, 173, 'provincia di Los Santos', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2473, 173, 'provincia di Veraguas', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2474, 174, 'Amazonas', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2475, 174, 'Ancash', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2476, 174, 'Apurímac', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2477, 174, 'Arequipa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2478, 174, 'Ayacucho', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2479, 174, 'Cajamarca', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2480, 174, 'Cusco', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2481, 174, 'Huancavelica', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2482, 174, 'Huánuco', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2483, 174, 'Ica', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2484, 174, 'Junín', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2485, 174, 'La Libertad', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2486, 174, 'Lambayeque', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2487, 174, 'Lima', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2488, 174, 'Loreto', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2489, 174, 'Moquegua', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2490, 174, 'Pasco', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2491, 174, 'Piura', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2492, 174, 'Provincia Constitucional del Callao', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2493, 174, 'Regione di Puno', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2494, 174, 'Regione di Ucayali', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2495, 174, 'San Martín', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2496, 174, 'Tacna', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2497, 174, 'Tumbes', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2498, 174, 'provincia di Lima', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2499, 174, 'regione di Madre de Dios', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2505, 176, 'Bougainville', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2506, 176, 'National Capital District', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2507, 176, 'Nuova Britannia Occidentale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2508, 176, 'Nuova Britannia Orientale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2509, 176, 'Sepik Orientale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2510, 176, 'provincia Centrale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2511, 176, 'provincia Occidentale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2512, 176, 'provincia degli Altopiani Occidentali', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2513, 176, 'provincia degli Altopiani Orientali', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2514, 176, 'provincia degli Altopiani del Sud', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2515, 176, 'provincia del Golfo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2516, 176, 'provincia della Nuova Irlanda', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2517, 176, 'provincia di Baia di Milne', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2518, 176, 'provincia di Chimbu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2519, 176, 'provincia di Enga', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2520, 176, 'provincia di Hela', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2521, 176, 'provincia di Jiwaka', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2522, 176, 'provincia di Madang', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2523, 176, 'provincia di Manus', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2524, 176, 'provincia di Morobe', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2525, 176, 'provincia di Oro', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2526, 176, 'provincia di Sandaun', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2527, 177, 'Bicol', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2528, 177, 'Calabarzon', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2529, 177, 'Caraga', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2530, 177, 'Davao', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2531, 177, 'Ilocos', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2532, 177, 'Luzon Centrale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2533, 177, 'Mimaropa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2534, 177, 'Mindanao Settentrionale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2535, 177, 'National Capital Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2536, 177, 'Penisola di Zamboanga', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2537, 177, 'Regione Autonoma nel Mindanao Musulmano', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2538, 177, 'Regione amministrativa Cordillera', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2539, 177, 'Soccsksargen', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2540, 177, 'Valle di Cagayan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2541, 177, 'Visayas Centrale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2542, 177, 'Visayas Occidentale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2543, 177, 'Visayas Orientale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2544, 178, 'Azad Kashmir', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2545, 178, 'Belucistan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2546, 178, 'Gilgit-Baltistan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2547, 178, 'Khyber Pakhtunkhwa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2548, 178, 'Punjab', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2549, 178, 'Sindh', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2550, 178, 'Territorio della capitale Islamabad', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2551, 179, 'Pomeranian Voivodeship', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2552, 179, 'Voivodato della Masovia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2553, 179, 'Voivodato di Cuiavia-Pomerania', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2554, 179, 'Voivodato di Opole', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2555, 179, 'Voivodato di Podlachia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2556, 179, 'Voivodato di Santacroce', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2557, 179, 'Voivodato di Slesia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2558, 179, 'voivodato della Bassa Slesia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2559, 179, 'voivodato della Grande Polonia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2560, 179, 'voivodato della Piccola Polonia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2561, 179, 'voivodato della Pomerania Occidentale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2562, 179, 'voivodato della Precarpazia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2563, 179, 'voivodato della Varmia-Masuria', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2564, 179, 'voivodato di Lublino', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2565, 179, 'voivodato di Lubusz', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2566, 179, 'voivodato di Łódź', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2647, 183, 'Cisgiordania', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2648, 183, 'Striscia di Gaza', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2649, 184, 'Azzorre', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2650, 184, 'Beja', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2651, 184, 'Braga', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2652, 184, 'Bragança', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2653, 184, 'Castelo Branco', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2654, 184, 'Coimbra', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2655, 184, 'Distrito de Aveiro', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2656, 184, 'Faro', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2657, 184, 'Guarda', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2658, 184, 'Leiria', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2659, 184, 'Lisbona', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2660, 184, 'Oporto', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2661, 184, 'Portalegre', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2662, 184, 'Santarém', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2663, 184, 'Setúbal', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2664, 184, 'Viana do Castelo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2665, 184, 'Vila Real', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2666, 184, 'Viseu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2667, 184, 'Évora', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2668, 185, 'Aimeliik', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2669, 185, 'Airai', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2670, 185, 'Angaur', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2671, 185, 'Hatohobei', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2672, 185, 'Kayangel', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2673, 185, 'Koror', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2674, 185, 'Melekeok', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2675, 185, 'Ngaraard', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2676, 185, 'Ngarchelong', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2677, 185, 'Ngardmau', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2678, 185, 'Ngaremlengui', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2679, 185, 'Ngatpang', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2680, 185, 'Ngchesar', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2681, 185, 'Ngiwal', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2682, 185, 'Peleliu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2683, 185, 'Sonsorol', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2684, 186, 'Alto Paraguay', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2685, 186, 'Amambay', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2686, 186, 'Asunción', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2687, 186, 'Caazapá', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2688, 186, 'Canindeyú', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2689, 186, 'Cordillera', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2690, 186, 'Departamento de Boquerón', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2691, 186, 'Departamento de Caaguazú', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2692, 186, 'Departamento de Concepción', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2693, 186, 'Departamento de Paraguarí', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2694, 186, 'Departamento de Ñeembucú', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2695, 186, 'Departamento del Alto Paraná', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2696, 186, 'Departamento del Guairá', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2697, 186, 'Itapúa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2698, 186, 'Misiones', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2699, 186, 'Presidente Hayes', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2700, 186, 'San Pedro', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2701, 186, 'dipartimento Central', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2702, 187, 'Al Daayen', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2703, 187, 'Al Khawr', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2704, 187, 'Al Wakrah', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2705, 187, 'Al-Shahaniya', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2706, 187, 'Baladīyat ad Dawḩah', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2707, 187, 'Baladīyat ar Rayyān', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2708, 187, 'Baladīyat ash Shamāl', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2709, 187, 'Umm Salal', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2711, 189, 'București', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2712, 189, 'Harghita', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2713, 189, 'Vaslui', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2714, 189, 'distretto di Alba', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2715, 189, 'distretto di Arad', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2716, 189, 'distretto di Argeș', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2717, 189, 'distretto di Bacău', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2718, 189, 'distretto di Bihor', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2719, 189, 'distretto di Bistrița-Năsăud', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2720, 189, 'distretto di Botoșani', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2721, 189, 'distretto di Brașov', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2722, 189, 'distretto di Brăila', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2723, 189, 'distretto di Buzău', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2724, 189, 'distretto di Caraș-Severin', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2725, 189, 'distretto di Cluj', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2726, 189, 'distretto di Costanza', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2727, 189, 'distretto di Covasna', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2728, 189, 'distretto di Călărași', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2729, 189, 'distretto di Dolj', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2730, 189, 'distretto di Dâmbovița', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2731, 189, 'distretto di Galați', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2732, 189, 'distretto di Giurgiu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2733, 189, 'distretto di Gorj', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2734, 189, 'distretto di Hunedoara', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2735, 189, 'distretto di Ialomița', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2736, 189, 'distretto di Iași', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2737, 189, 'distretto di Ilfov', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2738, 189, 'distretto di Maramureș', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2739, 189, 'distretto di Mehedinți', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2740, 189, 'distretto di Mureș', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2741, 189, 'distretto di Neamț', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2742, 189, 'distretto di Olt', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2743, 189, 'distretto di Prahova', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2744, 189, 'distretto di Satu Mare', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2745, 189, 'distretto di Sibiu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2746, 189, 'distretto di Suceava', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2747, 189, 'distretto di Sălaj', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2748, 189, 'distretto di Teleorman', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2749, 189, 'distretto di Timiș', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2750, 189, 'distretto di Tulcea', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2751, 189, 'distretto di Vrancea', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2752, 189, 'distretto di Vâlcea', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2753, 190, 'Central Serbia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2754, 190, 'Voivodina', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2755, 191, 'Adighezia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2756, 191, 'Baschiria', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2757, 191, 'Cabardino-Balcaria', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2758, 191, 'Calmucchia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2759, 191, 'Cecenia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2760, 191, 'Chakassia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2761, 191, 'Ciuvascia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2762, 191, 'Daghestan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2763, 191, 'Irkutsk Oblast', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2764, 191, 'Kamchatka Krai', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2765, 191, 'Karačaj-Circassia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2766, 191, 'Kemerovo Oblast', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2767, 191, 'Khanty-Mansiyskiy Avtonomnyy Okrug-Yugra', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2768, 191, 'Krasnoyarskiy Kray', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2769, 191, 'Mordovia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2770, 191, 'Moskva', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2771, 191, 'Oblast'' di Ul''janovsk', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2772, 191, 'Orenburg Oblast', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2773, 191, 'Ossezia Settentrionale-Alania', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2774, 191, 'Repubblica dei Komi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2775, 191, 'Repubblica dei Mari', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2776, 191, 'Repubblica dell''Altaj', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2777, 191, 'Repubblica di Carelia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2778, 191, 'Republic of Sakha (Yakutia)', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2779, 191, 'Respublika Buryatiya', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2780, 191, 'Respublika Ingushetiya', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2781, 191, 'Sankt-Peterburg', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2782, 191, 'Tatarstan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2783, 191, 'Territorio del Litorale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2784, 191, 'Territorio dell''Altaj', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2785, 191, 'Territorio di Chabarovsk', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2786, 191, 'Territorio di Krasnodar', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2787, 191, 'Territorio di Perm''', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2788, 191, 'Territorio di Stavropol''', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2789, 191, 'Tomsk Oblast', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2790, 191, 'Transbaikal Territory', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2791, 191, 'Tuva', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2792, 191, 'Udmurtskaya Respublika', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2793, 191, 'circondario autonomo Jamalo-Nenec', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2794, 191, 'circondario autonomo dei Nenec', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2795, 191, 'circondario autonomo della Čukotka', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2796, 191, 'oblast'' autonoma ebraica', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2797, 191, 'oblast'' dell''Amur', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2798, 191, 'oblast'' di Arcangelo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2799, 191, 'oblast'' di Astrachan''', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2800, 191, 'oblast'' di Belgorod', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2801, 191, 'oblast'' di Brjansk', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2802, 191, 'oblast'' di Ivanovo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2803, 191, 'oblast'' di Jaroslavl''', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2804, 191, 'oblast'' di Kaliningrad', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2805, 191, 'oblast'' di Kaluga', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2806, 191, 'oblast'' di Kirov', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2807, 191, 'oblast'' di Kostroma', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2808, 191, 'oblast'' di Kurgan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2809, 191, 'oblast'' di Kursk', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2810, 191, 'oblast'' di Leningrado', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2811, 191, 'oblast'' di Lipeck', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2812, 191, 'oblast'' di Magadan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2813, 191, 'oblast'' di Mosca', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2814, 191, 'oblast'' di Murmansk', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2815, 191, 'oblast'' di Nižnij Novgorod', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2816, 191, 'oblast'' di Novgorod', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2817, 191, 'oblast'' di Novosibirsk', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2818, 191, 'oblast'' di Omsk', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2819, 191, 'oblast'' di Orël', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2820, 191, 'oblast'' di Penza', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2821, 191, 'oblast'' di Pskov', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2822, 191, 'oblast'' di Rjazan''', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2823, 191, 'oblast'' di Rostov', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2824, 191, 'oblast'' di Sachalin', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2825, 191, 'oblast'' di Samara', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2826, 191, 'oblast'' di Saratov', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2827, 191, 'oblast'' di Smolensk', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2828, 191, 'oblast'' di Sverdlovsk', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2829, 191, 'oblast'' di Tambov', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2830, 191, 'oblast'' di Tjumen''', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2831, 191, 'oblast'' di Tula', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2832, 191, 'oblast'' di Tver''', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2833, 191, 'oblast'' di Vladimir', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2834, 191, 'oblast'' di Volgograd', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2835, 191, 'oblast'' di Vologda', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2836, 191, 'oblast'' di Voronež', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2837, 191, 'oblast'' di Čeljabinsk', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2838, 192, 'Kigali Province', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2839, 192, 'provincia Meridionale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2840, 192, 'provincia Occidentale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2841, 192, 'provincia Orientale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2842, 192, 'provincia Settentrionale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2843, 193, '''Asir', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2844, 193, 'Al Bahah Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2845, 193, 'Al Jawf Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2846, 193, 'Al-Qassim Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2847, 193, 'Al-Riyad', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2848, 193, 'Al-Sharqiyya', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2849, 193, 'Ha''il Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2850, 193, 'Jazan Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2851, 193, 'Mecca Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2852, 193, 'Medina Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2853, 193, 'Najran', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2854, 193, 'Northern Borders Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2855, 193, 'Tabuk', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2856, 194, 'Honiara', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2857, 194, 'provincia Centrale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2858, 194, 'provincia Occidentale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2859, 194, 'provincia di Choiseul', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2860, 194, 'provincia di Guadalcanal', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2861, 194, 'provincia di Isabel', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2862, 194, 'provincia di Makira-Ulawa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2863, 194, 'provincia di Malaita', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2864, 194, 'provincia di Rennell e Bellona', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2865, 194, 'provincia di Temotu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2866, 195, 'Anse Boileau', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2867, 195, 'Anse Etoile', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2868, 195, 'Anse Royale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2869, 195, 'Anse aux Pins', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2870, 195, 'Au Cap', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2871, 195, 'Baie Lazare', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2872, 195, 'Baie Sainte Anne', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2873, 195, 'Beau Vallon', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2874, 195, 'Bel Air', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2875, 195, 'Bel Ombre', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2876, 195, 'Cascade', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2877, 195, 'Glacis', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2878, 195, 'Grand Anse Mahe', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2879, 195, 'Grand Anse Praslin', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2880, 195, 'Ile Perseverance I', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2881, 195, 'Ile Perseverance II', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2882, 195, 'La Digue ed altre isole interne', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2883, 195, 'La Rivière Anglaise', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2884, 195, 'Les Mamelles', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2885, 195, 'Mont Buxton', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2886, 195, 'Mont Fleuri', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2887, 195, 'Outer Islands', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2888, 195, 'Plaisance', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2889, 195, 'Pointe La Rue', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2890, 195, 'Port Glaud', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2891, 195, 'Roche Caiman', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2892, 195, 'Saint Louis', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2893, 195, 'Takamaka', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2894, 196, 'Cassala', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2895, 196, 'Central Darfur', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2896, 196, 'Darfur Meridionale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2897, 196, 'Darfur Occidentale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2898, 196, 'Darfur Settentrionale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2899, 196, 'East Darfur', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2900, 196, 'Gadaref', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2901, 196, 'Gezira', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2902, 196, 'Khartum', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2903, 196, 'Kordofan Meridionale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2904, 196, 'Kordofan Occidentale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2905, 196, 'Kordofan Settentrionale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2906, 196, 'Mar Rosso', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2907, 196, 'Nilo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2908, 196, 'Nilo Azzurro', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2909, 196, 'Nilo Bianco', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2910, 196, 'Nord', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2911, 196, 'Sennar', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2912, 208, 'Alto Nilo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2913, 208, 'Bahr al-Ghazal Occidentale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2914, 208, 'Bahr al-Ghazal Settentrionale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2915, 208, 'Equatoria Centrale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2916, 208, 'Equatoria Occidentale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2917, 208, 'Equatoria Orientale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2918, 208, 'Jonglei', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2919, 208, 'Laghi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2920, 208, 'Unità', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2921, 208, 'Warrap', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2922, 197, 'Contea di Dalarna', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2923, 197, 'Contea di Gotland', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2924, 197, 'Contea di Kalmar', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2925, 197, 'Contea di Kronoberg', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2926, 197, 'Gävleborg', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2927, 197, 'Norrbotten', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2928, 197, 'Stockholm County', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2929, 197, 'Västerbotten', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2930, 197, 'Västernorrland', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2931, 197, 'Västmanland', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2932, 197, 'contea della Scania', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2933, 197, 'contea di Blekinge', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2934, 197, 'contea di Halland', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2935, 197, 'contea di Jämtland', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2936, 197, 'contea di Jönköping', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2937, 197, 'contea di Södermanland', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2938, 197, 'contea di Uppsala', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2939, 197, 'contea di Värmland', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2940, 197, 'contea di Västra Götaland', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2941, 197, 'contea di Östergötland', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2942, 197, 'Örebro', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2946, 200, 'Beltinci', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2947, 200, 'Benedikt', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2948, 200, 'Bisterza', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2949, 200, 'Bistrica ob Sotli', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2950, 200, 'Bloke', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2951, 200, 'Bohinj', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2952, 200, 'Borovnica', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2953, 200, 'Brda', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2954, 200, 'Brezovica', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2955, 200, 'Cankova', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2956, 200, 'Capodistria', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2957, 200, 'Celje', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2958, 200, 'Cerklje na Gorenjskem', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2959, 200, 'Cerkvenjak', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2960, 200, 'Circhina', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2961, 200, 'Cirkulane', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2962, 200, 'Commune di Ranziano-Voghersca', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2963, 200, 'Comune di Aidussina', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2964, 200, 'Comune di Canale d''Isonzo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2965, 200, 'Comune di Caporetto', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2966, 200, 'Comune di Longatico', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2967, 200, 'Comune di Loška Dolina', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2968, 200, 'Comune di Maribor', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2969, 200, 'Comune di Ruše', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2970, 200, 'Comune di Sevnica', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2971, 200, 'Comune di Trebnje', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2972, 200, 'Comune di Šentjur', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2973, 200, 'Destrnik', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2974, 200, 'Dobje', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2975, 200, 'Dobrepolje', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2976, 200, 'Dobrna', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2977, 200, 'Dobrova-Polhov Gradec', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2978, 200, 'Dobrovnik', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2979, 200, 'Dol pri Ljubljani', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2980, 200, 'Dolenjske Toplice', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2981, 200, 'Dornava', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2982, 200, 'Dravograd', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2983, 200, 'Duplek', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2984, 200, 'Gorenja vas-Poljane', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2985, 200, 'Gornja Radgona', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2986, 200, 'Gornji Grad', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2987, 200, 'Gornji Petrovci', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2988, 200, 'Grad', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2989, 200, 'Grosuplje', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2990, 200, 'Hajdina', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2991, 200, 'Hodos', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2992, 200, 'Horjul', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2993, 200, 'Hrastnik', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2994, 200, 'Hrpelje-Kozina', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2995, 200, 'Idria', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2996, 200, 'Ig', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2997, 200, 'Isola', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2998, 200, 'Jesenice', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (2999, 200, 'Jezersko', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3000, 200, 'Kamnik', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3001, 200, 'Kobilje', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3002, 200, 'Komen', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3003, 200, 'Komenda', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3004, 200, 'Kostanjevica na Krki', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3005, 200, 'Kostel', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3006, 200, 'Kozje', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3007, 200, 'Kranjska Gora', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3008, 200, 'Krško', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3009, 200, 'Kungota', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3010, 200, 'Kuzma', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3011, 200, 'Laško', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3012, 200, 'Lenart', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3013, 200, 'Lendava', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3014, 200, 'Litija', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3015, 200, 'Ljubno', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3016, 200, 'Ljutomer', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3017, 200, 'Log-Dragomer', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3018, 200, 'Lovrenc na Pohorju', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3019, 200, 'Lubiana', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3020, 200, 'Lukovica', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3021, 200, 'Makole', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3022, 200, 'Markovci', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3023, 200, 'Medvode', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3024, 200, 'Mestna Občina Novo mesto', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3025, 200, 'Metlika', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3026, 200, 'Miren-Kostanjevica', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3027, 200, 'Mirna Peč', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3028, 200, 'Mislinja', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3029, 200, 'Moravske Toplice', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3030, 200, 'Mozirje', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3031, 200, 'Murska Sobota', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3032, 200, 'Muta', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3033, 200, 'Naklo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3034, 200, 'Nazarje', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3035, 200, 'Nova Gorica', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3036, 200, 'Občina Apače', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3037, 200, 'Občina Bled', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3038, 200, 'Občina Bovec', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3039, 200, 'Občina Braslovče', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3040, 200, 'Občina Brežice', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3041, 200, 'Občina Divača', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3042, 200, 'Občina Domžale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3043, 200, 'Občina Gorišnica', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3044, 200, 'Občina Hoče-Slivnica', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3045, 200, 'Občina Ivančna Gorica', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3046, 200, 'Občina Juršinci', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3047, 200, 'Občina Kidričevo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3048, 200, 'Občina Kočevje', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3049, 200, 'Občina Križevci', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3050, 200, 'Občina Loški Potok', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3051, 200, 'Občina Luče', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3052, 200, 'Občina Majšperk', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3053, 200, 'Občina Mengeš', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3054, 200, 'Občina Mežica', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3055, 200, 'Občina Miklavž na Dravskem Polju', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3056, 200, 'Občina Moravče', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3057, 200, 'Občina Ormož', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3058, 200, 'Občina Podčetrtek', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3059, 200, 'Občina Poljčane', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3060, 200, 'Občina Radeče', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3061, 200, 'Občina Ravne na Koroškem', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3062, 200, 'Občina Razkrižje', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3063, 200, 'Občina Rače-Fram', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3064, 200, 'Občina Rečica ob Savinji', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3065, 200, 'Občina Rogaška Slatina', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3066, 200, 'Občina Rogašovci', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3067, 200, 'Občina Semič', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3068, 200, 'Občina Sežana', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3069, 200, 'Občina Sodražica', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3070, 200, 'Občina Središče ob Dravi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3071, 200, 'Občina Starše', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3072, 200, 'Občina Sveti Andraž v Slovenskih Goricah', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3073, 200, 'Občina Sveti Jurij ob Ščavnici', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3074, 200, 'Občina Tišina', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3075, 200, 'Občina Tolmin', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3076, 200, 'Občina Trnovska vas', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3077, 200, 'Občina Tržič', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3078, 200, 'Občina Turnišče', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3079, 200, 'Občina Velike Lašče', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3080, 200, 'Občina Veržej', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3081, 200, 'Občina Zavrč', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3082, 200, 'Občina Črenšovci', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3083, 200, 'Občina Šalovci', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3084, 200, 'Občina Šempeter-Vrtojba', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3085, 200, 'Občina Šentilj', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3086, 200, 'Občina Šentjernej', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3087, 200, 'Občina Šenčur', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3088, 200, 'Občina Škocjan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3089, 200, 'Občina Škofljica', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3090, 200, 'Občina Šmarje pri Jelšah', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3091, 200, 'Občina Šmartno ob Paki', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3092, 200, 'Občina Šmartno pri Litiji', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3093, 200, 'Občina Šoštanj', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3094, 200, 'Občina Štore', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3095, 200, 'Občina Žalec', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3096, 200, 'Občina Žetale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3097, 200, 'Občina Žiri', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3098, 200, 'Občina Žirovnica', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3099, 200, 'Občina Žužemberk', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3100, 200, 'Odranci', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3101, 200, 'Oplotnica', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3102, 200, 'Osilnica', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3103, 200, 'Pesnica', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3104, 200, 'Pirano', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3105, 200, 'Podlehnik', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3106, 200, 'Podvelka', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3107, 200, 'Polzela', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3108, 200, 'Postumia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3109, 200, 'Prebold', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3110, 200, 'Preddvor', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3111, 200, 'Prevalje', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3112, 200, 'Ptuj', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3113, 200, 'Puconci', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3114, 200, 'Radenci', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3115, 200, 'Radlje ob Dravi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3116, 200, 'Radovljica', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3117, 200, 'Ribnica', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3118, 200, 'Ribnica na Pohorju', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3119, 200, 'Rogatec', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3120, 200, 'San Pietro del Carso', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3121, 200, 'Selnica ob Dravi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3122, 200, 'Slovenj Gradec', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3123, 200, 'Slovenska Bistrica', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3124, 200, 'Slovenske Konjice', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3125, 200, 'Solčava', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3126, 200, 'Sveta Ana', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3127, 200, 'Tabor', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3128, 200, 'Trbovlje', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3129, 200, 'Trzin', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3130, 200, 'Velenje', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3131, 200, 'Velika Polana', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3132, 200, 'Videm', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3133, 200, 'Vipava', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3134, 200, 'Vitanje', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3135, 200, 'Vodice', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3136, 200, 'Vojnik', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3137, 200, 'Vransko', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3138, 200, 'Vrhnika', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3139, 200, 'Vuzenica', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3140, 200, 'Zagorje ob Savi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3141, 200, 'Zreče', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3142, 200, 'Črna na Koroškem', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3143, 200, 'Črnomelj', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3144, 200, 'Škofja Loka', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3145, 200, 'Železniki', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3146, 202, 'Trencin', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3147, 202, 'regione di Banská Bystrica', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3148, 202, 'regione di Bratislava', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3149, 202, 'regione di Košice', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3150, 202, 'regione di Nitra', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3151, 202, 'regione di Prešov', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3152, 202, 'regione di Trnava', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3153, 202, 'regione di Žilina', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3154, 203, 'Area occidentale della Sierra Leone', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3155, 203, 'North West Province', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3156, 203, 'provincia del Nord', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3157, 203, 'provincia del Sud', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3158, 203, 'provincia dell''Est', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3159, 204, 'Acquaviva', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3160, 204, 'Borgo Maggiore', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3161, 204, 'Castello di Domagnano', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3162, 204, 'Castello di San Marino Città', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3163, 204, 'Chiesanuova', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3164, 204, 'Faetano', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3165, 204, 'Fiorentino', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3166, 204, 'Montegiardino', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3167, 204, 'Serravalle', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3168, 205, 'Dakar', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3169, 205, 'Fatick', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3170, 205, 'Kaffrine', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3171, 205, 'Kolda', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3172, 205, 'Louga', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3173, 205, 'Matam', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3174, 205, 'Regione di Diourbel', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3175, 205, 'Regione di Kaolack', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3176, 205, 'Région de Kédougou', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3177, 205, 'Région de Thiès', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3178, 205, 'Saint-Louis', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3179, 205, 'Sédhiou', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3180, 205, 'Ziguinchor', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3181, 205, 'regione di Tambacounda', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3182, 206, 'Commissariat de l’Uebi Scebeli', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3183, 206, 'Gobolka Awdal', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3184, 206, 'Gobolka Bakool', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3185, 206, 'Gobolka Banaadir', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3186, 206, 'Gobolka Bari', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3187, 206, 'Gobolka Bay', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3188, 206, 'Gobolka Galguduud', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3189, 206, 'Gobolka Gedo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3190, 206, 'Gobolka Jubbada Dhexe', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3191, 206, 'Gobolka Jubbada Hoose', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3192, 206, 'Gobolka Mudug', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3193, 206, 'Gobolka Nugaal', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3194, 206, 'Gobolka Sanaag', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3195, 206, 'Gobolka Shabeellaha Dhexe', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3196, 206, 'Gobolka Shabeellaha Hoose', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3197, 206, 'Gobolka Sool', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3198, 206, 'Gobolka Togdheer', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3199, 206, 'Gobolka Woqooyi Galbeed', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3200, 207, 'distretto del Commewijne', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3201, 207, 'distretto del Marowijne', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3202, 207, 'distretto del Nickerie', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3203, 207, 'distretto del Para', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3204, 207, 'distretto del Saramacca', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3205, 207, 'distretto del Sipaliwini', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3206, 207, 'distretto di Brokopondo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3207, 207, 'distretto di Coronie', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3208, 207, 'distretto di Paramaribo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3209, 207, 'distretto di Wanica', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3210, 209, 'Príncipe', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3211, 209, 'São Tomé', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3212, 210, 'Departamento de Ahuachapán', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3213, 210, 'Departamento de Cabañas', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3214, 210, 'Departamento de Cuscatlán', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3215, 210, 'Departamento de La Unión', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3216, 210, 'Departamento de Morazán', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3217, 210, 'Departamento de Usulután', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3218, 210, 'La Paz', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3219, 210, 'dipartimento di Chalatenango', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3220, 210, 'dipartimento di La Libertad', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3221, 210, 'dipartimento di San Miguel', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3222, 210, 'dipartimento di San Salvador', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3223, 210, 'dipartimento di San Vicente', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3224, 210, 'dipartimento di Santa Ana', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3225, 210, 'dipartimento di Sonsonate', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3226, 212, 'Ar-Raqqah Governorate', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3227, 212, 'governatorato del Rif di Damasco', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3228, 212, 'governatorato di Aleppo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3229, 212, 'governatorato di Damasco', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3230, 212, 'governatorato di Dar''a', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3231, 212, 'governatorato di Deir el-Zor', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3232, 212, 'governatorato di Hama', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3233, 212, 'governatorato di Homs', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3234, 212, 'governatorato di Idlib', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3235, 212, 'governatorato di Latakia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3236, 212, 'governatorato di Quneitra', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3237, 212, 'governatorato di Tartus', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3238, 212, 'governatorato di al-Hasaka', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3239, 212, 'governatorato di al-Suwayda', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3240, 213, 'Shiselweni District', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3241, 213, 'distretto di Hhohho', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3242, 213, 'distretto di Lubombo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3243, 213, 'distretto di Manzini', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3244, 215, 'Province du Barh-El-Gazel', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3245, 215, 'Ville de N''Djamena', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3246, 215, 'provincia del Lago', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3247, 215, 'provincia del Logone Occidentale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3248, 215, 'provincia del Logone Orientale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3249, 215, 'provincia del Salamat', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3250, 215, 'provincia del Sila', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3251, 215, 'provincia di Batha', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3252, 215, 'provincia di Borkou', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3253, 215, 'provincia di Chari-Baguirmi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3254, 215, 'provincia di Ennedi Est', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3255, 215, 'provincia di Ennedi Ovest', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3256, 215, 'provincia di Guéra', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3257, 215, 'provincia di Hadjer-Lamis', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3258, 215, 'provincia di Kanem', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3259, 215, 'provincia di Mandoul', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3260, 215, 'provincia di Mayo-Kebbi Est', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3261, 215, 'provincia di Moyen-Chari', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3262, 215, 'provincia di Ouaddaï', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3263, 215, 'provincia di Tandjilé', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3264, 215, 'provincia di Tibesti', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3265, 215, 'provincia di Wadi Fira', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3266, 215, 'regione di Mayo-Kebbi Ovest', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3272, 217, 'regione Centrale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3273, 217, 'regione Marittima', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3274, 217, 'regione degli Altopiani', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3275, 217, 'regione delle Savane', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3276, 217, 'regione di Kara', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3277, 218, 'Bangkok', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3278, 218, 'Changwat Ang Thong', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3279, 218, 'Changwat Nan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3280, 218, 'Changwat Nonthaburi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3281, 218, 'Changwat Trang', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3282, 218, 'Changwat Trat', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3283, 218, 'Changwat Uthai Thani', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3284, 218, 'provincia di Amnat Charoen', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3285, 218, 'provincia di Ayutthaya', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3286, 218, 'provincia di Bueng Kan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3287, 218, 'provincia di Buri Ram', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3288, 218, 'provincia di Chachoengsao', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3289, 218, 'provincia di Chainat', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3290, 218, 'provincia di Chaiyaphum', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3291, 218, 'provincia di Chanthaburi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3292, 218, 'provincia di Chiang Mai', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3293, 218, 'provincia di Chiang Rai', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3294, 218, 'provincia di Chonburi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3295, 218, 'provincia di Chumphon', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3296, 218, 'provincia di Kalasin', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3297, 218, 'provincia di Kamphaeng Phet', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3298, 218, 'provincia di Kanchanaburi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3299, 218, 'provincia di Khǭnkǣn', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3300, 218, 'provincia di Krabi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3301, 218, 'provincia di Lampang', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3302, 218, 'provincia di Lamphun', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3303, 218, 'provincia di Loei', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3304, 218, 'provincia di Lopburi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3305, 218, 'provincia di Mae Hong Son', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3306, 218, 'provincia di Maha Sarakham', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3307, 218, 'provincia di Mukdahan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3308, 218, 'provincia di Nakhon Nayok', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3309, 218, 'provincia di Nakhon Pathom', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3310, 218, 'provincia di Nakhon Phanom', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3311, 218, 'provincia di Nakhon Ratchasima', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3312, 218, 'provincia di Nakhon Sawan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3313, 218, 'provincia di Nakhon Si Thammarat', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3314, 218, 'provincia di Narathiwat', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3315, 218, 'provincia di Nǭngbūalamphū', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3316, 218, 'provincia di Nǭngkhāi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3317, 218, 'provincia di Pathum Thani', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3318, 218, 'provincia di Pattani', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3319, 218, 'provincia di Phang Nga', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3320, 218, 'provincia di Phatthalung', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3321, 218, 'provincia di Phayao', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3322, 218, 'provincia di Phetchabun', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3323, 218, 'provincia di Phetchaburi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3324, 218, 'provincia di Phichit', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3325, 218, 'provincia di Phitsanulok', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3326, 218, 'provincia di Phrae', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3327, 218, 'provincia di Phuket', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3328, 218, 'provincia di Prachinburi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3329, 218, 'provincia di Prachuap Khiri Khan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3330, 218, 'provincia di Ranong', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3331, 218, 'provincia di Ratchaburi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3332, 218, 'provincia di Rayong', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3333, 218, 'provincia di Roi Et', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3334, 218, 'provincia di Sa Kaeo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3335, 218, 'provincia di Sakon Nakhon', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3336, 218, 'provincia di Samut Prakan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3337, 218, 'provincia di Samut Sakhon', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3338, 218, 'provincia di Samut Songkhram', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3339, 218, 'provincia di Saraburi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3340, 218, 'provincia di Satun', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3341, 218, 'provincia di Sing Buri', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3342, 218, 'provincia di Sisaket', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3343, 218, 'provincia di Songkhla', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3344, 218, 'provincia di Sukhothai', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3345, 218, 'provincia di Suphanburi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3346, 218, 'provincia di Surat Thani', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3347, 218, 'provincia di Surin', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3348, 218, 'provincia di Tak', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3349, 218, 'provincia di Ubon Ratchathani', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3350, 218, 'provincia di Udon Thani', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3351, 218, 'provincia di Uttaradit', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3352, 218, 'provincia di Yala', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3353, 218, 'provincia di Yasothon', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3354, 219, 'Chatlon', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3355, 219, 'Districts of Republican Subordination', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3356, 219, 'Dushanbe', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3357, 219, 'Gorno-Badakhshan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3358, 219, 'Viloyati Sughd', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3362, 221, 'Ermera', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3363, 221, 'Kovalima', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3364, 221, 'Manufahi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3365, 221, 'Oecusse', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3366, 221, 'distretto di Aileu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3367, 221, 'distretto di Ainaro', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3368, 221, 'distretto di Baucau', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3369, 221, 'distretto di Bobonaro', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3370, 221, 'distretto di Dili', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3371, 221, 'distretto di Lautém', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3372, 221, 'distretto di Liquiçá', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3373, 221, 'distretto di Manatuto', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3374, 221, 'distretto di Viqueque', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3375, 222, 'Ashgabat', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3376, 222, 'Daşoguz Welaýaty', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3377, 222, 'Provincia di Ahal', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3378, 222, 'Provincia di Balkan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3379, 222, 'Provincia di Lebap', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3380, 222, 'Provincia di Mary', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3381, 223, 'Gouvernorat de Béja', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3382, 223, 'governatorato del Kef', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3383, 223, 'governatorato di Ariana', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3384, 223, 'governatorato di Ben Arous', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3385, 223, 'governatorato di Biserta', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3386, 223, 'governatorato di Gabès', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3387, 223, 'governatorato di Gafsa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3388, 223, 'governatorato di Jendouba', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3389, 223, 'governatorato di Kairouan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3390, 223, 'governatorato di Kasserine', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3391, 223, 'governatorato di Kébili', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3392, 223, 'governatorato di Mahdia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3393, 223, 'governatorato di Manouba', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3394, 223, 'governatorato di Monastir', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3395, 223, 'governatorato di Médenine', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3396, 223, 'governatorato di Nabeul', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3397, 223, 'governatorato di Sfax', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3398, 223, 'governatorato di Sidi Bouzid', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3399, 223, 'governatorato di Siliana', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3400, 223, 'governatorato di Susa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3401, 223, 'governatorato di Tataouine', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3402, 223, 'governatorato di Tozeur', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3403, 223, 'governatorato di Tunisi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3404, 223, 'governatorato di Zaghouan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3405, 224, 'EUA', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3406, 224, 'Ha‘apai', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3407, 224, 'Isole Niua', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3408, 224, 'Tongatapu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3409, 224, 'Vava‘u', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3410, 225, 'Antalya', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3411, 225, 'Düzce', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3412, 225, 'Kars', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3413, 225, 'Provincia di Adana', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3414, 225, 'Provincia di Artvin', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3415, 225, 'Provincia di Denizli', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3416, 225, 'Provincia di Muğla', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3417, 225, 'provincia di Adıyaman', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3418, 225, 'provincia di Afyonkarahisar', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3419, 225, 'provincia di Aksaray', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3420, 225, 'provincia di Amasya', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3421, 225, 'provincia di Ankara', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3422, 225, 'provincia di Ardahan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3423, 225, 'provincia di Aydın', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3424, 225, 'provincia di Ağrı', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3425, 225, 'provincia di Balıkesir', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3426, 225, 'provincia di Bartın', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3427, 225, 'provincia di Batman', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3428, 225, 'provincia di Bayburt', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3429, 225, 'provincia di Bilecik', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3430, 225, 'provincia di Bingöl', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3431, 225, 'provincia di Bitlis', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3432, 225, 'provincia di Bolu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3433, 225, 'provincia di Burdur', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3434, 225, 'provincia di Bursa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3435, 225, 'provincia di Diyarbakır', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3436, 225, 'provincia di Edirne', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3437, 225, 'provincia di Elâzığ', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3438, 225, 'provincia di Erzincan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3439, 225, 'provincia di Erzurum', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3440, 225, 'provincia di Eskişehir', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3441, 225, 'provincia di Gaziantep', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3442, 225, 'provincia di Giresun', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3443, 225, 'provincia di Gümüşhane', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3444, 225, 'provincia di Hakkâri', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3445, 225, 'provincia di Hatay', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3446, 225, 'provincia di Isparta', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3447, 225, 'provincia di Istanbul', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3448, 225, 'provincia di Iğdır', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3449, 225, 'provincia di Kahramanmaraş', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3450, 225, 'provincia di Karabük', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3451, 225, 'provincia di Karaman', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3452, 225, 'provincia di Kastamonu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3453, 225, 'provincia di Kayseri', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3454, 225, 'provincia di Kilis', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3455, 225, 'provincia di Kocaeli', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3456, 225, 'provincia di Konya', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3457, 225, 'provincia di Kütahya', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3458, 225, 'provincia di Kırklareli', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3459, 225, 'provincia di Kırıkkale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3460, 225, 'provincia di Kırşehir', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3461, 225, 'provincia di Malatya', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3462, 225, 'provincia di Manisa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3463, 225, 'provincia di Mardin', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3464, 225, 'provincia di Mersin', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3465, 225, 'provincia di Muş', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3466, 225, 'provincia di Nevşehir', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3467, 225, 'provincia di Niğde', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3468, 225, 'provincia di Ordu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3469, 225, 'provincia di Osmaniye', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3470, 225, 'provincia di Rize', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3471, 225, 'provincia di Sakarya', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3472, 225, 'provincia di Samsun', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3473, 225, 'provincia di Siirt', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3474, 225, 'provincia di Sinope', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3475, 225, 'provincia di Sivas', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3476, 225, 'provincia di Smirne', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3477, 225, 'provincia di Tekirdağ', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3478, 225, 'provincia di Tokat', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3479, 225, 'provincia di Trebisonda', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3480, 225, 'provincia di Tunceli', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3481, 225, 'provincia di Uşak', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3482, 225, 'provincia di Van', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3483, 225, 'provincia di Yalova', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3484, 225, 'provincia di Yozgat', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3485, 225, 'provincia di Zonguldak', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3486, 225, 'provincia di Çanakkale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3487, 225, 'provincia di Çankırı', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3488, 225, 'provincia di Çorum', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3489, 225, 'provincia di Şanlıurfa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3490, 225, 'provincia di Şırnak', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3491, 226, 'Arima', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3492, 226, 'Chaguanas', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3493, 226, 'City of Port of Spain', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3494, 226, 'Mayaro', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3495, 226, 'Penal/Debe', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3496, 226, 'Point Fortin', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3497, 226, 'San Fernando', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3498, 226, 'San Juan/Laventille', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3499, 226, 'Tobago', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3500, 226, 'Tunapuna/Piarco', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3501, 226, 'regione di Couva-Tabaquite-Talparo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3502, 226, 'regione di Diego Martin', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3503, 226, 'regione di Princes Town', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3504, 226, 'regione di Sangre Grande', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3505, 226, 'regione di Siparia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3506, 227, 'Funafuti', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3507, 227, 'Nanumaga', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3508, 227, 'Nanumea', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3509, 227, 'Niutao', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3510, 227, 'Nui', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3511, 227, 'Nukufetau', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3512, 227, 'Nukulaelae', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3513, 227, 'Vaitupu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3514, 228, 'Fukien', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3515, 228, 'Kaohsiung', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3516, 228, 'Taipei', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3517, 228, 'Taiwan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3518, 229, 'Pemba North Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3519, 229, 'Pemba South Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3520, 229, 'Regione del Simiyu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3521, 229, 'Regione di Geita', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3522, 229, 'Regione di Katavi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3523, 229, 'Regione di Njombe', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3524, 229, 'Songwe', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3525, 229, 'Zanzibar Central/South Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3526, 229, 'Zanzibar North Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3527, 229, 'Zanzibar Urban/West Region', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3528, 229, 'regione del Kagera', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3529, 229, 'regione del Kilimangiaro', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3530, 229, 'regione del Manyara', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3531, 229, 'regione del Mara', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3532, 229, 'regione del Ruvuma', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3533, 229, 'regione di Arusha', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3534, 229, 'regione di Dar es Salaam', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3535, 229, 'regione di Dodoma', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3536, 229, 'regione di Iringa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3537, 229, 'regione di Kigoma', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3538, 229, 'regione di Lindi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3539, 229, 'regione di Mbeya', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3540, 229, 'regione di Morogoro', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3541, 229, 'regione di Mtwara', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3542, 229, 'regione di Mwanza', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3543, 229, 'regione di Pwani', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3544, 229, 'regione di Rukwa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3545, 229, 'regione di Shinyanga', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3546, 229, 'regione di Singida', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3547, 229, 'regione di Tabora', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3548, 229, 'regione di Tanga', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3549, 230, 'Chernivtsi Oblast', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3550, 230, 'Dnipropetrovsk Oblast', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3551, 230, 'Misto Kyiv', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3552, 230, 'Oblast di Kyiv', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3553, 230, 'Oblast'' di Cherson', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3554, 230, 'Repubblica autonoma di Crimea', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3555, 230, 'Rivnenska Oblast', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3556, 230, 'Sebastopol City', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3557, 230, 'Zhytomyrska Oblast', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3558, 230, 'oblast'' di Charkiv', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3559, 230, 'oblast'' di Chmel''nyc''kyj', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3560, 230, 'oblast'' di Donec''k', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3561, 230, 'oblast'' di Ivano-Frankivs''k', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3562, 230, 'oblast'' di Kirovohrad', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3563, 230, 'oblast'' di Leopoli', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3564, 230, 'oblast'' di Luhans''k', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3565, 230, 'oblast'' di Mykolaïv', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3566, 230, 'oblast'' di Odessa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3567, 230, 'oblast'' di Poltava', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3568, 230, 'oblast'' di Sumy', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3569, 230, 'oblast'' di Ternopil''', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3570, 230, 'oblast'' di Transcarpazia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3571, 230, 'oblast'' di Vinnycja', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3572, 230, 'oblast'' di Volinia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3573, 230, 'oblast'' di Zaporižžja', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3574, 230, 'oblast'' di Čerkasy', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3575, 230, 'oblast'' di Černihiv', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3576, 231, 'Regione Centrale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3577, 231, 'Regione occidentale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3578, 231, 'Regione orientale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3579, 231, 'Regione settentrionale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3589, 233, 'Alabama', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3590, 233, 'Alaska', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3591, 233, 'Arizona', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3592, 233, 'Arkansas', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3593, 233, 'California', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3594, 233, 'Carolina del Nord', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3595, 233, 'Carolina del Sud', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3596, 233, 'Colorado', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3597, 233, 'Connecticut', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3598, 233, 'Dakota del Nord', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3599, 233, 'Dakota del Sud', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3600, 233, 'Delaware', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3601, 233, 'Distretto di Columbia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3602, 233, 'Florida', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3603, 233, 'Georgia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3604, 233, 'Hawaii', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3605, 233, 'Idaho', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3606, 233, 'Illinois', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3607, 233, 'Indiana', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3608, 233, 'Iowa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3609, 233, 'Kansas', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3610, 233, 'Kentucky', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3611, 233, 'Louisiana', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3612, 233, 'Maine', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3613, 233, 'Maryland', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3614, 233, 'Massachusetts', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3615, 233, 'Minnesota', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3616, 233, 'Mississippi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3617, 233, 'Montana', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3618, 233, 'Nebraska', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3619, 233, 'Nevada', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3620, 233, 'New Hampshire', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3621, 233, 'New Jersey', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3622, 233, 'New York', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3623, 233, 'Nuovo Messico', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3624, 233, 'Ohio', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3625, 233, 'Oklahoma', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3626, 233, 'Oregon', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3627, 233, 'Pennsylvania', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3628, 233, 'Rhode Island', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3629, 233, 'Tennessee', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3630, 233, 'Texas', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3631, 233, 'Utah', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3632, 233, 'Vermont', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3633, 233, 'Virginia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3634, 233, 'Virginia Occidentale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3635, 233, 'Wisconsin', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3636, 233, 'Wyoming', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3637, 234, 'Departamento de Flores', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3638, 234, 'dipartimento di Artigas', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3639, 234, 'dipartimento di Canelones', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3640, 234, 'dipartimento di Cerro Largo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3641, 234, 'dipartimento di Colonia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3642, 234, 'dipartimento di Durazno', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3643, 234, 'dipartimento di Florida', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3644, 234, 'dipartimento di Lavalleja', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3645, 234, 'dipartimento di Maldonado', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3646, 234, 'dipartimento di Montevideo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3647, 234, 'dipartimento di Paysandú', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3648, 234, 'dipartimento di Rivera', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3649, 234, 'dipartimento di Rocha', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3650, 234, 'dipartimento di Río Negro', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3651, 234, 'dipartimento di Salto', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3652, 234, 'dipartimento di San José', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3653, 234, 'dipartimento di Soriano', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3654, 234, 'dipartimento di Tacuarembó', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3655, 234, 'dipartimento di Treinta y Tres', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3656, 235, 'Karakalpakstan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3657, 235, 'Tashkent', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3658, 235, 'regione di Andijan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3659, 235, 'regione di Bukhara', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3660, 235, 'regione di Fergana', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3661, 235, 'regione di Jizzax', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3662, 235, 'regione di Kashkadarya', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3663, 235, 'regione di Khorezm', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3664, 235, 'regione di Namangan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3665, 235, 'regione di Navoiy', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3666, 235, 'regione di Samarcanda', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3667, 235, 'regione di Sirdarya', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3668, 235, 'regione di Surkhandarya', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3669, 235, 'regione di Tashkent', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3670, 237, 'parrocchia delle Grenadine', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3671, 237, 'parrocchia di Charlotte', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3672, 237, 'parrocchia di Saint Andrew', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3673, 237, 'parrocchia di Saint David', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3674, 237, 'parrocchia di Saint George', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3675, 237, 'parrocchia di Saint Patrick', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3676, 238, 'Delta Amacuro', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3677, 238, 'Dependencias Federales', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3678, 238, 'Distretto Capitale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3679, 238, 'Estado Amazonas', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3680, 238, 'Estado Anzoátegui', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3681, 238, 'Estado Apure', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3682, 238, 'Estado Aragua', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3683, 238, 'Estado Barinas', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3684, 238, 'Estado Bolívar', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3685, 238, 'Estado Carabobo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3686, 238, 'Estado Cojedes', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3687, 238, 'Estado Falcón', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3688, 238, 'Estado Guárico', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3689, 238, 'Estado La Guaira', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3690, 238, 'Estado Lara', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3691, 238, 'Estado Monagas', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3692, 238, 'Estado Mérida', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3693, 238, 'Estado Nueva Esparta', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3694, 238, 'Estado Portuguesa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3695, 238, 'Estado Sucre', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3696, 238, 'Estado Trujillo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3697, 238, 'Estado Táchira', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3698, 238, 'Estado Yaracuy', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3699, 238, 'Estado Zulia', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3700, 238, 'Miranda', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3704, 241, 'Cần Thơ', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3705, 241, 'Da Nang', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3706, 241, 'Haiphong', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3707, 241, 'Hanoi', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3708, 241, 'Ho Chi Minh', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3709, 241, 'Hậu Giang Province', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3710, 241, 'Thừa Thiên Huế', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3711, 241, 'Tỉnh Bắc Kạn', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3712, 241, 'Tỉnh Hà Nam', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3713, 241, 'Tỉnh Hòa Bình', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3714, 241, 'Tỉnh Hải Dương', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3715, 241, 'Tỉnh Kiến Giang', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3716, 241, 'Tỉnh Nghệ An', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3717, 241, 'Tỉnh Ninh Bình', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3718, 241, 'Tỉnh Trà Vinh', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3719, 241, 'Tỉnh Yên Bái', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3720, 241, 'Tỉnh Ðiện Biên', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3721, 241, 'provincia di An Giang', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3722, 241, 'provincia di Ba Ria-Vung Tau', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3723, 241, 'provincia di Bac Giang', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3724, 241, 'provincia di Bac Lieu', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3725, 241, 'provincia di Bac Ninh', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3726, 241, 'provincia di Ben Tre', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3727, 241, 'provincia di Binh Dinh', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3728, 241, 'provincia di Binh Duong', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3729, 241, 'provincia di Binh Phuoc', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3730, 241, 'provincia di Binh Thuan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3731, 241, 'provincia di Ca Mau', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3732, 241, 'provincia di Cao Bang', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3733, 241, 'provincia di Dak Lak', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3734, 241, 'provincia di Dong Nai', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3735, 241, 'provincia di Dong Thap', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3736, 241, 'provincia di Gia Lai', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3737, 241, 'provincia di Ha Giang', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3738, 241, 'provincia di Ha Tinh', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3739, 241, 'provincia di Hung Yen', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3740, 241, 'provincia di Khanh Hoa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3741, 241, 'provincia di Kon Tum', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3742, 241, 'provincia di Lai Chau', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3743, 241, 'provincia di Lam Dong', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3744, 241, 'provincia di Lang Son', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3745, 241, 'provincia di Lao Cai', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3746, 241, 'provincia di Long An', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3747, 241, 'provincia di Nam Dinh', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3748, 241, 'provincia di Ninh Thuan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3749, 241, 'provincia di Phu Tho', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3750, 241, 'provincia di Phu Yen', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3751, 241, 'provincia di Quang Binh', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3752, 241, 'provincia di Quang Nam', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3753, 241, 'provincia di Quang Ngai', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3754, 241, 'provincia di Quang Ninh', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3755, 241, 'provincia di Quang Tri', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3756, 241, 'provincia di Soc Trang', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3757, 241, 'provincia di Son La', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3758, 241, 'provincia di Tay Ninh', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3759, 241, 'provincia di Thai Binh', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3760, 241, 'provincia di Thai Nguyen', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3761, 241, 'provincia di Thanh Hoa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3762, 241, 'provincia di Tien Giang', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3763, 241, 'provincia di Tuyen Quang', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3764, 241, 'provincia di Vinh Long', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3765, 241, 'provincia di Vinh Phuc', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3766, 241, 'Ðắk Nông', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3767, 242, 'Malampa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3768, 242, 'Penama', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3769, 242, 'Sanma', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3770, 242, 'Shefa Province', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3771, 242, 'Tafea', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3772, 242, 'Torba', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3776, 244, 'A''ana', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3777, 244, 'Aiga-i-le-Tai', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3778, 244, 'Atua', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3779, 244, 'Fa''asaleleaga', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3780, 244, 'Gaga''emauga', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3781, 244, 'Gaga''ifomauga', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3782, 244, 'Palauli', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3783, 244, 'Satupa''itea', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3784, 244, 'Tuamasaga', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3785, 244, 'Va''a-o-Fonoti', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3786, 244, 'Vaisigano', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3787, 245, 'Amanat alasimah', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3788, 245, 'Governorate Number One', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3789, 245, 'governatorato di ''Amran', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3790, 245, 'governatorato di Abyan', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3791, 245, 'governatorato di Dhamar', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3792, 245, 'governatorato di Hadramawt', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3793, 245, 'governatorato di Hajja', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3794, 245, 'governatorato di Ibb', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3795, 245, 'governatorato di Lahij', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3796, 245, 'governatorato di Ma''rib', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3797, 245, 'governatorato di Rayma', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3798, 245, 'governatorato di Sa''da', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3799, 245, 'governatorato di San''a''', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3800, 245, 'governatorato di Shabwa', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3801, 245, 'governatorato di Socotra', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3802, 245, 'governatorato di Ta''izz', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3803, 245, 'governatorato di al-Bayda''', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3804, 245, 'governatorato di al-Dali''', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3805, 245, 'governatorato di al-Hudayda', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3806, 245, 'governatorato di al-Jawf', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3807, 245, 'governatorato di al-Mahra', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3808, 245, 'governatorato di al-Mahwit', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3826, 247, 'Free State', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3827, 247, 'Gauteng', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3828, 247, 'KwaZulu-Natal', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3829, 247, 'Mpumalanga', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3830, 247, 'provincia del Capo Occidentale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3831, 247, 'provincia del Capo Orientale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3832, 247, 'provincia del Capo Settentrionale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3833, 247, 'provincia del Limpopo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3834, 247, 'provincia del Nordovest', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3835, 248, 'North-Western Province', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3836, 248, 'Provincia di Muchinga', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3837, 248, 'Provincia orientale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3838, 248, 'provincia Centrale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3839, 248, 'provincia Meridionale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3840, 248, 'provincia Occidentale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3841, 248, 'provincia Settentrionale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3842, 248, 'provincia di Copperbelt', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3843, 248, 'provincia di Luapula', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3844, 248, 'provincia di Lusaka', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3845, 249, 'Bulawayo Province', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3846, 249, 'Harare Province', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3847, 249, 'Provincia di Masvingo', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3848, 249, 'provincia del Manicaland', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3849, 249, 'provincia del Mashonaland Centrale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3850, 249, 'provincia del Mashonaland Occidentale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3851, 249, 'provincia del Mashonaland Orientale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3852, 249, 'provincia del Matabeleland Meridionale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3853, 249, 'provincia del Matabeleland Settentrionale', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3854, 249, 'provincia delle Midland', '2025-06-26 11:49:36.401433');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3859, 236, 'Città del Vaticano', '2025-06-26 15:37:48.555203');
INSERT INTO "public"."subdivisions" ("id", "country_id", "name", "created_at") VALUES (3860, 198, 'Singapore', '2025-06-26 15:37:48.555203');
COMMIT;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS "public"."users";
CREATE TABLE "public"."users" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "email" text COLLATE "pg_catalog"."default" NOT NULL,
  "email_verified" bool NOT NULL,
  "image" text COLLATE "pg_catalog"."default",
  "role" text COLLATE "pg_catalog"."default",
  "created_at" timestamp(6) NOT NULL,
  "updated_at" timestamp(6) NOT NULL,
  "banned" bool,
  "ban_reason" text COLLATE "pg_catalog"."default",
  "ban_expires" timestamp(6),
  "status" "public"."user_status" NOT NULL DEFAULT 'waiting-for-approval'::user_status
)
;
ALTER TABLE "public"."users" OWNER TO "postgres";

-- ----------------------------
-- Records of users
-- ----------------------------
BEGIN;
INSERT INTO "public"."users" ("id", "name", "email", "email_verified", "image", "role", "created_at", "updated_at", "banned", "ban_reason", "ban_expires", "status") VALUES ('qPSsbIL4EOqM48BsrcjvQBJd43UGQwvx', 'dev 0', 'dev@mokkastudios.com', 't', NULL, 'admin', '2025-06-23 14:21:40.123', '2025-06-23 14:21:40.123', NULL, NULL, NULL, 'waiting-for-approval');
INSERT INTO "public"."users" ("id", "name", "email", "email_verified", "image", "role", "created_at", "updated_at", "banned", "ban_reason", "ban_expires", "status") VALUES ('7FfguPdOCplD0CSxSsKsOlTcIvkzjn2K', 'dev 1', 'dev1@mokkastudios.com', 't', NULL, 'admin', '2025-06-23 14:21:03.681', '2025-06-23 14:21:03.681', NULL, NULL, NULL, 'waiting-for-approval');
INSERT INTO "public"."users" ("id", "name", "email", "email_verified", "image", "role", "created_at", "updated_at", "banned", "ban_reason", "ban_expires", "status") VALUES ('7Raq7QuyjE7ym59FhIiR59efYAlvOeJp', 'mo 1', 'carmen@uh17.it', 't', NULL, 'admin', '2025-06-25 08:38:26.237', '2025-06-25 08:38:26.237', NULL, NULL, NULL, 'waiting-for-approval');
INSERT INTO "public"."users" ("id", "name", "email", "email_verified", "image", "role", "created_at", "updated_at", "banned", "ban_reason", "ban_expires", "status") VALUES ('UegmCXJMVpje71qgOqTjRA5ZB9W8YirZ', 'mo 2', 'orsola.cacciadominioni@gmail.com', 't', NULL, 'admin', '2025-06-25 08:38:59.374', '2025-06-25 08:38:59.374', NULL, NULL, NULL, 'waiting-for-approval');
INSERT INTO "public"."users" ("id", "name", "email", "email_verified", "image", "role", "created_at", "updated_at", "banned", "ban_reason", "ban_expires", "status") VALUES ('WOIITxYuXrybPj7IdeiPw5VQUhtttefl', 'mo 3', 'cpaolo59@gmail.com', 't', NULL, 'admin', '2025-06-25 08:39:21.434', '2025-06-25 08:39:21.434', NULL, NULL, NULL, 'waiting-for-approval');
INSERT INTO "public"."users" ("id", "name", "email", "email_verified", "image", "role", "created_at", "updated_at", "banned", "ban_reason", "ban_expires", "status") VALUES ('XKhiGjTht1pd4Ge7oB1m1TTHCsHvwjNA', 'dev 1', 'a.truffo@mokkastudios.com', 't', NULL, 'admin', '2025-06-25 08:41:05.945', '2025-06-25 08:41:05.945', NULL, NULL, NULL, 'waiting-for-approval');
INSERT INTO "public"."users" ("id", "name", "email", "email_verified", "image", "role", "created_at", "updated_at", "banned", "ban_reason", "ban_expires", "status") VALUES ('42El0wMZG4fdVf7lp7d5v7ccvHZJywv6', 'Leo', 'leonardo+1@filli.it', 'f', NULL, 'admin', '2025-06-27 13:43:22.011', '2025-06-27 13:43:22.011', NULL, NULL, NULL, 'waiting-for-approval');
INSERT INTO "public"."users" ("id", "name", "email", "email_verified", "image", "role", "created_at", "updated_at", "banned", "ban_reason", "ban_expires", "status") VALUES ('f8NbEUJ88icpxntUkpj8m1bChJjRZrKM', 'Leonardo', 'leonardo+2@filli.it', 'f', NULL, 'admin', '2025-06-27 14:17:49.637', '2025-06-27 14:17:49.637', NULL, NULL, NULL, 'waiting-for-approval');
INSERT INTO "public"."users" ("id", "name", "email", "email_verified", "image", "role", "created_at", "updated_at", "banned", "ban_reason", "ban_expires", "status") VALUES ('31RubGSMGbYAnuvGbZCAjFBgJoV8P1t8', 'Leo', 'leonardo+3@filli.it', 'f', NULL, 'admin', '2025-06-27 14:32:11.171', '2025-06-27 14:32:11.171', NULL, NULL, NULL, 'waiting-for-approval');
INSERT INTO "public"."users" ("id", "name", "email", "email_verified", "image", "role", "created_at", "updated_at", "banned", "ban_reason", "ban_expires", "status") VALUES ('DLQWfgizkAZDfFXqTJ2RbtV84QD4rIoO', 'Bianca', 'leonardo+4@filli.it', 'f', NULL, 'admin', '2025-06-27 15:24:57.486', '2025-06-27 15:24:57.486', NULL, NULL, NULL, 'waiting-for-approval');
INSERT INTO "public"."users" ("id", "name", "email", "email_verified", "image", "role", "created_at", "updated_at", "banned", "ban_reason", "ban_expires", "status") VALUES ('vEn3AdwfLK5k7RB9a1baOkGfxI9HVTMB', 'Leo', 'leonardo+5@filli.it', 'f', NULL, 'admin', '2025-06-27 17:31:08.435', '2025-06-27 17:31:08.435', NULL, NULL, NULL, 'waiting-for-approval');
INSERT INTO "public"."users" ("id", "name", "email", "email_verified", "image", "role", "created_at", "updated_at", "banned", "ban_reason", "ban_expires", "status") VALUES ('BTw1kpUUysVHkNTHr8aIsa9WFcwg4KUj', 'Leonardo', 'leonardo@filli.it', 't', NULL, 'admin', '2025-05-23 18:11:18.42', '2025-05-23 18:11:18.42', NULL, NULL, NULL, 'active');
INSERT INTO "public"."users" ("id", "name", "email", "email_verified", "image", "role", "created_at", "updated_at", "banned", "ban_reason", "ban_expires", "status") VALUES ('KDyIv0QgZ55zXJfhnG8RW55CLpTTy2BH', 'Bianca', 'leonardo+6@filli.it', 'f', NULL, 'artist-manager', '2025-06-28 16:02:43.277', '2025-07-04 10:59:44.879', NULL, NULL, NULL, 'active');
INSERT INTO "public"."users" ("id", "name", "email", "email_verified", "image", "role", "created_at", "updated_at", "banned", "ban_reason", "ban_expires", "status") VALUES ('tVG7xjyBrvQ6X4HYe0QufaG7tbMopbzc', 'Leonardo', 'leonardo+7@filli.it', 'f', NULL, 'artist-manager', '2025-06-30 15:31:46.476', '2025-07-07 08:09:42.502', NULL, NULL, NULL, 'active');
INSERT INTO "public"."users" ("id", "name", "email", "email_verified", "image", "role", "created_at", "updated_at", "banned", "ban_reason", "ban_expires", "status") VALUES ('FFGOqQg6LPsHgvNfvzv38eRkRRjqvt3r', 'Alice', 'alice@mariani.it', 'f', NULL, 'artist-manager', '2025-07-03 12:20:54.809', '2025-07-04 10:19:07.361', NULL, NULL, NULL, 'disabled');
INSERT INTO "public"."users" ("id", "name", "email", "email_verified", "image", "role", "created_at", "updated_at", "banned", "ban_reason", "ban_expires", "status") VALUES ('R4uoTk62O7IBBYS3ZlNZ1cs0kEaZtoPR', 'Marco', 'marco.pedro@gmail.com', 'f', NULL, 'venue-manager', '2025-07-14 14:06:26.119', '2025-07-15 07:52:59.875', NULL, NULL, NULL, 'active');
INSERT INTO "public"."users" ("id", "name", "email", "email_verified", "image", "role", "created_at", "updated_at", "banned", "ban_reason", "ban_expires", "status") VALUES ('mPrOgzzpapfxM19TH2yN5ScE2u56DbvN', 'Alice', 'alice@filli.it', 'f', NULL, 'artist-manager', '2025-07-02 09:09:30.86', '2025-07-02 09:09:30.86', NULL, NULL, NULL, 'active');
INSERT INTO "public"."users" ("id", "name", "email", "email_verified", "image", "role", "created_at", "updated_at", "banned", "ban_reason", "ban_expires", "status") VALUES ('rSPIrm15X59BvoBSUzjFOrRxZWx2MmFx', 'Emilia', 'info@wow.it', 'f', NULL, 'artist-manager', '2025-07-16 13:10:44.582', '2025-07-16 13:13:58.541', NULL, NULL, NULL, 'active');
INSERT INTO "public"."users" ("id", "name", "email", "email_verified", "image", "role", "created_at", "updated_at", "banned", "ban_reason", "ban_expires", "status") VALUES ('pnFs4BxumJttWrUuZ3lbt7TBrhlJMde3', 'Filippo', 'filippo@filli.it', 'f', NULL, 'venue-manager', '2025-07-16 13:56:08.365', '2025-07-16 13:56:08.365', NULL, NULL, NULL, 'active');
INSERT INTO "public"."users" ("id", "name", "email", "email_verified", "image", "role", "created_at", "updated_at", "banned", "ban_reason", "ban_expires", "status") VALUES ('SmdtueaEdRV68DkwVeR19r3lPJT7HUzN', 'Leonardo', 'leonardo+10@filli.it', 'f', NULL, 'artist-manager', '2025-07-02 10:37:52.806', '2025-07-02 10:37:52.806', NULL, NULL, NULL, 'active');
INSERT INTO "public"."users" ("id", "name", "email", "email_verified", "image", "role", "created_at", "updated_at", "banned", "ban_reason", "ban_expires", "status") VALUES ('g77jHRUgKH4OcwLMb754iySw14EbVOPZ', 'Gianna', 'gianna@gmail.com', 'f', NULL, 'artist-manager', '2025-07-16 15:07:35.281', '2025-07-16 15:09:24.326', NULL, NULL, NULL, 'active');
INSERT INTO "public"."users" ("id", "name", "email", "email_verified", "image", "role", "created_at", "updated_at", "banned", "ban_reason", "ban_expires", "status") VALUES ('LORjajcme6wepJzYSpyj7t3JkvAglQfH', 'Gio', 'info+1@wow.it', 'f', NULL, 'venue-manager', '2025-07-16 15:16:34.342', '2025-07-16 15:16:56.731', NULL, NULL, NULL, 'disabled');
INSERT INTO "public"."users" ("id", "name", "email", "email_verified", "image", "role", "created_at", "updated_at", "banned", "ban_reason", "ban_expires", "status") VALUES ('1UkQ6Ei67EpxKUVplZYBWAFSjYFQttF4', 'Leonardo', 'leonardo+11@filli.it', 'f', NULL, 'artist-manager', '2025-07-02 10:38:00.645', '2025-07-02 10:38:00.645', NULL, NULL, NULL, 'active');
INSERT INTO "public"."users" ("id", "name", "email", "email_verified", "image", "role", "created_at", "updated_at", "banned", "ban_reason", "ban_expires", "status") VALUES ('Km5T0SK9jetTWkkZZPyTohMCMOLkLkUq', 'Leonardo', 'leonardo+12@filli.it', 'f', NULL, 'artist-manager', '2025-07-03 13:45:10.204', '2025-07-03 13:45:10.204', NULL, NULL, NULL, 'active');
COMMIT;

-- ----------------------------
-- Table structure for venues
-- ----------------------------
DROP TABLE IF EXISTS "public"."venues";
CREATE TABLE "public"."venues" (
  "id" int4 NOT NULL DEFAULT nextval('venues_id_seq'::regclass),
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "slug" uuid NOT NULL DEFAULT gen_random_uuid(),
  "status" "public"."user_status" NOT NULL,
  "avatar_url" text COLLATE "pg_catalog"."default" NOT NULL,
  "type" "public"."venue_types" NOT NULL,
  "capacity" int4 NOT NULL,
  "address" text COLLATE "pg_catalog"."default" NOT NULL,
  "country_id" int4 NOT NULL,
  "subdivision_id" int4 NOT NULL,
  "city" text COLLATE "pg_catalog"."default" NOT NULL,
  "zip_code" varchar(10) COLLATE "pg_catalog"."default" NOT NULL,
  "manager_profile_id" int4 NOT NULL,
  "company" text COLLATE "pg_catalog"."default" NOT NULL,
  "tax_code" text COLLATE "pg_catalog"."default" NOT NULL,
  "ipi_code" text COLLATE "pg_catalog"."default" NOT NULL,
  "bic_code" text COLLATE "pg_catalog"."default",
  "aba_routing_number" varchar(20) COLLATE "pg_catalog"."default",
  "iban" text COLLATE "pg_catalog"."default" NOT NULL,
  "sdi_recipient_code" text COLLATE "pg_catalog"."default",
  "billing_address" text COLLATE "pg_catalog"."default" NOT NULL,
  "billing_country_id" int4 NOT NULL,
  "billing_subdivision_id" int4 NOT NULL,
  "billing_city" text COLLATE "pg_catalog"."default" NOT NULL,
  "billing_zip_code" varchar(10) COLLATE "pg_catalog"."default" NOT NULL,
  "billing_email" text COLLATE "pg_catalog"."default" NOT NULL,
  "billing_pec" text COLLATE "pg_catalog"."default" NOT NULL,
  "billing_phone" text COLLATE "pg_catalog"."default" NOT NULL,
  "taxable_invoice" bool NOT NULL DEFAULT false,
  "tiktok_url" text COLLATE "pg_catalog"."default",
  "tiktok_username" text COLLATE "pg_catalog"."default",
  "tiktok_followers" int4,
  "tiktok_created_at" date,
  "facebook_url" text COLLATE "pg_catalog"."default",
  "facebook_username" text COLLATE "pg_catalog"."default",
  "facebook_followers" int4,
  "facebook_created_at" date,
  "instagram_url" text COLLATE "pg_catalog"."default",
  "instagram_username" text COLLATE "pg_catalog"."default",
  "instagram_followers" int4,
  "instagram_created_at" date,
  "x_url" text COLLATE "pg_catalog"."default",
  "x_username" text COLLATE "pg_catalog"."default",
  "x_followers" int4,
  "x_created_at" date,
  "created_at" timestamp(6) NOT NULL DEFAULT now(),
  "updated_at" timestamp(6) NOT NULL DEFAULT now()
)
;
ALTER TABLE "public"."venues" OWNER TO "postgres";

-- ----------------------------
-- Records of venues
-- ----------------------------
BEGIN;
INSERT INTO "public"."venues" ("id", "name", "slug", "status", "avatar_url", "type", "capacity", "address", "country_id", "subdivision_id", "city", "zip_code", "manager_profile_id", "company", "tax_code", "ipi_code", "bic_code", "aba_routing_number", "iban", "sdi_recipient_code", "billing_address", "billing_country_id", "billing_subdivision_id", "billing_city", "billing_zip_code", "billing_email", "billing_pec", "billing_phone", "taxable_invoice", "tiktok_url", "tiktok_username", "tiktok_followers", "tiktok_created_at", "facebook_url", "facebook_username", "facebook_followers", "facebook_created_at", "instagram_url", "instagram_username", "instagram_followers", "instagram_created_at", "x_url", "x_username", "x_followers", "x_created_at", "created_at", "updated_at") VALUES (1, 'La madunina', '9abf14fb-d424-4465-84d3-048a3570ef64', 'disabled', 'https://mzmigzmqxpmypbmvklfh.supabase.co/storage/v1/object/public/milano-ovest-admin/avatars/1752565699824-whatsapp-image-2025-07-14-at-18-28-03.jpeg', 'medium', 1, 'Via duomo 1', 110, 1428, 'Milano', '20129', 11, 'Fillissss', 'SLMLRD98H11I690N', '123451234444', 'IJ1H24314213412', NULL, 'IT19287344711223', NULL, 'Via roma 1', 32, 381, 'Milano', '20144', 'fatturazione@filli.it', 'leonardo+1@filli.it', '+3934536354736', 't', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-15 07:49:10.820844', '2025-07-15 10:22:37.852');
INSERT INTO "public"."venues" ("id", "name", "slug", "status", "avatar_url", "type", "capacity", "address", "country_id", "subdivision_id", "city", "zip_code", "manager_profile_id", "company", "tax_code", "ipi_code", "bic_code", "aba_routing_number", "iban", "sdi_recipient_code", "billing_address", "billing_country_id", "billing_subdivision_id", "billing_city", "billing_zip_code", "billing_email", "billing_pec", "billing_phone", "taxable_invoice", "tiktok_url", "tiktok_username", "tiktok_followers", "tiktok_created_at", "facebook_url", "facebook_username", "facebook_followers", "facebook_created_at", "instagram_url", "instagram_username", "instagram_followers", "instagram_created_at", "x_url", "x_username", "x_followers", "x_created_at", "created_at", "updated_at") VALUES (2, 'Plaza', '51eb78b6-4cf8-4bb8-bb4e-82bad7b7044c', 'active', 'https://mzmigzmqxpmypbmvklfh.supabase.co/storage/v1/object/public/milano-ovest-admin/avatars/1752679060203-1024x1024bb.png', 'small', 15000, 'Via duomo 1', 110, 1428, 'Piemonte', '20129', 15, 'Filli S.r.l.', 'SLMLRD98H11I690N', '123948719', NULL, NULL, 'IT12837468912736487124', 'ABC1234', 'Via roma 1', 110, 1428, 'Milano', '20129', 'wow@srl.com', 'pec@gmail.com', '+39123441234', 'f', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-16 15:18:52.500213', '2025-07-16 15:20:01.048');
COMMIT;

-- ----------------------------
-- Table structure for verifications
-- ----------------------------
DROP TABLE IF EXISTS "public"."verifications";
CREATE TABLE "public"."verifications" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "identifier" text COLLATE "pg_catalog"."default" NOT NULL,
  "value" text COLLATE "pg_catalog"."default" NOT NULL,
  "expires_at" timestamp(6) NOT NULL,
  "created_at" timestamp(6),
  "updated_at" timestamp(6)
)
;
ALTER TABLE "public"."verifications" OWNER TO "postgres";

-- ----------------------------
-- Records of verifications
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for zones
-- ----------------------------
DROP TABLE IF EXISTS "public"."zones";
CREATE TABLE "public"."zones" (
  "id" int4 NOT NULL DEFAULT nextval('zones_id_seq'::regclass),
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "created_at" timestamp(6) NOT NULL DEFAULT now()
)
;
ALTER TABLE "public"."zones" OWNER TO "postgres";

-- ----------------------------
-- Records of zones
-- ----------------------------
BEGIN;
INSERT INTO "public"."zones" ("id", "name", "created_at") VALUES (1, 'Nord', '2025-07-07 12:29:47.14232');
INSERT INTO "public"."zones" ("id", "name", "created_at") VALUES (2, 'Centro', '2025-07-07 12:29:47.14232');
INSERT INTO "public"."zones" ("id", "name", "created_at") VALUES (4, 'Estero', '2025-07-07 12:29:47.14232');
INSERT INTO "public"."zones" ("id", "name", "created_at") VALUES (3, 'Sud e isole', '2025-07-07 12:29:47.14232');
COMMIT;

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."artist_notes_id_seq"
OWNED BY "public"."artist_notes"."id";
SELECT setval('"public"."artist_notes_id_seq"', 3, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."artists_id_seq"
OWNED BY "public"."artists"."id";
SELECT setval('"public"."artists_id_seq"', 4, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."countries_id_seq"
OWNED BY "public"."countries"."id";
SELECT setval('"public"."countries_id_seq"', 250, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."languages_id_seq"
OWNED BY "public"."languages"."id";
SELECT setval('"public"."languages_id_seq"', 184, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."profile_notes_id_seq"
OWNED BY "public"."profile_notes"."id";
SELECT setval('"public"."profile_notes_id_seq"', 22, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."profiles_id_seq"
OWNED BY "public"."profiles"."id";
SELECT setval('"public"."profiles_id_seq"', 15, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."subdivisions_id_seq"
OWNED BY "public"."subdivisions"."id";
SELECT setval('"public"."subdivisions_id_seq"', 3860, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."venues_id_seq"
OWNED BY "public"."venues"."id";
SELECT setval('"public"."venues_id_seq"', 2, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."zones_id_seq"
OWNED BY "public"."zones"."id";
SELECT setval('"public"."zones_id_seq"', 5, true);

-- ----------------------------
-- Primary Key structure for table accounts
-- ----------------------------
ALTER TABLE "public"."accounts" ADD CONSTRAINT "accounts_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table artist_languages
-- ----------------------------
ALTER TABLE "public"."artist_languages" ADD CONSTRAINT "artist_languages_pkey" PRIMARY KEY ("artist_id", "language_id");

-- ----------------------------
-- Primary Key structure for table artist_notes
-- ----------------------------
ALTER TABLE "public"."artist_notes" ADD CONSTRAINT "artist_notes_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table artist_zones
-- ----------------------------
ALTER TABLE "public"."artist_zones" ADD CONSTRAINT "artist_zones_pkey" PRIMARY KEY ("artist_id", "zone_id");

-- ----------------------------
-- Uniques structure for table artists
-- ----------------------------
ALTER TABLE "public"."artists" ADD CONSTRAINT "artists_slug_key" UNIQUE ("slug");

-- ----------------------------
-- Primary Key structure for table artists
-- ----------------------------
ALTER TABLE "public"."artists" ADD CONSTRAINT "artists_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table countries
-- ----------------------------
ALTER TABLE "public"."countries" ADD CONSTRAINT "countries_code_key" UNIQUE ("code");

-- ----------------------------
-- Primary Key structure for table countries
-- ----------------------------
ALTER TABLE "public"."countries" ADD CONSTRAINT "countries_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table languages
-- ----------------------------
ALTER TABLE "public"."languages" ADD CONSTRAINT "languages_code_key" UNIQUE ("code");

-- ----------------------------
-- Primary Key structure for table languages
-- ----------------------------
ALTER TABLE "public"."languages" ADD CONSTRAINT "languages_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table manager_artists
-- ----------------------------
ALTER TABLE "public"."manager_artists" ADD CONSTRAINT "manager_artists_pkey" PRIMARY KEY ("manager_profile_id", "artist_id");

-- ----------------------------
-- Primary Key structure for table profile_languages
-- ----------------------------
ALTER TABLE "public"."profile_languages" ADD CONSTRAINT "profile_languages_pkey" PRIMARY KEY ("profile_id", "language_id");

-- ----------------------------
-- Primary Key structure for table profile_notes
-- ----------------------------
ALTER TABLE "public"."profile_notes" ADD CONSTRAINT "profile_notes_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table profiles
-- ----------------------------
ALTER TABLE "public"."profiles" ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table sessions
-- ----------------------------
ALTER TABLE "public"."sessions" ADD CONSTRAINT "sessions_token_unique" UNIQUE ("token");

-- ----------------------------
-- Primary Key structure for table sessions
-- ----------------------------
ALTER TABLE "public"."sessions" ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table subdivisions
-- ----------------------------
ALTER TABLE "public"."subdivisions" ADD CONSTRAINT "subdivisions_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table users
-- ----------------------------
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_unique" UNIQUE ("email");

-- ----------------------------
-- Primary Key structure for table users
-- ----------------------------
ALTER TABLE "public"."users" ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table venues
-- ----------------------------
ALTER TABLE "public"."venues" ADD CONSTRAINT "venues_slug_key" UNIQUE ("slug");

-- ----------------------------
-- Primary Key structure for table venues
-- ----------------------------
ALTER TABLE "public"."venues" ADD CONSTRAINT "venues_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table verifications
-- ----------------------------
ALTER TABLE "public"."verifications" ADD CONSTRAINT "verifications_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table zones
-- ----------------------------
ALTER TABLE "public"."zones" ADD CONSTRAINT "zones_name_key" UNIQUE ("name");

-- ----------------------------
-- Primary Key structure for table zones
-- ----------------------------
ALTER TABLE "public"."zones" ADD CONSTRAINT "zones_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Foreign Keys structure for table accounts
-- ----------------------------
ALTER TABLE "public"."accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table artist_languages
-- ----------------------------
ALTER TABLE "public"."artist_languages" ADD CONSTRAINT "artist_languages_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "public"."artists" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "public"."artist_languages" ADD CONSTRAINT "artist_languages_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "public"."languages" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- ----------------------------
-- Foreign Keys structure for table artist_notes
-- ----------------------------
ALTER TABLE "public"."artist_notes" ADD CONSTRAINT "artist_notes_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "public"."artists" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."artist_notes" ADD CONSTRAINT "artist_notes_writer_id_fkey" FOREIGN KEY ("writer_id") REFERENCES "public"."users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table artist_zones
-- ----------------------------
ALTER TABLE "public"."artist_zones" ADD CONSTRAINT "artist_zones_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "public"."artists" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
ALTER TABLE "public"."artist_zones" ADD CONSTRAINT "artist_zones_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "public"."zones" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table artists
-- ----------------------------
ALTER TABLE "public"."artists" ADD CONSTRAINT "artists_billing_country_id_fkey" FOREIGN KEY ("billing_country_id") REFERENCES "public"."countries" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
ALTER TABLE "public"."artists" ADD CONSTRAINT "artists_billing_subdivision_id_fkey" FOREIGN KEY ("billing_subdivision_id") REFERENCES "public"."subdivisions" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
ALTER TABLE "public"."artists" ADD CONSTRAINT "artists_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "public"."countries" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
ALTER TABLE "public"."artists" ADD CONSTRAINT "artists_subdivision_id_fkey" FOREIGN KEY ("subdivision_id") REFERENCES "public"."subdivisions" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table manager_artists
-- ----------------------------
ALTER TABLE "public"."manager_artists" ADD CONSTRAINT "manager_artists_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "public"."artists" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
ALTER TABLE "public"."manager_artists" ADD CONSTRAINT "manager_artists_manager_profile_id_fkey" FOREIGN KEY ("manager_profile_id") REFERENCES "public"."profiles" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table profile_languages
-- ----------------------------
ALTER TABLE "public"."profile_languages" ADD CONSTRAINT "profile_languages_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "public"."languages" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "public"."profile_languages" ADD CONSTRAINT "profile_languages_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- ----------------------------
-- Foreign Keys structure for table profile_notes
-- ----------------------------
ALTER TABLE "public"."profile_notes" ADD CONSTRAINT "profile_notes_receiver_profile_id_fkey" FOREIGN KEY ("receiver_profile_id") REFERENCES "public"."profiles" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."profile_notes" ADD CONSTRAINT "profile_notes_writer_id_fkey" FOREIGN KEY ("writer_id") REFERENCES "public"."users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table profiles
-- ----------------------------
ALTER TABLE "public"."profiles" ADD CONSTRAINT "profiles_billing_country_id_fkey" FOREIGN KEY ("billing_country_id") REFERENCES "public"."countries" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
ALTER TABLE "public"."profiles" ADD CONSTRAINT "profiles_billing_subdivision_id_fkey" FOREIGN KEY ("billing_subdivision_id") REFERENCES "public"."subdivisions" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
ALTER TABLE "public"."profiles" ADD CONSTRAINT "profiles_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "public"."countries" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
ALTER TABLE "public"."profiles" ADD CONSTRAINT "profiles_subdivision_id_fkey" FOREIGN KEY ("subdivision_id") REFERENCES "public"."subdivisions" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
ALTER TABLE "public"."profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table sessions
-- ----------------------------
ALTER TABLE "public"."sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table subdivisions
-- ----------------------------
ALTER TABLE "public"."subdivisions" ADD CONSTRAINT "subdivisions_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "public"."countries" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table venues
-- ----------------------------
ALTER TABLE "public"."venues" ADD CONSTRAINT "venues_billing_country_id_fkey" FOREIGN KEY ("billing_country_id") REFERENCES "public"."countries" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
ALTER TABLE "public"."venues" ADD CONSTRAINT "venues_billing_subdivision_id_fkey" FOREIGN KEY ("billing_subdivision_id") REFERENCES "public"."subdivisions" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
ALTER TABLE "public"."venues" ADD CONSTRAINT "venues_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "public"."countries" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
ALTER TABLE "public"."venues" ADD CONSTRAINT "venues_manager_profile_id_fkey" FOREIGN KEY ("manager_profile_id") REFERENCES "public"."profiles" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
ALTER TABLE "public"."venues" ADD CONSTRAINT "venues_subdivision_id_fkey" FOREIGN KEY ("subdivision_id") REFERENCES "public"."subdivisions" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
