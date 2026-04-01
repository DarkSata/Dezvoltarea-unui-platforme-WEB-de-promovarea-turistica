using eBookStore.Domain.Models.User;

namespace eBookStore.BusinessLayer.Interfaces
{
    public interface IUserLoginAction
    {
        public object UserLoginDataValidation(UserLoginDto udata);
    }
}
