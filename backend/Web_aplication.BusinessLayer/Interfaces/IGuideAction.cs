using Web_aplication.Domain.Models.Guide;
using Web_aplication.Domain.Models.Responses;

namespace Web_aplication.BusinessLayer.Interfaces;

public interface IGuideAction
{
    GuideListResult      GetAll(string? search, string? sortBy, int page, int pageSize);
    GuideChecklistItem   Create(GuideChecklistInput input);
    GuideChecklistItem?  Update(string id, GuideChecklistInput input);
    ActionResponse       Delete(string id);
}
