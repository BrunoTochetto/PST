-- =========================
-- USUÁRIOS
-- =========================

INSERT INTO usuarios (nome, email, cep, senha)
VALUES
    ('Ana Silva', 'ana@email.com', '89700-000', '123456'),
    ('João Santos', 'joao@email.com', '89701-000', '123456'),
    ('Maria Oliveira', 'maria@email.com', '89702-000', '123456');


-- =========================
-- GÊNEROS
-- =========================

INSERT INTO genero (nome)
VALUES
    ('Araucaria'),
    ('Eucalyptus'),
    ('Myrtaceae'),
    ('Fabaceae'),
    ('Lauraceae'),
    ('Asteraceae');


-- =========================
-- PLANTAS
-- =========================

INSERT INTO plantas
(nome_comum, id_genero, id_usuario, descricao, imagem_url)
VALUES
(
    'Araucária',
    1,
    1,
    'Árvore característica da região Sul do Brasil, conhecida também como pinheiro-do-paraná.',
    'https://upload.wikimedia.org/wikipedia/commons/0/0a/Araucaria_angustifolia.jpg'
),
(
    'Eucalipto',
    2,
    2,
    'Árvore de crescimento rápido, bastante utilizada para produção de madeira e papel.',
    'https://upload.wikimedia.org/wikipedia/commons/6/6f/Eucalyptus_tree.jpg'
),
(
    'Pitanga',
    3,
    1,
    'Árvore frutífera nativa da Mata Atlântica, conhecida pelos seus frutos vermelhos.',
    'https://upload.wikimedia.org/wikipedia/commons/5/5a/Eugenia_uniflora.jpg'
),
(
    'Ingá',
    4,
    3,
    'Árvore nativa brasileira que produz frutos com polpa branca e adocicada.',
    'https://upload.wikimedia.org/wikipedia/commons/8/83/Inga_vera.jpg'
),
(
    'Canela',
    5,
    2,
    'Árvore característica das regiões de Mata Atlântica e Floresta de Araucárias.',
    'https://upload.wikimedia.org/wikipedia/commons/0/0f/Ocotea_odora.jpg'
),
(
    'Marcela',
    6,
    3,
    'Planta herbácea conhecida por suas flores amarelas e pelo uso tradicional em infusões.',
    'https://upload.wikimedia.org/wikipedia/commons/8/87/Achyrocline_satureioides.jpg'
);


-- =========================
-- MARCADORES
-- =========================

INSERT INTO marcadores
(id_planta, latitude, longitude)
VALUES
    (1, -27.0086, -51.1517),
    (2, -27.0050, -51.1500),
    (3, -27.0100, -51.1550),
    (4, -27.0150, -51.1600),
    (5, -27.0200, -51.1450),
    (6, -27.0250, -51.1400);