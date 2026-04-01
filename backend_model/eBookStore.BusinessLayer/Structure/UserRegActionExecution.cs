using eBookStore.BusinessLayer.Core;
using eBookStore.BusinessLayer.Interfaces;
using eBookStore.Domain.Models.Responces;
using eBookStore.Domain.Models.User;

namespace eBookStore.BusinessLayer.Structure
{
    public class UserRegActionExecution : UserActions, IUserRegAction
    {
        public ActionResponce UserRegDataValidation(UserRegisterDto uReg)
        {
            return UserRegDataValidationAction(uReg);
        }
    }
}
