using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Web_aplication.Domain.Entities;

// ── User ──────────────────────────────────────────────────────────────────────

public class UserEntity
{
    [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required, MaxLength(100)]
    public string Username { get; set; } = "";

    [Required, MaxLength(100)]
    public string Password { get; set; } = "";

    [Required, MaxLength(50)]
    public string Role { get; set; } = "";

    [MaxLength(200)]
    public string? Email { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

// ── Destination ───────────────────────────────────────────────────────────────

public class DestinationEntity
{
    [Key]
    public string Id { get; set; } = "";

    [Required, MaxLength(200)]
    public string Name { get; set; } = "";

    [Required, MaxLength(200)]
    public string Area { get; set; } = "";

    /// <summary>"Natura" | "Vin" | "Manastiri" | "Istorie" | "Orase"</summary>
    [Required, MaxLength(50)]
    public string Cat { get; set; } = "";

    public double Lat { get; set; }
    public double Lng { get; set; }

    [Required]
    public string Description { get; set; } = "";

    [Required]
    public string Tips { get; set; } = "";

    public string? Image { get; set; }
}

// ── TouristRoute + RoutePoi (1:N relationship) ───────────────────────────────

public class TouristRouteEntity
{
    [Key]
    public string Id { get; set; } = "";

    /// <summary>"Drumetie" | "Ciclism" | "Vinarii" | "Natura" | "Auto" | "Autobuz"</summary>
    [Required, MaxLength(50)]
    public string Category { get; set; } = "";

    /// <summary>1 | 2 | 3</summary>
    public int DurationDays { get; set; }

    [Required, MaxLength(300)]
    public string Title { get; set; } = "";

    [Required, MaxLength(500)]
    public string Subtitle { get; set; } = "";

    [Required]
    public string Details { get; set; } = "";

    /// <summary>Serialized JSON: [[lat, lng], ...]</summary>
    public string LineJson { get; set; } = "[]";

    /// <summary>Serialized JSON: [{icon, label}, ...]</summary>
    public string TopPillsJson { get; set; } = "[]";

    /// <summary>Serialized JSON: [{icon, label}, ...]</summary>
    public string BottomPillsJson { get; set; } = "[]";

    public ICollection<RoutePoiEntity> Points { get; set; } = [];
}

/// <summary>Point of Interest — belongs to a TouristRoute (many-to-one)</summary>
public class RoutePoiEntity
{
    [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    public string RouteId { get; set; } = "";

    public double Lat { get; set; }
    public double Lng { get; set; }

    [Required, MaxLength(300)]
    public string Title { get; set; } = "";

    [Required]
    public string Desc { get; set; } = "";

    public string? Img { get; set; }

    public TouristRouteEntity Route { get; set; } = null!;
}

// ── Contact ───────────────────────────────────────────────────────────────────

public class ContactDetailEntity
{
    [Key]
    public string Id { get; set; } = "";

    [Required, MaxLength(100)]
    public string Label { get; set; } = "";

    [Required, MaxLength(300)]
    public string Value { get; set; } = "";

    [Required, MaxLength(500)]
    public string Href { get; set; } = "";

    [Required, MaxLength(100)]
    public string Icon { get; set; } = "";

    [MaxLength(200)]
    public string? Note { get; set; }
}

public class SocialLinkEntity
{
    [Key]
    public string Id { get; set; } = "";

    [Required, MaxLength(100)]
    public string Label { get; set; } = "";

    [Required, MaxLength(500)]
    public string Href { get; set; } = "";

    [Required, MaxLength(100)]
    public string Icon { get; set; } = "";
}

public class FaqItemEntity
{
    [Key]
    public string Id { get; set; } = "";

    [Required, MaxLength(100)]
    public string Category { get; set; } = "";

    [Required, MaxLength(500)]
    public string Question { get; set; } = "";

    [Required]
    public string Answer { get; set; } = "";
}

/// <summary>Single-row table — office location (id always = "office")</summary>
public class OfficeLocationEntity
{
    [Key]
    public string Id { get; set; } = "office";

    [Required, MaxLength(200)]
    public string Name { get; set; } = "";

    [Required, MaxLength(300)]
    public string Address { get; set; } = "";

    [Required, MaxLength(100)]
    public string City { get; set; } = "";

    [Required, MaxLength(100)]
    public string Schedule { get; set; } = "";

    public double Lat { get; set; }
    public double Lng { get; set; }
}

// ── Gallery ───────────────────────────────────────────────────────────────────

public class GalleryBlockEntity
{
    [Key]
    public string Id { get; set; } = "";

    [Required, MaxLength(200)]
    public string Title { get; set; } = "";

    [Required, MaxLength(300)]
    public string Subtitle { get; set; } = "";

    /// <summary>"galerie-sunset" | "galerie-vin" | "galerie-nistru"</summary>
    [Required, MaxLength(50)]
    public string Theme { get; set; } = "galerie-sunset";
}

// ── Guide ─────────────────────────────────────────────────────────────────────

public class GuideChecklistItemEntity
{
    [Key]
    public string Id { get; set; } = "";

    [Required, MaxLength(200)]
    public string Title { get; set; } = "";

    [Required]
    public string Description { get; set; } = "";
}
