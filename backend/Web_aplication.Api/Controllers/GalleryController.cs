using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Web_aplication.BusinessLayer;
using Web_aplication.Domain.Models.Gallery;

namespace Web_aplication.Api.Controllers;

[ApiController]
[Route("api/gallery")]
public class GalleryController : ControllerBase
{
    private readonly BusinessLogic _bl = new();

    [HttpGet]
    public IActionResult Query(
        [FromQuery] string? search,
        [FromQuery] string? sortBy,
        [FromQuery] int page     = 1,
        [FromQuery] int pageSize = 50)
    {
        var result = _bl.GalleryAction().GetAll(search, sortBy, page, pageSize);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "admin")]
    public IActionResult Create([FromBody] GalleryBlockInput input)
        => Ok(_bl.GalleryAction().Create(input));

    [HttpPut("{id}")]
    [Authorize(Roles = "admin")]
    public IActionResult Update(string id, [FromBody] GalleryBlockInput input)
    {
        var result = _bl.GalleryAction().Update(id, input);
        if (result is null) return NotFound();
        return Ok(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public IActionResult Delete(string id)
    {
        var result = _bl.GalleryAction().Delete(id);
        if (!result.IsSuccess) return NotFound();
        return NoContent();
    }
}
