CREATE TABLE alerts (id SERIAL NOT NULL PRIMARY KEY, alert TEXT NOT NULL, user_id INT NOT NULL);

INSERT INTO alerts (alert, user_id) VALUES ('Amazon workers rights lawsuit', 1);