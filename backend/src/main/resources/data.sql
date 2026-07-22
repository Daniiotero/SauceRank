-- Albums
INSERT INTO albums (name, year, cover_url, type, spotify_playlist_id) VALUES
('CORSA', 2026, '/covers/portada corsa.png', 'ALBUM', '5JNyi6vWb9zTfxa9zDHrZr'),
('DON KBRN', 2025, '/covers/portadaDonKbrn.png', 'ALBUM', '77WXheyyYBkqqz6Q19l37a'),
('Porque Puedo', 2024, '/covers/portadaPorquePuedo.png', 'EP', '1yHXJzuDKUHwR0kM0oah82'),
('Sol Maria', 2024, '/covers/portadaSolMaria.png', 'ALBUM', '2zE9RJSh5sMV0NJ8Oc8k5s'),
('3MEN2 KBRN', 2023, '/covers/portada3mendoKbron.png', 'ALBUM', '6BGN5CVd7koJApotl5Bj8u'),
('SEN2 KBRN VOL. 2', 2022, '/covers/portadaSendoKbrnVol2.png', 'MIXTAPE', '3lsdB3dY4odywNI42KV6D9'),
('SEN2 KBRN VOL. 1', 2021, '/covers/portadaSendoKbrnVol1.png', 'MIXTAPE', '7rzr5GOIXMfA41aIkzGtvo'),
('Sauce Boyz 2', 2021, '/covers/portadaSauceBoy2.png', 'ALBUM', '4JaYe7HIddzNaF3rUgJzHI'),
('Monarca', 2021, '/covers/portadaMonarca.png', 'ALBUM', '6N1iKBKY8zRGImxADk2IdN'),
('Sauce Boyz', 2020, '/covers/portadaSauceboyz.png', 'ALBUM', '2JwUsV3QP7FMWx1Fzt6dHQ')
ON CONFLICT (name) DO UPDATE SET spotify_playlist_id = EXCLUDED.spotify_playlist_id;

-- CORSA (2026)
INSERT INTO songs (album_id, title, track_number, featured_artists, spotify_track_id) VALUES
(1, 'Intro', 1, NULL, '4YYnhfBK9OLPRJk478K4Ad'),
(1, 'Ricky Bobby', 2, NULL, '24IeBGZDIeRA4H6EpQz8D0'),
(1, 'Daikoku', 3, 'Topboy TGR', '6g1c531586S5DzdWYraRzv'),
(1, 'Body', 4, NULL, '2LDvRwKpty6vuYWGGAYs75'),
(1, 'Polaroid', 5, NULL, '7HzLGyZkbUtatOACuwO75x'),
(1, 'Estrella', 6, NULL, '6PnXTyFIJIW16j9ut633vJ'),
(1, 'Impredecible', 7, 'Mora', '6RlMyEKTup093DPweRgiSB'),
(1, 'Benji', 8, NULL, '5PShMDs2Q5JhGSxglof6Ke'),
(1, 'GUWOP', 9, 'Midnvght', '5lCRYLZJ0OdPvCnOpAjCrR'),
(1, 'Kimchi', 10, 'Myke Towers', '48V5ToWtSra9nzF0no4rqn'),
(1, 'Money En Mi Mente', 11, NULL, '3PArXxgR4SPPLMKew69pnG'),
(1, 'De Chamaquitx', 12, 'Cazzu', '1KhoFLVowDHqt1hu9hSNzx'),
(1, 'Confio En Mi', 13, NULL, '5h9znCYmisdpDbBftzeIei'),
(1, 'Carta Para Mis Fans', 14, NULL, '3gGM3txFbnEnYJObH90u0g'),
(1, 'La Vida', 15, NULL, '07DUeK6z4knyXHhEjjkjid')
ON CONFLICT (album_id, title) DO UPDATE SET spotify_track_id = EXCLUDED.spotify_track_id;

