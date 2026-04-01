using Web_aplication.BusinessLayer.Core;
using Web_aplication.BusinessLayer.Interfaces;
using Web_aplication.Domain.Models.Guide;
using Web_aplication.Domain.Models.Responses;

namespace Web_aplication.BusinessLayer.Structure;

public class GuideActionExecution : GuideActions, IGuideAction
{
    public GuideListResult GetAll(string? search, string? sortBy, int page, int pageSize)
        => GetAllGuideActionExecution(search, sortBy, page, pageSize);

    public GuideChecklistItem Create(GuideChecklistInput input)
        => CreateGuideActionExecution(input);

    public GuideChecklistItem? Update(string id, GuideChecklistInput input)
        => UpdateGuideActionExecution(id, input);

    public ActionResponse Delete(string id)
        => DeleteGuideActionExecution(id);
}
