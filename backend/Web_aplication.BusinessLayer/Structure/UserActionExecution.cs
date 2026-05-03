using Web_aplication.BusinessLayer.Core;
using Web_aplication.BusinessLayer.Interfaces;
using Web_aplication.Domain.Models.Auth;
using Web_aplication.Domain.Models.Responses;

namespace Web_aplication.BusinessLayer.Structure;

public class UserActionExecution : UserActions, IUserAction
{
    public UserProfileDto? GetProfile(string username)
        => GetProfileExecution(username);

    public UserProfileUpdateResponse? UpdateProfile(string username, UserProfileUpdateRequest request)
        => UpdateProfileExecution(username, request);

    public ActionResponse ChangePassword(string username, ChangePasswordRequest request)
        => ChangePasswordExecution(username, request);

    public ActionResponse DeleteOwnAccount(string username)
        => DeleteOwnAccountExecution(username);
}
