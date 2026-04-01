using Web_aplication.BusinessLayer.Core;
using Web_aplication.BusinessLayer.Interfaces;
using Web_aplication.Domain.Models.Auth;

namespace Web_aplication.BusinessLayer.Structure;

public class AuthActionExecution : AuthActions, IAuthAction
{
    public LoginResponse?    Login(LoginRequest request)
        => LoginActionExecution(request);

    public RegisterResponse? Register(RegisterRequest request)
        => RegisterActionExecution(request);
}
