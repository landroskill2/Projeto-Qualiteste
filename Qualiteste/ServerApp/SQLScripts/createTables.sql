CREATE TABLE CONSUMER(
    Id int GENERATED ALWAYS AS IDENTITY,
    FullName varchar(200) NOT NULL,
    NIF varchar(15) PRIMARY KEY,
    Sex varchar(1) NOT NULL check (Sex in ('F', 'M')),
    DateOfBirth date,
    Contact int unique NOT NULL,
    Email varchar
);

CREATE TABLE SESSION(
    SessionID varchar(8) PRIMARY KEY,
    SessionDate date
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

CREATE TABLE PRODUCT(
    ProductID int PRIMARY KEY,
    Designation varchar(200),
    Brand varchar(50)
); 

CREATE TABLE CLIENT(
    Acronym varchar(10) PRIMARY KEY,
    CompanyName varchar(50) NOT NULL
);



CREATE TABLE SAMPLE(
    TestID varchar(20) REFERENCES TEST(InternalID),
    ProductID int REFERENCES PRODUCT(ProductID),
    ReceptionDate date
);

CREATE TABLE CONSUMER_HT(
    InternalID varchar(20) REFERENCES TEST(InternalID),
    ConsumerID varchar(15) REFERENCES CONSUMER(NIF),
    DeliveryDate date,
    DueDate date,
    ResponseDate date,
    StampDate date
);

CREATE TABLE CONSUMER_SP(
    InternalID varchar(20) REFERENCES TEST(InternalID),
    ConsumerID varchar(15) REFERENCES CONSUMER(NIF)
    /* REFERENCIA PARA A TABELA FIZZ */
);

CREATE TABLE SESSION_TESTS(
    SessionID varchar(8) REFERENCES SESSION(SessionID),
    TestID varchar(20) REFERENCES Test(InternalID)
);

CREATE TABLE CONSUMER_SESSION(
    SessionID varchar(8) REFERENCES SESSION(SessionID),
    ConsumerID varchar(15) REFERENCES CONSUMER(NIF),
    ContactedDate date,
    ConfirmationDate date,
    SessionTime time,
    Attendance boolean,
    StampDate date
);
