using Web_aplication.Domain.Models.Auth;

namespace Web_aplication.BusinessLayer.Interfaces;

public interface IAuthAction
{
    LoginResponse?    Login(LoginRequest request);
    RegisterResponse? Register(RegisterRequest request);
}
