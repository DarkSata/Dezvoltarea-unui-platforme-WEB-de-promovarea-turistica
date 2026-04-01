namespace eBookStore.Domain.Entities.Product
{
    public class ProductImg
    {
        public int Id { get; set; }
        public string ImgUrl { get; set; }
        public int ProductId { get; set; }
    }
}
