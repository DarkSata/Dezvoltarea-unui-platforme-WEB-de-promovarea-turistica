using Web_aplication.DataAccess.Context;
using Web_aplication.Domain.Entities;
using Web_aplication.Domain.Models.Auth;
using Web_aplication.Domain.Models.Responses;

namespace Web_aplication.BusinessLayer.Core;

public abstract class UserActions
{
    protected UserActions() { }

    private static UserProfileDto ToProfile(UserEntity user) => new()
    {
        Username  = user.Username,
        Email     = user.Email,
        Role      = user.Role,
        CreatedAt = user.CreatedAt
    };

    protected UserProfileDto? GetProfileExecution(string username)
    {
        using var db = new AppDbContext();
        var user = db.Users.FirstOrDefault(u => u.Username == username);
        return user is null ? null : ToProfile(user);
    }

    protected UserProfileUpdateResponse? UpdateProfileExecution(
        string currentUsername,
        UserProfileUpdateRequest request)
    {
        using var db = new AppDbContext();
        var user = db.Users.FirstOrDefault(u => u.Username == currentUsername);
        if (user is null) return null;

        if (!string.IsNullOrWhiteSpace(request.Username))
        {
            var nextUsername = request.Username.Trim();
            if (db.Users.Any(u => u.Id != user.Id && u.Username.ToLower() == nextUsername.ToLower()))
                return null;

            user.Username = nextUsername;
        }

        if (request.Email != null)
            user.Email = string.IsNullOrWhiteSpace(request.Email) ? null : request.Email.Trim();

        db.SaveChanges();

        return new UserProfileUpdateResponse
        {
            Token     = TokenService.GenerateToken(user.Username, user.Role),
            Username  = user.Username,
            Email     = user.Email,
            Role      = user.Role,
            CreatedAt = user.CreatedAt
        };
    }

    protected ActionResponse ChangePasswordExecution(string username, ChangePasswordRequest request)
    {
        using var db = new AppDbContext();
        var user = db.Users.FirstOrDefault(u => u.Username == username);
        if (user is null)
            return new ActionResponse { IsSuccess = false, Message = "Utilizatorul nu a fost gasit." };

        if (user.Password != request.CurrentPassword)
            return new ActionResponse { IsSuccess = false, Message = "Parola curenta este gresita." };

        user.Password = request.NewPassword.Trim();
        db.SaveChanges();

        return new ActionResponse { IsSuccess = true, Message = "Parola a fost schimbata." };
    }

    protected ActionResponse DeleteOwnAccountExecution(string username)
    {
        using var db = new AppDbContext();
        var user = db.Users.FirstOrDefault(u => u.Username == username);
        if (user is null)
            return new ActionResponse { IsSuccess = false, Message = "Utilizatorul nu a fost gasit." };

        if (user.Role == "admin" && db.Users.Count(u => u.Role == "admin") <= 1)
            return new ActionResponse { IsSuccess = false, Message = "Nu poti sterge ultimul cont admin." };

        db.Users.Remove(user);
        db.SaveChanges();

        return new ActionResponse { IsSuccess = true, Message = "Contul a fost sters." };
    }
}
