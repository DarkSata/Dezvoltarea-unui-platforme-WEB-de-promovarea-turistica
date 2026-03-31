using Web_aplication.BusinessLayer.Interfaces;
using Web_aplication.BusinessLayer.Structure;

namespace Web_aplication.BusinessLayer;

public class BusinessLogic
{
    public BusinessLogic() { }

    public IAuthAction         AuthAction()         => new AuthActionExecution();
    public IDestinationsAction DestinationsAction() => new DestinationsActionExecution();
    public IRoutesAction       RoutesAction()        => new RoutesActionExecution();
    public IContactAction      ContactAction()      => new ContactActionExecution();
    public IGalleryAction      GalleryAction()      => new GalleryActionExecution();
    public IGuideAction        GuideAction()        => new GuideActionExecution();
}
