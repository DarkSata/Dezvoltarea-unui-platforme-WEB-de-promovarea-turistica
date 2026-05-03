using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Web_aplication.BusinessLayer;
using Web_aplication.Domain.Models.Auth;

namespace Web_aplication.Api.Controllers;

[ApiController]
[Route("api/users")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly BusinessLogic _bl = new();

    private string CurrentUsername
        => User.FindFirstValue(ClaimTypes.Name) ?? "";

    // GET /api/users/me
    [HttpGet("me")]
    public IActionResult GetMe()
    {
        var result = _bl.UserAction().GetProfile(CurrentUsername);
        if (result == null)
            return NotFound(new { message = "Utilizatorul nu a fost gasit." });

        return Ok(result);
    }

    // PUT /api/users/me
    [HttpPut("me")]
    public IActionResult UpdateMe([FromBody] UserProfileUpdateRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Username) && request.Email == null)
            return BadRequest(new { message = "Niciun camp de actualizat." });

        if (_bl.UserAction().GetProfile(CurrentUsername) == null)
            return NotFound(new { message = "Utilizatorul nu a fost gasit." });

        var result = _bl.UserAction().UpdateProfile(CurrentUsername, request);
        if (result == null)
            return Conflict(new { message = "Username-ul este deja folosit." });

        return Ok(result);
    }

    // PUT /api/users/me/password
    [HttpPut("me/password")]
    public IActionResult ChangePassword([FromBody] ChangePasswordRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.CurrentPassword) || string.IsNullOrWhiteSpace(request.NewPassword))
            return BadRequest(new { message = "Parola curenta si parola noua sunt obligatorii." });

        if (request.NewPassword.Trim().Length < 4)
            return BadRequest(new { message = "Parola noua trebuie sa aiba cel putin 4 caractere." });

        var result = _bl.UserAction().ChangePassword(CurrentUsername, request);
        if (!result.IsSuccess)
            return BadRequest(new { message = result.Message });

        return Ok(result);
    }

    // DELETE /api/users/me
    [HttpDelete("me")]
    public IActionResult DeleteMe()
    {
        var result = _bl.UserAction().DeleteOwnAccount(CurrentUsername);
        if (!result.IsSuccess)
            return BadRequest(new { message = result.Message });

        return NoContent();
    }
}
