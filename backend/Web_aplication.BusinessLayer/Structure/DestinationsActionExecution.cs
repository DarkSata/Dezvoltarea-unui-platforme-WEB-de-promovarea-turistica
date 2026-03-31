using Web_aplication.BusinessLayer.Core;
using Web_aplication.BusinessLayer.Interfaces;
using Web_aplication.Domain.Models.Destinations;
using Web_aplication.Domain.Models.Responses;

namespace Web_aplication.BusinessLayer.Structure;

public class DestinationsActionExecution : DestinationsActions, IDestinationsAction
{
    public DestinationListResult GetAll(string? search, string? category, string? sortBy, int page, int pageSize) // un obiect ca parametrul
        => GetAllDestinationsActionExecution(search, category, sortBy, page, pageSize);

    public Destination? GetById(string id)
        => GetDestinationByIdActionExecution(id);

    public Destination Create(DestinationInput input)
        => CreateDestinationActionExecution(input);

    public Destination? Update(string id, DestinationInput input)
        => UpdateDestinationActionExecution(id, input);

    public ActionResponse Delete(string id)
        => DeleteDestinationActionExecution(id);
}
