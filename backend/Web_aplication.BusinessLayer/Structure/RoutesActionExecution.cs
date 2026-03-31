using Web_aplication.BusinessLayer.Core;
using Web_aplication.BusinessLayer.Interfaces;
using Web_aplication.Domain.Models.Routes;
using Web_aplication.Domain.Models.Responses;

namespace Web_aplication.BusinessLayer.Structure;

public class RoutesActionExecution : RoutesActions, IRoutesAction
{
    public RouteListResult GetAll(string? search, string? category, string? duration, string? sortBy, int page, int pageSize)
        => GetAllRoutesActionExecution(search, category, duration, sortBy, page, pageSize);

    public TouristRoute Create(TouristRouteInput input)
        => CreateRouteActionExecution(input);

    public TouristRoute? Update(string id, TouristRouteInput input)
        => UpdateRouteActionExecution(id, input);

    public ActionResponse Delete(string id)
        => DeleteRouteActionExecution(id);
}
