CREATE PROC dbo.Finish_Task
	(
	@TaskId int,
	@IsDone bit
)
AS
BEGIN
	SET NOCOUNT ON

	UPDATE dbo.Task
	SET IsDone = @IsDone
	WHERE TaskID = @TaskId
END
