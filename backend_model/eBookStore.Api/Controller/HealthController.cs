using Microsoft.AspNetCore.Mvc;

namespace eBookStore.Api.Controller
{
    [Route("api/health")]
    [ApiController]
    public class HealthController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok("API is healthy");
        }
    }
}
