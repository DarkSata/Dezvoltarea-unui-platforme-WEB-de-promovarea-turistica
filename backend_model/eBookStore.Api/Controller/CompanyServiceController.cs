using eBookStore.BusinessLayer.Interfaces;
using eBookStore.Domain.Models.CompanyService;
using Microsoft.AspNetCore.Mvc;

namespace eBookStore.Api.Controller
{
    [Route("api/company")]
    [ApiController]
    public class CompanyServiceController : ControllerBase
    {
        private ICompanyServiceAction _company;
        public CompanyServiceController()
        {
            var bl = new BusinessLayer.BusinessLogic();
            _company = bl.CompanyServiceAction();
        }

        [HttpGet("getAll")]
        public IActionResult GetAll()
        {
            var services = _company.GetAllCompanyServiceAction();
            return Ok(services);
        }

        [HttpGet]
        public IActionResult Get(int id)
        {
            var service = _company.GetCompanyServiceByIdAction(id);
            return Ok(service);
        }

        [HttpPost]
        public IActionResult Create([FromBody] CompanyServiceDto data)
        {
            var responce = _company.CreateCompanyServiceAction(data);
            return Ok(responce);
        }

        [HttpPut]
        public IActionResult Update([FromBody] CompanyServiceDto data)
        {
            var responce = _company.UpdateCompanyServiceAction(data);
            return Ok(responce);
        }

        [HttpDelete]
        public IActionResult Delete(int id)
        {
            var responce = _company.DeleteCompanyServiceAction(id);
            return Ok(responce);
        }
    }
}
