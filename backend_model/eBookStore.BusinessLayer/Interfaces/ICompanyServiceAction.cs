using eBookStore.Domain.Models.CompanyService;
using eBookStore.Domain.Models.Responces;

namespace eBookStore.BusinessLayer.Interfaces
{
    public interface ICompanyServiceAction
    {
        List<CompanyServiceDto> GetAllCompanyServiceAction();
        CompanyServiceDto? GetCompanyServiceByIdAction(int id);
        ActionResponce CreateCompanyServiceAction(CompanyServiceDto data);
        ActionResponce UpdateCompanyServiceAction(CompanyServiceDto data);
        ActionResponce DeleteCompanyServiceAction(int id);
    }
}
