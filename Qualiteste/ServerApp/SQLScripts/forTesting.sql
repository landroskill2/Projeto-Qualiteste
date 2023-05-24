DROP TABLE IF EXISTS CONSUMER CASCADE;
DROP TABLE IF EXISTS SESSION CASCADE;
DROP TABLE IF EXISTS TEST CASCADE;
DROP TABLE IF EXISTS PRODUCT CASCADE;
DROP TABLE IF EXISTS CLIENT CASCADE;
DROP TABLE IF EXISTS SAMPLE CASCADE;
DROP TABLE IF EXISTS CONSUMER_HT CASCADE;
DROP TABLE IF EXISTS CONSUMER_SP CASCADE;
DROP TABLE IF EXISTS SESSION_TESTS CASCADE;
DROP TABLE IF EXISTS CONSUMER_SESSION CASCADE;
DROP TABLE IF EXISTS FIZZ_ATTRIBUTES CASCADE;
DROP TABLE IF EXISTS ATTRIBUTE_VALUES CASCADE;

CREATE TABLE CONSUMER(
    Id int PRIMARY KEY,
    FullName varchar(200) NOT NULL,
    NIF varchar(15) UNIQUE,
    Sex varchar(1) NOT NULL check (Sex in ('F', 'M')),
    DateOfBirth date,
    Contact int unique NOT NULL,
    Email varchar
);

CREATE TABLE SESSION(
    SessionID varchar(32) PRIMARY KEY,
    SessionDate date NOT NULL,
    ConsumersNumber int NOT NULL
);

CREATE TABLE PRODUCT(
    ProductID int PRIMARY KEY,
    Designation varchar(200),
    Brand varchar(50)
); 

CREATE TABLE TEST(
    InternalID varchar(20) PRIMARY KEY,
    Product int REFERENCES PRODUCT(ProductID) NOT NULL,
    TestType varchar(2) NOT NULL check (TestType in ('HT', 'SP')),
    ConsumersNumber int NOT NULL,
    RequestDate date NOT NULL,
    ValidationDate date,
    DueDate date,
    ReportDeliveryDate date
);


CREATE TABLE CLIENT(
    Acronym varchar(10) PRIMARY KEY,
    CompanyName varchar(50) NOT NULL
);

CREATE TABLE SAMPLE(
    TestID varchar(20) REFERENCES TEST(InternalID),
    ProductID int REFERENCES PRODUCT(ProductID),
    ReceptionDate date,
    primary key(TestID, ProductID)
);

CREATE TABLE CONSUMER_HT(
    TestID varchar(20) REFERENCES TEST(InternalID),
    ConsumerID INT REFERENCES CONSUMER(Id),
    DeliveryDate date,
    DueDate date,
    ResponseDate date,
    StampDate date,
    primary key(ConsumerID, TestID)
);

CREATE TABLE CONSUMER_SP(
    /*ID int generated always as identity unique,*/
    TestID varchar(20) REFERENCES TEST(InternalID),
    ConsumerID INT REFERENCES CONSUMER(Id),
    primary key(ConsumerID, TestID)
);

CREATE TABLE FIZZ_ATTRIBUTES(
    TestID varchar(20) REFERENCES Test(InternalID),
    Attribute varchar NOT NULL,
    Alias varchar,
    PRIMARY KEY(TestID, Attribute)
);

CREATE TABLE ATTRIBUTE_VALUES(
    ConsumerID int REFERENCES Consumer(Id),
    AttrValue varchar,
    TestID varchar(20),
    Attribute varchar,
    FOREIGN KEY(TestID, Attribute) REFERENCES FIZZ_ATTRIBUTES(TestID, Attribute),
    PRIMARY KEY(TestID, Attribute, ConsumerID)
);

CREATE TABLE SESSION_TESTS(
    SessionID varchar(8) REFERENCES SESSION(SessionID),
    TestID varchar(20) REFERENCES Test(InternalID),
    primary key(TestID, SessionID)
);

CREATE TABLE CONSUMER_SESSION(
    SessionID varchar(8) REFERENCES SESSION(SessionID),
    ConsumerID INT REFERENCES CONSUMER(Id),
    ContactedDate date,
    ConfirmationDate date,
    SessionTime time,
    Attendance boolean,
    StampDate date,
    primary key(ConsumerID, SessionID)
);


