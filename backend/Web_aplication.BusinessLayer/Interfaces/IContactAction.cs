using Web_aplication.Domain.Models.Contact;

namespace Web_aplication.BusinessLayer.Interfaces;

public interface IContactAction
{
    ContactContent  GetContent();
    ContactDetail   CreateDetail(ContactDetailInput input);
    ContactDetail?  UpdateDetail(string id, ContactDetailInput input);
    bool            DeleteDetail(string id);
    SocialLink      CreateSocial(SocialLinkInput input);
    SocialLink?     UpdateSocial(string id, SocialLinkInput input);
    bool            DeleteSocial(string id);
    FaqItem         CreateFaq(FaqItemInput input);
    FaqItem?        UpdateFaq(string id, FaqItemInput input);
    bool            DeleteFaq(string id);
    OfficeLocation? UpdateOffice(OfficeLocation input);
}
