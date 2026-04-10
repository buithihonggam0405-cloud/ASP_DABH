using ASPNET.Data;
using ASPNET.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ASPNET.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CartController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Cart/{sessionId}
        [HttpGet("{sessionId}")]
        public async Task<ActionResult<Cart>> GetCart(string sessionId)
        {
            // Lấy giỏ hàng, nạp luôn cả danh sách các sản phẩm bên trong giỏ
            var cart = await _context.Carts
                .Include(c => c.Items)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(c => c.SessionId == sessionId);

            if (cart == null)
            {
                return NotFound("Chưa có giỏ hàng nào cho Session này.");
            }

            return cart;
        }

        // POST: api/Cart/AddToCart
        [HttpPost("AddToCart")]
        public async Task<ActionResult<Cart>> AddToCart(string sessionId, int productId, int quantity = 1)
        {
            // 1. Kiểm tra xem user này đã có giỏ hàng chưa
            var cart = await _context.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.SessionId == sessionId);

            // Nếu chưa có, tạo giỏ hàng mới cho user
            if (cart == null)
            {
                cart = new Cart { SessionId = sessionId };
                _context.Carts.Add(cart);
            }

            // 2. Kiểm tra sản phẩm có tồn tại trong cửa hàng không
            var product = await _context.Products.FindAsync(productId);
            if (product == null)
            {
                return NotFound("Oops! Không tìm thấy sản phẩm này.");
            }

            // 3. Kiểm tra giỏ hàng đã có sản phẩm này chưa
            var existingItem = cart.Items.FirstOrDefault(i => i.ProductId == productId);
            if (existingItem != null)
            {
                existingItem.Quantity += quantity; // Nếu có rồi thì cộng dồn số lượng
            }
            else
            {
                // Chưa có thì thêm mới vào giỏ
                cart.Items.Add(new CartItem { ProductId = productId, Quantity = quantity });
            }

            await _context.SaveChangesAsync();

            return Ok(cart);
        }
    }
}