-- DON KBRN (2025)
INSERT INTO songs (album_id, title, track_number, featured_artists, spotify_track_id) VALUES
(2, 'Invencible', 1, NULL, '4Vc16xSZRb0t7V8A22akHH'),
(2, 'Ohtani', 2, NULL, '7MJVcGtxARJzYfU6CIttGa'),
(2, 'Vetements', 3, 'Myke Towers', '7DACCN4AceR9hgiP9s99PC'),
(2, 'H.I.M.', 4, NULL, '4fZUG9dMyqlIFSnf1iitm1'),
(2, 'Broly', 5, 'Neutro Shorty', '59JV4rlxRU7jbuhnDIXOg9'),
(2, 'Call My Line', 6, 'Jessie Reyez', '1KjVJymj5fmMCqtkwVxrDU'),
(2, '100 Conmigo', 7, NULL, '4sMLOi2r2M2gJeO4qeZB7A'),
(2, 'Tiffany', 8, 'Peso Pluma', '0xL0nSOiZzaVHnbakk5YUw'),
(2, 'El Reggaeton del Disco', 9, 'Cris MJ', '15F8m8VShRlBXmSbwZBUTt'),
(2, 'Me Muero', 10, 'Lia Kali', '4MfDHmbJQNpeBp83uSlsSa'),
(2, 'Cuenta a 10', 11, NULL, '0fAVeCYN4LkkDaIZ7A8yLE'),
(2, 'Branzino', 12, 'Big Sean', '2JoIp9pZeJRaJmKUkzhATH'),
(2, 'Cancela To (Skit)', 13, NULL, '5WBeXBhG1v3qdG9LFS8ERG'),
(2, 'E.L.A.D.I.O.', 14, NULL, '0eKR4cgwtJTP8Bu2rsEs5C'),
(2, 'Mosh Pit Muzik', 15, NULL, '64zvGHyTuzS5hcY1qI9Hjb'),
(2, 'Comodo', 16, NULL, '2D5aL6xaUtfYYwnRPIejkH'),
(2, 'AMG', 17, 'Young Miko', '0JLhX4LHGL1DYBgrp8STgs'),
(2, 'Ozil', 18, NULL, '5kMrQKRMj5uODKiOqaTbBF'),
(2, 'Romeo y Julieta', 19, 'Quevedo', '4hY6swYPVeFVKFaormmzez'),
(2, 'Piedras en la Ventana', 20, NULL, '6a78lsclHfvHEMES2X5BT7'),
(2, 'Y U So Cold?', 21, NULL, '2HYGBPJmQiP7TBdoGdUX5Y'),
(2, 'Carta a Dios 2', 22, NULL, '3xNMIlapTnqg4zZ4Vz7tzE')
ON CONFLICT (album_id, title) DO UPDATE SET spotify_track_id = EXCLUDED.spotify_track_id;

-- Porque Puedo EP (2024)
INSERT INTO songs (album_id, title, track_number, featured_artists, spotify_track_id) VALUES
(3, 'Heavyweight', 1, NULL, '75GbllGszQynPdm2qj78Lu'),
(3, 'Don KBRN Freestyle', 2, NULL, '4y6avDOMg27PS7n71aOZZB'),
(3, 'Codigo G', 3, NULL, '7kXFHkoWcqtRc3vJEmYkmN'),
(3, 'Henny Mood', 4, NULL, '29r9oYmyt4rEEbeHaoAGJ8'),
(3, 'Susanoo', 5, NULL, '7JzXQByRyTjgtYzDaymfvk')
ON CONFLICT (album_id, title) DO UPDATE SET spotify_track_id = EXCLUDED.spotify_track_id;

-- Sol Maria (2024)
INSERT INTO songs (album_id, title, track_number, featured_artists, spotify_track_id) VALUES
(4, 'Bendecido', 1, NULL, '3ZV60LVhqQ2uHXG6LL6F0V'),
(4, 'La Cancion Feliz Del Disco', 2, 'Milo J', '3vP62cjz1b4QvUS5vSyEVY'),
(4, 'TQMQA', 3, NULL, '0Xm7WesKiHAAbLYluGqBZ7'),
(4, 'Sonrisa', 4, NULL, '3MbbbpxLOnWUCpzS6hRN4e'),
(4, 'Sigo Enamorau', 5, 'Yandel', '6v9Sbtpt6par16uCnlvm98'),
(4, 'Tu Ritmo', 6, NULL, '7JArcReBGffsbhMaosvQR0'),
(4, 'Hey Lil Mama', 7, 'Rauw Alejandro', '5QtB74eCS2YzHvEfSlh8MG'),
(4, 'Tranquila Baby', 8, NULL, '794Avy9oTKvi8SGWSO1tXQ'),
(4, 'Tanta Droga', 9, 'Arcangel & De La Ghetto', '39wiPEmqQ4J3vS16j6X9Ki'),
(4, 'El Malo', 10, 'Sech', '144k7KOL7ZPopw7rTTzzXN'),
(4, 'Fe, Cojones y Paciencia', 11, NULL, '0KK2eoNnggdrfUU6sMqRoR'),
(4, 'Todo Lit', 12, 'Duki', '1oxSzLgFPeFm5o6y7Bxie9'),
(4, 'That Motherf*cker Eladio', 13, NULL, '71Vh78nrCxBZGTltiHAD0H'),
(4, 'Mencionar', 14, NULL, '5gEkHtIiOoTuKqcMyxVrqJ'),
(4, 'RKO', 15, NULL, '4KglpGG1pPLuXmO4lxrIaQ'),
(4, 'Luchas Mentales', 16, NULL, '1f70ywNtUyw4VgckqXeuOv'),
(4, 'Mama Boy', 17, 'Nach', '6s0WTmorTss8VsEzsHApKt')
ON CONFLICT (album_id, title) DO UPDATE SET spotify_track_id = EXCLUDED.spotify_track_id;

