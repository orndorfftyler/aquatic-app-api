-- TRUNCATE all tables to ensure that there are no
-- data in them so we start with a fresh set of data
TRUNCATE users, questions, answers RESTART IDENTITY CASCADE;

INSERT INTO users (username, pw)
VALUES
    ('Bulbasaur','$2a$04$eiOmCEDM7wF.5YgBJZ1wcuBMR2dDeqdtadlkQvmVmO7sLvd1YIXI.'),
    ('Pikachu','$2a$04$2d4jbxnHeUFZtBbgbNxyJuaG0ArlGThAFQt1BRlaXnbG4dnrZRPMS'),
    ('Squirtle', '$2a$04$IOdFJCcPq5MwZ1Pd7RNU5eVe6JDkt48G6Z79InupI/aoIRE.53SNK');

INSERT INTO questions (question_id, title, contents)
VALUES
    ('513d8e7a-34b5-43e8-91cb-891a34e59d0a','What water temp is best?', 'question Corporis accusamus placeat quas non voluptas.'),
    ('0988c8b4-69e9-4fb8-b34d-cd3652a546fd','How fast do brine shrimp grow?', 'question Eos laudantium quia ab blanditiis'),
    ('772b2693-f32a-4972-a205-881b3c18b8cc', 'Can I grow jellyfish in a fish tank?', 'question Occaecati dignissimos quam qui');

UPDATE questions SET user_id = 1 WHERE id = 1;
UPDATE questions SET user_id = 2 WHERE id = 2;
UPDATE questions SET user_id = 3 WHERE id = 3;

INSERT INTO answers (answer_id, question_id, title, contents)
VALUES
    ('62c2e46d-a262-4332-9909-c3717364169e', '513d8e7a-34b5-43e8-91cb-891a34e59d0a','Best answer ever', 'answer Corporis accusamus placeat quas non voluptas.'),
    ('3e0ace45-5420-47d9-b6ac-7ce678d9ec34', '0988c8b4-69e9-4fb8-b34d-cd3652a546fd','Moderately good answer', 'answer Eos laudantium quia ab blanditiis'),
    ('86b63d85-5d30-4b96-9db7-743d5aeea2d5', '772b2693-f32a-4972-a205-881b3c18b8cc', 'OK answer', 'answer Occaecati dignissimos quam qui');
  
UPDATE answers SET user_id = 3 WHERE id = 1;
UPDATE answers SET user_id = 1 WHERE id = 2;
UPDATE answers SET user_id = 2 WHERE id = 3;


