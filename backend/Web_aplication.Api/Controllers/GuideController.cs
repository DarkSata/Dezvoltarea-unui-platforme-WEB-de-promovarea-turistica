using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Web_aplication.BusinessLayer;
using Web_aplication.Domain.Models.Guide;

namespace Web_aplication.Api.Controllers;

[ApiController]
[Route("api/guide")]
public class GuideController : ControllerBase
{
    private readonly BusinessLogic _bl = new();

    [HttpGet]
    public IActionResult Query(
        [FromQuery] string? search,
        [FromQuery] string? sortBy,
        [FromQuery] int page     = 1,
        [FromQuery] int pageSize = 50)
    {
        var result = _bl.GuideAction().GetAll(search, sortBy, page, pageSize);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "admin")]
    public IActionResult Create([FromBody] GuideChecklistInput input)
        => Ok(_bl.GuideAction().Create(input));

    [HttpPut("{id}")]
    [Authorize(Roles = "admin")]
    public IActionResult Update(string id, [FromBody] GuideChecklistInput input)
    {
        var result = _bl.GuideAction().Update(id, input);
        if (result is null) return NotFound();
        return Ok(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public IActionResult Delete(string id)
    {
        var result = _bl.GuideAction().Delete(id);
        if (!result.IsSuccess) return NotFound();
        return NoContent();
    }
}
