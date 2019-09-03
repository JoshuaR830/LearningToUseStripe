using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using newStripe.Models;
using Stripe;
using Newtonsoft.Json;


namespace newStripe.Controllers
{
    public class HomeController : Controller
    {
        
        // PaymentIntent paymentIntent = null;
        public IActionResult Index()
        {
            StripeConfiguration.ApiKey = "sk_test_JSYiBJm8SlRLnoKp7lm4pFOo00Z8SvfVpO";
            // var paymentIntentService = new PaymentIntentService();
            // var createOptions = new PaymentIntentCreateOptions
            // {
            //     Amount = 999,
            //     Currency = "gbp"
            // };
            // var intent = paymentIntentService.Create(createOptions);
            // ViewData["ClientSecret"] = intent.ClientSecret;
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
