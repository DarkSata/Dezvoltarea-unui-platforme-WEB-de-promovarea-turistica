using eBookStore.Domain.Entities.Product;
using eBookStore.Domain.Models.Product;

namespace eBookStore.BusinessLayer.Core
{
    public class ProductActions
    {
        public ProductActions() { }

        internal List<ProductDto> GetAllProductsActionExecution()
        {
            var products = new List<ProductDto>();

            var product = new ProductDto()
            {
                Id = 1,
                Name = "Test Product",
                Description = "This is a test product.",
                Imgs = new List<ProductImg>()
                {
                    new ProductImg() { Id = 1, ImgUrl = "https://example.com/product1.jpg" },
                    new ProductImg() { Id = 2, ImgUrl = "https://example.com/product2.jpg" }
                },
                Price = 19.99m,
                StockQt = 100,
                Category = new CategoryData() { Id = 1, Name = "Test Category" }
            };


            products.Add(product);
            return products;
        }
    }
}
