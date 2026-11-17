-- =========================
-- USUÁRIOS
-- =========================

INSERT INTO usuarios (nome, email, cep, senha)
VALUES
    ('Ana Silva', 'ana@email.com', '89700-000', '$2b$10$03e0VcPxPuHRH3Zqw1Pxmuu1wwFsg4.p4w111kKPmDwMKVwfqNpOW'),
    ('João Santos', 'joao@email.com', '89701-000', '$2b$10$03e0VcPxPuHRH3Zqw1Pxmuu1wwFsg4.p4w111kKPmDwMKVwfqNpOW'),
    ('Maria Oliveira', 'maria@email.com', '89702-000', '$2b$10$03e0VcPxPuHRH3Zqw1Pxmuu1wwFsg4.p4w111kKPmDwMKVwfqNpOW');


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
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVk3sihm-LvSlSTfBXAk2pi9ISruzZyRXa879a5oaxvTIS1C8G-5I_LHE&s=10'
),
(
    'Eucalipto',
    2,
    2,
    'Árvore de crescimento rápido, bastante utilizada para produção de madeira e papel.',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVpIvujjGMbyUCShrsZFuFKt2t36NHxNFbBXurm7TjZa0h2oj_yRkEREoa&s=10'
),
(
    'Pitanga',
    3,
    1,
    'Árvore frutífera nativa da Mata Atlântica, conhecida pelos seus frutos vermelhos.',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4Z_jUTfeqAy8xiZa5AHF4MW3LOSOYSA-DoH3DFRyijg&s=10'
),
(
    'Ingá',
    4,
    3,
    'Árvore nativa brasileira que produz frutos com polpa branca e adocicada.',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTflxHfGdSbPT1bL-CpZpLVsiNStWncnS2NxgpRuHzObrVcn_YP2AuGRS2l&s=10'
),
(
    'Canela',
    5,
    2,
    'Árvore característica das regiões de Mata Atlântica e Floresta de Araucárias.',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX_459fQhDSEAhmHCBHBXiUdEjvyqy9UoVZJ7s7OJfZVCb3_WbFJMxRW6Q&s=10'
),
(
    'Marcela',
    6,
    3,
    'Planta herbácea conhecida por suas flores amarelas e pelo uso tradicional em infusões.',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTY6jQBaM-CER30QaKd0cKi6YcEK5aWG5voM7TItXOfww&s=10'
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