INSERT INTO CONSUMER(Id, FullName, NIF, Sex, DateOfBirth, Contact, Email) VALUES 
(3, 'MARIA IRENE ALVES', 111111111111131, 'F', '1951-04-11', 2130, null),
(5,'MARIA DE LURDES ALVES', 111111111111168, 'F', '1952-04-03', 943942, null),
(6, 'ALEXANDRA BERNARDINO', 111111111111129, 'F', '1986-04-19', 91559, null),
(14, 'PAULA ALEXANDRA DE ÁGUA', 222222222222222, 'F', '1967-10-21', 18320, null),
(19,'MARTA ROSMANINHO FILIPE', 23934812832823, 'F', '1995-03-17', 2141234, null),
(20,'PAULA GONÇALVES HENRIQUES', 23812382138, 'F', '1967-01-17', 582382, null),
(23, 'PATRICIA JANUÁRIO', 111111111111121, 'F', '1989-04-20', 94684, null ),
(36, 'MARIA DAS NEVES PEDRO', 23929381823, 'F', '1950-03-17', 382183, null),
(37, 'MARGARIDA CORREIA DE OLIVEIRA', 111111111111126, 'F', '1976-12-15', 34128, null),
(38, 'MARIA CAROLINA REIS OLIVEIRA', 111111111111111, 'F', '1960-03-29', 31153, null ),
(48, 'CARMINA SILVA SANTOS', 111111111111127, 'F', '1954-02-17', 29702, null),
(51, 'MARIA FERREIRA SOUSA', 93238472371, 'F', '1969-11-11', 342134, null),
(67, 'RAFAEL JOSÉ DOMINGOS MOTA', 777777777777777, 'M', '1969-08-04', 54891, null ),
(82, 'LIDIA RAQUEL MADUREIRA', 999999999999999, 'F', '1977-11-26', 30222, null ),
(83, 'NUNO FILIPE COSTA MONTEZ', 111111111111112, 'M', '1975-08-19', 76060, null ),
(86, 'DIOGO MARCHANTE DO CARMO', 111111111111123, 'M', '2000-02-09', 92248, null ),
(87, 'CATARINA MARCHANTE DO CARMO', 111111111111124, 'F', '2004-11-12',28076, null ),
(90, 'IVONE FIGUEIREDO', 2848238182382, 'F', '1971-07-07', 239822, null),
(94, 'ACÁCIO COELHO FONSECA', 111111111111119, 'M', '1955-12-19', 32137, null ),
(110, 'ISABEL DUARTE BASTOS', 111111111111116, 'F', '1972-06-04', 12985, null ),
(119, 'MARIA HERMENGADA RIBEIRO', 666666666666666, 'F', '1957-01-28', 59404, null ),
(141, 'ANABELA LOPES FERREIRA', 111111111111122, 'F', '1975-05-27', 70382, null ),
(143, 'MARIA MANUELA FERREIRA ALHO', 111111111111115, 'F', '1970-08-09', 68708, null ),
(152, 'CLAUDIA FRANCISCO DA COSTA', 2323912938382, 'F', '1972-05-05', 52352, null),
(154, 'CLAUDIA SOFIA SANTOS COSME', 111111111111114, 'F', '1982-04-27', 37268, null ),
(167, 'ADELAIDE RODRIGUES CONSTANTINO', 333333333333333, 'F', '1960-03-18', 52093, null ),
(168, 'PAULO SAMUEL MADUREIRA', 111111111111117, 'M', '1971-04-25', 27227, null ),
(184, 'HELENA PARAISO FERREIRA', 1282282818182, 'F', '1973-03-02', 2381283, null),
(204, 'CARLA DINÁ NUNES LOURENÇO', 111111111111125, 'F', '1970-01-28', 73502, null),
(205, 'SANDRA VICENTE RODRIGUES', 29291837277372, 'F', '1975-09-22', 9878972, null),
(216, 'ANA RODRIGUES ALMEIDA', 92392939238421, 'F', '1995-03-19', 92387237, null),
(227, 'CRISTINA MARIA RIBEIRO HORTA', 239834823232, 'F', '1966-10-20', 48323823, null),
(228, 'MARIA JUSÉLIA ESTRELA ALVES', 92381271642, 'F', '1958-07-10', 238712671, null),
(263, 'JORGE RAFAEL CAVALEIRO DA SILVA COUTO', 111111111111128, 'M', '1999-01-09', 94965, null),
(264, 'MARIA MANUELA DA SILVA COUTO', 111111111111118, 'F', '1964-12-21', 74792, null ),
(322, 'PAULA CRISTINA DA SILVA', 238723623654, 'F', '1969-12-04', 237273, null),
(341, 'LAURENTINA MARIA JESUS CEPAS', 2382737236, 'F', '1954-04-20', 2387427, null),
(342, 'LUIS MANUEL PIEDADE SILVA', 555555555555555, 'M', '1960-12-23', 68461, null ),
(348, 'ANA RITA DIAS LUCIO', 283716236642, 'F', '1988-01-26', 2372736, null),
(352, 'ISILDA DE JESUS TEIXEIRA LEITE', 7473626362723, 'F', '1970-07-02', 87237273, null),
(359, 'RUI MIGUEL NOGUEIRA', 92382732736, 'M', '1974-01-25', 9736263, null),
(373, 'CONSTANÇA MARIA MADEIRA CARVAL', 111111111111113, 'F', '2004-04-05', 73775, null ),
(399, 'CARLA PATRICIA SANTOS', 27362635162372, 'F', '1982-12-08', 23772372, null),
(411, 'JÉSSICA RIBEIRO DOMINGOS LIMA', 888888888888888, 'F', '1993-12-02', 4942, null ),
(412, 'TELMA BRITES VIEIRA', 444444444444444, 'F', '1984-11-03', 89342, null),
(426, 'JOYCE LIRA BACRY', 727362636263, 'F', '1981-08-31', 723252532, null);

