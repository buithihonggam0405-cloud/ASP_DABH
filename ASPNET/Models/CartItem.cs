using System.Text.Json.Serialization;

namespace ASPNET.Models
{
    public class CartItem
    {
        public int Id { get; set; }
        
        public int CartId { get; set; }
        [JsonIgnore] // Tránh lỗi lặp vòng vô tận khi trả về dữ liệu API
        public Cart? Cart { get; set; }

        public int ProductId { get; set; }
        public Product? Product { get; set; }

        public int Quantity { get; set; } = 1; // Mặc định mua 1 món
    }
}
