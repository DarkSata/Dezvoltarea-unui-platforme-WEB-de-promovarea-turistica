namespace Web_aplication.Domain.Models.Contact;

public class ContactDetail
{
    public string  Id    { get; set; } = "";
    public string  Label { get; set; } = "";
    public string  Value { get; set; } = "";
    public string  Href  { get; set; } = "";
    public string  Icon  { get; set; } = "";
    public string? Note  { get; set; }
}

public class ContactDetailInput
{
    public string  Label { get; set; } = "";
    public string  Value { get; set; } = "";
    public string  Href  { get; set; } = "";
    public string  Icon  { get; set; } = "";
    public string? Note  { get; set; }
}

public class SocialLink
{
    public string Id    { get; set; } = "";
    public string Label { get; set; } = "";
    public string Href  { get; set; } = "";
    public string Icon  { get; set; } = "";
}

public class SocialLinkInput
{
    public string Label { get; set; } = "";
    public string Href  { get; set; } = "";
    public string Icon  { get; set; } = "";
}

public class FaqItem
{
    public string Id       { get; set; } = "";
    public string Category { get; set; } = "";
    public string Question { get; set; } = "";
    public string Answer   { get; set; } = "";
}

public class FaqItemInput
{
    public string Category { get; set; } = "";
    public string Question { get; set; } = "";
    public string Answer   { get; set; } = "";
}

public class OfficeLocation
{
    public string Name     { get; set; } = "";
    public string Address  { get; set; } = "";
    public string City     { get; set; } = "";
    public string Schedule { get; set; } = "";
    public double Lat      { get; set; }
    public double Lng      { get; set; }
}

public class ContactContent
{
    public List<ContactDetail> Details { get; set; } = [];
    public List<SocialLink>    Socials { get; set; } = [];
    public List<FaqItem>       Faq     { get; set; } = [];
    public OfficeLocation      Office  { get; set; } = new();
}
