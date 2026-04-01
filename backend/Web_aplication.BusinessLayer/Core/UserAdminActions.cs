using Web_aplication.DataAccess.Context;
using Web_aplication.Domain.Models.Auth;

namespace Web_aplication.BusinessLayer.Core;

public abstract class UserAdminActions
{
    protected UserAdminActions() { }

    protected UserListResponse GetAllUsersExecution()
    {
        using var db = new AppDbContext();
        var items = db.Users
            .OrderBy(u => u.Username)
            .Select(u => new UserAdminDto
            {
                Id        = u.Id,
                Username  = u.Username,
                Email     = u.Email,
                Role      = u.Role,
                CreatedAt = u.CreatedAt
            })
            .ToList();

        return new UserListResponse { Items = items, Total = items.Count };
    }

    protected UserAdminDto? UpdateUserExecution(int id, UserUpdateRequest request)
    {
        using var db = new AppDbContext();
        var user = db.Users.Find(id);
        if (user == null) return null;

        if (!string.IsNullOrWhiteSpace(request.Username))
            user.Username = request.Username.Trim();

        // allow clearing email with empty string
        if (request.Email != null)
            user.Email = string.IsNullOrWhiteSpace(request.Email) ? null : request.Email.Trim();

        if (!string.IsNullOrWhiteSpace(request.Role) && (request.Role == "admin" || request.Role == "user"))
            user.Role = request.Role;

        if (!string.IsNullOrWhiteSpace(request.Password))
            user.Password = request.Password.Trim();

        db.SaveChanges();

        return new UserAdminDto
        {
            Id        = user.Id,
            Username  = user.Username,
            Email     = user.Email,
            Role      = user.Role,
            CreatedAt = user.CreatedAt
        };
    }

    protected bool DeleteUserExecution(int id)
    {
        using var db = new AppDbContext();
        var user = db.Users.Find(id);
        if (user == null) return false;
        db.Users.Remove(user);
        db.SaveChanges();
        return true;
    }
}
