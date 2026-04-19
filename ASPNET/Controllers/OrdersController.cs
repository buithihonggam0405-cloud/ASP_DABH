using ASPNET.Data;
using ASPNET.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ASPNET.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrdersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            return await _context.Orders.OrderByDescending(o => o.CreatedDate).ToListAsync();
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            order.Status = status;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder([FromBody] OrderRequest request)
        {
            var cart = await _context.Carts
                .Include(c => c.Items)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(c => c.SessionId == request.Email);

            if (cart == null || !cart.Items.Any())
                return BadRequest("Giỏ hàng của bạn đang trống!");

            decimal subtotal = cart.Items.Sum(i => (decimal)(i.Product?.Price ?? 0) * i.Quantity);
            decimal totalAmount = subtotal + request.ShippingFee;

            var order = new Order
            {
                CustomerName = request.Email,
                PhoneNumber = "N/A",
                Address = request.FullAddress,
                TotalAmount = totalAmount,
                Status = "Pending",
                CreatedDate = DateTime.Now
            };

            _context.Orders.Add(order);
            _context.CartItems.RemoveRange(cart.Items);
            await _context.SaveChangesAsync();

            return Ok(order);
        }
    }

    public class OrderRequest
    {
        public string Email { get; set; } = string.Empty;
        public int AddressId { get; set; }
        public string FullAddress { get; set; } = string.Empty;
        public decimal ShippingFee { get; set; }
    }
}
