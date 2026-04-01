using Web_aplication.DataAccess.Context;
using Web_aplication.Domain.Entities;
using Web_aplication.Domain.Models.Gallery;
using Web_aplication.Domain.Models.Responses;

namespace Web_aplication.BusinessLayer.Core;

public abstract class GalleryActions
{
    protected GalleryActions() { }

    private static GalleryBlock ToModel(GalleryBlockEntity e) =>
        new() { Id = e.Id, Title = e.Title, Subtitle = e.Subtitle, Theme = e.Theme };

    protected GalleryListResult GetAllGalleryActionExecution(
        string? search, string? sortBy, int page, int pageSize)
    {
        var s    = search?.Trim().ToLowerInvariant() ?? "";
        var sort = sortBy ?? "title-asc";

        using var db = new AppDbContext();
        var query = db.GalleryBlocks.AsQueryable();

        if (s.Length > 0)
            query = query.Where(g =>
                g.Title.ToLower().Contains(s) ||
                g.Subtitle.ToLower().Contains(s) ||
                g.Theme.Contains(s));

        query = sort == "title-desc"
            ? query.OrderByDescending(g => g.Title)
            : query.OrderBy(g => g.Title);

        var p     = Math.Max(1, page);
        var ps    = Math.Max(1, pageSize);
        var total = query.Count();
        var items = query.Skip((p - 1) * ps).Take(ps).ToList();

        return new GalleryListResult
        {
            Items = items.Select(ToModel).ToList(),
            Total = total, Page = p, PageSize = ps
        };
    }

    protected GalleryBlock CreateGalleryActionExecution(GalleryBlockInput input)
    {
        var entity = new GalleryBlockEntity
        {
            Id = $"gallery_{Guid.NewGuid():N}",
            Title = input.Title, Subtitle = input.Subtitle, Theme = input.Theme
        };
        using (var db = new AppDbContext())
        {
            db.GalleryBlocks.Add(entity);
            db.SaveChanges();
        }
        return ToModel(entity);
    }

    protected GalleryBlock? UpdateGalleryActionExecution(string id, GalleryBlockInput input)
    {
        using var db = new AppDbContext();
        var entity = db.GalleryBlocks.Find(id);
        if (entity is null) return null;
        entity.Title = input.Title; entity.Subtitle = input.Subtitle; entity.Theme = input.Theme;
        db.SaveChanges();
        return ToModel(entity);
    }

    protected ActionResponse DeleteGalleryActionExecution(string id)
    {
        using var db = new AppDbContext();
        var entity = db.GalleryBlocks.Find(id);
        if (entity is null)
            return new ActionResponse { IsSuccess = false, Message = "Gallery block not found." };
        db.GalleryBlocks.Remove(entity);
        db.SaveChanges();
        return new ActionResponse { IsSuccess = true, Message = "Gallery block deleted." };
    }
}