INSERT INTO PRODUCT(ProductID, Designation, Brand) VALUES
(122332, 'Yogurte Grego', 'Continente'),
(132321, 'Yogurte Grego', 'Pingo Doce'),
(231233, 'Yogurte Grego', 'Intermarché'),
(321332, 'Fiambre Fatiado', 'Continente'),
(324231, 'Fiambre Fatiado', 'Pingo Doce'),
(573626, 'Pastel de Nata', 'Auchan'),
(123123, 'Mala Eastpack', 'Continente');


INSERT INTO TEST(InternalID, Product, TestType, ConsumersNumber, RequestDate, ValidationDate, DueDate, ReportDeliveryDate) VALUES
('443244', 122332, 'SP', 10, '2023-03-21', null, null, null),
('343123', 324231, 'SP', 10, '2023-03-29', null, null, null),
('583828', 573626, 'SP', 36, '2023-05-20', null, null, null),
('041234', 123123, 'HT', 10, '2023-03-29', null, null, null);


INSERT INTO SAMPLE(TestID, ProductID, ReceptionDate) VALUES
('443244', 132321, '2023-03-24'),
('443244', 231233, '2023-03-25'),
('343123', 321332, '2023-04-01'),
('583828', 573626, '2023-05-16'),
('041234', 123123, '2023-04-01');


INSERT INTO SESSION(SessionID, SessionDate, ConsumersNumber) VALUES
('040423', '2023-04-04', 10),
('250523', '2023-05-25', 36);

INSERT INTO SESSION_TESTS(SessionID, TestID) VALUES
('040423', '443244'),
('250523', '583828'),
('040423', '343123');

