namespace Web_aplication.Domain.Models.Destinations;

public class Destination
{
    public string  Id          { get; set; } = "";
    public string  Name        { get; set; } = "";
    public string  Area        { get; set; } = "";
    public string  Cat         { get; set; } = "";
    public double  Lat         { get; set; }
    public double  Lng         { get; set; }
    public string  Description { get; set; } = "";
    public string  Tips        { get; set; } = "";
    public string? Image       { get; set; }
}

public class DestinationInput
{
    public string  Name        { get; set; } = "";
    public string  Area        { get; set; } = "";
    public string  Cat         { get; set; } = "";
    public double  Lat         { get; set; }
    public double  Lng         { get; set; }
    public string  Description { get; set; } = "";
    public string  Tips        { get; set; } = "";
    public string? Image       { get; set; }
}

public class DestinationListResult
{
    public List<Destination> Items    { get; set; } = [];
    public int               Total    { get; set; }
    public int               Page     { get; set; }
    public int               PageSize { get; set; }
}
