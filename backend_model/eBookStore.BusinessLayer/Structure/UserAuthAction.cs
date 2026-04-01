using eBookStore.BusinessLayer.Core;
using eBookStore.BusinessLayer.Interfaces;
using eBookStore.Domain.Models.User;

namespace eBookStore.BusinessLayer.Structure
{
    public class UserAuthAction : UserActions, IUserLoginAction
    {
        public UserAuthAction() { }

        public object UserLoginDataValidation(UserLoginDto udata)
        {

            var isValid = UserLoginDataValidationExecution(udata);
            if (isValid)
            {
                var token = UserTokenGeneration(udata);

            }

            return null;
        }
    }
}
