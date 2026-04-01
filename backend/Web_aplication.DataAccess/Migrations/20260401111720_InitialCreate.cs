using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Web_aplication.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ContactDetails",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Label = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Value = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Href = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Icon = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Note = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContactDetails", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Destinations",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Area = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Cat = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Lat = table.Column<double>(type: "float", nullable: false),
                    Lng = table.Column<double>(type: "float", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Tips = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Image = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Destinations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FaqItems",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Category = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Question = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Answer = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FaqItems", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "GalleryBlocks",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Subtitle = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Theme = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GalleryBlocks", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "GuideItems",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuideItems", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "OfficeLocation",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Address = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    City = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Schedule = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Lat = table.Column<double>(type: "float", nullable: false),
                    Lng = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OfficeLocation", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Routes",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Category = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    DurationDays = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Subtitle = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Details = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LineJson = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TopPillsJson = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BottomPillsJson = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Routes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SocialLinks",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Label = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Href = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Icon = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SocialLinks", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Password = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Role = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RoutePois",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RouteId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Lat = table.Column<double>(type: "float", nullable: false),
                    Lng = table.Column<double>(type: "float", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Desc = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Img = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoutePois", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RoutePois_Routes_RouteId",
                        column: x => x.RouteId,
                        principalTable: "Routes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "ContactDetails",
                columns: new[] { "Id", "Href", "Icon", "Label", "Note", "Value" },
                values: new object[,]
                {
                    { "address", "https://www.google.com/maps", "fa-solid fa-location-dot", "Adresa", "Chisinau, Moldova", "Stefan cel Mare si Sfant Boulevard 83, MD-2012" },
                    { "email", "mailto:contact@moldovatravel.md", "fa-solid fa-envelope", "Email", "Raspundem in max. 24h", "contact@moldovatravel.md" },
                    { "phone", "tel:+37322555700", "fa-solid fa-phone", "Telefon", "Luni - Vineri, 09:00 - 18:00", "+373 22 555 700" }
                });

            migrationBuilder.InsertData(
                table: "Destinations",
                columns: new[] { "Id", "Area", "Cat", "Description", "Image", "Lat", "Lng", "Name", "Tips" },
                values: new object[,]
                {
                    { "chisinau", "Chișinău", "Orase", "Capitala Republicii Moldova cu parcuri, muzee, restaurante și viață culturală activă.", null, 47.0105, 28.863800000000001, "Chișinău", "Vizitați Grădina Publică Ștefan cel Mare și Sfânt și Piața Centrală." },
                    { "codrii", "Strășeni", "Natura", "Cea mai mare rezervație naturală din Moldova (5.177 ha) cu biodiversitate bogată.", null, 47.116700000000002, 28.416699999999999, "Rezervația Codrii", "Obțineți permisul de acces în avans. Traseele marcate sunt recomandate." },
                    { "cricova", "Cricova", "Vin", "Vinărie renumită pentru tunelurile de 120 km săpate în calcar.", null, 47.133299999999998, 28.866700000000002, "Cricova", "Rezervați turul cu cel puțin o săptămână înainte în sezonul turistic." },
                    { "milestii-mici", "Ialoveni", "Vin", "Cel mai mare depozit de vinuri din lume (Guinness). Tunelele subterane au peste 200 km.", null, 46.933300000000003, 28.899999999999999, "Mileștii Mici", "Rezervați vizita în avans. Turul se face cu mașina proprie sau cu vehiculele vinăriei." },
                    { "orheiul-vechi", "Orhei", "Natura", "Complex natural și archaeological pe malul râului Răut cu mănăstiri rupestre și vestigii medievale.", "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Orheiul_Vechi.jpg/1280px-Orheiul_Vechi.jpg", 47.364400000000003, 28.978400000000001, "Orheiul Vechi", "Vizitați dimineața devreme pentru a evita aglomerația. Purtați pantofi comozi." },
                    { "saharna", "Rezina", "Manastiri", "Complex monastic ortodox înconjurat de păduri și cascade pe malul Nistrului.", null, 47.683300000000003, 28.966699999999999, "Mănăstirea Saharna", "Respectați codul vestimentar. Traseul spre cascade necesită condiție fizică bună." },
                    { "soroca", "Soroca", "Istorie", "Singura cetate circulară din Moldova, construită la ordinul lui Ștefan cel Mare.", null, 48.156100000000002, 28.2881, "Cetatea Soroca", "Vizitați și Lumânarea Recunoștinței de pe dealul din spatele cetății." },
                    { "tipova", "Rezina", "Manastiri", "Cel mai vechi complex monahal din Moldova, săpat în stânca de pe malul Nistrului.", null, 47.700000000000003, 29.0167, "Mănăstirea Tipova", "Traseul este abrupt. Nu este recomandat pe vreme ploioasă." }
                });

            migrationBuilder.InsertData(
                table: "FaqItems",
                columns: new[] { "Id", "Answer", "Category", "Question" },
                values: new object[,]
                {
                    { "best-season", "Primavara si toamna sunt cele mai potrivite.", "Organizare", "Care este cea mai buna perioada?" },
                    { "language", "Limba oficiala este romana, dar se vorbeste si rusa sau engleza.", "Informatii generale", "Ce limba se vorbeste in Moldova?" },
                    { "reserve-early", "Da, este recomandat, mai ales in weekend sau sezonul turistic.", "Planificare si rezervari", "Trebuie sa rezerv din timp?" },
                    { "reserve-tour", "Poti rezerva direct din pagina Rute sau contactandu-ne.", "Planificare si rezervari", "Cum pot rezerva un tur?" },
                    { "safety", "Da, este o destinatie sigura pentru turisti.", "Informatii generale", "Este sigur sa calatoresc in Moldova?" }
                });

            migrationBuilder.InsertData(
                table: "GalleryBlocks",
                columns: new[] { "Id", "Subtitle", "Theme", "Title" },
                values: new object[,]
                {
                    { "gallery-seed-1", "Culorile soarelui apune deasupra stâncilor", "galerie-sunset", "Apus la Orheiul Vechi" },
                    { "gallery-seed-2", "Tradiție și pasiune în fiecare pahar", "galerie-vin", "Vinurile Moldovei" },
                    { "gallery-seed-3", "Peisaje pitorești de pe malul Nistrului", "galerie-nistru", "Nistrul albastru" }
                });

            migrationBuilder.InsertData(
                table: "GuideItems",
                columns: new[] { "Id", "Description", "Title" },
                values: new object[,]
                {
                    { "guide-1-documente", "Pașaport sau buletin valabil. Cetățenii UE nu au nevoie de viză.", "Documente" },
                    { "guide-2-valuta", "Leul moldovenesc (MDL). Cardurile sunt acceptate în orașe.", "Valută" },
                    { "guide-3-transport", "Mașina proprie sau închiriată oferă cel mai mult confort.", "Transport" },
                    { "guide-4-cazare", "Rezervați din timp, mai ales pentru sezonul turistic (mai-septembrie).", "Cazare" },
                    { "guide-5-haine", "Haine lejere vara, strat termic toamna. Pantofi comozi pentru drumeții.", "Îmbrăcăminte" },
                    { "guide-6-vinarii", "Rezervați în avans. Cricova și Mileștii Mici sunt obligatorii.", "Vizite la vinării" }
                });

            migrationBuilder.InsertData(
                table: "OfficeLocation",
                columns: new[] { "Id", "Address", "City", "Lat", "Lng", "Name", "Schedule" },
                values: new object[] { "office", "Stefan cel Mare si Sfant Boulevard 83, MD-2012", "Chisinau", 47.022743599999998, 28.834643199999999, "Moldova Travel Hub", "Luni - Vineri, 09:00 - 18:00" });

            migrationBuilder.InsertData(
                table: "Routes",
                columns: new[] { "Id", "BottomPillsJson", "Category", "Details", "DurationDays", "LineJson", "Subtitle", "Title", "TopPillsJson" },
                values: new object[,]
                {
                    { "auto-vin", "[{\"icon\":\"fa-solid fa-wine-glass\",\"label\":\"Degustare\"},{\"icon\":\"fa-solid fa-star\",\"label\":\"Top destinație\"}]", "Vinarii", "Vizitați Cricova (120 km tuneluri) și Mileștii Mici (record Guinness) în aceeași zi.", 1, "[[47.0105,28.8638],[47.1333,28.8667],[46.9333,28.9]]", "Cel mai bun vin din Moldova într-o singură zi", "Ruta Vinurilor — Cricova & Mileștii Mici", "[{\"icon\":\"fa-solid fa-route\",\"label\":\"60 km\"},{\"icon\":\"fa-solid fa-car\",\"label\":\"Auto\"},{\"icon\":\"fa-solid fa-clock\",\"label\":\"1 zi\"}]" },
                    { "codrii", "[{\"icon\":\"fa-solid fa-mountain\",\"label\":\"Dificultate medie\"},{\"icon\":\"fa-solid fa-tree\",\"label\":\"Natură\"}]", "Drumetie", "Traseul prin Rezervația Codrii vă duce prin păduri seculare de stejar și fag, cu oportunități de a observa fauna locală.", 1, "[[47.1167,28.4167],[47.12,28.42],[47.125,28.415],[47.13,28.41],[47.128,28.405]]", "Drumeție prin cea mai mare rezervație naturală", "Codrii — Inima Pădurilor Moldovei", "[{\"icon\":\"fa-solid fa-route\",\"label\":\"15 km\"},{\"icon\":\"fa-solid fa-person-hiking\",\"label\":\"Drumetie\"},{\"icon\":\"fa-solid fa-clock\",\"label\":\"1 zi\"}]" },
                    { "saharna-tipova", "[{\"icon\":\"fa-solid fa-church\",\"label\":\"Mănăstiri\"},{\"icon\":\"fa-solid fa-water\",\"label\":\"Cascade\"}]", "Natura", "Excursie de două zile cu vizite la mănăstirea Saharna și mănăstirea rupestră Tipova.", 2, "[[47.0105,28.8638],[47.6833,28.9667],[47.7,29.0167]]", "Mănăstiri rupestre și cascade pe Nistru", "Saharna & Tipova — Pe Malul Nistrului", "[{\"icon\":\"fa-solid fa-route\",\"label\":\"180 km\"},{\"icon\":\"fa-solid fa-car\",\"label\":\"Auto\"},{\"icon\":\"fa-solid fa-clock\",\"label\":\"2 zile\"}]" }
                });

            migrationBuilder.InsertData(
                table: "SocialLinks",
                columns: new[] { "Id", "Href", "Icon", "Label" },
                values: new object[,]
                {
                    { "facebook", "https://www.facebook.com/search/top?q=moldova%20travel", "fa-brands fa-facebook-f", "Facebook" },
                    { "instagram", "https://www.instagram.com/explore/tags/moldovatravel/", "fa-brands fa-instagram", "Instagram" },
                    { "tiktok", "https://www.tiktok.com/search?q=moldova%20travel", "fa-brands fa-tiktok", "TikTok" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Password", "Role", "Username" },
                values: new object[,]
                {
                    { 1, "admin123", "admin", "admin" },
                    { 2, "user123", "user", "user" }
                });

            migrationBuilder.InsertData(
                table: "RoutePois",
                columns: new[] { "Id", "Desc", "Img", "Lat", "Lng", "RouteId", "Title" },
                values: new object[,]
                {
                    { 1, "Punct de start și informații despre traseu", null, 47.116700000000002, 28.416699999999999, "codrii", "Centrul Rezervației" },
                    { 2, "Loc de odihnă cu fagi seculari", null, 47.125, 28.414999999999999, "codrii", "Poiana Fagilor" },
                    { 3, "Priveliște panoramică asupra rezervației", null, 47.130000000000003, 28.41, "codrii", "Belvedere Codrii" },
                    { 4, "Punct de plecare din capitală", null, 47.0105, 28.863800000000001, "auto-vin", "Chișinău" },
                    { 5, "Tuneluri de 120 km în calcar", null, 47.133299999999998, 28.866700000000002, "auto-vin", "Cricova" },
                    { 6, "Record Guinness — cel mai mare depozit de vinuri", null, 46.933300000000003, 28.899999999999999, "auto-vin", "Mileștii Mici" },
                    { 7, "Plecare", null, 47.0105, 28.863800000000001, "saharna-tipova", "Chișinău" },
                    { 8, "Complex monastic cu cascade și izvoare", null, 47.683300000000003, 28.966699999999999, "saharna-tipova", "Mănăstirea Saharna" },
                    { 9, "Cel mai vechi complex rupestru din Moldova", null, 47.700000000000003, 29.0167, "saharna-tipova", "Mănăstirea Tipova" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_RoutePois_RouteId",
                table: "RoutePois",
                column: "RouteId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ContactDetails");

            migrationBuilder.DropTable(
                name: "Destinations");

            migrationBuilder.DropTable(
                name: "FaqItems");

            migrationBuilder.DropTable(
                name: "GalleryBlocks");

            migrationBuilder.DropTable(
                name: "GuideItems");

            migrationBuilder.DropTable(
                name: "OfficeLocation");

            migrationBuilder.DropTable(
                name: "RoutePois");

            migrationBuilder.DropTable(
                name: "SocialLinks");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Routes");
        }
    }
}
