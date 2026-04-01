using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Web_aplication.DataAccess.Context;

/// <summary>
/// Used by EF Core CLI tools (dotnet ef migrations add / update).
/// Connection string here is for design-time only — update when SQL Server is ready.
/// </summary>
public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        DbSession.ConnectionString =
            "Server=localhost\\SQLEXPRESS;Database=MoldovaTravelDb;Trusted_Connection=True;TrustServerCertificate=True;";
        return new AppDbContext();
    }
}
