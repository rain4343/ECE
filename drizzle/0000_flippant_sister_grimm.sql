CREATE TYPE "public"."allocation_status" AS ENUM('PLANNED', 'DISPATCHED', 'RECEIVED');--> statement-breakpoint
CREATE TYPE "public"."instrument_code" AS ENUM('FORM_1', 'FORM_2');--> statement-breakpoint
CREATE TYPE "public"."locale" AS ENUM('en', 'ar', 'ckb');--> statement-breakpoint
CREATE TYPE "public"."plan_entry_status" AS ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('SUPER_ADMIN', 'KINDERGARTEN_MANAGER', 'FIELD_MONITOR', 'COUNCIL_MEMBER', 'DISTRICT_EDUCATION');--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_id" uuid,
	"action" varchar(64) NOT NULL,
	"entity" varchar(64) NOT NULL,
	"entity_id" uuid,
	"kindergarten_id" uuid,
	"payload_hash" varchar(128),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "children" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kindergarten_id" uuid NOT NULL,
	"classroom_id" uuid,
	"registration_code" varchar(64) NOT NULL,
	"given_name" text NOT NULL,
	"family_name" text NOT NULL,
	"sex" varchar(16),
	"date_of_birth" timestamp,
	"disability_flag" integer DEFAULT 0 NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "classrooms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kindergarten_id" uuid NOT NULL,
	"code" varchar(32) NOT NULL,
	"name_en" text NOT NULL,
	"name_ar" text NOT NULL,
	"name_ckb" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "development_plan_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"section" varchar(32) NOT NULL,
	"gaps" text NOT NULL,
	"objective" text NOT NULL,
	"activities" text NOT NULL,
	"responsible" text NOT NULL,
	"timeframe" text NOT NULL,
	"resources" text NOT NULL,
	"indicator" text NOT NULL,
	"status" "plan_entry_status" DEFAULT 'NOT_STARTED' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "evaluation_instruments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" "instrument_code" NOT NULL,
	"version" varchar(32) NOT NULL,
	"title_en" text NOT NULL,
	"title_ar" text NOT NULL,
	"title_ckb" text NOT NULL,
	"schema" jsonb NOT NULL,
	"is_active" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "form_item_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"item_id" varchar(64) NOT NULL,
	"section" varchar(32) NOT NULL,
	"score" varchar(8) NOT NULL,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "form_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kindergarten_id" uuid NOT NULL,
	"form_code" "instrument_code" NOT NULL,
	"instrument_version" varchar(32) DEFAULT '1.0.0' NOT NULL,
	"academic_year" varchar(16) NOT NULL,
	"current_section" varchar(32),
	"status" varchar(16) DEFAULT 'DRAFT' NOT NULL,
	"overall_score" numeric(5, 2),
	"section_scores" jsonb,
	"assessor_id" uuid NOT NULL,
	"submitted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kindergartens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(32) NOT NULL,
	"name_en" text NOT NULL,
	"name_ar" text NOT NULL,
	"name_ckb" text NOT NULL,
	"education_directorate_id" text,
	"governorate" text,
	"address" text,
	"is_active" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "supply_allocations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kindergarten_id" uuid NOT NULL,
	"supply_item_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"academic_year" varchar(16) NOT NULL,
	"status" "allocation_status" DEFAULT 'PLANNED' NOT NULL,
	"allocated_by_id" uuid NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "supply_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sku" varchar(64) NOT NULL,
	"category" varchar(64) NOT NULL,
	"name_en" text NOT NULL,
	"name_ar" text NOT NULL,
	"name_ckb" text NOT NULL,
	"unit" varchar(32) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_site_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"kindergarten_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"display_name" text NOT NULL,
	"role" "user_role" NOT NULL,
	"preferred_locale" "locale" DEFAULT 'en' NOT NULL,
	"kindergarten_id" uuid,
	"education_directorate_id" text,
	"is_active" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "children" ADD CONSTRAINT "children_kindergarten_id_kindergartens_id_fk" FOREIGN KEY ("kindergarten_id") REFERENCES "public"."kindergartens"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "children" ADD CONSTRAINT "children_classroom_id_classrooms_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "public"."classrooms"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classrooms" ADD CONSTRAINT "classrooms_kindergarten_id_kindergartens_id_fk" FOREIGN KEY ("kindergarten_id") REFERENCES "public"."kindergartens"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "development_plan_entries" ADD CONSTRAINT "development_plan_entries_submission_id_form_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_item_responses" ADD CONSTRAINT "form_item_responses_submission_id_form_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_kindergarten_id_kindergartens_id_fk" FOREIGN KEY ("kindergarten_id") REFERENCES "public"."kindergartens"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_assessor_id_users_id_fk" FOREIGN KEY ("assessor_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supply_allocations" ADD CONSTRAINT "supply_allocations_kindergarten_id_kindergartens_id_fk" FOREIGN KEY ("kindergarten_id") REFERENCES "public"."kindergartens"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supply_allocations" ADD CONSTRAINT "supply_allocations_supply_item_id_supply_items_id_fk" FOREIGN KEY ("supply_item_id") REFERENCES "public"."supply_items"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supply_allocations" ADD CONSTRAINT "supply_allocations_allocated_by_id_users_id_fk" FOREIGN KEY ("allocated_by_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_site_assignments" ADD CONSTRAINT "user_site_assignments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_site_assignments" ADD CONSTRAINT "user_site_assignments_kindergarten_id_kindergartens_id_fk" FOREIGN KEY ("kindergarten_id") REFERENCES "public"."kindergartens"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_kindergarten_id_kindergartens_id_fk" FOREIGN KEY ("kindergarten_id") REFERENCES "public"."kindergartens"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_entity_idx" ON "audit_logs" USING btree ("entity","entity_id");--> statement-breakpoint
