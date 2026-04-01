using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Web_aplication.BusinessLayer;
using Web_aplication.Domain.Models.Auth;

namespace Web_aplication.Api.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize]
public class AdminUsersController : ControllerBase
{
    private readonly BusinessLogic _bl = new();

    private bool IsAdmin()
        => User.FindFirstValue(ClaimTypes.Role) == "admin";

    // GET /api/admin/users
    [HttpGet("users")]
    public IActionResult GetUsers()
    {
        if (!IsAdmin()) return Forbid();
        return Ok(_bl.UserAdminAction().GetAllUsers());
    }

    // PUT /api/admin/users/{id}
    [HttpPut("users/{id:int}")]
    public IActionResult UpdateUser(int id, [FromBody] UserUpdateRequest request)
    {
        if (!IsAdmin()) return Forbid();

        if (string.IsNullOrWhiteSpace(request.Username) &&
            string.IsNullOrWhiteSpace(request.Role)     &&
            string.IsNullOrWhiteSpace(request.Password) &&
            request.Email == null)
            return BadRequest(new { message = "Niciun camp de actualizat." });

        var result = _bl.UserAdminAction().UpdateUser(id, request);
        if (result == null)
            return NotFound(new { message = "Utilizatorul nu a fost gasit." });

        return Ok(result);
    }

    // DELETE /api/admin/users/{id}
    [HttpDelete("users/{id:int}")]
    public IActionResult DeleteUser(int id)
    {
        if (!IsAdmin()) return Forbid();

        var deleted = _bl.UserAdminAction().DeleteUser(id);
        if (!deleted)
            return NotFound(new { message = "Utilizatorul nu a fost gasit." });

        return NoContent();
    }
}
