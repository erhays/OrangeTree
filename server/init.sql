CREATE TABLE IF NOT EXISTS customer (
    id         SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name  TEXT NOT NULL,
    email      TEXT NOT NULL UNIQUE,
    phone      TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS appointment (
    id           SERIAL PRIMARY KEY,
    customer_id  INTEGER NOT NULL REFERENCES customer(id) ON DELETE CASCADE,
    date_time    TIMESTAMP NOT NULL,
    service_type TEXT NOT NULL,
    status       TEXT NOT NULL DEFAULT 'Scheduled',
    notes        TEXT,
    created_at   TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_inquiry (
    id         SERIAL PRIMARY KEY,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL,
    message    TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
    id            SERIAL PRIMARY KEY,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS post (
    id         SERIAL PRIMARY KEY,
    title      TEXT NOT NULL,
    body       TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO post (title, body) SELECT
    'Welcome to OrangeTree Detailing',
    'We''re thrilled to launch our new website! Whether you''re looking for a quick refresh or a full premium detail, our team is ready to bring your vehicle back to showroom condition. Book an appointment online or reach out with any questions — we''d love to hear from you.'
WHERE NOT EXISTS (SELECT 1 FROM post LIMIT 1);
