using eBookStore.Domain.Entities.Product;

namespace eBookStore.Domain.Models.Product
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public List<ProductImg> Imgs { get; set; }
        public decimal Price { get; set; }
        public int StockQt { get; set; }
        public CategoryData Category { get; set; }
    }
}
