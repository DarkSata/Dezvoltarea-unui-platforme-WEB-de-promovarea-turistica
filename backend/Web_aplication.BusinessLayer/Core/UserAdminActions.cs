using Web_aplication.DataAccess.Context;
using Web_aplication.Domain.Entities;
using Web_aplication.Domain.Models.Auth;

namespace Web_aplication.BusinessLayer.Core;

public abstract class UserAdminActions
{
    protected UserAdminActions() { }

    private static UserAdminDto ToDto(UserEntity user) => new()
    {
        Id        = user.Id,
        Username  = user.Username,
        Email     = user.Email,
        Role      = user.Role,
        CreatedAt = user.CreatedAt
    };

    private static bool IsValidRole(string role)
        => role == "admin" || role == "user";

    protected UserListResponse GetAllUsersExecution()
    {
        using var db = new AppDbContext();
        var items = db.Users
            .OrderBy(u => u.Username)
            .ToList()
            .Select(ToDto)
            .ToList();

        return new UserListResponse { Items = items, Total = items.Count };
    }

    protected UserAdminDto? GetUserByIdExecution(int id)
    {
        using var db = new AppDbContext();
        var user = db.Users.Find(id);
        return user is null ? null : ToDto(user);
    }

    protected UserAdminDto? CreateUserExecution(UserCreateRequest request)
    {
        var username = request.Username.Trim();
        var role     = request.Role.Trim();

        using var db = new AppDbContext();
        if (db.Users.Any(u => u.Username.ToLower() == username.ToLower()))
            return null;

        if (!IsValidRole(role))
            role = "user";

        var user = new UserEntity
        {
            Username  = username,
            Password  = request.Password.Trim(),
            Email     = string.IsNullOrWhiteSpace(request.Email) ? null : request.Email.Trim(),
            Role      = role,
            CreatedAt = DateTime.UtcNow
        };

        db.Users.Add(user);
        db.SaveChanges();

        return ToDto(user);
    }

    protected UserAdminDto? UpdateUserExecution(int id, UserUpdateRequest request)
    {
        using var db = new AppDbContext();
        var user = db.Users.Find(id);
        if (user == null) return null;

        if (!string.IsNullOrWhiteSpace(request.Username))
        {
            var username = request.Username.Trim();
            if (db.Users.Any(u => u.Id != id && u.Username.ToLower() == username.ToLower()))
                return null;

            user.Username = username;
        }

        // allow clearing email with empty string
        if (request.Email != null)
            user.Email = string.IsNullOrWhiteSpace(request.Email) ? null : request.Email.Trim();

        if (!string.IsNullOrWhiteSpace(request.Role) && IsValidRole(request.Role))
            user.Role = request.Role;

        if (!string.IsNullOrWhiteSpace(request.Password))
            user.Password = request.Password.Trim();

        db.SaveChanges();

        return ToDto(user);
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
