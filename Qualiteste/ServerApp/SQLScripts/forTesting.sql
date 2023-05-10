DROP TABLE CONSUMER CASCADE;
DROP TABLE SESSION CASCADE;
DROP TABLE TEST CASCADE;
DROP TABLE PRODUCT CASCADE;
DROP TABLE CLIENT CASCADE;
DROP TABLE SAMPLE CASCADE;
DROP TABLE CONSUMER_HT CASCADE;
DROP TABLE CONSUMER_SP CASCADE;
DROP TABLE SESSION_TESTS CASCADE;
DROP TABLE CONSUMER_SESSION CASCADE;

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
    TestID varchar(20) REFERENCES TEST(InternalID),
    ConsumerID INT REFERENCES CONSUMER(Id)
    /* REFERENCIA PARA A TABELA FIZZ */
    /* Primary Key */
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
(6, 'ALEXANDRA BERNARDINO', 111111111111129, 'F', '1986-04-19', 91559, null),
(14, 'PAULA ALEXANDRA DE ÁGUA', 222222222222222, 'F', '1967-10-21', 18320, null ),
(23, 'PATRICIA JANUÁRIO', 111111111111121, 'F', '1989-04-20', 94684, null ),
(37, 'MARGARIDA CORREIA DE OLIVEIRA', 111111111111126, 'F', '1976-12-15', 34128, null),
(38, 'MARIA CAROLINA REIS OLIVEIRA', 111111111111111, 'F', '1960-03-29', 31153, null ),
(48, 'CARMINA SILVA SANTOS', 111111111111127, 'F', '1954-02-17', 29702, null),
(67, 'RAFAEL JOSÉ DOMINGOS MOTA', 777777777777777, 'M', '1969-08-04', 54891, null ),
(82, 'LIDIA RAQUEL MADUREIRA', 999999999999999, 'F', '1977-11-26', 30222, null ),
(83, 'NUNO FILIPE COSTA MONTEZ', 111111111111112, 'M', '1975-08-19', 76060, null ),
(86, 'DIOGO MARCHANTE DO CARMO', 111111111111123, 'M', '2000-02-09', 92248, null ),
(87, 'CATARINA MARCHANTE DO CARMO', 111111111111124, 'F', '2004-11-12',28076, null ),
(94, 'ACÁCIO COELHO FONSECA', 111111111111119, 'M', '1955-12-19', 32137, null ),
(110, 'ISABEL DUARTE BASTOS', 111111111111116, 'F', '1972-06-04', 12985, null ),
(119, 'MARIA HERMENGADA RIBEIRO', 666666666666666, 'F', '1957-01-28', 59404, null ),
(141, 'ANABELA LOPES FERREIRA', 111111111111122, 'F', '1975-05-27', 70382, null ),
(143, 'MARIA MANUELA FERREIRA ALHO', 111111111111115, 'F', '1970-08-09', 68708, null ),
(154, 'CLAUDIA SOFIA SANTOS COSME', 111111111111114, 'F', '1982-04-27', 37268, null ),
(167, 'ADELAIDE RODRIGUES CONSTANTINO', 333333333333333, 'F', '1960-03-18', 52093, null ),
(168, 'PAULO SAMUEL MADUREIRA', 111111111111117, 'M', '1971-04-25', 27227, null ),
(204, 'CARLA DINÁ NUNES LOURENÇO', 111111111111125, 'F', '1970-01-28', 73502, null),
(263, 'JORGE RAFAEL CAVALEIRO DA SILVA COUTO', 111111111111128, 'M', '1999-01-09', 94965, null),
(264, 'MARIA MANUELA DA SILVA COUTO', 111111111111118, 'F', '1964-12-21', 74792, null ),
(342, 'LUIS MANUEL PIEDADE SILVA', 555555555555555, 'M', '1960-12-23', 68461, null ),
(373, 'CONSTANÇA MARIA MADEIRA CARVAL', 111111111111113, 'F', '2004-04-05', 73775, null ),
(411, 'JÉSSICA RIBEIRO DOMINGOS LIMA', 888888888888888, 'F', '1993-12-02', 4942, null ),
(412, 'TELMA BRITES VIEIRA', 444444444444444, 'F', '1984-11-03', 89342, null);

INSERT INTO PRODUCT(ProductID, Designation, Brand) VALUES
(122332, 'Yogurte Grego', 'Continente'),
(132321, 'Yogurte Grego', 'Pingo Doce'),
(231233, 'Yogurte Grego', 'Intermarché'),
(321332, 'Fiambre Fatiado', 'Continente'),
(324231, 'Fiambre Fatiado', 'Pingo Doce'),
(123123, 'Mala Eastpack', 'Continente');


INSERT INTO TEST(InternalID, Product, TestType, ConsumersNumber, RequestDate, ValidationDate, DueDate, ReportDeliveryDate) VALUES
('443244', 122332, 'SP', 10, '2023-03-21', null, null, null),
('343123', 324231, 'SP', 10, '2023-03-29', null, null, null),
('041234', 123123, 'HT', 10, '2023-03-29', null, null, null);


INSERT INTO SAMPLE(TestID, ProductID, ReceptionDate) VALUES
('443244', 132321, '2023-03-24'),
('443244', 231233, '2023-03-25'),
('343123', 321332, '2023-04-01'),
('041234', 123123, '2023-04-01');


INSERT INTO SESSION(SessionID, SessionDate, ConsumersNumber) VALUES
('040423', '2023-04-04', 10);

INSERT INTO SESSION_TESTS(SessionID, TestID) VALUES
('040423', '443244'),
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
('040423', 67, '2023-03-01', '2023-03-02', '17:00', null, null);


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
('343123', 67);

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