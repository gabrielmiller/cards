ATTACH DATABASE 'cards' as 'cards';

CREATE TABLE IF NOT EXISTS 'cards.users' (
    id INTEGER,
    username VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL,
    hash VARCHAR(255) NOT NULL,
    PRIMARY KEY(id ASC)
);
