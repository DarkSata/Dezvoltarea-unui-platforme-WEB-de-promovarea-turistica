namespace Web_aplication.Domain.Models.Gallery;

public class GalleryBlock
{
    public string Id       { get; set; } = "";
    public string Title    { get; set; } = "";
    public string Subtitle { get; set; } = "";
    public string Theme    { get; set; } = "";
}

public class GalleryBlockInput
{
    public string Title    { get; set; } = "";
    public string Subtitle { get; set; } = "";
    public string Theme    { get; set; } = "";
}

public class GalleryListResult
{
    public List<GalleryBlock> Items    { get; set; } = [];
    public int                Total    { get; set; }
    public int                Page     { get; set; }
    public int                PageSize { get; set; }
}
