using Web_aplication.DataAccess.Context;
using Web_aplication.Domain.Models.Auth;

namespace Web_aplication.BusinessLayer.Core;

public abstract class AuthActions
{
    protected AuthActions() { }

    protected LoginResponse? LoginActionExecution(LoginRequest request)
    {
        using var db = new AppDbContext();
        var user = db.Users.FirstOrDefault(u =>
            u.Username == request.Username && u.Password == request.Password);

        if (user == null) return null;

        return new LoginResponse
        {
            Token    = TokenService.GenerateToken(user.Username, user.Role),
            Username = user.Username,
            Role     = user.Role
        };
    }
}
