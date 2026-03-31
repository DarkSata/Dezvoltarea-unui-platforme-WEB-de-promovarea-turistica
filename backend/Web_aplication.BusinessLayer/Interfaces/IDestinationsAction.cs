using Web_aplication.Domain.Models.Destinations;
using Web_aplication.Domain.Models.Responses;

namespace Web_aplication.BusinessLayer.Interfaces;

public interface IDestinationsAction
{
    DestinationListResult GetAll(string? search, string? category, string? sortBy, int page, int pageSize);
    Destination?          GetById(string id);
    Destination           Create(DestinationInput input);
    Destination?          Update(string id, DestinationInput input);
    ActionResponse        Delete(string id);
}
