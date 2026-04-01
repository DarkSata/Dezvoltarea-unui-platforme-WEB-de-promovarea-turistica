using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Web_aplication.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddDestinationImages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Destinations",
                keyColumn: "Id",
                keyValue: "chisinau",
                column: "Image",
                value: "/images/destinatii/chisinau.jpg");

            migrationBuilder.UpdateData(
                table: "Destinations",
                keyColumn: "Id",
                keyValue: "codrii",
                column: "Image",
                value: "/images/destinatii/codrii.jpg");

            migrationBuilder.UpdateData(
                table: "Destinations",
                keyColumn: "Id",
                keyValue: "cricova",
                column: "Image",
                value: "/images/destinatii/cricova.jpg");

            migrationBuilder.UpdateData(
                table: "Destinations",
                keyColumn: "Id",
                keyValue: "milestii-mici",
                column: "Image",
                value: "/images/destinatii/milestii-mici.jpg");

            migrationBuilder.UpdateData(
                table: "Destinations",
                keyColumn: "Id",
                keyValue: "orheiul-vechi",
                column: "Image",
                value: "/images/destinatii/orheiul-vechi.jpg");

            migrationBuilder.UpdateData(
                table: "Destinations",
                keyColumn: "Id",
                keyValue: "saharna",
                column: "Image",
                value: "/images/destinatii/saharna.jpg");

            migrationBuilder.UpdateData(
                table: "Destinations",
                keyColumn: "Id",
                keyValue: "soroca",
                column: "Image",
                value: "/images/destinatii/cetatea-soroca.jpg");

            migrationBuilder.UpdateData(
                table: "Destinations",
                keyColumn: "Id",
                keyValue: "tipova",
                column: "Image",
                value: "/images/destinatii/tipova.jpg");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Destinations",
                keyColumn: "Id",
                keyValue: "chisinau",
                column: "Image",
                value: null);

            migrationBuilder.UpdateData(
                table: "Destinations",
                keyColumn: "Id",
                keyValue: "codrii",
                column: "Image",
                value: null);

            migrationBuilder.UpdateData(
                table: "Destinations",
                keyColumn: "Id",
                keyValue: "cricova",
                column: "Image",
                value: null);

            migrationBuilder.UpdateData(
                table: "Destinations",
                keyColumn: "Id",
                keyValue: "milestii-mici",
                column: "Image",
                value: null);

            migrationBuilder.UpdateData(
                table: "Destinations",
                keyColumn: "Id",
                keyValue: "orheiul-vechi",
                column: "Image",
                value: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Orheiul_Vechi.jpg/1280px-Orheiul_Vechi.jpg");

            migrationBuilder.UpdateData(
                table: "Destinations",
                keyColumn: "Id",
                keyValue: "saharna",
                column: "Image",
                value: null);

            migrationBuilder.UpdateData(
                table: "Destinations",
                keyColumn: "Id",
                keyValue: "soroca",
                column: "Image",
                value: null);

            migrationBuilder.UpdateData(
                table: "Destinations",
                keyColumn: "Id",
                keyValue: "tipova",
                column: "Image",
                value: null);
        }
    }
}
