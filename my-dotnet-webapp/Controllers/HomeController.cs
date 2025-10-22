using Microsoft.AspNetCore.Mvc;

namespace my_dotnet_webapp.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}