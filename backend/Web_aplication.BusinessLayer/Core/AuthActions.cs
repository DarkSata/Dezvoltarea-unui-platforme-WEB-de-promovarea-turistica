using Web_aplication.DataAccess.Context;
using Web_aplication.Domain.Entities;
using Web_aplication.Domain.Models.Auth;

namespace Web_aplication.BusinessLayer.Core;

public abstract class AuthActions
{
    protected AuthActions() { }

    protected LoginResponse? LoginActionExecution(LoginRequest request)
    {
        using var db = new AppDbContext();
        var username = request.Username.Trim();
        var user = db.Users.FirstOrDefault(u =>
            u.Username == username && u.Password == request.Password);

        if (user == null) return null;

        return new LoginResponse
        {
            Token    = TokenService.GenerateToken(user.Username, user.Role),
            Username = user.Username,
            Role     = user.Role
        };
    }

    protected RegisterResponse? RegisterActionExecution(RegisterRequest request)
    {
        using var db = new AppDbContext();
        var username = request.Username.Trim();

        if (db.Users.Any(u => u.Username.ToLower() == username.ToLower()))
            return null;

        var user = new UserEntity
        {
            Username  = username,
            Password  = request.Password.Trim(),
            Email     = string.IsNullOrWhiteSpace(request.Email) ? null : request.Email.Trim(),
            Role      = "user",
            CreatedAt = DateTime.UtcNow
        };
        db.Users.Add(user);
        db.SaveChanges();

        return new RegisterResponse
        {
            Token    = TokenService.GenerateToken(user.Username, user.Role),
            Username = user.Username,
            Role     = user.Role
        };
    }
}
