using Web_aplication.Domain.Models.Routes;
using Web_aplication.Domain.Models.Responses;

namespace Web_aplication.BusinessLayer.Interfaces;

public interface IRoutesAction
{
    RouteListResult GetAll(string? search, string? category, string? duration, string? sortBy, int page, int pageSize);
    TouristRoute    Create(TouristRouteInput input);
    TouristRoute?   Update(string id, TouristRouteInput input);
    ActionResponse  Delete(string id);
}
