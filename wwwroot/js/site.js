var stripe = Stripe('pk_test_XfHGe7CQlIfC0oNDVBe7RGgH00XUi5JkVy');

var elements = stripe.elements();

var cardnumberElement = elements.create('cardNumber');
var cvcElement = elements.create('cardCvc');
var expiryElement = elements.create('cardExpiry');
var zipElement = elements.create('postalCode');

cardnumberElement.mount('#cardNumber-element');
cvcElement.mount('#cardCvc-element');
expiryElement.mount('#cardExpiry-element');
zipElement.mount('#postalCode-element');

var cardholderName = document.getElementById('cardholder-name');
var cardButton = document.getElementById('card-button');
var clientSecret = cardButton.dataset.secret;

cardButton.addEventListener('click', function(ev) {
    ev.preventDefault;
    cardButton.setAttribute('disabled', 'disabled');

    if(cardholderName.value == "")
    {
        cardholderName.classList.add('error');
        cardButton.removeAttribute('disabled', 'disabled');
        return;
    }

    stripe.createPaymentMethod( 'card', cardnumberElement, { 
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
        alert('error');
    } else if (response.requires_action) {
      // Use Stripe.js to handle required card action
      alert('requires action');
      stripe.handleCardAction(
        response.payment_intent_client_secret
      ).then(function(result) {
        if (result.error) {
            alert('error');
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
      alert('success');
    }
}