-- 3MEN2 KBRN (2023)
INSERT INTO songs (album_id, title, track_number, featured_artists, spotify_track_id) VALUES
(5, 'Padre Tiempo', 1, NULL, '1PtXtGJSDKTkB5urVEZ7rf'),
(5, 'Gladiador (Remix)', 2, 'Lil Wayne', '1IbYD5V9zCvkPfIPcWqerO'),
(5, 'El Hokage', 3, NULL, '5GZ4tx6VZxM7V4IQtSJFyx'),
(5, 'Mbappe (Remix)', 4, 'Future', '1T6CF1qnG0hK0absyeVL5H'),
(5, 'Si Salimos', 5, '50 Cent', '7GfQEUSuqYGeY2L0BfVOXM'),
(5, 'Que Carajos Quieres Tu Ahora?', 6, NULL, '7GuEE0ydKmuXV5DVliachs'),
(5, 'Cuevita', 7, NULL, '3LGn1d8P4Na3WHvYwCE6NL'),
(5, 'Coco Chanel', 8, 'Bad Bunny', '0PB0O24JqAuNdOAFVJljMS'),
(5, 'Si La Calle Llama (Remix)', 9, 'Myke Towers', '3qXZqXGniqNt3PK2CBSZgM'),
(5, 'Peso a Peso', 10, 'Quavo & Rich The Kid & Nengo Flow', '1iyvRYYAeuJhrsxTsQW9fh'),
(5, 'Mala Mia Otra Vez', 11, NULL, '422ogeWJwcQaKyJhsleacY'),
(5, 'Friends (Remix)', 12, 'Lil Tjay & Luar La L', '54iyLNmcnLWNdCqX5pdtuL'),
(5, 'Quizas, Tal Vez', 13, NULL, '15malicZv4vdLHzIXg5kK0'),
(5, 'M3', 14, 'Fivio Foreign', '4WDRKKpJiEZ6DK6FFM3pkZ'),
(5, 'Betty', 15, NULL, '5Ov2yPhOmhL5qvlnU3UBpZ'),
(5, 'Haciendo Dinero', 16, NULL, '76qcIul6DB0y4OPzOMSkNU'),
(5, 'Como? (Skit)', 17, NULL, '5G17G6fPn9Gcy037CdX9Nx'),
(5, 'Air France', 18, NULL, '6wrHRPtw1Z37iP5PGDbS6g')
ON CONFLICT (album_id, title) DO UPDATE SET spotify_track_id = EXCLUDED.spotify_track_id;

-- SEN2 KBRN VOL. 2 (2022)
INSERT INTO songs (album_id, title, track_number, featured_artists, spotify_track_id) VALUES
(6, 'Gladiador', 1, NULL, '2sY92LRATo3fwPzmDo0wwt'),
(6, 'Si la Calle Llama', 2, NULL, '32nYQxfwMslxlbhgm48B3o'),
(6, 'Mbappe', 3, NULL, '2lmWwBLVJ2P0HX491zkYws'),
(6, 'Hp Freestyle', 4, NULL, '0ea9jt0vWPgR5Jm2P4q70z'),
(6, 'Caras Vemos', 5, NULL, '6NSt2HFIMe5dEDo7Aq2Tf5'),
(6, 'Hugo', 6, NULL, '3oCSBlJniNwxVQfq1R2ROt'),
(6, 'Te Dijeron', 7, NULL, '53KWPG6uE5DCFwbF9K6qH0'),
(6, 'Friends', 8, NULL, '4rzWmtnly4bVIi6QGUETV0'),
(6, 'La Fama', 9, NULL, '3Lk9DyjczkS9qf8PlJgBYj'),
(6, 'Carta a Dios', 10, NULL, '5ZLWuh52L4vvIVlRsjFhga')
ON CONFLICT (album_id, title) DO UPDATE SET spotify_track_id = EXCLUDED.spotify_track_id;

