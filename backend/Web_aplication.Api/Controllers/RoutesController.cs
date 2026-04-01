using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Web_aplication.BusinessLayer;
using Web_aplication.Domain.Models.Routes;

namespace Web_aplication.Api.Controllers;

[ApiController]
[Route("api/routes")]
public class RoutesController : ControllerBase
{
    private readonly BusinessLogic _bl = new();

    [HttpGet]
    public IActionResult Query(
        [FromQuery] string? search,
        [FromQuery] string? category,
        [FromQuery] string? duration,
        [FromQuery] string? sortBy,
        [FromQuery] int page     = 1,
        [FromQuery] int pageSize = 20)
    {
        var result = _bl.RoutesAction().GetAll(search, category, duration, sortBy, page, pageSize);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "admin")]
    public IActionResult Create([FromBody] TouristRouteInput input)
    {
        var result = _bl.RoutesAction().Create(input);
        return CreatedAtAction(nameof(Query), new { }, result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "admin")]
    public IActionResult Update(string id, [FromBody] TouristRouteInput input)
    {
        var result = _bl.RoutesAction().Update(id, input);
        if (result is null) return NotFound();
        return Ok(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public IActionResult Delete(string id)
    {
        var result = _bl.RoutesAction().Delete(id);
        if (!result.IsSuccess) return NotFound();
        return NoContent();
    }
}
