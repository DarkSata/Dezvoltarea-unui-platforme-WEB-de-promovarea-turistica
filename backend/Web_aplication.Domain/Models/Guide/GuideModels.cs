namespace Web_aplication.Domain.Models.Guide;

public class GuideChecklistItem
{
    public string Id          { get; set; } = "";
    public string Title       { get; set; } = "";
    public string Description { get; set; } = "";
}

public class GuideChecklistInput
{
    public string Title       { get; set; } = "";
    public string Description { get; set; } = "";
}

public class GuideListResult
{
    public List<GuideChecklistItem> Items    { get; set; } = [];
    public int                      Total    { get; set; }
    public int                      Page     { get; set; }
    public int                      PageSize { get; set; }
}
