using eBookStore.BusinessLayer.Interfaces;
using eBookStore.Domain.Models.User;
using Microsoft.AspNetCore.Mvc;

namespace eBookStore.Api.Controller
{
    [Route("api/reg")]
    [ApiController]
    public class RegisterController : ControllerBase
    {
        internal IUserRegAction _userReg;
        public RegisterController()
        {
            var bl = new BusinessLayer.BusinessLogic();
            _userReg = bl.UserRegAction();
        }

        [HttpPost]
        public IActionResult Register([FromBody] UserRegisterDto uRegData)
        {


            var data = _userReg.UserRegDataValidation(uRegData);
            if (data.IsSuccess)
            {
                return Ok(data.Message);
            }

            return Ok(data.Message);
        }
    }
}
