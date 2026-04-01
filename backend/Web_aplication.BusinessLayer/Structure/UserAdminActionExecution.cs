using Web_aplication.BusinessLayer.Core;
using Web_aplication.BusinessLayer.Interfaces;
using Web_aplication.Domain.Models.Auth;

namespace Web_aplication.BusinessLayer.Structure;

public class UserAdminActionExecution : UserAdminActions, IUserAdminAction
{
    public UserListResponse  GetAllUsers()                          => GetAllUsersExecution();
    public UserAdminDto?     UpdateUser(int id, UserUpdateRequest r) => UpdateUserExecution(id, r);
    public bool              DeleteUser(int id)                     => DeleteUserExecution(id);
}
