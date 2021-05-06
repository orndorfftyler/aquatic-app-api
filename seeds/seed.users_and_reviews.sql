-- TRUNCATE all tables to ensure that there are no
-- data in them so we start with a fresh set of data
TRUNCATE users, questions, answers RESTART IDENTITY CASCADE;

INSERT INTO users (username, pw)
VALUES
    ('Bulbasaur','$2a$04$eiOmCEDM7wF.5YgBJZ1wcuBMR2dDeqdtadlkQvmVmO7sLvd1YIXI.'),
    ('Pikachu','$2a$04$2d4jbxnHeUFZtBbgbNxyJuaG0ArlGThAFQt1BRlaXnbG4dnrZRPMS'),
    ('Squirtle', '$2a$04$IOdFJCcPq5MwZ1Pd7RNU5eVe6JDkt48G6Z79InupI/aoIRE.53SNK');

INSERT INTO questions (questions_id, title, contents)
VALUES
    ('b0715eze-ffaf-11e8-8eb2-f2801f1b9fd1','What water temp is best?', 'question Corporis accusamus placeat quas non voluptas.'),
    ('b07161f6-ffaf-11e8-8eb2-f2801f1b9fd1','How fast do brine shrimp grow?', 'question Eos laudantium quia ab blanditiis'),
    ('b07162b0-ffaf-11e8-8eb2-f2801f1b9fd1', 'Can I grow jellyfish in a fish tank?', 'question Occaecati dignissimos quam qui');

UPDATE questions SET user_id = 1 WHERE id = 1;
UPDATE questions SET user_id = 2 WHERE id = 2;
UPDATE questions SET user_id = 3 WHERE id = 3;

INSERT INTO answers (answer_id, questions_id, title, contents)
VALUES
    ('b0715efe-ffaf-11e8-8eb2-f2801f1b9fd1', 'b0715eze-ffaf-11e8-8eb2-f2801f1b9fd1','Best answer ever', 'answer Corporis accusamus placeat quas non voluptas.'),
    ('b07161a6-ffaf-11e8-8eb2-f2801f1b9fd1', 'b07161f6-ffaf-11e8-8eb2-f2801f1b9fd1','Moderately good answer', 'answer Eos laudantium quia ab blanditiis'),
    ('b07162f0-ffaf-11e8-8eb2-f2801f1b9fd1', 'b07162b0-ffaf-11e8-8eb2-f2801f1b9fd1', 'OK answer', 'answer Occaecati dignissimos quam qui');
  
UPDATE answers SET user_id = 3 WHERE id = 1;
UPDATE answers SET user_id = 1 WHERE id = 2;
UPDATE answers SET user_id = 2 WHERE id = 3;


