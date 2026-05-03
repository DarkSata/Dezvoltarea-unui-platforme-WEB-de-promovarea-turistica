using Web_aplication.Domain.Models.Auth;
using Web_aplication.Domain.Models.Responses;

namespace Web_aplication.BusinessLayer.Interfaces;

public interface IUserAction
{
    UserProfileDto? GetProfile(string username);
    UserProfileUpdateResponse? UpdateProfile(string username, UserProfileUpdateRequest request);
    ActionResponse ChangePassword(string username, ChangePasswordRequest request);
    ActionResponse DeleteOwnAccount(string username);
}
