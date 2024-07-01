ALTER TABLE surveys ADD user_id INTEGER;
ALTER TABLE surveys ADD question_type VARCHAR(255) NOT NULL;
ALTER TABLE surveys ADD follow_up_question_key VARCHAR(255);
ALTER TABLE surveys ADD follow_up_question_type VARCHAR(255);
ALTER TABLE surveys ADD follow_up_question_text VARCHAR(255);
ALTER TABLE surveys ADD follow_up_question_response VARCHAR(255);

CREATE TABLE IF NOT EXISTS inline_questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    app_ref VARCHAR(255) NOT NULL UNIQUE,
    online_ref VARCHAR(255),
    user_id INTEGER NOT NULL,
    question_key VARCHAR(255) NOT NULL,
    question_type VARCHAR(255) NOT NULL,
    question_text VARCHAR(255) NOT NULL,
    question_response VARCHAR(255) NOT NULL,
    sub_chapter VARCHAR(255) NOT NULL,
    follow_up_question_key VARCHAR(255),
    follow_up_question_type VARCHAR(255),
    follow_up_question_text VARCHAR(255),
    follow_up_question_response VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255) NOT NULL,
    updated_by VARCHAR(255) NOT NULL
);
