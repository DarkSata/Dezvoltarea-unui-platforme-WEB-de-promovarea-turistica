using Web_aplication.BusinessLayer.Core;
using Web_aplication.BusinessLayer.Interfaces;
using Web_aplication.Domain.Models.Gallery;
using Web_aplication.Domain.Models.Responses;

namespace Web_aplication.BusinessLayer.Structure;

public class GalleryActionExecution : GalleryActions, IGalleryAction
{
    public GalleryListResult GetAll(string? search, string? sortBy, int page, int pageSize)
        => GetAllGalleryActionExecution(search, sortBy, page, pageSize);

    public GalleryBlock Create(GalleryBlockInput input)
        => CreateGalleryActionExecution(input);

    public GalleryBlock? Update(string id, GalleryBlockInput input)
        => UpdateGalleryActionExecution(id, input);

    public ActionResponse Delete(string id)
        => DeleteGalleryActionExecution(id);
}
