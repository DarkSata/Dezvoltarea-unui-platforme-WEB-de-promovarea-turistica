namespace eBookStore.Domain.Entities.Product
{
    public class ProductData
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public List<ProductImg> Imgs { get; set; }

        public decimal Price { get; set; }
        public int StockQt { get; set; }

        public CategoryData Category { get; set; }

        /// <summary>
        /// The date and time when the product was created.
        /// This field is typically set automatically when
        /// a new product is added to the system and is used
        /// for tracking and auditing purposes.
        /// </summary>
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
