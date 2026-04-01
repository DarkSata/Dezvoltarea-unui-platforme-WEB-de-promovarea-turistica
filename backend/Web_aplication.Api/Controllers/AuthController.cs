using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Web_aplication.BusinessLayer;
using Web_aplication.Domain.Models.Auth;

namespace Web_aplication.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly BusinessLogic _bl = new();

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        var result = _bl.AuthAction().Login(request);
        if (result is null)
            return Unauthorized(new { message = "Credențiale invalide." });
        return Ok(result);
    }

    [HttpPost("register")]
    public IActionResult Register([FromBody] RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            return BadRequest(new { message = "Username și parola sunt obligatorii." });

        var result = _bl.AuthAction().Register(request);
        if (result is null)
            return Conflict(new { message = "Username-ul este deja folosit." });
        return Ok(result);
    }

    [HttpPost("logout")]
    public IActionResult Logout() => Ok();

    [HttpGet("session")]
    [Authorize]
    public IActionResult Session()
    {
        var username = User.FindFirstValue(ClaimTypes.Name)!;
        var role     = User.FindFirstValue(ClaimTypes.Role)!;
        return Ok(new SessionUser { Username = username, Role = role });
    }
}
