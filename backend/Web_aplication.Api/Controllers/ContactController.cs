using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Web_aplication.BusinessLayer;
using Web_aplication.Domain.Models.Contact;

namespace Web_aplication.Api.Controllers;

[ApiController]
[Route("api/contact")]
public class ContactController : ControllerBase
{
    private readonly BusinessLogic _bl = new();

    [HttpGet("content")]
    public IActionResult GetContent() => Ok(_bl.ContactAction().GetContent());

    // ── Details ───────────────────────────────────────────────────────────────

    [HttpPost("details")]
    [Authorize(Roles = "admin")]
    public IActionResult CreateDetail([FromBody] ContactDetailInput input)
        => Ok(_bl.ContactAction().CreateDetail(input));

    [HttpPut("details/{id}")]
    [Authorize(Roles = "admin")]
    public IActionResult UpdateDetail(string id, [FromBody] ContactDetailInput input)
    {
        var result = _bl.ContactAction().UpdateDetail(id, input);
        if (result is null) return NotFound();
        return Ok(result);
    }

    [HttpDelete("details/{id}")]
    [Authorize(Roles = "admin")]
    public IActionResult DeleteDetail(string id)
    {
        if (!_bl.ContactAction().DeleteDetail(id)) return NotFound();
        return NoContent();
    }

    // ── Socials ───────────────────────────────────────────────────────────────

    [HttpPost("socials")]
    [Authorize(Roles = "admin")]
    public IActionResult CreateSocial([FromBody] SocialLinkInput input)
        => Ok(_bl.ContactAction().CreateSocial(input));

    [HttpPut("socials/{id}")]
    [Authorize(Roles = "admin")]
    public IActionResult UpdateSocial(string id, [FromBody] SocialLinkInput input)
    {
        var result = _bl.ContactAction().UpdateSocial(id, input);
        if (result is null) return NotFound();
        return Ok(result);
    }

    [HttpDelete("socials/{id}")]
    [Authorize(Roles = "admin")]
    public IActionResult DeleteSocial(string id)
    {
        if (!_bl.ContactAction().DeleteSocial(id)) return NotFound();
        return NoContent();
    }

    // ── FAQ ───────────────────────────────────────────────────────────────────

    [HttpPost("faq")]
    [Authorize(Roles = "admin")]
    public IActionResult CreateFaq([FromBody] FaqItemInput input)
        => Ok(_bl.ContactAction().CreateFaq(input));

    [HttpPut("faq/{id}")]
    [Authorize(Roles = "admin")]
    public IActionResult UpdateFaq(string id, [FromBody] FaqItemInput input)
    {
        var result = _bl.ContactAction().UpdateFaq(id, input);
        if (result is null) return NotFound();
        return Ok(result);
    }

    [HttpDelete("faq/{id}")]
    [Authorize(Roles = "admin")]
    public IActionResult DeleteFaq(string id)
    {
        if (!_bl.ContactAction().DeleteFaq(id)) return NotFound();
        return NoContent();
    }

    // ── Office ────────────────────────────────────────────────────────────────

    [HttpPut("office")]
    [Authorize(Roles = "admin")]
    public IActionResult UpdateOffice([FromBody] OfficeLocation input)
    {
        var result = _bl.ContactAction().UpdateOffice(input);
        if (result is null) return NotFound();
        return Ok(result);
    }
}
