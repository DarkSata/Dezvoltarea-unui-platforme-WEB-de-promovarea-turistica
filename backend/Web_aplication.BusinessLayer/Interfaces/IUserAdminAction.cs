using Web_aplication.Domain.Models.Auth;

namespace Web_aplication.BusinessLayer.Interfaces;

public interface IUserAdminAction
{
    UserListResponse  GetAllUsers();
    UserAdminDto?     GetUserById(int id);
    UserAdminDto?     CreateUser(UserCreateRequest request);
    UserAdminDto?     UpdateUser(int id, UserUpdateRequest request);
    bool              DeleteUser(int id);
}
