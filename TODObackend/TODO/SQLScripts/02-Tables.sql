CREATE PROC dbo.Task_AddForLoadTest
AS
BEGIN
	DECLARE @i int = 1

	WHILE @i < 100
	BEGIN
		INSERT INTO dbo.Task
			(Title, Content, CreatedAt)
		VALUES('Task ' + CAST(@i AS nvarchar(5)), 'Content ' + CAST(@i AS nvarchar(5)), GETUTCDATE())
		SET @i = @i + 1
	END
END
GO

CREATE PROC dbo.Task_Delete
	(
	@TaskId int
)
AS
BEGIN
	SET NOCOUNT ON

	DELETE
	FROM dbo.Task
	WHERE TaskID = @TaskID
END
GO

CREATE PROC dbo.Task_Exists
	(
	@TaskId int
)
AS
BEGIN
	SET NOCOUNT ON

	SELECT CASE WHEN EXISTS (SELECT TaskId
		FROM dbo.Task
		WHERE TaskId = @TaskId) 
        THEN CAST (1 AS BIT) 
        ELSE CAST (0 AS BIT) END AS Result

END
GO

CREATE PROC dbo.Task_GetMany
AS
BEGIN
	SET NOCOUNT ON

	SELECT TaskId, Title, Content, CreatedAt, IsDone
	FROM dbo.Task 
END
GO

CREATE PROC dbo.Task_GetMany_BySearch
	(
	@Search nvarchar(100)
)
AS
BEGIN
	SET NOCOUNT ON

		SELECT TaskId, Title, Content, CreatedAt, IsDone
		FROM dbo.Task 
		WHERE Title LIKE '%' + @Search + '%'

	UNION

		SELECT TaskId, Title, Content, CreatedAt, IsDone
		FROM dbo.Task 
		WHERE Content LIKE '%' + @Search + '%'
END
GO

CREATE PROC dbo.Task_GetMany_BySearch_WithPaging
	(
	@Search nvarchar(100),
	@PageNumber int,
	@PageSize int
)
AS
BEGIN
	SELECT TaskId, Title, Content, CreatedAt, IsDone
	FROM
		(	SELECT TaskId, Title, Content, CreatedAt, IsDone
			FROM dbo.Task 
			WHERE Title LIKE '%' + @Search + '%'

		UNION

			SELECT TaskId, Title, Content, CreatedAt, IsDone
			FROM dbo.Task 
			WHERE Content LIKE '%' + @Search + '%') Sub
	ORDER BY TaskId
	OFFSET @PageSize * (@PageNumber - 1) ROWS
    FETCH NEXT @PageSize ROWS ONLY
END
GO

CREATE PROC dbo.Task_GetSingle
	(
	@TaskId int
)
AS
BEGIN
	SET NOCOUNT ON

	SELECT TaskId, Title, Content, CreatedAt, IsDone
	FROM dbo.Task 
	WHERE TaskId = @TaskId
END
GO

CREATE PROC dbo.Task_GetScheduled
AS
BEGIN
	SET NOCOUNT ON

	SELECT TaskId, Title, Content, CreatedAt, IsDone
	FROM dbo.Task t
	WHERE IsDone = 0
END
GO

CREATE PROC dbo.Add_Task
	(
	@Title nvarchar(100),
	@Content nvarchar(max),
	@CreatedAt datetime2
)
AS
BEGIN
	SET NOCOUNT ON

	INSERT INTO dbo.Task
		(Title, Content, CreatedAt)
	VALUES(@Title, @Content, @CreatedAt)

	SELECT SCOPE_IDENTITY() AS TaskId
END
GO

CREATE PROC dbo.Put_Task
	(
	@TaskId int,
	@Title nvarchar(100),
	@Content nvarchar(max)
)
AS
BEGIN
	SET NOCOUNT ON

	UPDATE dbo.Task
	SET Title = @Title, Content = @Content
	WHERE TaskID = @TaskId
END
GO

CREATE PROC dbo.Task_GetReady
AS
BEGIN
	SET NOCOUNT ON

	SELECT TaskId, Title, Content, CreatedAt, IsDone
	FROM dbo.Task t
	WHERE IsDone = 1
END
GO