using Web_aplication.Domain.Models.Auth;

namespace Web_aplication.BusinessLayer.Interfaces;

public interface IUserAdminAction
{
    UserListResponse  GetAllUsers();
    UserAdminDto?     UpdateUser(int id, UserUpdateRequest request);
    bool              DeleteUser(int id);
}
