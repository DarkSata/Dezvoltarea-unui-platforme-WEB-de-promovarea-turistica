using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using eBookStore.BusinessLayer.Core;
using eBookStore.BusinessLayer.Interfaces;
using eBookStore.Domain.Models.CompanyService;
using eBookStore.Domain.Models.Responces;

namespace eBookStore.BusinessLayer.Structure
{
    public class CompanyServiceExecution : CompanyServiceActions, ICompanyServiceAction
    {
        public ActionResponce CreateCompanyServiceAction(CompanyServiceDto data)
        {
            return CreateCompanyServiceActionExecution(data);
        }

        public ActionResponce DeleteCompanyServiceAction(int id)
        {
            return DeleteCompanyServiceActionExecution(id);
        }

        public List<CompanyServiceDto> GetAllCompanyServiceAction()
        {
            return GetAllCompanyServiceActionExecution();
        }

        public CompanyServiceDto? GetCompanyServiceByIdAction(int id)
        {
            return GetCompanyServiceByIdActionExecution(id);
        }

        public ActionResponce UpdateCompanyServiceAction(CompanyServiceDto data)
        {
           return UpdateCompanyServiceActionExecution(data);
        }
    }
}
