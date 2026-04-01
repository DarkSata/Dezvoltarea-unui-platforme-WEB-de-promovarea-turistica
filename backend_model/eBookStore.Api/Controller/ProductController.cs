using eBookStore.BusinessLayer.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace eBookStore.Api.Controller
{
    [Route("api/product")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        internal IProductAction _product;
        public ProductController()
        {
            var bl = new BusinessLayer.BusinessLogic();
            _product = bl.ProductAction();
        }

        [HttpGet("getAll")]
        public IActionResult GetAllProducts()
        {
            var products = _product.GetAllProductsAction();
            return Ok(products);
        }
    }
}
