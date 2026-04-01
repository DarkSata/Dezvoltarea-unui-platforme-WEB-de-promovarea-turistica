using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Web_aplication.DataAccess.Context;
using Web_aplication.Domain.Entities;
using Web_aplication.Domain.Models.Routes;
using Web_aplication.Domain.Models.Responses;

namespace Web_aplication.BusinessLayer.Core;

public abstract class RoutesActions
{
    protected RoutesActions() { }

    private static readonly JsonSerializerOptions JsonOpts = new() { PropertyNameCaseInsensitive = true };

    private static TouristRoute ToModel(TouristRouteEntity e) => new()
    {
        Id           = e.Id,
        Category     = e.Category,
        DurationDays = e.DurationDays,
        Title        = e.Title,
        Subtitle     = e.Subtitle,
        Details      = e.Details,
        Line         = JsonSerializer.Deserialize<List<double[]>>(e.LineJson, JsonOpts) ?? [],
        TopPills     = JsonSerializer.Deserialize<List<RoutePill>>(e.TopPillsJson, JsonOpts) ?? [],
        BottomPills  = JsonSerializer.Deserialize<List<RoutePill>>(e.BottomPillsJson, JsonOpts) ?? [],
        Points       = e.Points.Select(p => new RoutePoi
        {
            Lat = p.Lat, Lng = p.Lng, Title = p.Title, Desc = p.Desc, Img = p.Img
        }).ToList()
    };

    protected RouteListResult GetAllRoutesActionExecution(
        string? search, string? category, string? duration, string? sortBy, int page, int pageSize)
    {
        var s    = search?.Trim().ToLowerInvariant() ?? "";
        var cat  = category ?? "Toate";
        var sort = sortBy ?? "title-asc";
        int? dur = int.TryParse(duration, out var d) ? d : null;

        using var db = new AppDbContext();
        var query = db.Routes.Include(r => r.Points).AsQueryable();

        if (cat != "Toate")  query = query.Where(r => r.Category == cat);
        if (dur.HasValue)    query = query.Where(r => r.DurationDays == dur.Value);
        if (s.Length > 0)    query = query.Where(r =>
            r.Title.ToLower().Contains(s) || r.Subtitle.ToLower().Contains(s) ||
            r.Details.ToLower().Contains(s) || r.Category.ToLower().Contains(s));

        query = sort switch
        {
            "title-desc"    => query.OrderByDescending(r => r.Title),
            "duration-asc"  => query.OrderBy(r => r.DurationDays),
            "duration-desc" => query.OrderByDescending(r => r.DurationDays),
            _               => query.OrderBy(r => r.Title)
        };

        var p     = Math.Max(1, page);
        var ps    = Math.Max(1, pageSize);
        var total = query.Count();
        var items = query.Skip((p - 1) * ps).Take(ps).ToList();

        return new RouteListResult
        {
            Items = items.Select(ToModel).ToList(),
            Total = total, Page = p, PageSize = ps
        };
    }

    protected TouristRoute CreateRouteActionExecution(TouristRouteInput input)
    {
        var id = $"route_{Guid.NewGuid():N}";
        var entity = new TouristRouteEntity
        {
            Id = id, Category = input.Category, DurationDays = input.DurationDays,
            Title = input.Title, Subtitle = input.Subtitle, Details = input.Details,
            LineJson        = JsonSerializer.Serialize(input.Line),
            TopPillsJson    = JsonSerializer.Serialize(input.TopPills),
            BottomPillsJson = JsonSerializer.Serialize(input.BottomPills),
            Points = input.Points.Select(p => new RoutePoiEntity
            {
                RouteId = id, Lat = p.Lat, Lng = p.Lng,
                Title = p.Title, Desc = p.Desc, Img = p.Img
            }).ToList()
        };

        using (var db = new AppDbContext())
        {
            db.Routes.Add(entity);
            db.SaveChanges();
        }

        return ToModel(entity);
    }

    protected TouristRoute? UpdateRouteActionExecution(string id, TouristRouteInput input)
    {
        using var db = new AppDbContext();
        var entity = db.Routes.Include(r => r.Points).FirstOrDefault(r => r.Id == id);
        if (entity is null) return null;

        entity.Category        = input.Category;
        entity.DurationDays    = input.DurationDays;
        entity.Title           = input.Title;
        entity.Subtitle        = input.Subtitle;
        entity.Details         = input.Details;
        entity.LineJson        = JsonSerializer.Serialize(input.Line);
        entity.TopPillsJson    = JsonSerializer.Serialize(input.TopPills);
        entity.BottomPillsJson = JsonSerializer.Serialize(input.BottomPills);

        db.RoutePois.RemoveRange(entity.Points);
        entity.Points = input.Points.Select(p => new RoutePoiEntity
        {
            RouteId = id, Lat = p.Lat, Lng = p.Lng,
            Title = p.Title, Desc = p.Desc, Img = p.Img
        }).ToList();

        db.SaveChanges();
        return ToModel(entity);
    }

    protected ActionResponse DeleteRouteActionExecution(string id)
    {
        using var db = new AppDbContext();
        var entity = db.Routes.Find(id);
        if (entity is null)
            return new ActionResponse { IsSuccess = false, Message = "Route not found." };

        db.Routes.Remove(entity);
        db.SaveChanges();
        return new ActionResponse { IsSuccess = true, Message = "Route deleted." };
    }
}
