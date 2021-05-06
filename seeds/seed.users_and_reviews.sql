-- TRUNCATE all tables to ensure that there are no
-- data in them so we start with a fresh set of data
TRUNCATE reviews, users RESTART IDENTITY CASCADE;

INSERT INTO users (username, pw)
VALUES
    ('Bulbasaur','$2a$04$eiOmCEDM7wF.5YgBJZ1wcuBMR2dDeqdtadlkQvmVmO7sLvd1YIXI.'),
    ('Pikachu','$2a$04$2d4jbxnHeUFZtBbgbNxyJuaG0ArlGThAFQt1BRlaXnbG4dnrZRPMS'),
    ('Squirtle', '$2a$04$IOdFJCcPq5MwZ1Pd7RNU5eVe6JDkt48G6Z79InupI/aoIRE.53SNK');

INSERT INTO reviews (review_id, book_id, title, contents, help_count)
VALUES
    ('b0715efe-ffaf-11e8-8eb2-f2801f1b9fd1', 'f2801f1b9fd1','Dracula was good', 'Corporis accusamus placeat quas non voluptas.', 5),
    ('b07161a6-ffaf-11e8-8eb2-f2801f1b9fd1', 'f2301f1b9fd1','Harry Potter was ok', 'Eos laudantium quia ab blanditiis', 8 ),
    ('b07162f0-ffaf-11e8-8eb2-f2801f1b9fd1', 'f2401f1b9fd1', 'Mixology was delicious', 'Occaecati dignissimos quam qui', 15);
  
UPDATE reviews SET user_id = 1 WHERE id = 1;
UPDATE reviews SET user_id = 2 WHERE id = 2;
UPDATE reviews SET user_id = 3 WHERE id = 3;

INSERT INTO helpful (user_id, review_id, book_id)
VALUES
    (2, 'b0715efe-ffaf-11e8-8eb2-f2801f1b9fd1', 'f2801f1b9fd1'),
    (3, 'b07161a6-ffaf-11e8-8eb2-f2801f1b9fd1', 'f2301f1b9fd1'),
    (1, 'b07162f0-ffaf-11e8-8eb2-f2801f1b9fd1', 'f2401f1b9fd1');
