var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();
var questions = new Dictionary<string, string[]>(StringComparer.OrdinalIgnoreCase);
var sync = new object();

app.MapGet("/api/questions", (string? question) =>
{
    if (string.IsNullOrWhiteSpace(question))
        return Results.BadRequest(new { error = "Eine Frage ist erforderlich." });

    lock (sync)
    {
        return questions.TryGetValue(question, out var answers)
            ? Results.Ok(new { answers = answers.OrderBy(a => a).ToArray() })
            : Results.Ok(new { answers = new[] { "Die Antwort auf die Frage nach dem Leben, dem Universum und dem ganzen Rest ist 42." } });
    }
});

app.MapPost("/api/questions", (QuestionEntry? entry) =>
{
    if (entry is null || string.IsNullOrWhiteSpace(entry.Question) ||
        entry.Answers is null || entry.Answers.Length == 0 ||
        entry.Answers.Any(string.IsNullOrWhiteSpace))
        return Results.BadRequest(new { error = "Eine Frage und mindestens eine nicht leere Antwort sind erforderlich." });

    lock (sync)
    {
        if (questions.ContainsKey(entry.Question))
            return Results.Conflict(new { error = "Diese Frage ist bereits gespeichert." });

        questions.Add(entry.Question, entry.Answers);
    }

    return Results.Created("/api/questions", new { entry.Question, entry.Answers });
});

app.Run();

record QuestionEntry(string? Question, string[]? Answers);
