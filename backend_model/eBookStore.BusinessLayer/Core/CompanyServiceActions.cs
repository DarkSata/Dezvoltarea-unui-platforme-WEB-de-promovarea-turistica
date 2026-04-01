using eBookStore.Domain.Models.CompanyService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using eBookStore.DataAccess.Context;
using eBookStore.Domain.Entities.CompanyService;
using eBookStore.Domain.Models.Responces;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace eBookStore.BusinessLayer.Core
{
    public class CompanyServiceActions
    {
        protected CompanyServiceActions()
        {
        }

        protected List<CompanyServiceDto> GetAllCompanyServiceActionExecution()
        {
            var data = new List<CompanyServiceDto>();
            List<CompanyServiceData> csData;
            using (var db = new CompanyServiceContext())
            {
                csData = db.CompanyServices.
                    Where(x => !x.IsDeleted).ToList();
            }


            if (csData.Count <= 0) return data;
            foreach (var item in csData)
            {
                data.Add(new CompanyServiceDto
                {
                    Id = item.Id,
                    ServiceName = item.ServiceName,
                    ServiceDescription = item.ServiceDescription,
                    ServicePrice = item.ServicePrice
                });
            }

            return data;
        }

        protected CompanyServiceDto? GetCompanyServiceByIdActionExecution(int id)
        {
            CompanyServiceData? csData;
            using (var db = new CompanyServiceContext())
            {
                csData = db.CompanyServices
                    .FirstOrDefault(x =>
                        x.Id == id && !x.IsDeleted);
            }

            if (csData == null) return null;
            var data = new CompanyServiceDto
            {
                Id = csData.Id,
                ServiceName = csData.ServiceName,
                ServiceDescription = csData.ServiceDescription,
                ServicePrice = csData.ServicePrice
            };
            return data;
        }

        protected ActionResponce CreateCompanyServiceActionExecution(CompanyServiceDto data)
        {
            var status = ValidateCompanyServiceName(data);
            if (!status.IsSuccess)
            {
                return status;
            }

            using (var db = new CompanyServiceContext())
            {
                var csData = new CompanyServiceData
                {
                    ServiceName = data.ServiceName,
                    ServiceDescription = data.ServiceDescription,
                    ServicePrice = data.ServicePrice
                };
                db.CompanyServices.Add(csData);
                db.SaveChanges();
            }

            return new ActionResponce
            {
                IsSuccess = true,
                Message = "Company service created successfully."
            };
        }

        protected ActionResponce UpdateCompanyServiceActionExecution(CompanyServiceDto data)
        {

            var localData = GetCompanyServiceByIdIternal(data.Id);
            if (localData == null)
            {
                return new ActionResponce
                {
                    IsSuccess = false,
                    Message = "Company service not found."
                };
            }

            localData.ServiceDescription = data.ServiceDescription;
            localData.ServiceName = data.ServiceName;
            localData.ServicePrice = data.ServicePrice;

            localData.UpdatedAt = DateTime.Now;


            using (var db = new CompanyServiceContext())
            {
                db.CompanyServices.Update(localData);
                db.SaveChanges();
            }

            return new ActionResponce
            {
                IsSuccess = true,
                Message = "Company service updated successfully."
            };
        }

        protected ActionResponce DeleteCompanyServiceActionExecution(int id)
        {
            var localData = GetCompanyServiceByIdIternal(id);
            if (localData == null)
            {
                return new ActionResponce
                {
                    IsSuccess = false,
                    Message = "Company service not found."
                };
            }


            localData.IsDeleted = true;

            using (var db = new CompanyServiceContext())
            {
                db.CompanyServices.Update(localData);
                db.SaveChanges();
            }

            return new ActionResponce()
            {
                IsSuccess = true,
                Message = "Company Service Deleted"
            };
        }


        /// <summary>
        /// Helper for Action of Getting Company Services by ID
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        private CompanyServiceData? GetCompanyServiceByIdIternal(int id)
        {
            CompanyServiceData? localData;
            using (var db = new CompanyServiceContext())
            {
                localData = db.CompanyServices.
                    FirstOrDefault(x => x.Id == id);
            }

            return localData;
        }

        /// <summary>
        /// Validate Company Service Name an unique value.
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        private ActionResponce ValidateCompanyServiceName(CompanyServiceDto data)
        {
            CompanyServiceData? localData;
            using (var db = new CompanyServiceContext())
            {
                localData = db.CompanyServices
                .FirstOrDefault(x =>
                        x.ServiceName.ToLower() == data.ServiceName.ToLower() && !x.IsDeleted);
            }

            if (localData != null)
            {
                return new ActionResponce
                {
                    IsSuccess = false,
                    Message = "A company service with the same name already exists."
                };
            }

            return new ActionResponce()
            {
                IsSuccess = true,
                Message = "A company service name is valid."
            };
        }
    }
}
