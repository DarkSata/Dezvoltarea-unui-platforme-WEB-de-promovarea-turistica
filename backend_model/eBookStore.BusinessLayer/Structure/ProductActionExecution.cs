using eBookStore.BusinessLayer.Core;
using eBookStore.BusinessLayer.Interfaces;
using eBookStore.Domain.Models.Product;

namespace eBookStore.BusinessLayer.Structure
{
    public class ProductActionExecution : ProductActions, IProductAction
    {
        public List<ProductDto> GetAllProductsAction()
        {
            return GetAllProductsActionExecution();
        }
    }
}