-- SEN2 KBRN VOL. 1 (2021)
INSERT INTO songs (album_id, title, track_number, featured_artists, spotify_track_id) VALUES
(7, 'Guerrero', 1, NULL, '1aLMuy142vA5gMq1OxQxUQ'),
(7, 'Midas', 2, NULL, '6ZxQu3WmtKGzm6yeSKsaz0'),
(7, '5 Star', 3, NULL, '5B840Ui53HVbqRNJmuZvDF'),
(7, 'Problema', 4, NULL, '734ZXeQ454V5VN15GETKt2'),
(7, 'Paz Mental', 5, NULL, '7vhIpemqMF1mcNWdTNDfjF'),
(7, 'Sauce Boy Freestyle 4', 6, NULL, '4ValVjUZweYXAnu3444wFa'),
(7, 'AL CAPONE', 7, NULL, '6KAWHhTnc0cjaNSHcmCs72'),
(7, 'La H', 8, NULL, '4ju7kar249CQKWu2s5uHFg'),
(7, 'La Novena', 9, NULL, '2aopsHyJhzLOPqNQo7IVqL')
ON CONFLICT (album_id, title) DO UPDATE SET spotify_track_id = EXCLUDED.spotify_track_id;

-- Sauce Boyz 2 (2021)
INSERT INTO songs (album_id, title, track_number, featured_artists, spotify_track_id) VALUES
(8, 'Par de Tenis', 1, NULL, '7iGX6Xdi2EnYqBqvzEVEVC'),
(8, 'Claro Cristal', 2, NULL, '2N6a6lmyj9DytOAPiUB11R'),
(8, 'No Te Deseo el Mal', 3, 'Karol G', '3HQxzXOb4p9pfpD5gP38D5'),
(8, 'Flores en Anonimo', 4, NULL, '62pg2fFuBb6zgU2gqJR8kP'),
(8, 'Fuego', 5, NULL, '2bEjeBM3MVspWXXbor9H32'),
(8, 'Miradas Raras', 6, 'Sech', '090hDgrCGBBnex7ojpX9Fi'),
(8, 'Me Gustas Natural', 7, 'Rels B', '1Sym1HsTqsa2pYKhYL1j15'),
(8, 'Quienes Son Ustedes', 8, NULL, '4qdJeQlPfs2sKSHWUVchpi'),
(8, 'Alejarme de Ti', 9, 'Jay Wheeler', '4YV8COy6CS7PBFHw0AO4pF'),
(8, 'Gastar', 10, NULL, '7jZGELQvY3aZKaCIQVqwSY'),
(8, 'Hola Como Vas', 11, NULL, '0MEZYGMSPxNwUO4nAdQRBW'),
(8, 'Sin Frenos', 12, 'Bizarrap & Duki', '1b62AO1IzcVr5SOgoguc9o'),
(8, 'Socio', 13, 'Luar La L', '2H4SvdfK9ret8B4cjNvrum'),
(8, 'Jovenes Millonarios', 14, 'Myke Towers', '4EbNxZ6ei9q1imUf2Hyo90'),
(8, 'No Me Importa un Carajo', 15, 'Ovi', '1OGhv7OFVVIKsbVD3g4MAR'),
(8, 'Mami Dijo', 16, NULL, '6miAVDdheid0YA8WTmzNQ6'),
(8, 'Cheque', 17, 'Jon Z & Noriel', '2Ah0LPGczp8OKkGZOA5IC6'),
(8, 'Como Sea', 18, 'Arcangel', '5K42LXYdwB905rlqgDA6Qg'),
(8, 'Primera Vez', 19, 'Nicky Jam', '0jRnQ0qTi3BRei6p0AunAH'),
(8, 'Cuarentena', 20, NULL, '7zNGzcGEnfVld7PdlXSeSa'),
(8, 'Touch Your Body', 21, NULL, '2FabnqpCzc59bbFo5kw4IF'),
(8, 'Sauce Boy Freestyle 5', 22, NULL, '69L3B6ZuwodK4NL8bAPgJc')
ON CONFLICT (album_id, title) DO UPDATE SET spotify_track_id = EXCLUDED.spotify_track_id;

