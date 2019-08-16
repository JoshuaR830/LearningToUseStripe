// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
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
    console.log("Hello Joshua");
    stripe.handleCardPayment(
        clientSecret, cardElement, {
            payment_method_data: {
                billing_details:{name: cardholderName.value}
            }
        }
    ).then(function(result)
    {
        if (result.error)
        {
            console.log("Card error");
            alert("Error");
        }
        else if(result.paymentIntent && result.paymentIntent.status === 'succeeded')
        {
            console.log("Card success");
            alert("Success 1");
        }
        else
        {
            console.log("Card success");
            alert("Success 2");
        }
        cardButton.removeAttribute('disabled', 'disabled');
    });
});



var form = document.getElementById('payment-form');
form.addEventListener('submit', function(event){
    event.preventDefault();
    stripe.createToken(card).then(function(result){
        if(result.error){
            alert("Error")
        }else{
            stripeTokenHandler(result.token)
        }
    });
});

function stripeTokenHandler(token) {
    var form = document.getElementById('payment-form');
    var hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'stripeToken');
    hiddenInput.setAttribute('value', token.id);
    form.appendChild(hiddenInput);

    form.submit();
}

// Create a Stripe client.
var stripe = Stripe('pk_test_XfHGe7CQlIfC0oNDVBe7RGgH00XUi5JkVy');

// Create an instance of Elements.
var elements = stripe.elements();

// Custom styling can be passed to options when creating an Element.
// (Note that this demo uses a wider set of styles than the guide below.)
var style = {
  base: {
    color: '#32325d',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4'
    }
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a'
  }
};

// Create an instance of the card Element.
var card = elements.create('card', {style: style});
// var card = elements.create('cardNumber', {style: style});
// var card = elements.create('cardExpiry', {style: style});
// var card = elements.create('cardCvc', {style: style});

// Add an instance of the card Element into the `card-element` <div>.
card.mount('#card-element');

// Handle real-time validation errors from the card Element.
card.addEventListener('change', function(event) {
  var displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});

// Handle form submission.
var form = document.getElementById('payment-form');
form.addEventListener('submit', function(event) {
  event.preventDefault();

  stripe.createToken(card).then(function(result) {
    if (result.error) {
      // Inform the user if there was an error.
      var errorElement = document.getElementById('card-errors');
      errorElement.textContent = result.error.message;
    } else {
      // Send the token to your server.
      stripeTokenHandler(result.token);
    }
  });
});

// Submit the form with the token ID.
function stripeTokenHandler(token) {
  // Insert the token ID into the form so it gets submitted to the server
  var form = document.getElementById('payment-form');
  var hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('name', 'stripeToken');
  hiddenInput.setAttribute('value', token.id);
  form.appendChild(hiddenInput);

  // Submit the form
  form.submit();
}