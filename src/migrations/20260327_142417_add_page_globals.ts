import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('ar', 'en', 'it', 'tr');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_news_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__news_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__news_v_published_locale" AS ENUM('ar', 'en', 'it', 'tr');
  CREATE TYPE "public"."enum_pages_blocks_image_gallery_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_cta_bar_style" AS ENUM('red', 'navy', 'cyan');
  CREATE TYPE "public"."enum_pages_blocks_two_column_content_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_hero_type" AS ENUM('banner', 'slider', 'none');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_blocks_image_gallery_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_bar_style" AS ENUM('red', 'navy', 'cyan');
  CREATE TYPE "public"."enum__pages_v_blocks_two_column_content_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_version_hero_type" AS ENUM('banner', 'slider', 'none');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('ar', 'en', 'it', 'tr');
  CREATE TYPE "public"."enum_navigation_main_menu_mega_menu_columns_links_icon" AS ENUM('moulds', 'machinery', 'testing');
  CREATE TYPE "public"."enum_navigation_main_menu_mega_menu_columns_column_type" AS ENUM('links', 'featuredProducts', 'imageCard');
  CREATE TYPE "public"."enum_navigation_main_menu_type" AS ENUM('link', 'mega');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar,
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "product_categories_technologies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL
  );
  
  CREATE TABLE "product_categories_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "product_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"featured_image_id" integer,
  	"brochure_id" integer,
  	"sort_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "product_categories_locales" (
  	"name" varchar NOT NULL,
  	"materials" varchar,
  	"description" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "news" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"featured_image_id" integer,
  	"date" timestamp(3) with time zone,
  	"year" varchar,
  	"status" "enum_news_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_news_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "news_locales" (
  	"title" varchar,
  	"excerpt" varchar,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_news_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_featured_image_id" integer,
  	"version_date" timestamp(3) with time zone,
  	"version_year" varchar,
  	"version_status" "enum__news_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__news_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__news_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_news_v_locales" (
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_blocks_hero_slider_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"background_image_id" integer,
  	"cta_label" varchar,
  	"cta_link" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_slider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_image_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "pages_blocks_image_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"columns" "enum_pages_blocks_image_gallery_columns" DEFAULT '3',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_product_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"limit" numeric DEFAULT 6,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_contact_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"show_map" boolean DEFAULT true,
  	"map_embed_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_video_embed_side_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_video_embed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"video_url" varchar,
  	"thumbnail_image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_core_values_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_core_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_certificates_grid_certificates" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"image_id" integer,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_certificates_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_bar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"button_label" varchar,
  	"button_link" varchar,
  	"style" "enum_pages_blocks_cta_bar_style" DEFAULT 'red',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_two_column_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"left_column" jsonb,
  	"right_column" jsonb,
  	"image_id" integer,
  	"image_position" "enum_pages_blocks_two_column_content_image_position" DEFAULT 'right',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"hero_type" "enum_pages_hero_type" DEFAULT 'banner',
  	"hero_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_locales" (
  	"title" varchar,
  	"hero_title" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"locale" "_locales",
  	"product_categories_id" integer
  );
  
  CREATE TABLE "_pages_v_blocks_hero_slider_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"background_image_id" integer,
  	"cta_label" varchar,
  	"cta_link" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_slider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_image_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_image_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"columns" "enum__pages_v_blocks_image_gallery_columns" DEFAULT '3',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_product_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"limit" numeric DEFAULT 6,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_contact_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"show_map" boolean DEFAULT true,
  	"map_embed_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_video_embed_side_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_video_embed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"video_url" varchar,
  	"thumbnail_image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_core_values_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_core_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_certificates_grid_certificates" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"image_id" integer,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_certificates_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_bar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"button_label" varchar,
  	"button_link" varchar,
  	"style" "enum__pages_v_blocks_cta_bar_style" DEFAULT 'red',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_two_column_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"left_column" jsonb,
  	"right_column" jsonb,
  	"image_id" integer,
  	"image_position" "enum__pages_v_blocks_two_column_content_image_position" DEFAULT 'right',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_hero_type" "enum__pages_v_version_hero_type" DEFAULT 'banner',
  	"version_hero_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__pages_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_pages_v_locales" (
  	"version_title" varchar,
  	"version_hero_title" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"locale" "_locales",
  	"product_categories_id" integer
  );
  
  CREATE TABLE "contact_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"subject" varchar,
  	"message" varchar NOT NULL,
  	"read_status" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "newsletter_subscribers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"email" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "languages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"native_label" varchar NOT NULL,
  	"short_label" varchar NOT NULL,
  	"is_default" boolean DEFAULT false,
  	"is_active" boolean DEFAULT true,
  	"is_r_t_l" boolean DEFAULT false,
  	"flag_emoji" varchar,
  	"sort_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"product_categories_id" integer,
  	"news_id" integer,
  	"pages_id" integer,
  	"contact_submissions_id" integer,
  	"newsletter_subscribers_id" integer,
  	"languages_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'Polinar',
  	"logo_id" integer,
  	"logo_white_id" integer,
  	"contact_email" varchar,
  	"contact_phone" varchar,
  	"contact_fax" varchar,
  	"contact_whatsapp" varchar,
  	"contact_google_maps_embed" varchar,
  	"social_media_facebook" varchar,
  	"social_media_instagram" varchar,
  	"social_media_youtube" varchar,
  	"social_media_linkedin" varchar,
  	"social_media_twitter" varchar,
  	"chatbot_enabled" boolean DEFAULT false,
  	"chatbot_system_prompt" varchar,
  	"whatsapp_c_t_a_enabled" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_locales" (
  	"default_seo_description" varchar,
  	"contact_address" varchar,
  	"chatbot_labels_title" varchar,
  	"chatbot_labels_welcome" varchar,
  	"chatbot_labels_placeholder" varchar,
  	"chatbot_labels_whatsapp_label" varchar,
  	"chatbot_labels_close_label" varchar,
  	"chatbot_labels_error_message" varchar,
  	"chatbot_labels_connection_error" varchar,
  	"whatsapp_c_t_a_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "navigation_main_menu_mega_menu_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"icon" "enum_navigation_main_menu_mega_menu_columns_links_icon",
  	"image_id" integer
  );
  
  CREATE TABLE "navigation_main_menu_mega_menu_columns_links_locales" (
  	"label" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_main_menu_mega_menu_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"column_type" "enum_navigation_main_menu_mega_menu_columns_column_type" DEFAULT 'links',
  	"image_id" integer,
  	"image_link" varchar
  );
  
  CREATE TABLE "navigation_main_menu_mega_menu_columns_locales" (
  	"column_title" varchar,
  	"image_caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_main_menu" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_navigation_main_menu_type" DEFAULT 'link',
  	"url" varchar
  );
  
  CREATE TABLE "navigation_main_menu_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "navigation_locales" (
  	"mega_menu_c_t_a_title" varchar,
  	"mega_menu_c_t_a_description" varchar,
  	"mega_menu_c_t_a_button" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "navigation_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"product_categories_id" integer
  );
  
  CREATE TABLE "footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "footer_columns_locales" (
  	"title" varchar,
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"show_newsletter" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_locales" (
  	"labels_address_label" varchar,
  	"labels_phone_fax_label" varchar,
  	"labels_email_label" varchar,
  	"labels_newsletter_label" varchar,
  	"labels_subscribe_button" varchar,
  	"labels_name_placeholder" varchar,
  	"labels_email_placeholder" varchar,
  	"copyright_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "homepage_settings_hero_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"background_image_id" integer,
  	"cta_link" varchar
  );
  
  CREATE TABLE "homepage_settings_hero_slides_locales" (
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_settings_promotion_video_side_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "homepage_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"about_preview_image_id" integer,
  	"promotion_video_video_url" varchar,
  	"promotion_video_thumbnail_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "homepage_settings_locales" (
  	"core_values_title" varchar,
  	"core_values_description" varchar,
  	"about_preview_text" jsonb,
  	"about_preview_labels_label" varchar,
  	"about_preview_labels_title" varchar,
  	"about_preview_labels_description" varchar,
  	"business_section_section_label" varchar,
  	"business_section_section_title" varchar,
  	"news_section_label" varchar,
  	"news_section_title" varchar,
  	"news_section_empty" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "homepage_settings_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"product_categories_id" integer,
  	"news_id" integer
  );
  
  CREATE TABLE "about_page_settings_values_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar
  );
  
  CREATE TABLE "about_page_settings_values_cards_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_image_id" integer,
  	"content_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_page_settings_locales" (
  	"hero_label" varchar,
  	"hero_title" varchar,
  	"content_title" varchar,
  	"content_paragraph1" varchar,
  	"content_paragraph2" varchar,
  	"values_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "contact_page_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "contact_page_settings_locales" (
  	"hero_title" varchar,
  	"hero_subtitle" varchar,
  	"form_name_label" varchar,
  	"form_email_label" varchar,
  	"form_subject_label" varchar,
  	"form_message_label" varchar,
  	"form_send_button" varchar,
  	"form_sending_button" varchar,
  	"messages_success" varchar,
  	"messages_error" varchar,
  	"info_address_label" varchar,
  	"info_address_text" varchar,
  	"info_phone_label" varchar,
  	"info_email_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "news_page_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "news_page_settings_locales" (
  	"hero_label" varchar,
  	"hero_title" varchar,
  	"labels_empty" varchar,
  	"labels_breadcrumb" varchar,
  	"labels_all_news" varchar,
  	"labels_cms_placeholder" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "ui_labels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "ui_labels_locales" (
  	"learn_more" varchar,
  	"read_more" varchar,
  	"content_coming_soon" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_categories_technologies" ADD CONSTRAINT "product_categories_technologies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_categories_gallery" ADD CONSTRAINT "product_categories_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_categories_gallery" ADD CONSTRAINT "product_categories_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_brochure_id_media_id_fk" FOREIGN KEY ("brochure_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_categories_locales" ADD CONSTRAINT "product_categories_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_categories_locales" ADD CONSTRAINT "product_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_locales" ADD CONSTRAINT "news_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_locales" ADD CONSTRAINT "news_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_parent_id_news_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."news"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v_locales" ADD CONSTRAINT "_news_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v_locales" ADD CONSTRAINT "_news_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_news_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_slider_slides" ADD CONSTRAINT "pages_blocks_hero_slider_slides_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_slider_slides" ADD CONSTRAINT "pages_blocks_hero_slider_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero_slider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_slider" ADD CONSTRAINT "pages_blocks_hero_slider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text" ADD CONSTRAINT "pages_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_gallery_images" ADD CONSTRAINT "pages_blocks_image_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_gallery_images" ADD CONSTRAINT "pages_blocks_image_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_image_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_gallery" ADD CONSTRAINT "pages_blocks_image_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_product_grid" ADD CONSTRAINT "pages_blocks_product_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_form" ADD CONSTRAINT "pages_blocks_contact_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_video_embed_side_images" ADD CONSTRAINT "pages_blocks_video_embed_side_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_video_embed_side_images" ADD CONSTRAINT "pages_blocks_video_embed_side_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_video_embed"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_video_embed" ADD CONSTRAINT "pages_blocks_video_embed_thumbnail_image_id_media_id_fk" FOREIGN KEY ("thumbnail_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_video_embed" ADD CONSTRAINT "pages_blocks_video_embed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_core_values_values" ADD CONSTRAINT "pages_blocks_core_values_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_core_values"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_core_values" ADD CONSTRAINT "pages_blocks_core_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_certificates_grid_certificates" ADD CONSTRAINT "pages_blocks_certificates_grid_certificates_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_certificates_grid_certificates" ADD CONSTRAINT "pages_blocks_certificates_grid_certificates_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_certificates_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_certificates_grid" ADD CONSTRAINT "pages_blocks_certificates_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_bar" ADD CONSTRAINT "pages_blocks_cta_bar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_two_column_content" ADD CONSTRAINT "pages_blocks_two_column_content_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_two_column_content" ADD CONSTRAINT "pages_blocks_two_column_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_product_categories_fk" FOREIGN KEY ("product_categories_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_slider_slides" ADD CONSTRAINT "_pages_v_blocks_hero_slider_slides_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_slider_slides" ADD CONSTRAINT "_pages_v_blocks_hero_slider_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero_slider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_slider" ADD CONSTRAINT "_pages_v_blocks_hero_slider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text" ADD CONSTRAINT "_pages_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_gallery_images" ADD CONSTRAINT "_pages_v_blocks_image_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_gallery_images" ADD CONSTRAINT "_pages_v_blocks_image_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_image_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_gallery" ADD CONSTRAINT "_pages_v_blocks_image_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_product_grid" ADD CONSTRAINT "_pages_v_blocks_product_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_form" ADD CONSTRAINT "_pages_v_blocks_contact_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video_embed_side_images" ADD CONSTRAINT "_pages_v_blocks_video_embed_side_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video_embed_side_images" ADD CONSTRAINT "_pages_v_blocks_video_embed_side_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_video_embed"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video_embed" ADD CONSTRAINT "_pages_v_blocks_video_embed_thumbnail_image_id_media_id_fk" FOREIGN KEY ("thumbnail_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video_embed" ADD CONSTRAINT "_pages_v_blocks_video_embed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_core_values_values" ADD CONSTRAINT "_pages_v_blocks_core_values_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_core_values"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_core_values" ADD CONSTRAINT "_pages_v_blocks_core_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_certificates_grid_certificates" ADD CONSTRAINT "_pages_v_blocks_certificates_grid_certificates_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_certificates_grid_certificates" ADD CONSTRAINT "_pages_v_blocks_certificates_grid_certificates_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_certificates_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_certificates_grid" ADD CONSTRAINT "_pages_v_blocks_certificates_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_bar" ADD CONSTRAINT "_pages_v_blocks_cta_bar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_two_column_content" ADD CONSTRAINT "_pages_v_blocks_two_column_content_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_two_column_content" ADD CONSTRAINT "_pages_v_blocks_two_column_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_product_categories_fk" FOREIGN KEY ("product_categories_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_product_categories_fk" FOREIGN KEY ("product_categories_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_submissions_fk" FOREIGN KEY ("contact_submissions_id") REFERENCES "public"."contact_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_newsletter_subscribers_fk" FOREIGN KEY ("newsletter_subscribers_id") REFERENCES "public"."newsletter_subscribers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_languages_fk" FOREIGN KEY ("languages_id") REFERENCES "public"."languages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_white_id_media_id_fk" FOREIGN KEY ("logo_white_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_main_menu_mega_menu_columns_links" ADD CONSTRAINT "navigation_main_menu_mega_menu_columns_links_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_main_menu_mega_menu_columns_links" ADD CONSTRAINT "navigation_main_menu_mega_menu_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_main_menu_mega_menu_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_main_menu_mega_menu_columns_links_locales" ADD CONSTRAINT "navigation_main_menu_mega_menu_columns_links_locales_pare_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_main_menu_mega_menu_columns_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_main_menu_mega_menu_columns" ADD CONSTRAINT "navigation_main_menu_mega_menu_columns_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_main_menu_mega_menu_columns" ADD CONSTRAINT "navigation_main_menu_mega_menu_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_main_menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_main_menu_mega_menu_columns_locales" ADD CONSTRAINT "navigation_main_menu_mega_menu_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_main_menu_mega_menu_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_main_menu" ADD CONSTRAINT "navigation_main_menu_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_main_menu_locales" ADD CONSTRAINT "navigation_main_menu_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_main_menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_locales" ADD CONSTRAINT "navigation_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_rels" ADD CONSTRAINT "navigation_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_rels" ADD CONSTRAINT "navigation_rels_product_categories_fk" FOREIGN KEY ("product_categories_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns" ADD CONSTRAINT "footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_locales" ADD CONSTRAINT "footer_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_locales" ADD CONSTRAINT "footer_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_settings_hero_slides" ADD CONSTRAINT "homepage_settings_hero_slides_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_settings_hero_slides" ADD CONSTRAINT "homepage_settings_hero_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_settings_hero_slides_locales" ADD CONSTRAINT "homepage_settings_hero_slides_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_settings_hero_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_settings_promotion_video_side_images" ADD CONSTRAINT "homepage_settings_promotion_video_side_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_settings_promotion_video_side_images" ADD CONSTRAINT "homepage_settings_promotion_video_side_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_settings" ADD CONSTRAINT "homepage_settings_about_preview_image_id_media_id_fk" FOREIGN KEY ("about_preview_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_settings" ADD CONSTRAINT "homepage_settings_promotion_video_thumbnail_image_id_media_id_fk" FOREIGN KEY ("promotion_video_thumbnail_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_settings_locales" ADD CONSTRAINT "homepage_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_settings_rels" ADD CONSTRAINT "homepage_settings_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."homepage_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_settings_rels" ADD CONSTRAINT "homepage_settings_rels_product_categories_fk" FOREIGN KEY ("product_categories_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_settings_rels" ADD CONSTRAINT "homepage_settings_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_settings_values_cards" ADD CONSTRAINT "about_page_settings_values_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_settings_values_cards_locales" ADD CONSTRAINT "about_page_settings_values_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_settings_values_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_settings" ADD CONSTRAINT "about_page_settings_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_settings" ADD CONSTRAINT "about_page_settings_content_image_id_media_id_fk" FOREIGN KEY ("content_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_settings_locales" ADD CONSTRAINT "about_page_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_page_settings_locales" ADD CONSTRAINT "contact_page_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_page_settings" ADD CONSTRAINT "news_page_settings_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_page_settings_locales" ADD CONSTRAINT "news_page_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news_page_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ui_labels_locales" ADD CONSTRAINT "ui_labels_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ui_labels"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "product_categories_technologies_order_idx" ON "product_categories_technologies" USING btree ("_order");
  CREATE INDEX "product_categories_technologies_parent_id_idx" ON "product_categories_technologies" USING btree ("_parent_id");
  CREATE INDEX "product_categories_technologies_locale_idx" ON "product_categories_technologies" USING btree ("_locale");
  CREATE INDEX "product_categories_gallery_order_idx" ON "product_categories_gallery" USING btree ("_order");
  CREATE INDEX "product_categories_gallery_parent_id_idx" ON "product_categories_gallery" USING btree ("_parent_id");
  CREATE INDEX "product_categories_gallery_image_idx" ON "product_categories_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX "product_categories_slug_idx" ON "product_categories" USING btree ("slug");
  CREATE INDEX "product_categories_featured_image_idx" ON "product_categories" USING btree ("featured_image_id");
  CREATE INDEX "product_categories_brochure_idx" ON "product_categories" USING btree ("brochure_id");
  CREATE INDEX "product_categories_updated_at_idx" ON "product_categories" USING btree ("updated_at");
  CREATE INDEX "product_categories_created_at_idx" ON "product_categories" USING btree ("created_at");
  CREATE INDEX "product_categories_meta_meta_image_idx" ON "product_categories_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "product_categories_locales_locale_parent_id_unique" ON "product_categories_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "news_slug_idx" ON "news" USING btree ("slug");
  CREATE INDEX "news_featured_image_idx" ON "news" USING btree ("featured_image_id");
  CREATE INDEX "news_updated_at_idx" ON "news" USING btree ("updated_at");
  CREATE INDEX "news_created_at_idx" ON "news" USING btree ("created_at");
  CREATE INDEX "news__status_idx" ON "news" USING btree ("_status");
  CREATE INDEX "news_meta_meta_image_idx" ON "news_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "news_locales_locale_parent_id_unique" ON "news_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_news_v_parent_idx" ON "_news_v" USING btree ("parent_id");
  CREATE INDEX "_news_v_version_version_slug_idx" ON "_news_v" USING btree ("version_slug");
  CREATE INDEX "_news_v_version_version_featured_image_idx" ON "_news_v" USING btree ("version_featured_image_id");
  CREATE INDEX "_news_v_version_version_updated_at_idx" ON "_news_v" USING btree ("version_updated_at");
  CREATE INDEX "_news_v_version_version_created_at_idx" ON "_news_v" USING btree ("version_created_at");
  CREATE INDEX "_news_v_version_version__status_idx" ON "_news_v" USING btree ("version__status");
  CREATE INDEX "_news_v_created_at_idx" ON "_news_v" USING btree ("created_at");
  CREATE INDEX "_news_v_updated_at_idx" ON "_news_v" USING btree ("updated_at");
  CREATE INDEX "_news_v_snapshot_idx" ON "_news_v" USING btree ("snapshot");
  CREATE INDEX "_news_v_published_locale_idx" ON "_news_v" USING btree ("published_locale");
  CREATE INDEX "_news_v_latest_idx" ON "_news_v" USING btree ("latest");
  CREATE INDEX "_news_v_version_meta_version_meta_image_idx" ON "_news_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_news_v_locales_locale_parent_id_unique" ON "_news_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_hero_slider_slides_order_idx" ON "pages_blocks_hero_slider_slides" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_slider_slides_parent_id_idx" ON "pages_blocks_hero_slider_slides" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_slider_slides_locale_idx" ON "pages_blocks_hero_slider_slides" USING btree ("_locale");
  CREATE INDEX "pages_blocks_hero_slider_slides_background_image_idx" ON "pages_blocks_hero_slider_slides" USING btree ("background_image_id");
  CREATE INDEX "pages_blocks_hero_slider_order_idx" ON "pages_blocks_hero_slider" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_slider_parent_id_idx" ON "pages_blocks_hero_slider" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_slider_path_idx" ON "pages_blocks_hero_slider" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_slider_locale_idx" ON "pages_blocks_hero_slider" USING btree ("_locale");
  CREATE INDEX "pages_blocks_rich_text_order_idx" ON "pages_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_parent_id_idx" ON "pages_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_path_idx" ON "pages_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_rich_text_locale_idx" ON "pages_blocks_rich_text" USING btree ("_locale");
  CREATE INDEX "pages_blocks_image_gallery_images_order_idx" ON "pages_blocks_image_gallery_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_gallery_images_parent_id_idx" ON "pages_blocks_image_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_gallery_images_locale_idx" ON "pages_blocks_image_gallery_images" USING btree ("_locale");
  CREATE INDEX "pages_blocks_image_gallery_images_image_idx" ON "pages_blocks_image_gallery_images" USING btree ("image_id");
  CREATE INDEX "pages_blocks_image_gallery_order_idx" ON "pages_blocks_image_gallery" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_gallery_parent_id_idx" ON "pages_blocks_image_gallery" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_gallery_path_idx" ON "pages_blocks_image_gallery" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_gallery_locale_idx" ON "pages_blocks_image_gallery" USING btree ("_locale");
  CREATE INDEX "pages_blocks_product_grid_order_idx" ON "pages_blocks_product_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_product_grid_parent_id_idx" ON "pages_blocks_product_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_product_grid_path_idx" ON "pages_blocks_product_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_product_grid_locale_idx" ON "pages_blocks_product_grid" USING btree ("_locale");
  CREATE INDEX "pages_blocks_contact_form_order_idx" ON "pages_blocks_contact_form" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_form_parent_id_idx" ON "pages_blocks_contact_form" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_form_path_idx" ON "pages_blocks_contact_form" USING btree ("_path");
  CREATE INDEX "pages_blocks_contact_form_locale_idx" ON "pages_blocks_contact_form" USING btree ("_locale");
  CREATE INDEX "pages_blocks_video_embed_side_images_order_idx" ON "pages_blocks_video_embed_side_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_video_embed_side_images_parent_id_idx" ON "pages_blocks_video_embed_side_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_video_embed_side_images_locale_idx" ON "pages_blocks_video_embed_side_images" USING btree ("_locale");
  CREATE INDEX "pages_blocks_video_embed_side_images_image_idx" ON "pages_blocks_video_embed_side_images" USING btree ("image_id");
  CREATE INDEX "pages_blocks_video_embed_order_idx" ON "pages_blocks_video_embed" USING btree ("_order");
  CREATE INDEX "pages_blocks_video_embed_parent_id_idx" ON "pages_blocks_video_embed" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_video_embed_path_idx" ON "pages_blocks_video_embed" USING btree ("_path");
  CREATE INDEX "pages_blocks_video_embed_locale_idx" ON "pages_blocks_video_embed" USING btree ("_locale");
  CREATE INDEX "pages_blocks_video_embed_thumbnail_image_idx" ON "pages_blocks_video_embed" USING btree ("thumbnail_image_id");
  CREATE INDEX "pages_blocks_core_values_values_order_idx" ON "pages_blocks_core_values_values" USING btree ("_order");
  CREATE INDEX "pages_blocks_core_values_values_parent_id_idx" ON "pages_blocks_core_values_values" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_core_values_values_locale_idx" ON "pages_blocks_core_values_values" USING btree ("_locale");
  CREATE INDEX "pages_blocks_core_values_order_idx" ON "pages_blocks_core_values" USING btree ("_order");
  CREATE INDEX "pages_blocks_core_values_parent_id_idx" ON "pages_blocks_core_values" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_core_values_path_idx" ON "pages_blocks_core_values" USING btree ("_path");
  CREATE INDEX "pages_blocks_core_values_locale_idx" ON "pages_blocks_core_values" USING btree ("_locale");
  CREATE INDEX "pages_blocks_certificates_grid_certificates_order_idx" ON "pages_blocks_certificates_grid_certificates" USING btree ("_order");
  CREATE INDEX "pages_blocks_certificates_grid_certificates_parent_id_idx" ON "pages_blocks_certificates_grid_certificates" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_certificates_grid_certificates_locale_idx" ON "pages_blocks_certificates_grid_certificates" USING btree ("_locale");
  CREATE INDEX "pages_blocks_certificates_grid_certificates_image_idx" ON "pages_blocks_certificates_grid_certificates" USING btree ("image_id");
  CREATE INDEX "pages_blocks_certificates_grid_order_idx" ON "pages_blocks_certificates_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_certificates_grid_parent_id_idx" ON "pages_blocks_certificates_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_certificates_grid_path_idx" ON "pages_blocks_certificates_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_certificates_grid_locale_idx" ON "pages_blocks_certificates_grid" USING btree ("_locale");
  CREATE INDEX "pages_blocks_cta_bar_order_idx" ON "pages_blocks_cta_bar" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_bar_parent_id_idx" ON "pages_blocks_cta_bar" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_bar_path_idx" ON "pages_blocks_cta_bar" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_bar_locale_idx" ON "pages_blocks_cta_bar" USING btree ("_locale");
  CREATE INDEX "pages_blocks_two_column_content_order_idx" ON "pages_blocks_two_column_content" USING btree ("_order");
  CREATE INDEX "pages_blocks_two_column_content_parent_id_idx" ON "pages_blocks_two_column_content" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_two_column_content_path_idx" ON "pages_blocks_two_column_content" USING btree ("_path");
  CREATE INDEX "pages_blocks_two_column_content_locale_idx" ON "pages_blocks_two_column_content" USING btree ("_locale");
  CREATE INDEX "pages_blocks_two_column_content_image_idx" ON "pages_blocks_two_column_content" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_hero_image_idx" ON "pages" USING btree ("hero_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_locale_idx" ON "pages_rels" USING btree ("locale");
  CREATE INDEX "pages_rels_product_categories_id_idx" ON "pages_rels" USING btree ("product_categories_id","locale");
  CREATE INDEX "_pages_v_blocks_hero_slider_slides_order_idx" ON "_pages_v_blocks_hero_slider_slides" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_slider_slides_parent_id_idx" ON "_pages_v_blocks_hero_slider_slides" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_slider_slides_locale_idx" ON "_pages_v_blocks_hero_slider_slides" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_hero_slider_slides_background_image_idx" ON "_pages_v_blocks_hero_slider_slides" USING btree ("background_image_id");
  CREATE INDEX "_pages_v_blocks_hero_slider_order_idx" ON "_pages_v_blocks_hero_slider" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_slider_parent_id_idx" ON "_pages_v_blocks_hero_slider" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_slider_path_idx" ON "_pages_v_blocks_hero_slider" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_slider_locale_idx" ON "_pages_v_blocks_hero_slider" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_rich_text_order_idx" ON "_pages_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rich_text_parent_id_idx" ON "_pages_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_path_idx" ON "_pages_v_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_rich_text_locale_idx" ON "_pages_v_blocks_rich_text" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_image_gallery_images_order_idx" ON "_pages_v_blocks_image_gallery_images" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_gallery_images_parent_id_idx" ON "_pages_v_blocks_image_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_gallery_images_locale_idx" ON "_pages_v_blocks_image_gallery_images" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_image_gallery_images_image_idx" ON "_pages_v_blocks_image_gallery_images" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_image_gallery_order_idx" ON "_pages_v_blocks_image_gallery" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_gallery_parent_id_idx" ON "_pages_v_blocks_image_gallery" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_gallery_path_idx" ON "_pages_v_blocks_image_gallery" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_image_gallery_locale_idx" ON "_pages_v_blocks_image_gallery" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_product_grid_order_idx" ON "_pages_v_blocks_product_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_product_grid_parent_id_idx" ON "_pages_v_blocks_product_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_product_grid_path_idx" ON "_pages_v_blocks_product_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_product_grid_locale_idx" ON "_pages_v_blocks_product_grid" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_contact_form_order_idx" ON "_pages_v_blocks_contact_form" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_form_parent_id_idx" ON "_pages_v_blocks_contact_form" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_form_path_idx" ON "_pages_v_blocks_contact_form" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_contact_form_locale_idx" ON "_pages_v_blocks_contact_form" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_video_embed_side_images_order_idx" ON "_pages_v_blocks_video_embed_side_images" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_video_embed_side_images_parent_id_idx" ON "_pages_v_blocks_video_embed_side_images" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_video_embed_side_images_locale_idx" ON "_pages_v_blocks_video_embed_side_images" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_video_embed_side_images_image_idx" ON "_pages_v_blocks_video_embed_side_images" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_video_embed_order_idx" ON "_pages_v_blocks_video_embed" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_video_embed_parent_id_idx" ON "_pages_v_blocks_video_embed" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_video_embed_path_idx" ON "_pages_v_blocks_video_embed" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_video_embed_locale_idx" ON "_pages_v_blocks_video_embed" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_video_embed_thumbnail_image_idx" ON "_pages_v_blocks_video_embed" USING btree ("thumbnail_image_id");
  CREATE INDEX "_pages_v_blocks_core_values_values_order_idx" ON "_pages_v_blocks_core_values_values" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_core_values_values_parent_id_idx" ON "_pages_v_blocks_core_values_values" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_core_values_values_locale_idx" ON "_pages_v_blocks_core_values_values" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_core_values_order_idx" ON "_pages_v_blocks_core_values" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_core_values_parent_id_idx" ON "_pages_v_blocks_core_values" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_core_values_path_idx" ON "_pages_v_blocks_core_values" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_core_values_locale_idx" ON "_pages_v_blocks_core_values" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_certificates_grid_certificates_order_idx" ON "_pages_v_blocks_certificates_grid_certificates" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_certificates_grid_certificates_parent_id_idx" ON "_pages_v_blocks_certificates_grid_certificates" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_certificates_grid_certificates_locale_idx" ON "_pages_v_blocks_certificates_grid_certificates" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_certificates_grid_certificates_image_idx" ON "_pages_v_blocks_certificates_grid_certificates" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_certificates_grid_order_idx" ON "_pages_v_blocks_certificates_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_certificates_grid_parent_id_idx" ON "_pages_v_blocks_certificates_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_certificates_grid_path_idx" ON "_pages_v_blocks_certificates_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_certificates_grid_locale_idx" ON "_pages_v_blocks_certificates_grid" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_cta_bar_order_idx" ON "_pages_v_blocks_cta_bar" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_bar_parent_id_idx" ON "_pages_v_blocks_cta_bar" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_bar_path_idx" ON "_pages_v_blocks_cta_bar" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_bar_locale_idx" ON "_pages_v_blocks_cta_bar" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_two_column_content_order_idx" ON "_pages_v_blocks_two_column_content" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_two_column_content_parent_id_idx" ON "_pages_v_blocks_two_column_content" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_two_column_content_path_idx" ON "_pages_v_blocks_two_column_content" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_two_column_content_locale_idx" ON "_pages_v_blocks_two_column_content" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_two_column_content_image_idx" ON "_pages_v_blocks_two_column_content" USING btree ("image_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_hero_image_idx" ON "_pages_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_locale_idx" ON "_pages_v_rels" USING btree ("locale");
  CREATE INDEX "_pages_v_rels_product_categories_id_idx" ON "_pages_v_rels" USING btree ("product_categories_id","locale");
  CREATE INDEX "contact_submissions_updated_at_idx" ON "contact_submissions" USING btree ("updated_at");
  CREATE INDEX "contact_submissions_created_at_idx" ON "contact_submissions" USING btree ("created_at");
  CREATE UNIQUE INDEX "newsletter_subscribers_email_idx" ON "newsletter_subscribers" USING btree ("email");
  CREATE INDEX "newsletter_subscribers_updated_at_idx" ON "newsletter_subscribers" USING btree ("updated_at");
  CREATE INDEX "newsletter_subscribers_created_at_idx" ON "newsletter_subscribers" USING btree ("created_at");
  CREATE UNIQUE INDEX "languages_code_idx" ON "languages" USING btree ("code");
  CREATE INDEX "languages_updated_at_idx" ON "languages" USING btree ("updated_at");
  CREATE INDEX "languages_created_at_idx" ON "languages" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_product_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("product_categories_id");
  CREATE INDEX "payload_locked_documents_rels_news_id_idx" ON "payload_locked_documents_rels" USING btree ("news_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_contact_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_newsletter_subscribers_id_idx" ON "payload_locked_documents_rels" USING btree ("newsletter_subscribers_id");
  CREATE INDEX "payload_locked_documents_rels_languages_id_idx" ON "payload_locked_documents_rels" USING btree ("languages_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "site_settings_logo_white_idx" ON "site_settings" USING btree ("logo_white_id");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_main_menu_mega_menu_columns_links_order_idx" ON "navigation_main_menu_mega_menu_columns_links" USING btree ("_order");
  CREATE INDEX "navigation_main_menu_mega_menu_columns_links_parent_id_idx" ON "navigation_main_menu_mega_menu_columns_links" USING btree ("_parent_id");
  CREATE INDEX "navigation_main_menu_mega_menu_columns_links_image_idx" ON "navigation_main_menu_mega_menu_columns_links" USING btree ("image_id");
  CREATE UNIQUE INDEX "navigation_main_menu_mega_menu_columns_links_locales_locale_" ON "navigation_main_menu_mega_menu_columns_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_main_menu_mega_menu_columns_order_idx" ON "navigation_main_menu_mega_menu_columns" USING btree ("_order");
  CREATE INDEX "navigation_main_menu_mega_menu_columns_parent_id_idx" ON "navigation_main_menu_mega_menu_columns" USING btree ("_parent_id");
  CREATE INDEX "navigation_main_menu_mega_menu_columns_image_idx" ON "navigation_main_menu_mega_menu_columns" USING btree ("image_id");
  CREATE UNIQUE INDEX "navigation_main_menu_mega_menu_columns_locales_locale_parent" ON "navigation_main_menu_mega_menu_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_main_menu_order_idx" ON "navigation_main_menu" USING btree ("_order");
  CREATE INDEX "navigation_main_menu_parent_id_idx" ON "navigation_main_menu" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "navigation_main_menu_locales_locale_parent_id_unique" ON "navigation_main_menu_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "navigation_locales_locale_parent_id_unique" ON "navigation_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_rels_order_idx" ON "navigation_rels" USING btree ("order");
  CREATE INDEX "navigation_rels_parent_idx" ON "navigation_rels" USING btree ("parent_id");
  CREATE INDEX "navigation_rels_path_idx" ON "navigation_rels" USING btree ("path");
  CREATE INDEX "navigation_rels_product_categories_id_idx" ON "navigation_rels" USING btree ("product_categories_id");
  CREATE INDEX "footer_columns_order_idx" ON "footer_columns" USING btree ("_order");
  CREATE INDEX "footer_columns_parent_id_idx" ON "footer_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_columns_locales_locale_parent_id_unique" ON "footer_columns_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "footer_locales_locale_parent_id_unique" ON "footer_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_settings_hero_slides_order_idx" ON "homepage_settings_hero_slides" USING btree ("_order");
  CREATE INDEX "homepage_settings_hero_slides_parent_id_idx" ON "homepage_settings_hero_slides" USING btree ("_parent_id");
  CREATE INDEX "homepage_settings_hero_slides_background_image_idx" ON "homepage_settings_hero_slides" USING btree ("background_image_id");
  CREATE UNIQUE INDEX "homepage_settings_hero_slides_locales_locale_parent_id_uniqu" ON "homepage_settings_hero_slides_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_settings_promotion_video_side_images_order_idx" ON "homepage_settings_promotion_video_side_images" USING btree ("_order");
  CREATE INDEX "homepage_settings_promotion_video_side_images_parent_id_idx" ON "homepage_settings_promotion_video_side_images" USING btree ("_parent_id");
  CREATE INDEX "homepage_settings_promotion_video_side_images_image_idx" ON "homepage_settings_promotion_video_side_images" USING btree ("image_id");
  CREATE INDEX "homepage_settings_about_preview_about_preview_image_idx" ON "homepage_settings" USING btree ("about_preview_image_id");
  CREATE INDEX "homepage_settings_promotion_video_promotion_video_thumbn_idx" ON "homepage_settings" USING btree ("promotion_video_thumbnail_image_id");
  CREATE UNIQUE INDEX "homepage_settings_locales_locale_parent_id_unique" ON "homepage_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_settings_rels_order_idx" ON "homepage_settings_rels" USING btree ("order");
  CREATE INDEX "homepage_settings_rels_parent_idx" ON "homepage_settings_rels" USING btree ("parent_id");
  CREATE INDEX "homepage_settings_rels_path_idx" ON "homepage_settings_rels" USING btree ("path");
  CREATE INDEX "homepage_settings_rels_product_categories_id_idx" ON "homepage_settings_rels" USING btree ("product_categories_id");
  CREATE INDEX "homepage_settings_rels_news_id_idx" ON "homepage_settings_rels" USING btree ("news_id");
  CREATE INDEX "about_page_settings_values_cards_order_idx" ON "about_page_settings_values_cards" USING btree ("_order");
  CREATE INDEX "about_page_settings_values_cards_parent_id_idx" ON "about_page_settings_values_cards" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "about_page_settings_values_cards_locales_locale_parent_id_un" ON "about_page_settings_values_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_page_settings_hero_hero_image_idx" ON "about_page_settings" USING btree ("hero_image_id");
  CREATE INDEX "about_page_settings_content_content_image_idx" ON "about_page_settings" USING btree ("content_image_id");
  CREATE UNIQUE INDEX "about_page_settings_locales_locale_parent_id_unique" ON "about_page_settings_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "contact_page_settings_locales_locale_parent_id_unique" ON "contact_page_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "news_page_settings_hero_hero_image_idx" ON "news_page_settings" USING btree ("hero_image_id");
  CREATE UNIQUE INDEX "news_page_settings_locales_locale_parent_id_unique" ON "news_page_settings_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "ui_labels_locales_locale_parent_id_unique" ON "ui_labels_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "product_categories_technologies" CASCADE;
  DROP TABLE "product_categories_gallery" CASCADE;
  DROP TABLE "product_categories" CASCADE;
  DROP TABLE "product_categories_locales" CASCADE;
  DROP TABLE "news" CASCADE;
  DROP TABLE "news_locales" CASCADE;
  DROP TABLE "_news_v" CASCADE;
  DROP TABLE "_news_v_locales" CASCADE;
  DROP TABLE "pages_blocks_hero_slider_slides" CASCADE;
  DROP TABLE "pages_blocks_hero_slider" CASCADE;
  DROP TABLE "pages_blocks_rich_text" CASCADE;
  DROP TABLE "pages_blocks_image_gallery_images" CASCADE;
  DROP TABLE "pages_blocks_image_gallery" CASCADE;
  DROP TABLE "pages_blocks_product_grid" CASCADE;
  DROP TABLE "pages_blocks_contact_form" CASCADE;
  DROP TABLE "pages_blocks_video_embed_side_images" CASCADE;
  DROP TABLE "pages_blocks_video_embed" CASCADE;
  DROP TABLE "pages_blocks_core_values_values" CASCADE;
  DROP TABLE "pages_blocks_core_values" CASCADE;
  DROP TABLE "pages_blocks_certificates_grid_certificates" CASCADE;
  DROP TABLE "pages_blocks_certificates_grid" CASCADE;
  DROP TABLE "pages_blocks_cta_bar" CASCADE;
  DROP TABLE "pages_blocks_two_column_content" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_slider_slides" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_slider" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text" CASCADE;
  DROP TABLE "_pages_v_blocks_image_gallery_images" CASCADE;
  DROP TABLE "_pages_v_blocks_image_gallery" CASCADE;
  DROP TABLE "_pages_v_blocks_product_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_form" CASCADE;
  DROP TABLE "_pages_v_blocks_video_embed_side_images" CASCADE;
  DROP TABLE "_pages_v_blocks_video_embed" CASCADE;
  DROP TABLE "_pages_v_blocks_core_values_values" CASCADE;
  DROP TABLE "_pages_v_blocks_core_values" CASCADE;
  DROP TABLE "_pages_v_blocks_certificates_grid_certificates" CASCADE;
  DROP TABLE "_pages_v_blocks_certificates_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_bar" CASCADE;
  DROP TABLE "_pages_v_blocks_two_column_content" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "contact_submissions" CASCADE;
  DROP TABLE "newsletter_subscribers" CASCADE;
  DROP TABLE "languages" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  DROP TABLE "navigation_main_menu_mega_menu_columns_links" CASCADE;
  DROP TABLE "navigation_main_menu_mega_menu_columns_links_locales" CASCADE;
  DROP TABLE "navigation_main_menu_mega_menu_columns" CASCADE;
  DROP TABLE "navigation_main_menu_mega_menu_columns_locales" CASCADE;
  DROP TABLE "navigation_main_menu" CASCADE;
  DROP TABLE "navigation_main_menu_locales" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TABLE "navigation_locales" CASCADE;
  DROP TABLE "navigation_rels" CASCADE;
  DROP TABLE "footer_columns" CASCADE;
  DROP TABLE "footer_columns_locales" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "footer_locales" CASCADE;
  DROP TABLE "homepage_settings_hero_slides" CASCADE;
  DROP TABLE "homepage_settings_hero_slides_locales" CASCADE;
  DROP TABLE "homepage_settings_promotion_video_side_images" CASCADE;
  DROP TABLE "homepage_settings" CASCADE;
  DROP TABLE "homepage_settings_locales" CASCADE;
  DROP TABLE "homepage_settings_rels" CASCADE;
  DROP TABLE "about_page_settings_values_cards" CASCADE;
  DROP TABLE "about_page_settings_values_cards_locales" CASCADE;
  DROP TABLE "about_page_settings" CASCADE;
  DROP TABLE "about_page_settings_locales" CASCADE;
  DROP TABLE "contact_page_settings" CASCADE;
  DROP TABLE "contact_page_settings_locales" CASCADE;
  DROP TABLE "news_page_settings" CASCADE;
  DROP TABLE "news_page_settings_locales" CASCADE;
  DROP TABLE "ui_labels" CASCADE;
  DROP TABLE "ui_labels_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_news_status";
  DROP TYPE "public"."enum__news_v_version_status";
  DROP TYPE "public"."enum__news_v_published_locale";
  DROP TYPE "public"."enum_pages_blocks_image_gallery_columns";
  DROP TYPE "public"."enum_pages_blocks_cta_bar_style";
  DROP TYPE "public"."enum_pages_blocks_two_column_content_image_position";
  DROP TYPE "public"."enum_pages_hero_type";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_image_gallery_columns";
  DROP TYPE "public"."enum__pages_v_blocks_cta_bar_style";
  DROP TYPE "public"."enum__pages_v_blocks_two_column_content_image_position";
  DROP TYPE "public"."enum__pages_v_version_hero_type";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum_navigation_main_menu_mega_menu_columns_links_icon";
  DROP TYPE "public"."enum_navigation_main_menu_mega_menu_columns_column_type";
  DROP TYPE "public"."enum_navigation_main_menu_type";`)
}
