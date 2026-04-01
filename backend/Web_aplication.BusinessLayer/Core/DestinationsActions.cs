using Web_aplication.DataAccess.Context;
using Web_aplication.Domain.Entities;
using Web_aplication.Domain.Models.Destinations;
using Web_aplication.Domain.Models.Responses;

namespace Web_aplication.BusinessLayer.Core;

public abstract class DestinationsActions
{
    protected DestinationsActions() { }

    private static Destination ToModel(DestinationEntity e) => new()
    {
        Id = e.Id, Name = e.Name, Area = e.Area, Cat = e.Cat,
        Lat = e.Lat, Lng = e.Lng, Description = e.Description,
        Tips = e.Tips, Image = e.Image
    };

    protected DestinationListResult GetAllDestinationsActionExecution(
        string? search, string? category, string? sortBy, int page, int pageSize)
    {
        var s    = search?.Trim().ToLowerInvariant() ?? "";
        var cat  = category ?? "Toate";
        var sort = sortBy ?? "name-asc";

        using var db = new AppDbContext();
        var query = db.Destinations.AsQueryable();

        if (cat != "Toate")
            query = query.Where(d => d.Cat == cat);

        if (s.Length > 0)
            query = query.Where(d =>
                d.Name.ToLower().Contains(s) || d.Area.ToLower().Contains(s) ||
                d.Description.ToLower().Contains(s) || d.Tips.ToLower().Contains(s));

        query = sort switch
        {
            "name-desc" => query.OrderByDescending(d => d.Name),
            "area-asc"  => query.OrderBy(d => d.Area),
            "area-desc" => query.OrderByDescending(d => d.Area),
            _           => query.OrderBy(d => d.Name)
        };

        var p     = Math.Max(1, page);
        var ps    = Math.Max(1, pageSize);
        var total = query.Count();
        var items = query.Skip((p - 1) * ps).Take(ps).ToList();

        return new DestinationListResult
        {
            Items = items.Select(ToModel).ToList(),
            Total = total, Page = p, PageSize = ps
        };
    }

    protected Destination? GetDestinationByIdActionExecution(string id)
    {
        using var db = new AppDbContext();
        var entity = db.Destinations.Find(id);
        return entity is null ? null : ToModel(entity);
    }

    protected Destination CreateDestinationActionExecution(DestinationInput input)
    {
        var entity = new DestinationEntity
        {
            Id = $"dest_{Guid.NewGuid():N}",
            Name = input.Name, Area = input.Area, Cat = input.Cat,
            Lat = input.Lat, Lng = input.Lng,
            Description = input.Description, Tips = input.Tips, Image = input.Image
        };

        using (var db = new AppDbContext())
        {
            db.Destinations.Add(entity);
            db.SaveChanges();
        }

        return ToModel(entity);
    }

    protected Destination? UpdateDestinationActionExecution(string id, DestinationInput input)
    {
        using var db = new AppDbContext();
        var entity = db.Destinations.Find(id);
        if (entity is null) return null;

        entity.Name = input.Name; entity.Area = input.Area; entity.Cat = input.Cat;
        entity.Lat  = input.Lat;  entity.Lng  = input.Lng;
        entity.Description = input.Description; entity.Tips = input.Tips; entity.Image = input.Image;

        db.SaveChanges();
        return ToModel(entity);
    }

    protected ActionResponse DeleteDestinationActionExecution(string id)
    {
        using var db = new AppDbContext();
        var entity = db.Destinations.Find(id);
        if (entity is null)
            return new ActionResponse { IsSuccess = false, Message = "Destination not found." };

        db.Destinations.Remove(entity);
        db.SaveChanges();
        return new ActionResponse { IsSuccess = true, Message = "Destination deleted." };
    }
}
