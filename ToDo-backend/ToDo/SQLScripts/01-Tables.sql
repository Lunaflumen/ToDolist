CREATE TABLE dbo.Task(
	TaskId int IDENTITY(1,1) NOT NULL,
	Title nvarchar(100) NOT NULL,
	Content nvarchar(max) NOT NULL,
	CreatedAt datetime2(7) NOT NULL,
	IsDone bit DEFAULT(0) NOT NULL
 CONSTRAINT PK_Task PRIMARY KEY CLUSTERED 
(
	TaskId ASC
)
) 
GO

SET IDENTITY_INSERT dbo.Task ON 
GO
INSERT INTO dbo.Task(TaskId, Title, Content, CreatedAt, IsDone)
VALUES(1, 'Learn React', 
		'Learn the basics of React by the book "ASP.NET Core 3 and React" by Carl Rippon',
		'2019-05-18 14:32',
		0)

INSERT INTO dbo.Task(TaskId, Title, Content, CreatedAt, IsDone)
VALUES(2, 'Learn Typescript', 
		'Learn the basics of TypeScript by the guides on YouTube',
		'2019-05-18 14:48',
		1)
GO
SET IDENTITY_INSERT dbo.Task OFF