INSERT INTO CONSUMER_SESSION(SessionID, ConsumerID, ContactedDate, ConfirmationDate, SessionTime, Attendance, StampDate) VALUES
('040423', 6, '2023-03-01', '2023-03-02', '11:00', null, null),
('040423', 263, '2023-03-01', '2023-03-02', '12:00', null, null),
('040423', 48, '2023-03-01', '2023-03-02', '11:00', null, null),
('040423', 86, '2023-03-01', '2023-03-02', '12:00', null, null),
('040423', 87, '2023-03-01', '2023-03-02', '11:00', null, null),
('040423', 23, '2023-03-01', '2023-03-02', '12:00', null, null),
('040423', 168, '2023-03-01', '2023-03-02', '11:00', null, null),
('040423', 143, '2023-03-01', '2023-03-02', '11:00', null, null),
('040423', 373, '2023-03-01', '2023-03-02', '17:00', null, null),
('040423', 67, '2023-03-01', '2023-03-02', '17:00', null, null),
('250523', 38, '2023-05-20', '2023-05-21', '11:00', null, null),
('250523', 51, '2023-05-20', '2023-05-21', '11:00', null, null),
('250523', 322, '2023-05-20', '2023-05-21', '11:00', null, null),
('250523', 14, '2023-05-20', '2023-05-21', '11:00', null, null),
('250523', 20, '2023-05-20', '2023-05-21', '11:00', null, null),
('250523', 426, '2023-05-20', '2023-05-21', '11:00', null, null),
('250523', 399, '2023-05-20', '2023-05-21', '11:00', null, null),
('250523', 94, '2023-05-20', '2023-05-21', '11:00', null, null),
('250523', 341, '2023-05-20', '2023-05-21', '11:00', null, null),
('250523', 167, '2023-05-20', '2023-05-21', '11:00', null, null),
('250523', 412, '2023-05-20', '2023-05-21', '13:00', null, null),
('250523', 154, '2023-05-20', '2023-05-21', '13:00', null, null),
('250523', 90, '2023-05-20', '2023-05-21', '13:00', null, null),
('250523', 264, '2023-05-20', '2023-05-21', '13:00', null, null),
('250523', 216, '2023-05-20', '2023-05-21', '13:00', null, null),
('250523', 348, '2023-05-20', '2023-05-21', '13:00', null, null),
('250523', 5, '2023-05-20', '2023-05-21', '13:00', null, null),
('250523', 19, '2023-05-20', '2023-05-21', '13:00', null, null),
('250523', 228, '2023-05-20', '2023-05-21', '13:00', null, null),
('250523', 152, '2023-05-20', '2023-05-21', '13:00', null, null),
('250523', 411, '2023-05-20', '2023-05-21', '15:00', null, null),
('250523', 37, '2023-05-20', '2023-05-21', '15:00', null, null),
('250523', 359, '2023-05-20', '2023-05-21', '15:00', null, null),
('250523', 184, '2023-05-20', '2023-05-21', '15:00', null, null),
('250523', 110, '2023-05-20', '2023-05-21', '15:00', null, null),
('250523', 205, '2023-05-20', '2023-05-21', '15:00', null, null),
('250523', 141, '2023-05-20', '2023-05-21', '15:00', null, null),
('250523', 227, '2023-05-20', '2023-05-21', '15:00', null, null),
('250523', 36, '2023-05-20', '2023-05-21', '15:00', null, null),
('250523', 67, '2023-05-20', '2023-05-21', '15:00', null, null),
('250523', 82, '2023-05-20', '2023-05-21', '17:00', null, null),
('250523', 168, '2023-05-20', '2023-05-21', '17:00', null, null),
('250523', 352, '2023-05-20', '2023-05-21', '17:00', null, null),
('250523', 86, '2023-05-20', '2023-05-21', '17:00', null, null);

INSERT INTO CONSUMER_SP(TestID, ConsumerID) VALUES
('443244', 6),
('343123', 6),
('443244', 263),
('343123', 263),
('443244', 48),
('343123', 48),
('443244', 86),
('343123', 86),
('443244', 87),
('343123', 87),
('443244', 23),
('343123', 23),
('443244', 168),
('343123', 168),
('443244', 143),
('343123', 143),
('443244', 373),
('343123', 373),
('443244', 67),
('343123', 67),
('583828', 38),
('583828', 51),
('583828', 322),
('583828', 14),
('583828', 20),
('583828', 426),
('583828', 399),
('583828', 94),
('583828', 341),
('583828', 167),
('583828', 412),
('583828', 154),
('583828', 90),
('583828', 264),
('583828', 216),
('583828', 348),
('583828', 5),
('583828', 19),
('583828', 228),
('583828', 152),
('583828', 411),
('583828', 37),
('583828', 359),
('583828', 184),
('583828', 110),
('583828', 205),
('583828', 141),
('583828', 227),
('583828', 36),
('583828', 67),
('583828', 82),
('583828', 168),
('583828', 352),
('583828', 86);

INSERT INTO CONSUMER_HT(TestID, ConsumerID, DeliveryDate, DueDate, ResponseDate, StampDate) VALUES
('041234', 6, '2023-03-01', null, null, null),
('041234', 263, '2023-03-01', null, null, null),
('041234', 48, '2023-03-01', null, null, null),
('041234', 86, '2023-03-01', null, null, null),
('041234', 87, '2023-03-01', null, null, null),
('041234', 23, '2023-03-01', null, null, null),
('041234', 168, '2023-03-01', null, null, null),
('041234', 143, '2023-03-01', null, null, null),
('041234', 373, '2023-03-01', null, null, null),
('041234', 67, '2023-03-01', null, null, null);