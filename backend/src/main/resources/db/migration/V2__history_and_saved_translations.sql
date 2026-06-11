CREATE TABLE IF NOT EXISTS public.translation_history (
    id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
    user_id UUID NOT NULL,
    source_text TEXT NOT NULL,
    translated_text TEXT NOT NULL,
    source_language VARCHAR(10) NOT NULL,
    target_language VARCHAR(10) NOT NULL,
    model_used VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX idx_translation_history_user_id ON public.translation_history(user_id);
CREATE INDEX idx_translation_history_user_created ON public.translation_history(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.saved_translations (
    id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
    user_id UUID NOT NULL,
    translation_id UUID NOT NULL,
    title VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
    CONSTRAINT uq_saved_translations_user_translation UNIQUE (user_id, translation_id)
);

CREATE INDEX idx_saved_translations_user_id ON public.saved_translations(user_id);
