using Web_aplication.DataAccess.Context;
using Web_aplication.Domain.Entities;
using Web_aplication.Domain.Models.Contact;

namespace Web_aplication.BusinessLayer.Core;

public abstract class ContactActions
{
    protected ContactActions() { }

    protected ContactContent GetContactContentActionExecution()
    {
        using var db = new AppDbContext();
        var details = db.ContactDetails.ToList();
        var socials = db.SocialLinks.ToList();
        var faq     = db.FaqItems.ToList();
        var office  = db.OfficeLocation.FirstOrDefault() ?? new();

        return new ContactContent
        {
            Details = details.Select(d => new ContactDetail { Id = d.Id, Label = d.Label, Value = d.Value, Href = d.Href, Icon = d.Icon, Note = d.Note }).ToList(),
            Socials = socials.Select(s => new SocialLink   { Id = s.Id, Label = s.Label, Href = s.Href, Icon = s.Icon }).ToList(),
            Faq     = faq.Select(f    => new FaqItem       { Id = f.Id, Category = f.Category, Question = f.Question, Answer = f.Answer }).ToList(),
            Office  = new OfficeLocation { Name = office.Name, Address = office.Address, City = office.City, Schedule = office.Schedule, Lat = office.Lat, Lng = office.Lng }
        };
    }

    protected ContactDetail CreateContactDetailActionExecution(ContactDetailInput input)
    {
        var entity = new ContactDetailEntity
        {
            Id = $"detail_{Guid.NewGuid():N}",
            Label = input.Label, Value = input.Value, Href = input.Href,
            Icon = input.Icon, Note = input.Note
        };
        using (var db = new AppDbContext())
        {
            db.ContactDetails.Add(entity);
            db.SaveChanges();
        }
        return new ContactDetail { Id = entity.Id, Label = entity.Label, Value = entity.Value, Href = entity.Href, Icon = entity.Icon, Note = entity.Note };
    }

    protected ContactDetail? UpdateContactDetailActionExecution(string id, ContactDetailInput input)
    {
        using var db = new AppDbContext();
        var entity = db.ContactDetails.Find(id);
        if (entity is null) return null;
        entity.Label = input.Label; entity.Value = input.Value; entity.Href = input.Href;
        entity.Icon  = input.Icon;  entity.Note  = input.Note;
        db.SaveChanges();
        return new ContactDetail { Id = entity.Id, Label = entity.Label, Value = entity.Value, Href = entity.Href, Icon = entity.Icon, Note = entity.Note };
    }

    protected bool DeleteContactDetailActionExecution(string id)
    {
        using var db = new AppDbContext();
        var entity = db.ContactDetails.Find(id);
        if (entity is null) return false;
        db.ContactDetails.Remove(entity);
        db.SaveChanges();
        return true;
    }

    protected SocialLink CreateSocialLinkActionExecution(SocialLinkInput input)
    {
        var entity = new SocialLinkEntity
        {
            Id = $"social_{Guid.NewGuid():N}",
            Label = input.Label, Href = input.Href, Icon = input.Icon
        };
        using (var db = new AppDbContext())
        {
            db.SocialLinks.Add(entity);
            db.SaveChanges();
        }
        return new SocialLink { Id = entity.Id, Label = entity.Label, Href = entity.Href, Icon = entity.Icon };
    }

    protected SocialLink? UpdateSocialLinkActionExecution(string id, SocialLinkInput input)
    {
        using var db = new AppDbContext();
        var entity = db.SocialLinks.Find(id);
        if (entity is null) return null;
        entity.Label = input.Label; entity.Href = input.Href; entity.Icon = input.Icon;
        db.SaveChanges();
        return new SocialLink { Id = entity.Id, Label = entity.Label, Href = entity.Href, Icon = entity.Icon };
    }

    protected bool DeleteSocialLinkActionExecution(string id)
    {
        using var db = new AppDbContext();
        var entity = db.SocialLinks.Find(id);
        if (entity is null) return false;
        db.SocialLinks.Remove(entity);
        db.SaveChanges();
        return true;
    }

    protected FaqItem CreateFaqItemActionExecution(FaqItemInput input)
    {
        var entity = new FaqItemEntity
        {
            Id = $"faq_{Guid.NewGuid():N}",
            Category = input.Category, Question = input.Question, Answer = input.Answer
        };
        using (var db = new AppDbContext())
        {
            db.FaqItems.Add(entity);
            db.SaveChanges();
        }
        return new FaqItem { Id = entity.Id, Category = entity.Category, Question = entity.Question, Answer = entity.Answer };
    }

    protected FaqItem? UpdateFaqItemActionExecution(string id, FaqItemInput input)
    {
        using var db = new AppDbContext();
        var entity = db.FaqItems.Find(id);
        if (entity is null) return null;
        entity.Category = input.Category; entity.Question = input.Question; entity.Answer = input.Answer;
        db.SaveChanges();
        return new FaqItem { Id = entity.Id, Category = entity.Category, Question = entity.Question, Answer = entity.Answer };
    }

    protected bool DeleteFaqItemActionExecution(string id)
    {
        using var db = new AppDbContext();
        var entity = db.FaqItems.Find(id);
        if (entity is null) return false;
        db.FaqItems.Remove(entity);
        db.SaveChanges();
        return true;
    }

    protected OfficeLocation? UpdateOfficeActionExecution(OfficeLocation input)
    {
        using var db = new AppDbContext();
        var entity = db.OfficeLocation.Find("office");
        if (entity is null) return null;
        entity.Name = input.Name; entity.Address = input.Address; entity.City = input.City;
        entity.Schedule = input.Schedule; entity.Lat = input.Lat; entity.Lng = input.Lng;
        db.SaveChanges();
        return input;
    }
}
