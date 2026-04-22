using System.IO;
using Microsoft.Extensions.FileProviders;
using ASPNET.Data;
using Microsoft.EntityFrameworkCore;

namespace ASP.NET
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            string frontendPath = @"F:\ASPNET_PROJECT\wwwroot"; 

            builder.Environment.WebRootPath = frontendPath;

            if (!Directory.Exists(frontendPath))
            {
                var dir = new DirectoryInfo(builder.Environment.ContentRootPath);
                while (dir != null)
                {
                    var testPath = Path.Combine(dir.FullName, "wwwroot");
                    if (Directory.Exists(testPath))
                    {
                        frontendPath = testPath;
                        builder.Environment.WebRootPath = frontendPath;
                        break;
                    }
                    dir = dir.Parent;
                }
            }

            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            builder.Services.AddControllers()
                .AddJsonOptions(options => {
                    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
                });

            builder.Services.AddCors(options => {
                options.AddPolicy("AllowAll", policy => {
                    policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
                });
            });

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            app.UseSwagger();
            app.UseSwaggerUI();


            var defaultOptions = new DefaultFilesOptions();
            defaultOptions.FileProvider = new PhysicalFileProvider(frontendPath);
            defaultOptions.DefaultFileNames.Clear();
            defaultOptions.DefaultFileNames.Add("login.html");
            defaultOptions.DefaultFileNames.Add("index.html");
            app.UseDefaultFiles(defaultOptions);

            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(frontendPath),
                RequestPath = ""
            });

            app.UseCors("AllowAll");

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}