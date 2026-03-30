import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Create ENUM types (idempotent — dev mode may have already pushed them)
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_homepage_settings_slider_settings_transition_type"
        AS ENUM('fade', 'slide', 'zoom', 'slideUp');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_homepage_settings_hero_slides_text_alignment"
        AS ENUM('left', 'center', 'right');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_homepage_settings_hero_slides_text_position"
        AS ENUM('top', 'center', 'bottom');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_homepage_settings_hero_slides_title_size"
        AS ENUM('small', 'medium', 'large');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_homepage_settings_hero_slides_text_animation"
        AS ENUM('fadeUp', 'fadeIn', 'slideLeft', 'slideRight');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  // Add sliderSettings columns to homepage_settings (idempotent)
  await db.execute(sql`
    ALTER TABLE "homepage_settings"
      ADD COLUMN IF NOT EXISTS "slider_settings_auto_play" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "slider_settings_pause_on_hover" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "slider_settings_show_arrows" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "slider_settings_show_dots" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "slider_settings_interval" numeric DEFAULT 5000,
      ADD COLUMN IF NOT EXISTS "slider_settings_transition_duration" numeric DEFAULT 800,
      ADD COLUMN IF NOT EXISTS "slider_settings_transition_type"
        "public"."enum_homepage_settings_slider_settings_transition_type" DEFAULT 'fade';
  `)

  // Add per-slide setting columns to homepage_settings_hero_slides (idempotent)
  await db.execute(sql`
    ALTER TABLE "homepage_settings_hero_slides"
      ADD COLUMN IF NOT EXISTS "overlay_opacity" numeric DEFAULT 60,
      ADD COLUMN IF NOT EXISTS "text_alignment"
        "public"."enum_homepage_settings_hero_slides_text_alignment" DEFAULT 'left',
      ADD COLUMN IF NOT EXISTS "text_position"
        "public"."enum_homepage_settings_hero_slides_text_position" DEFAULT 'center',
      ADD COLUMN IF NOT EXISTS "title_size"
        "public"."enum_homepage_settings_hero_slides_title_size" DEFAULT 'large',
      ADD COLUMN IF NOT EXISTS "animate_text" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "text_animation"
        "public"."enum_homepage_settings_hero_slides_text_animation" DEFAULT 'fadeUp';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Remove per-slide columns
  await db.execute(sql`
    ALTER TABLE "homepage_settings_hero_slides"
      DROP COLUMN IF EXISTS "overlay_opacity",
      DROP COLUMN IF EXISTS "text_alignment",
      DROP COLUMN IF EXISTS "text_position",
      DROP COLUMN IF EXISTS "title_size",
      DROP COLUMN IF EXISTS "animate_text",
      DROP COLUMN IF EXISTS "text_animation";
  `)

  // Remove sliderSettings columns
  await db.execute(sql`
    ALTER TABLE "homepage_settings"
      DROP COLUMN IF EXISTS "slider_settings_auto_play",
      DROP COLUMN IF EXISTS "slider_settings_pause_on_hover",
      DROP COLUMN IF EXISTS "slider_settings_show_arrows",
      DROP COLUMN IF EXISTS "slider_settings_show_dots",
      DROP COLUMN IF EXISTS "slider_settings_interval",
      DROP COLUMN IF EXISTS "slider_settings_transition_duration",
      DROP COLUMN IF EXISTS "slider_settings_transition_type";
  `)

  // Drop ENUM types
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_homepage_settings_hero_slides_text_animation";`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_homepage_settings_hero_slides_title_size";`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_homepage_settings_hero_slides_text_position";`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_homepage_settings_hero_slides_text_alignment";`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_homepage_settings_slider_settings_transition_type";`)
}
