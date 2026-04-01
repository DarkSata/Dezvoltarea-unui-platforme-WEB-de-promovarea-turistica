namespace eBookStore.Domain.Models.CompanyService
{
    public class CompanyServiceDto
    {
        public int Id { get; set; }
        public string ServiceName { get; set; }
        public string ServiceDescription { get; set; }
        public decimal ServicePrice { get; set; }
    }
}
