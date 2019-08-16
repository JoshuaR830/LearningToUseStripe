using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using LearningStripeCore.Models;
using Stripe;
using Newtonsoft.Json;

namespace LearningStripeCore.Controllers
{

    public class ConfirmPaymentRequest
    {
        [JsonProperty("payment_method_id")]
        public string PaymentMethodId { get; set; }

        [JsonProperty("payment_intent_id")]
        public string PaymentIntentId { get; set; }
    }

    // AJAX endpoint when `/ajax/confirm_payment` is called from client
    [Route("/ajax/confirm_payment")]
    public class HomeController : Controller
    {
        public IActionResult Index([FromBody] ConfirmPaymentRequest request)
        {
            var paymentIntentService = new PaymentIntentService();
            PaymentIntent paymentIntent = null;

            try
            {
                if (request.PaymentMethodId != null)
                {
                    // Create the PaymentIntent
                    var createOptions = new PaymentIntentCreateOptions
                    {
                        PaymentMethodId = request.PaymentMethodId,
                        Amount = 1099,
                        Currency = "gbp",
                        ConfirmationMethod = "manual",
                        Confirm = true,
                    };
                    paymentIntent = paymentIntentService.Create(createOptions);
                }
                if (request.PaymentIntentId != null)
                {
                    var confirmOptions = new PaymentIntentConfirmOptions{};
                    paymentIntent = paymentIntentService.Confirm(
                        request.PaymentIntentId,
                        confirmOptions
                    );
                }
            }
            catch (StripeException e)
            {
                return Json(new { error = e.StripeError.Message });
            }
            return generatePaymentResponse(paymentIntent);
          }

          private IActionResult generatePaymentResponse(PaymentIntent intent)
          {
            // Note that if your API version is before 2019-02-11, 'requires_action'
            // appears as 'requires_source_action'.
            if (intent.Status == "requires_action" &&
                intent.NextAction.Type == "use_stripe_sdk")
            {
                // Tell the client to handle the action
                return Json(new
                {
                    requires_action = true,
                    payment_intent_client_secret = intent.ClientSecret
                });
            }
            else if (intent.Status == "succeeded")
            {
                // The payment didn’t need any additional actions and completed!
                // Handle post-payment fulfillment
                return Json(new { success = true });
            }
            else
            {
                // Invalid status
                return StatusCode(500, new { error = "Invalid PaymentIntent status" });
            }
        }
    }
}
//     }
// }

        // public IActionResult Charge(PaymentIntent pi)
        // {
        //     return View();
        // }

        // public IActionResult Index()
        // {
        //     StripeConfiguration.ApiKey = "sk_test_JSYiBJm8SlRLnoKp7lm4pFOo00Z8SvfVpO";
        //     var service = new PaymentIntentService();
            
        //     var options = new PaymentIntentCreateOptions
        //     {
        //         Amount = 111,
        //         Currency = "gbp",
        //     };

        //     var intent = service.Create(options);
        //     // var intent = service.Get("pi_1F7gnVDNI8WLPlOB3H7Xfqjz");
        //     ViewData["ClientSecret"] = intent.ClientSecret;
        //     ViewData["Lol"] = intent.Id;
        //     return View();
        // }


//         public IActionResult IndexPost(string id)
//         {
//             StripeConfiguration.ApiKey = "sk_test_JSYiBJm8SlRLnoKp7lm4pFOo00Z8SvfVpO";
//             var service = new PaymentIntentService();
//             var options = new PaymentIntentCreateOptions
//             {
//                 Amount = 111,
//                 Currency = "gbp",
//             };
            
//             service.Create(options);

//             // var id = options.RequestId;
//             var intent = service.Get("pi_1F7gnVDNI8WLPlOB3H7Xfqjz");

            
//             // System.Console.WriteLine(ViewData["Id"].ToString());
//             ViewData["ClientSecret"] = intent.ClientSecret;
//             return View();
//         }

//         public class PaymentIntentDto
//         {
//             [JsonProperty("id")]
//             public string Id { get; set; }
//         }

//         public IActionResult Privacy()
//         {
//             return View();
//         }

//         [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
//         public IActionResult Error()
//         {
//             return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
//         }
//     }
// }
