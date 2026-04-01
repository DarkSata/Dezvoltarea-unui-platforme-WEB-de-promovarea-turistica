namespace Web_aplication.DataAccess;

public static class JwtSettings
{
    public static string Key         { get; set; } = "";
    public static string Issuer      { get; set; } = "";
    public static string Audience    { get; set; } = "";
    public static double ExpiryHours { get; set; } = 24;
}
