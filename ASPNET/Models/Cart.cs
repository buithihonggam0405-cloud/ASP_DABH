namespace ASPNET.Models
{
    public class Cart
    {
        public int Id { get; set; }
        public string SessionId { get; set; } = string.Empty; // Quản lý giỏ hàng theo mã (người dùng ko cần đăng nhập ngay)
        
        // 1 Giỏ hàng có nhiều mặt hàng bên trong
        public ICollection<CartItem> Items { get; set; } = new List<CartItem>();
    }
}
