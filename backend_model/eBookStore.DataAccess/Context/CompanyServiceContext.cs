using eBookStore.Domain.Entities.CompanyService;
using Microsoft.EntityFrameworkCore;

namespace eBookStore.DataAccess.Context
{
    public class CompanyServiceContext : DbContext
    {
        public DbSet<CompanyServiceData> CompanyServices { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(DbSession.ConnectionString);
        }
    }
}