CREATE INDEX "audit_created_idx" ON "audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "audit_site_idx" ON "audit_logs" USING btree ("kindergarten_id");--> statement-breakpoint
CREATE UNIQUE INDEX "children_reg_code_uidx" ON "children" USING btree ("registration_code");--> statement-breakpoint
CREATE INDEX "children_kindergarten_idx" ON "children" USING btree ("kindergarten_id");--> statement-breakpoint
CREATE INDEX "children_classroom_idx" ON "children" USING btree ("classroom_id");--> statement-breakpoint
CREATE UNIQUE INDEX "classrooms_site_code_uidx" ON "classrooms" USING btree ("kindergarten_id","code");--> statement-breakpoint
CREATE INDEX "classrooms_kindergarten_idx" ON "classrooms" USING btree ("kindergarten_id");--> statement-breakpoint
CREATE UNIQUE INDEX "plan_submission_section_uidx" ON "development_plan_entries" USING btree ("submission_id","section");--> statement-breakpoint
CREATE UNIQUE INDEX "instruments_code_version_uidx" ON "evaluation_instruments" USING btree ("code","version");--> statement-breakpoint
CREATE UNIQUE INDEX "response_submission_item_uidx" ON "form_item_responses" USING btree ("submission_id","item_id");--> statement-breakpoint
CREATE INDEX "response_section_idx" ON "form_item_responses" USING btree ("submission_id","section");--> statement-breakpoint
CREATE INDEX "submissions_site_idx" ON "form_submissions" USING btree ("kindergarten_id");--> statement-breakpoint
CREATE INDEX "submissions_form_idx" ON "form_submissions" USING btree ("form_code");--> statement-breakpoint
CREATE INDEX "submissions_year_idx" ON "form_submissions" USING btree ("academic_year");--> statement-breakpoint
CREATE INDEX "submissions_assessor_idx" ON "form_submissions" USING btree ("assessor_id");--> statement-breakpoint
CREATE UNIQUE INDEX "kindergartens_code_uidx" ON "kindergartens" USING btree ("code");--> statement-breakpoint
CREATE INDEX "kindergartens_active_idx" ON "kindergartens" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "alloc_site_idx" ON "supply_allocations" USING btree ("kindergarten_id");--> statement-breakpoint
CREATE INDEX "alloc_item_idx" ON "supply_allocations" USING btree ("supply_item_id");--> statement-breakpoint
CREATE INDEX "alloc_year_idx" ON "supply_allocations" USING btree ("academic_year");--> statement-breakpoint
CREATE UNIQUE INDEX "alloc_site_item_year_uidx" ON "supply_allocations" USING btree ("kindergarten_id","supply_item_id","academic_year");--> statement-breakpoint
CREATE UNIQUE INDEX "supply_sku_uidx" ON "supply_items" USING btree ("sku");--> statement-breakpoint
CREATE UNIQUE INDEX "user_site_uidx" ON "user_site_assignments" USING btree ("user_id","kindergarten_id");--> statement-breakpoint
CREATE INDEX "user_site_user_idx" ON "user_site_assignments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_site_kg_idx" ON "user_site_assignments" USING btree ("kindergarten_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_uidx" ON "users" USING btree (lower("email"));--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" USING btree ("role");--> statement-breakpoint
CREATE INDEX "users_kindergarten_idx" ON "users" USING btree ("kindergarten_id");