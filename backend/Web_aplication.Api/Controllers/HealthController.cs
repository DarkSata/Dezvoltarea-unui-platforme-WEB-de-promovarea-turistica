using Microsoft.AspNetCore.Mvc;

namespace Web_aplication.Api.Controllers;

[ApiController]
[Route("api/health")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Check() => Ok(new { status = "ok" });
}
