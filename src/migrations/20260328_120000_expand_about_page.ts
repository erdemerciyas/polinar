import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Create ENUM for gallery image size
  await db.execute(sql`
    CREATE TYPE "public"."enum_about_page_settings_gallery_images_size" AS ENUM('normal', 'large');
  `)

  // --- Alter main about_page_settings table ---
  // Rename content_image_id -> story_main_image_id and add new upload columns
  await db.execute(sql`
    ALTER TABLE "about_page_settings"
      RENAME COLUMN "content_image_id" TO "story_main_image_id";
  `)
  await db.execute(sql`
    ALTER TABLE "about_page_settings"
      RENAME COLUMN "hero_image_id" TO "hero_background_image_id";
  `)
  await db.execute(sql`
    ALTER TABLE "about_page_settings"
      ADD COLUMN "story_accent_image_id" integer,
      ADD COLUMN "story_cta_link" varchar,
      ADD COLUMN "story_founded_year" varchar,
      ADD COLUMN "video_video_url" varchar,
      ADD COLUMN "video_thumbnail_image_id" integer,
      ADD COLUMN "cta_button_link" varchar;
  `)
  await db.execute(sql`
    ALTER TABLE "about_page_settings"
      ADD CONSTRAINT "about_page_settings_story_accent_image_id_media_id_fk"
        FOREIGN KEY ("story_accent_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  `)
  await db.execute(sql`
    ALTER TABLE "about_page_settings"
      ADD CONSTRAINT "about_page_settings_video_thumbnail_image_id_media_id_fk"
        FOREIGN KEY ("video_thumbnail_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  `)
  await db.execute(sql`
    CREATE INDEX "about_page_settings_story_accent_image_idx" ON "about_page_settings" USING btree ("story_accent_image_id");
    CREATE INDEX "about_page_settings_video_thumbnail_image_idx" ON "about_page_settings" USING btree ("video_thumbnail_image_id");
  `)

  // --- Alter locales table ---
  // Rename old columns and add new localized columns
  await db.execute(sql`
    ALTER TABLE "about_page_settings_locales"
      RENAME COLUMN "content_title" TO "story_title";
  `)
  await db.execute(sql`
    ALTER TABLE "about_page_settings_locales"
      RENAME COLUMN "content_paragraph1" TO "story_paragraph1";
  `)
  await db.execute(sql`
    ALTER TABLE "about_page_settings_locales"
      RENAME COLUMN "content_paragraph2" TO "story_paragraph2";
  `)
  await db.execute(sql`
    ALTER TABLE "about_page_settings_locales"
      ADD COLUMN "hero_subtitle" varchar,
      ADD COLUMN "story_paragraph3" varchar,
      ADD COLUMN "story_cta_text" varchar,
      ADD COLUMN "gallery_title" varchar,
      ADD COLUMN "gallery_description" varchar,
      ADD COLUMN "video_title" varchar,
      ADD COLUMN "video_description" varchar,
      ADD COLUMN "certificates_title" varchar,
      ADD COLUMN "certificates_description" varchar,
      ADD COLUMN "cta_title" varchar,
      ADD COLUMN "cta_description" varchar,
      ADD COLUMN "cta_button_text" varchar;
  `)

  // --- Create statistics cards array table ---
  await db.execute(sql`
    CREATE TABLE "about_page_settings_statistics_cards" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "number" numeric,
      "suffix" varchar,
      "icon" varchar
    );
  `)
  await db.execute(sql`
    CREATE TABLE "about_page_settings_statistics_cards_locales" (
      "label" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" varchar NOT NULL
    );
  `)
  await db.execute(sql`
    ALTER TABLE "about_page_settings_statistics_cards"
      ADD CONSTRAINT "about_page_settings_statistics_cards_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_settings"("id") ON DELETE cascade ON UPDATE no action;
  `)
  await db.execute(sql`
    ALTER TABLE "about_page_settings_statistics_cards_locales"
      ADD CONSTRAINT "about_page_settings_statistics_cards_locales_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_settings_statistics_cards"("id") ON DELETE cascade ON UPDATE no action;
  `)
  await db.execute(sql`
    CREATE INDEX "about_page_settings_statistics_cards_order_idx" ON "about_page_settings_statistics_cards" USING btree ("_order");
    CREATE INDEX "about_page_settings_statistics_cards_parent_id_idx" ON "about_page_settings_statistics_cards" USING btree ("_parent_id");
    CREATE UNIQUE INDEX "about_page_settings_statistics_cards_locales_locale_parent_id_un" ON "about_page_settings_statistics_cards_locales" USING btree ("_locale", "_parent_id");
  `)

  // --- Create gallery images array table ---
  await db.execute(sql`
    CREATE TABLE "about_page_settings_gallery_images" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer,
      "size" "enum_about_page_settings_gallery_images_size" DEFAULT 'normal'
    );
  `)
  await db.execute(sql`
    CREATE TABLE "about_page_settings_gallery_images_locales" (
      "caption" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" varchar NOT NULL
    );
  `)
  await db.execute(sql`
    ALTER TABLE "about_page_settings_gallery_images"
      ADD CONSTRAINT "about_page_settings_gallery_images_image_id_media_id_fk"
        FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "about_page_settings_gallery_images"
      ADD CONSTRAINT "about_page_settings_gallery_images_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_settings"("id") ON DELETE cascade ON UPDATE no action;
  `)
  await db.execute(sql`
    ALTER TABLE "about_page_settings_gallery_images_locales"
      ADD CONSTRAINT "about_page_settings_gallery_images_locales_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_settings_gallery_images"("id") ON DELETE cascade ON UPDATE no action;
  `)
  await db.execute(sql`
    CREATE INDEX "about_page_settings_gallery_images_order_idx" ON "about_page_settings_gallery_images" USING btree ("_order");
    CREATE INDEX "about_page_settings_gallery_images_parent_id_idx" ON "about_page_settings_gallery_images" USING btree ("_parent_id");
    CREATE INDEX "about_page_settings_gallery_images_image_idx" ON "about_page_settings_gallery_images" USING btree ("image_id");
    CREATE UNIQUE INDEX "about_page_settings_gallery_images_locales_locale_parent_id_un" ON "about_page_settings_gallery_images_locales" USING btree ("_locale", "_parent_id");
  `)

  // --- Create certificates items array table ---
  await db.execute(sql`
    CREATE TABLE "about_page_settings_certificates_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "name" varchar,
      "image_id" integer
    );
  `)
  await db.execute(sql`
    CREATE TABLE "about_page_settings_certificates_items_locales" (
      "description" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" varchar NOT NULL
    );
  `)
  await db.execute(sql`
    ALTER TABLE "about_page_settings_certificates_items"
      ADD CONSTRAINT "about_page_settings_certificates_items_image_id_media_id_fk"
        FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "about_page_settings_certificates_items"
      ADD CONSTRAINT "about_page_settings_certificates_items_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_settings"("id") ON DELETE cascade ON UPDATE no action;
  `)
  await db.execute(sql`
    ALTER TABLE "about_page_settings_certificates_items_locales"
      ADD CONSTRAINT "about_page_settings_certificates_items_locales_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_settings_certificates_items"("id") ON DELETE cascade ON UPDATE no action;
  `)
  await db.execute(sql`
    CREATE INDEX "about_page_settings_certificates_items_order_idx" ON "about_page_settings_certificates_items" USING btree ("_order");
    CREATE INDEX "about_page_settings_certificates_items_parent_id_idx" ON "about_page_settings_certificates_items" USING btree ("_parent_id");
    CREATE INDEX "about_page_settings_certificates_items_image_idx" ON "about_page_settings_certificates_items" USING btree ("image_id");
    CREATE UNIQUE INDEX "about_page_settings_certificates_items_locales_locale_parent_un" ON "about_page_settings_certificates_items_locales" USING btree ("_locale", "_parent_id");
  `)

  // --- Drop old values_title from locales (replaced by statistics) ---
  await db.execute(sql`
    ALTER TABLE "about_page_settings_locales"
      DROP COLUMN IF EXISTS "values_title";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Drop new array tables
  await db.execute(sql`
    DROP TABLE IF EXISTS "about_page_settings_certificates_items_locales" CASCADE;
    DROP TABLE IF EXISTS "about_page_settings_certificates_items" CASCADE;
    DROP TABLE IF EXISTS "about_page_settings_gallery_images_locales" CASCADE;
    DROP TABLE IF EXISTS "about_page_settings_gallery_images" CASCADE;
    DROP TABLE IF EXISTS "about_page_settings_statistics_cards_locales" CASCADE;
    DROP TABLE IF EXISTS "about_page_settings_statistics_cards" CASCADE;
  `)

  // Revert locales columns
  await db.execute(sql`
    ALTER TABLE "about_page_settings_locales"
      ADD COLUMN IF NOT EXISTS "values_title" varchar,
      DROP COLUMN IF EXISTS "hero_subtitle",
      DROP COLUMN IF EXISTS "story_paragraph3",
      DROP COLUMN IF EXISTS "story_cta_text",
      DROP COLUMN IF EXISTS "gallery_title",
      DROP COLUMN IF EXISTS "gallery_description",
      DROP COLUMN IF EXISTS "video_title",
      DROP COLUMN IF EXISTS "video_description",
      DROP COLUMN IF EXISTS "certificates_title",
      DROP COLUMN IF EXISTS "certificates_description",
      DROP COLUMN IF EXISTS "cta_title",
      DROP COLUMN IF EXISTS "cta_description",
      DROP COLUMN IF EXISTS "cta_button_text";
  `)

  // Revert column renames
  await db.execute(sql`
    ALTER TABLE "about_page_settings_locales"
      RENAME COLUMN "story_title" TO "content_title";
    ALTER TABLE "about_page_settings_locales"
      RENAME COLUMN "story_paragraph1" TO "content_paragraph1";
    ALTER TABLE "about_page_settings_locales"
      RENAME COLUMN "story_paragraph2" TO "content_paragraph2";
  `)

  // Revert main table
  await db.execute(sql`
    ALTER TABLE "about_page_settings"
      DROP COLUMN IF EXISTS "story_accent_image_id",
      DROP COLUMN IF EXISTS "story_cta_link",
      DROP COLUMN IF EXISTS "story_founded_year",
      DROP COLUMN IF EXISTS "video_video_url",
      DROP COLUMN IF EXISTS "video_thumbnail_image_id",
      DROP COLUMN IF EXISTS "cta_button_link";
    ALTER TABLE "about_page_settings"
      RENAME COLUMN "story_main_image_id" TO "content_image_id";
    ALTER TABLE "about_page_settings"
      RENAME COLUMN "hero_background_image_id" TO "hero_image_id";
  `)

  // Drop ENUM
  await db.execute(sql`
    DROP TYPE IF EXISTS "public"."enum_about_page_settings_gallery_images_size";
  `)
}
