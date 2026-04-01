using eBookStore.BusinessLayer.Interfaces;
using eBookStore.BusinessLayer.Structure;

namespace eBookStore.BusinessLayer
{
    public class BusinessLogic
    {

        public BusinessLogic() { }


        public IUserLoginAction UserLoginAction()
        {
            return new UserAuthAction();
        }

        public IProductAction ProductAction()
        {
            return new ProductActionExecution();
        }

        public IUserRegAction UserRegAction()
        {
            return new UserRegActionExecution();
        }

        public ICompanyServiceAction CompanyServiceAction()
        {
            return new CompanyServiceExecution();
        }
    }
}
