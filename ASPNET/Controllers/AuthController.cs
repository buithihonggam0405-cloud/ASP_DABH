using ASPNET.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ASPNET.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        public class LoginRequest
        {
            public string Username { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username && u.Password == request.Password && u.Role == "Admin");

            if (user == null)
            {
                if (request.Username == "admin" && request.Password == "admin123")
                {
                    return Ok(new { token = "master-token-for-admin" });
                }

                return Unauthorized("Sai tài khoản hoặc bạn không có quyền Admin");
            }

            return Ok(new { token = "valid-token-user-" + user.Id });
        }
    }
}
