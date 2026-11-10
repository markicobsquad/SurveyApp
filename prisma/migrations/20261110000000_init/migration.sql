CREATE TABLE "survey_responses" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status_mahasiswa" TEXT NOT NULL,
    "angkatan" TEXT NOT NULL,
    "program_studi" TEXT NOT NULL,
    "jumlah_grup_wa" TEXT NOT NULL,
    "sumber_info" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "sumber_info_lainnya" TEXT,
    "kejadian" JSONB NOT NULL,
    "penyebab_utama" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "penyebab_lainnya" TEXT,
    "wifi_hambatan" INTEGER NOT NULL,
    "sulit_tempat_belajar" INTEGER NOT NULL,
    "sulit_bahasa" INTEGER,
    "kebermanfaatan" JSONB NOT NULL,
    "manfaat_keseluruhan" INTEGER NOT NULL,
    "bersedia_uji_coba" TEXT NOT NULL,
    "fitur_tambahan" TEXT,
    "kontak" TEXT,

    CONSTRAINT "survey_responses_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "survey_responses_wifi_hambatan_check" CHECK ("wifi_hambatan" BETWEEN 1 AND 5),
    CONSTRAINT "survey_responses_sulit_tempat_belajar_check" CHECK ("sulit_tempat_belajar" BETWEEN 1 AND 5),
    CONSTRAINT "survey_responses_sulit_bahasa_check" CHECK ("sulit_bahasa" IS NULL OR "sulit_bahasa" BETWEEN 1 AND 5),
    CONSTRAINT "survey_responses_manfaat_keseluruhan_check" CHECK ("manfaat_keseluruhan" BETWEEN 1 AND 5)
);

CREATE INDEX "survey_responses_created_at_idx" ON "survey_responses"("created_at" DESC);
