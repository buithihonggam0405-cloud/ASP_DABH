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

        [HttpGet("{sessionId}")]
        public async Task<ActionResult<Cart>> GetCart(string sessionId)
        {
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

        [HttpPost("AddToCart")]
        public async Task<ActionResult<Cart>> AddToCart(string sessionId, int productId, int quantity = 1)
        {
            var cart = await _context.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.SessionId == sessionId);

            if (cart == null)
            {
                cart = new Cart { SessionId = sessionId };
                _context.Carts.Add(cart);
            }

            var product = await _context.Products.FindAsync(productId);
            if (product == null)
            {
                return NotFound("Oops! Không tìm thấy sản phẩm này.");
            }

            var existingItem = cart.Items.FirstOrDefault(i => i.ProductId == productId);
            if (existingItem != null)
            {
                existingItem.Quantity += quantity; 
            }
            else
            {
                cart.Items.Add(new CartItem { ProductId = productId, Quantity = quantity });
            }

            await _context.SaveChangesAsync();

            return Ok(cart);
        }
    }
}
