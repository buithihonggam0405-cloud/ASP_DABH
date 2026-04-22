using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using ASPNET.Helpers;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using System.Linq;

namespace ASPNET.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public PaymentController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("vnpay-url")]
        public IActionResult CreateVnPayUrl([FromBody] VnPayRequest request)
        {
            var vnpay = new VnPayLibrary();
            var config = _configuration.GetSection("Vnpay");

            vnpay.AddRequestData("vnp_Version", config["Version"]);
            vnpay.AddRequestData("vnp_Command", config["Command"]);
            vnpay.AddRequestData("vnp_TmnCode", config["TmnCode"]);
            vnpay.AddRequestData("vnp_Amount", ((long)(request.Amount * 100)).ToString()); 
            vnpay.AddRequestData("vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss"));
            vnpay.AddRequestData("vnp_CurrCode", config["CurrCode"]);
            vnpay.AddRequestData("vnp_IpAddr", HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1");
            vnpay.AddRequestData("vnp_Locale", config["Locale"]);
            vnpay.AddRequestData("vnp_OrderInfo", "Thanh toan don hang: " + request.OrderId);
            vnpay.AddRequestData("vnp_OrderType", "other");
            vnpay.AddRequestData("vnp_ReturnUrl", config["ReturnUrl"]);
            vnpay.AddRequestData("vnp_TxnRef", request.OrderId.ToString() + "_" + DateTime.Now.Ticks.ToString()); 

            var paymentUrl = vnpay.CreateRequestUrl(config["BaseUrl"], config["HashSecret"]);

            return Ok(new { url = paymentUrl });
        }

        [HttpGet("vnpay-return")]
        public IActionResult VnPayReturn()
        {
            var vnpay = new VnPayLibrary();
            var config = _configuration.GetSection("Vnpay");

            foreach (var key in Request.Query.Keys)
            {
                vnpay.AddResponseData(key, Request.Query[key]);
            }

            var vnp_SecureHash = Request.Query["vnp_SecureHash"];
            var isValidSignature = vnpay.ValidateSignature(vnp_SecureHash, config["HashSecret"]);

            if (isValidSignature)
            {
                var vnp_ResponseCode = Request.Query["vnp_ResponseCode"];
                if (vnp_ResponseCode == "00")
                {
                    return Ok(new { status = "Success", message = "Thanh toán thành công" });
                }
                return BadRequest(new { status = "Fail", message = "Thanh toán thất bại" });
            }
            return BadRequest(new { status = "Error", message = "Chữ ký không hợp lệ" });
        }
    }

    public class VnPayRequest
    {
        public int OrderId { get; set; }
        public decimal Amount { get; set; }
    }
}
