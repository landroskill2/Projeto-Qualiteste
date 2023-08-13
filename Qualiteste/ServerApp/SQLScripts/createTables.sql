
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
    Ref varchar(50) UNIQUE NOT NULL,
    Designation varchar(200),
    Brand varchar(50)
); 

CREATE TABLE TEST(
    InternalID varchar(20) PRIMARY KEY,
    Product int REFERENCES PRODUCT(ProductID),
    TestType varchar(2) NOT NULL check (TestType in ('HT', 'SP')),
    ConsumersNumber int NOT NULL,
    RequestDate date NOT NULL,
    ValidationDate date,
    DueDate date,
    ReportDeliveryDate date,
    SessionID varchar(8) REFERENCES SESSION(SessionID)
);

CREATE TABLE CLIENT(
    Acronym varchar(10) PRIMARY KEY,
    CompanyName varchar(50) NOT NULL
);

CREATE TABLE SAMPLE(
    TestID varchar(20) REFERENCES TEST(InternalID),
    ProductID int REFERENCES PRODUCT(ProductID),
    PresentationPosition int NOT NULL,
    ReceptionDate date,
    primary key(TestID, ProductID),
    CONSTRAINT unq_PresentationPosition UNIQUE (TestID, PresentationPosition)
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

CREATE TABLE ROLES(
    RoleID int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    RoleDesignation varchar(20)
);

CREATE TABLE USERS(
    Username varchar(20) PRIMARY KEY,
    Pwd varchar(256),
    Role int REFERENCES ROLES(RoleID)
);