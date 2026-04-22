namespace ASPNET.Models
{
    public class Cart
    {
        public int Id { get; set; }
        public string SessionId { get; set; } = string.Empty; 
        
        public ICollection<CartItem> Items { get; set; } = new List<CartItem>();
    }
}
