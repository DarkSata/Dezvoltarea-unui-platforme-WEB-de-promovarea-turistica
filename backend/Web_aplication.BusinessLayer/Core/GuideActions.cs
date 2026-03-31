using Web_aplication.DataAccess.Context;
using Web_aplication.Domain.Entities;
using Web_aplication.Domain.Models.Guide;
using Web_aplication.Domain.Models.Responses;

namespace Web_aplication.BusinessLayer.Core;

public abstract class GuideActions
{
    protected GuideActions() { }

    private static GuideChecklistItem ToModel(GuideChecklistItemEntity e) =>
        new() { Id = e.Id, Title = e.Title, Description = e.Description };

    protected GuideListResult GetAllGuideActionExecution(
        string? search, string? sortBy, int page, int pageSize)
    {
        var s    = search?.Trim().ToLowerInvariant() ?? "";
        var sort = sortBy ?? "title-asc";

        using var db = new AppDbContext();
        var query = db.GuideItems.AsQueryable();

        if (s.Length > 0)
            query = query.Where(g =>
                g.Title.ToLower().Contains(s) ||
                g.Description.ToLower().Contains(s));

        query = sort == "title-desc"
            ? query.OrderByDescending(g => g.Title)
            : query.OrderBy(g => g.Title);

        var p     = Math.Max(1, page);
        var ps    = Math.Max(1, pageSize);
        var total = query.Count();
        var items = query.Skip((p - 1) * ps).Take(ps).ToList();

        return new GuideListResult
        {
            Items = items.Select(ToModel).ToList(),
            Total = total, Page = p, PageSize = ps
        };
    }

    protected GuideChecklistItem CreateGuideActionExecution(GuideChecklistInput input)
    {
        var entity = new GuideChecklistItemEntity
        {
            Id = $"guide_{Guid.NewGuid():N}",
            Title = input.Title, Description = input.Description
        };
        using (var db = new AppDbContext())
        {
            db.GuideItems.Add(entity);
            db.SaveChanges();
        }
        return ToModel(entity);
    }

    protected GuideChecklistItem? UpdateGuideActionExecution(string id, GuideChecklistInput input)
    {
        using var db = new AppDbContext();
        var entity = db.GuideItems.Find(id);
        if (entity is null) return null;
        entity.Title = input.Title; entity.Description = input.Description;
        db.SaveChanges();
        return ToModel(entity);
    }

    protected ActionResponse DeleteGuideActionExecution(string id)
    {
        using var db = new AppDbContext();
        var entity = db.GuideItems.Find(id);
        if (entity is null)
            return new ActionResponse { IsSuccess = false, Message = "Guide item not found." };
        db.GuideItems.Remove(entity);
        db.SaveChanges();
        return new ActionResponse { IsSuccess = true, Message = "Guide item deleted." };
    }
}
