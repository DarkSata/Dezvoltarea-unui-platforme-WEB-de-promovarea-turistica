using Microsoft.EntityFrameworkCore;
using Web_aplication.Domain.Entities;

namespace Web_aplication.DataAccess.Context;

public class AppDbContext : DbContext
{
    public DbSet<UserEntity>               Users          { get; set; }
    public DbSet<DestinationEntity>        Destinations   { get; set; }
    public DbSet<TouristRouteEntity>       Routes         { get; set; }
    public DbSet<RoutePoiEntity>           RoutePois      { get; set; }
    public DbSet<ContactDetailEntity>      ContactDetails { get; set; }
    public DbSet<SocialLinkEntity>         SocialLinks    { get; set; }
    public DbSet<FaqItemEntity>            FaqItems       { get; set; }
    public DbSet<OfficeLocationEntity>     OfficeLocation { get; set; }
    public DbSet<GalleryBlockEntity>       GalleryBlocks  { get; set; }
    public DbSet<GuideChecklistItemEntity> GuideItems     { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
        => options.UseSqlServer(DbSession.ConnectionString);

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // ── Relationship: TouristRoute 1:N RoutePoi ───────────────────────────
        modelBuilder.Entity<RoutePoiEntity>()
            .HasOne(p => p.Route)
            .WithMany(r => r.Points)
            .HasForeignKey(p => p.RouteId)
            .OnDelete(DeleteBehavior.Cascade);

        // ── Seed: Users ───────────────────────────────────────────────────────
        modelBuilder.Entity<UserEntity>().HasData(
            new UserEntity { Id = 1, Username = "admin", Password = "admin123", Role = "admin" },
            new UserEntity { Id = 2, Username = "user",  Password = "user123",  Role = "user"  }
        );

        // ── Seed: Destinations ────────────────────────────────────────────────
        modelBuilder.Entity<DestinationEntity>().HasData(
            new DestinationEntity { Id = "orheiul-vechi", Name = "Orheiul Vechi",       Area = "Orhei",    Cat = "Natura",    Lat = 47.3644, Lng = 28.9784, Description = "Complex natural și archaeological pe malul râului Răut cu mănăstiri rupestre și vestigii medievale.", Tips = "Vizitați dimineața devreme pentru a evita aglomerația. Purtați pantofi comozi.", Image = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Orheiul_Vechi.jpg/1280px-Orheiul_Vechi.jpg" },
            new DestinationEntity { Id = "milestii-mici", Name = "Mileștii Mici",       Area = "Ialoveni", Cat = "Vin",       Lat = 46.9333, Lng = 28.9000, Description = "Cel mai mare depozit de vinuri din lume (Guinness). Tunelele subterane au peste 200 km.", Tips = "Rezervați vizita în avans. Turul se face cu mașina proprie sau cu vehiculele vinăriei.", Image = null },
            new DestinationEntity { Id = "saharna",        Name = "Mănăstirea Saharna", Area = "Rezina",   Cat = "Manastiri", Lat = 47.6833, Lng = 28.9667, Description = "Complex monastic ortodox înconjurat de păduri și cascade pe malul Nistrului.", Tips = "Respectați codul vestimentar. Traseul spre cascade necesită condiție fizică bună.", Image = null },
            new DestinationEntity { Id = "soroca",         Name = "Cetatea Soroca",     Area = "Soroca",   Cat = "Istorie",   Lat = 48.1561, Lng = 28.2881, Description = "Singura cetate circulară din Moldova, construită la ordinul lui Ștefan cel Mare.", Tips = "Vizitați și Lumânarea Recunoștinței de pe dealul din spatele cetății.", Image = null },
            new DestinationEntity { Id = "chisinau",       Name = "Chișinău",           Area = "Chișinău", Cat = "Orase",     Lat = 47.0105, Lng = 28.8638, Description = "Capitala Republicii Moldova cu parcuri, muzee, restaurante și viață culturală activă.", Tips = "Vizitați Grădina Publică Ștefan cel Mare și Sfânt și Piața Centrală.", Image = null },
            new DestinationEntity { Id = "codrii",         Name = "Rezervația Codrii",  Area = "Strășeni", Cat = "Natura",    Lat = 47.1167, Lng = 28.4167, Description = "Cea mai mare rezervație naturală din Moldova (5.177 ha) cu biodiversitate bogată.", Tips = "Obțineți permisul de acces în avans. Traseele marcate sunt recomandate.", Image = null },
            new DestinationEntity { Id = "cricova",        Name = "Cricova",            Area = "Cricova",  Cat = "Vin",       Lat = 47.1333, Lng = 28.8667, Description = "Vinărie renumită pentru tunelurile de 120 km săpate în calcar.", Tips = "Rezervați turul cu cel puțin o săptămână înainte în sezonul turistic.", Image = null },
            new DestinationEntity { Id = "tipova",         Name = "Mănăstirea Tipova",  Area = "Rezina",   Cat = "Manastiri", Lat = 47.7000, Lng = 29.0167, Description = "Cel mai vechi complex monahal din Moldova, săpat în stânca de pe malul Nistrului.", Tips = "Traseul este abrupt. Nu este recomandat pe vreme ploioasă.", Image = null }
        );

        // ── Seed: Routes ──────────────────────────────────────────────────────
        modelBuilder.Entity<TouristRouteEntity>().HasData(
            new TouristRouteEntity
            {
                Id = "codrii", Category = "Drumetie", DurationDays = 1,
                Title    = "Codrii — Inima Pădurilor Moldovei",
                Subtitle = "Drumeție prin cea mai mare rezervație naturală",
                Details  = "Traseul prin Rezervația Codrii vă duce prin păduri seculare de stejar și fag, cu oportunități de a observa fauna locală.",
                LineJson        = "[[47.1167,28.4167],[47.12,28.42],[47.125,28.415],[47.13,28.41],[47.128,28.405]]",
                TopPillsJson    = "[{\"icon\":\"fa-solid fa-route\",\"label\":\"15 km\"},{\"icon\":\"fa-solid fa-person-hiking\",\"label\":\"Drumetie\"},{\"icon\":\"fa-solid fa-clock\",\"label\":\"1 zi\"}]",
                BottomPillsJson = "[{\"icon\":\"fa-solid fa-mountain\",\"label\":\"Dificultate medie\"},{\"icon\":\"fa-solid fa-tree\",\"label\":\"Natură\"}]"
            },
            new TouristRouteEntity
            {
                Id = "auto-vin", Category = "Vinarii", DurationDays = 1,
                Title    = "Ruta Vinurilor — Cricova & Mileștii Mici",
                Subtitle = "Cel mai bun vin din Moldova într-o singură zi",
                Details  = "Vizitați Cricova (120 km tuneluri) și Mileștii Mici (record Guinness) în aceeași zi.",
                LineJson        = "[[47.0105,28.8638],[47.1333,28.8667],[46.9333,28.9]]",
                TopPillsJson    = "[{\"icon\":\"fa-solid fa-route\",\"label\":\"60 km\"},{\"icon\":\"fa-solid fa-car\",\"label\":\"Auto\"},{\"icon\":\"fa-solid fa-clock\",\"label\":\"1 zi\"}]",
                BottomPillsJson = "[{\"icon\":\"fa-solid fa-wine-glass\",\"label\":\"Degustare\"},{\"icon\":\"fa-solid fa-star\",\"label\":\"Top destinație\"}]"
            },
            new TouristRouteEntity
            {
                Id = "saharna-tipova", Category = "Natura", DurationDays = 2,
                Title    = "Saharna & Tipova — Pe Malul Nistrului",
                Subtitle = "Mănăstiri rupestre și cascade pe Nistru",
                Details  = "Excursie de două zile cu vizite la mănăstirea Saharna și mănăstirea rupestră Tipova.",
                LineJson        = "[[47.0105,28.8638],[47.6833,28.9667],[47.7,29.0167]]",
                TopPillsJson    = "[{\"icon\":\"fa-solid fa-route\",\"label\":\"180 km\"},{\"icon\":\"fa-solid fa-car\",\"label\":\"Auto\"},{\"icon\":\"fa-solid fa-clock\",\"label\":\"2 zile\"}]",
                BottomPillsJson = "[{\"icon\":\"fa-solid fa-church\",\"label\":\"Mănăstiri\"},{\"icon\":\"fa-solid fa-water\",\"label\":\"Cascade\"}]"
            }
        );

        // ── Seed: RoutePoi ────────────────────────────────────────────────────
        modelBuilder.Entity<RoutePoiEntity>().HasData(
            new RoutePoiEntity { Id = 1, RouteId = "codrii",         Lat = 47.1167, Lng = 28.4167, Title = "Centrul Rezervației",  Desc = "Punct de start și informații despre traseu" },
            new RoutePoiEntity { Id = 2, RouteId = "codrii",         Lat = 47.1250, Lng = 28.4150, Title = "Poiana Fagilor",       Desc = "Loc de odihnă cu fagi seculari" },
            new RoutePoiEntity { Id = 3, RouteId = "codrii",         Lat = 47.1300, Lng = 28.4100, Title = "Belvedere Codrii",     Desc = "Priveliște panoramică asupra rezervației" },
            new RoutePoiEntity { Id = 4, RouteId = "auto-vin",       Lat = 47.0105, Lng = 28.8638, Title = "Chișinău",            Desc = "Punct de plecare din capitală" },
            new RoutePoiEntity { Id = 5, RouteId = "auto-vin",       Lat = 47.1333, Lng = 28.8667, Title = "Cricova",             Desc = "Tuneluri de 120 km în calcar" },
            new RoutePoiEntity { Id = 6, RouteId = "auto-vin",       Lat = 46.9333, Lng = 28.9000, Title = "Mileștii Mici",       Desc = "Record Guinness — cel mai mare depozit de vinuri" },
            new RoutePoiEntity { Id = 7, RouteId = "saharna-tipova", Lat = 47.0105, Lng = 28.8638, Title = "Chișinău",            Desc = "Plecare" },
            new RoutePoiEntity { Id = 8, RouteId = "saharna-tipova", Lat = 47.6833, Lng = 28.9667, Title = "Mănăstirea Saharna",  Desc = "Complex monastic cu cascade și izvoare" },
            new RoutePoiEntity { Id = 9, RouteId = "saharna-tipova", Lat = 47.7000, Lng = 29.0167, Title = "Mănăstirea Tipova",   Desc = "Cel mai vechi complex rupestru din Moldova" }
        );

        // ── Seed: Contact ─────────────────────────────────────────────────────
        modelBuilder.Entity<ContactDetailEntity>().HasData(
            new ContactDetailEntity { Id = "address", Label = "Adresa",  Value = "Stefan cel Mare si Sfant Boulevard 83, MD-2012", Href = "https://www.google.com/maps", Icon = "fa-solid fa-location-dot", Note = "Chisinau, Moldova" },
            new ContactDetailEntity { Id = "phone",   Label = "Telefon", Value = "+373 22 555 700",          Href = "tel:+37322555700",               Icon = "fa-solid fa-phone",    Note = "Luni - Vineri, 09:00 - 18:00" },
            new ContactDetailEntity { Id = "email",   Label = "Email",   Value = "contact@moldovatravel.md", Href = "mailto:contact@moldovatravel.md", Icon = "fa-solid fa-envelope", Note = "Raspundem in max. 24h" }
        );

        modelBuilder.Entity<SocialLinkEntity>().HasData(
            new SocialLinkEntity { Id = "instagram", Label = "Instagram", Href = "https://www.instagram.com/explore/tags/moldovatravel/", Icon = "fa-brands fa-instagram" },
            new SocialLinkEntity { Id = "facebook",  Label = "Facebook",  Href = "https://www.facebook.com/search/top?q=moldova%20travel", Icon = "fa-brands fa-facebook-f" },
            new SocialLinkEntity { Id = "tiktok",    Label = "TikTok",    Href = "https://www.tiktok.com/search?q=moldova%20travel",       Icon = "fa-brands fa-tiktok" }
        );

        modelBuilder.Entity<FaqItemEntity>().HasData(
            new FaqItemEntity { Id = "reserve-tour",  Category = "Planificare si rezervari", Question = "Cum pot rezerva un tur?",               Answer = "Poti rezerva direct din pagina Rute sau contactandu-ne." },
            new FaqItemEntity { Id = "reserve-early", Category = "Planificare si rezervari", Question = "Trebuie sa rezerv din timp?",           Answer = "Da, este recomandat, mai ales in weekend sau sezonul turistic." },
            new FaqItemEntity { Id = "language",      Category = "Informatii generale",       Question = "Ce limba se vorbeste in Moldova?",      Answer = "Limba oficiala este romana, dar se vorbeste si rusa sau engleza." },
            new FaqItemEntity { Id = "safety",        Category = "Informatii generale",       Question = "Este sigur sa calatoresc in Moldova?",  Answer = "Da, este o destinatie sigura pentru turisti." },
            new FaqItemEntity { Id = "best-season",   Category = "Organizare",                Question = "Care este cea mai buna perioada?",      Answer = "Primavara si toamna sunt cele mai potrivite." }
        );

        modelBuilder.Entity<OfficeLocationEntity>().HasData(
            new OfficeLocationEntity
            {
                Id       = "office",
                Name     = "Moldova Travel Hub",
                Address  = "Stefan cel Mare si Sfant Boulevard 83, MD-2012",
                City     = "Chisinau",
                Schedule = "Luni - Vineri, 09:00 - 18:00",
                Lat      = 47.0227436,
                Lng      = 28.8346432
            }
        );

        // ── Seed: Gallery ─────────────────────────────────────────────────────
        modelBuilder.Entity<GalleryBlockEntity>().HasData(
            new GalleryBlockEntity { Id = "gallery-seed-1", Title = "Apus la Orheiul Vechi", Subtitle = "Culorile soarelui apune deasupra stâncilor", Theme = "galerie-sunset" },
            new GalleryBlockEntity { Id = "gallery-seed-2", Title = "Vinurile Moldovei",     Subtitle = "Tradiție și pasiune în fiecare pahar",        Theme = "galerie-vin"    },
            new GalleryBlockEntity { Id = "gallery-seed-3", Title = "Nistrul albastru",      Subtitle = "Peisaje pitorești de pe malul Nistrului",     Theme = "galerie-nistru" }
        );

        // ── Seed: Guide ───────────────────────────────────────────────────────
        modelBuilder.Entity<GuideChecklistItemEntity>().HasData(
            new GuideChecklistItemEntity { Id = "guide-1-documente", Title = "Documente",         Description = "Pașaport sau buletin valabil. Cetățenii UE nu au nevoie de viză." },
            new GuideChecklistItemEntity { Id = "guide-2-valuta",    Title = "Valută",            Description = "Leul moldovenesc (MDL). Cardurile sunt acceptate în orașe." },
            new GuideChecklistItemEntity { Id = "guide-3-transport", Title = "Transport",         Description = "Mașina proprie sau închiriată oferă cel mai mult confort." },
            new GuideChecklistItemEntity { Id = "guide-4-cazare",    Title = "Cazare",            Description = "Rezervați din timp, mai ales pentru sezonul turistic (mai-septembrie)." },
            new GuideChecklistItemEntity { Id = "guide-5-haine",     Title = "Îmbrăcăminte",      Description = "Haine lejere vara, strat termic toamna. Pantofi comozi pentru drumeții." },
            new GuideChecklistItemEntity { Id = "guide-6-vinarii",   Title = "Vizite la vinării", Description = "Rezervați în avans. Cricova și Mileștii Mici sunt obligatorii." }
        );
    }
}
