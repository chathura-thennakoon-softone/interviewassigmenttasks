-- Task Manager Database Setup Script
-- Run this script if you prefer to create the database manually

USE master;
GO

-- Create database if it doesn't exist
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'TaskManagerDB')
BEGIN
    CREATE DATABASE TaskManagerDB;
END
GO

USE TaskManagerDB;
GO

-- Create Users table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
BEGIN
    CREATE TABLE Users (
        Id int IDENTITY(1,1) PRIMARY KEY,
        Username nvarchar(50) NOT NULL UNIQUE,
        Email nvarchar(100) NOT NULL UNIQUE,
        PasswordHash nvarchar(max) NOT NULL,
        CreatedAt datetime2 NOT NULL DEFAULT GETUTCDATE()
    );
END
GO

-- Create Tasks table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Tasks' AND xtype='U')
BEGIN
    CREATE TABLE Tasks (
        Id int IDENTITY(1,1) PRIMARY KEY,
        Title nvarchar(200) NOT NULL,
        Description nvarchar(1000) NULL,
        IsCompleted bit NOT NULL DEFAULT 0,
        Priority int NOT NULL DEFAULT 2,
        CreatedAt datetime2 NOT NULL DEFAULT GETUTCDATE(),
        DueDate datetime2 NULL,
        CompletedAt datetime2 NULL,
        UserId int NOT NULL,
        CONSTRAINT FK_Tasks_Users FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
    );
END
GO

-- Create indexes for better performance
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Tasks_UserId')
BEGIN
    CREATE INDEX IX_Tasks_UserId ON Tasks(UserId);
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Tasks_IsCompleted')
BEGIN
    CREATE INDEX IX_Tasks_IsCompleted ON Tasks(IsCompleted);
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Tasks_Priority')
BEGIN
    CREATE INDEX IX_Tasks_Priority ON Tasks(Priority);
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Tasks_DueDate')
BEGIN
    CREATE INDEX IX_Tasks_DueDate ON Tasks(DueDate);
END
GO

-- Insert sample data (optional)
-- Uncomment the following lines if you want sample data

/*
-- Sample user (password is 'password123' hashed with BCrypt)
IF NOT EXISTS (SELECT * FROM Users WHERE Username = 'sampleuser')
BEGIN
    INSERT INTO Users (Username, Email, PasswordHash, CreatedAt)
    VALUES ('sampleuser', 'sample@example.com', '$2a$11$K.lTrk8bN2L2kP8vN5M0DuXKJHd6yVGjUbJ1v2wRqHjkMKLMhWONG', GETUTCDATE());
END

-- Sample tasks
DECLARE @UserId int = (SELECT Id FROM Users WHERE Username = 'sampleuser');

IF @UserId IS NOT NULL AND NOT EXISTS (SELECT * FROM Tasks WHERE UserId = @UserId)
BEGIN
    INSERT INTO Tasks (Title, Description, Priority, DueDate, UserId, CreatedAt)
    VALUES 
        ('Welcome Task', 'This is your first task in the Task Manager!', 1, DATEADD(day, 7, GETUTCDATE()), @UserId, GETUTCDATE()),
        ('Learn the API', 'Explore all the API endpoints and functionality', 2, DATEADD(day, 3, GETUTCDATE()), @UserId, GETUTCDATE()),
        ('Complete Interview', 'Finish the task manager implementation', 3, DATEADD(day, 1, GETUTCDATE()), @UserId, GETUTCDATE());
END
*/

PRINT 'Task Manager Database setup completed successfully!';
GO