-- Monarca (2021)
INSERT INTO songs (album_id, title, track_number, featured_artists, spotify_track_id) VALUES
(9, 'Mírame', 1, NULL, '6BFkiR2zXUC8JB2Kt4oknR'),
(9, 'Mariposas', 2, NULL, '6clBlaFDHCzyDaDkbX7Dnv'),
(9, 'Nena Buena', 3, 'Lunay', '3yaBstYCoYIfiQbAxTAxcT'),
(9, 'Progreso', 4, NULL, '3KZjrz47rzU8D6EpGTXKr2'),
(9, 'Todo o Nada', 5, 'Corina Smith', '2zdHRQTOBDk8mM8xBzziFh'),
(9, 'Tata', 6, 'J Balvin', '4h4ZykphGhv6HoomNndhm3'),
(9, 'Mami Me Pregunta Si Trapeo', 7, NULL, '0r8ZTj61xBtfUMrAOiOPvG'),
(9, 'Toretto', 8, NULL, '73ERt6sbMtVNgo4PTROP3z'),
(9, 'Ele Uve (Remix)', 9, 'Natanael Cano, Ovi, Noriel', '28gbcedjSMDS6DHB2t7U03'),
(9, 'Sauce Boy Freestyle 3', 10, NULL, '1me5LZYysJSVGb88oHMmsV'),
(9, 'Adiós', 11, NULL, '1vjvZkoc8FZz26axllh6yD'),
(9, 'Discoteca', 12, 'Yandel & Cazzu', '2ZWBNTg6Mn6NQkkq4gVec1'),
(9, '4 AM', 13, NULL, '2oJ1QO7pGqUk1mOCPZh4W4'),
(9, 'Mala Mia 2', 14, NULL, '7vaKZW45LNtK0H5JD0yHBu')
ON CONFLICT (album_id, title) DO UPDATE SET spotify_track_id = EXCLUDED.spotify_track_id;

-- Sauce Boyz (2020)
INSERT INTO songs (album_id, title, track_number, featured_artists, spotify_track_id) VALUES
(10, 'Vida Buena', 1, NULL, '1VD40ZbdHESsUa7BdTLIzX'),
(10, 'Hielo', 2, 'Jhay Cortez', '24UGLsGfKHgQhGviBrbDdl'),
(10, '3 A.M.', 3, 'Brytiago', '1F205Nl2feOSYSztLNOJAL'),
(10, 'Mala Mia', 4, 'Miky Woodz', '6MKxukLfTyhLpk94EgvHHv'),
(10, 'Mi Error (Remix)', 5, 'Zion & Lennox, Wisin & Yandel, Lunay', '5IjOqh4XLyjHINuOGolmAt'),
(10, 'Actriz', 6, 'Arcangel', '0aKzRWY1bFx55D7oSwzhCk'),
(10, 'Lluvia (Remix)', 7, 'Amenazzy, Lyanno, Rauw Alejandro', '0LJxgVwQXjsdrxfyNmRuYg'),
(10, 'Mi Funeral', 8, 'Nengo Flow & J Balvin', '4W9Fo3bJgtLZrffi0611Kl'),
(10, 'Kemba Walker', 9, 'Bad Bunny', '4jhHaLksdP8DJZzxYAjOSz'),
(10, 'Huh?', 10, 'Smokepurpp', '5HM8aaqHBRfU1ssRtY2uuO'),
(10, 'Rapido', 11, 'Jon Z & Noriel', '2VoXIVlMLnbMeg3C0ghm6T'),
(10, 'Corone', 12, NULL, '5l8SUpjEU8UaO4tUNc4AFI'),
(10, 'Hennessy', 13, 'Cosculluela', '3A4mcukwxLsaD5Q4J5Iixr'),
(10, 'Safe With Me', 14, 'Lil Mosey', '4u7PS4qpZX3sRoJfTU3pJp'),
(10, 'Ponte Linda', 15, NULL, '0FVgu3DdG2LMJSMlWiVbMp'),
(10, 'Mi Error', 16, 'Zion', '4o4HQPKJQEsPq36BJqWWUr')
ON CONFLICT (album_id, title) DO UPDATE SET spotify_track_id = EXCLUDED.spotify_track_id;
