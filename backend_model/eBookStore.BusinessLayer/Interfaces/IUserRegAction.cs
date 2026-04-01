using eBookStore.Domain.Models.Responces;
using eBookStore.Domain.Models.User;

namespace eBookStore.BusinessLayer.Interfaces
{
    public interface IUserRegAction
    {
        public ActionResponce UserRegDataValidation(UserRegisterDto uReg);
    }
}
