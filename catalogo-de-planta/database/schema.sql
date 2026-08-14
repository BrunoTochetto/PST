CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    cep VARCHAR(20),
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE genero (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL
);

CREATE TABLE plantas (
    id SERIAL PRIMARY KEY,
    nome_comum VARCHAR(255) NOT NULL,
    id_genero INTEGER NOT NULL,
    id_usuario INTEGER,
    descricao TEXT,
    imagem_url TEXT,

    CONSTRAINT fk_planta_genero
        FOREIGN KEY (id_genero)
        REFERENCES genero(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_planta_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id)
        ON DELETE SET NULL
);

CREATE TABLE marcadores (
    id SERIAL PRIMARY KEY,
    id_planta INTEGER NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,

    CONSTRAINT fk_marcador_planta
        FOREIGN KEY (id_planta)
        REFERENCES plantas(id)
        ON DELETE CASCADE
);