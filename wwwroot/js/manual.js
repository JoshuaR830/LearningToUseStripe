// // Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// // for details on configuring this project to bundle and minify static web assets.

// // Write your JavaScript code.
var stripe = Stripe('pk_test_XfHGe7CQlIfC0oNDVBe7RGgH00XUi5JkVy');

var elements = stripe.elements();
var cardElement = elements.create('card');
cardElement.mount('#card-element');

var cardholderName = document.getElementById('cardholder-name');
var cardButton = document.getElementById('card-button');
var clientSecret = cardButton.dataset.secret;

cardButton.addEventListener('click', function(ev) {
    ev.preventDefault;
    cardButton.setAttribute('disabled', 'disabled');
    stripe.createPaymentMethod( 'card', cardElement, { 
        billing_details: {name: cardholderName.value}
    }).then(function(result){
        if (result.error)
        {
            console.log("Card error");
            alert("Error");
        }
        else
        {
            fetch('/ajax/confirm_payment', {
                method: 'POST',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify({ PAYMENT_METHOD_ID: result.paymentMethod.id })
            }).then(function(result) {
                result.json().then(function(json) {
                    handleServerResponse(json);
                })
            });
        }
        cardButton.removeAttribute('disabled', 'disabled');
    });
});

function handleServerResponse(response) {
    if (response.error) {
      // Show error from server on payment form
    } else if (response.requires_action) {
      // Use Stripe.js to handle required card action
      stripe.handleCardAction(
        response.payment_intent_client_secret
      ).then(function(result) {
        if (result.error) {
          // Show error in payment form
        } else {
          // The card action has been handled
          // The PaymentIntent can be confirmed again on the server
          fetch('/ajax/confirm_payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ payment_intent_id: result.paymentIntent.id })
          }).then(function(confirmResult) {
            return confirmResult.json();
          }).then(handleServerResponse);
        }
      });
    } else {
      // Show success message
      alert(success);
    }
}