using eBookStore.Domain.Models.Product;

namespace eBookStore.BusinessLayer.Interfaces
{
    public interface IProductAction
    {
        List<ProductDto> GetAllProductsAction();
    }
}
