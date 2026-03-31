using Web_aplication.Domain.Models.Gallery;
using Web_aplication.Domain.Models.Responses;

namespace Web_aplication.BusinessLayer.Interfaces;

public interface IGalleryAction
{
    GalleryListResult GetAll(string? search, string? sortBy, int page, int pageSize);
    GalleryBlock      Create(GalleryBlockInput input);
    GalleryBlock?     Update(string id, GalleryBlockInput input);
    ActionResponse    Delete(string id);
}
