using Web_aplication.BusinessLayer.Core;
using Web_aplication.BusinessLayer.Interfaces;
using Web_aplication.Domain.Models.Contact;

namespace Web_aplication.BusinessLayer.Structure;

public class ContactActionExecution : ContactActions, IContactAction
{
    public ContactContent  GetContent()                                         => GetContactContentActionExecution();
    public ContactDetail   CreateDetail(ContactDetailInput input)               => CreateContactDetailActionExecution(input);
    public ContactDetail?  UpdateDetail(string id, ContactDetailInput input)    => UpdateContactDetailActionExecution(id, input);
    public bool            DeleteDetail(string id)                              => DeleteContactDetailActionExecution(id);
    public SocialLink      CreateSocial(SocialLinkInput input)                  => CreateSocialLinkActionExecution(input);
    public SocialLink?     UpdateSocial(string id, SocialLinkInput input)       => UpdateSocialLinkActionExecution(id, input);
    public bool            DeleteSocial(string id)                              => DeleteSocialLinkActionExecution(id);
    public FaqItem         CreateFaq(FaqItemInput input)                        => CreateFaqItemActionExecution(input);
    public FaqItem?        UpdateFaq(string id, FaqItemInput input)             => UpdateFaqItemActionExecution(id, input);
    public bool            DeleteFaq(string id)                                 => DeleteFaqItemActionExecution(id);
    public OfficeLocation? UpdateOffice(OfficeLocation input)                   => UpdateOfficeActionExecution(input);
}
