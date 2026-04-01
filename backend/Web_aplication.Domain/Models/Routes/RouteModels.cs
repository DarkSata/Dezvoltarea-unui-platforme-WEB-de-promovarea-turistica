namespace Web_aplication.Domain.Models.Routes;

public class RoutePill
{
    public string Icon  { get; set; } = "";
    public string Label { get; set; } = "";
}

public class RoutePoi
{
    public double  Lat   { get; set; }
    public double  Lng   { get; set; }
    public string  Title { get; set; } = "";
    public string  Desc  { get; set; } = "";
    public string? Img   { get; set; }
}

public class TouristRoute
{
    public string           Id           { get; set; } = "";
    public string           Category     { get; set; } = "";
    public int              DurationDays { get; set; }
    public string           Title        { get; set; } = "";
    public string           Subtitle     { get; set; } = "";
    public string           Details      { get; set; } = "";
    public List<double[]>   Line         { get; set; } = [];
    public List<RoutePill>  TopPills     { get; set; } = [];
    public List<RoutePill>  BottomPills  { get; set; } = [];
    public List<RoutePoi>   Points       { get; set; } = [];
}

public class TouristRouteInput
{
    public string           Category     { get; set; } = "";
    public int              DurationDays { get; set; }
    public string           Title        { get; set; } = "";
    public string           Subtitle     { get; set; } = "";
    public string           Details      { get; set; } = "";
    public List<double[]>   Line         { get; set; } = [];
    public List<RoutePill>  TopPills     { get; set; } = [];
    public List<RoutePill>  BottomPills  { get; set; } = [];
    public List<RoutePoi>   Points       { get; set; } = [];
}

public class RouteListResult
{
    public List<TouristRoute> Items    { get; set; } = [];
    public int                Total    { get; set; }
    public int                Page     { get; set; }
    public int                PageSize { get; set; }
}
