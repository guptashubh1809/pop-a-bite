'use strict';

const config = window.POPABITE;

// Page elements.
const products = document.querySelector('#products');
const dialog = document.querySelector('#product-dialog');
const dialogTitle = document.querySelector('#dialog-title');
const dialogDescription = document.querySelector('#dialog-description');
const dialogDetails = document.querySelector('#dialog-details');
const dialogNote = document.querySelector('#dialog-note');
const dialogPayment = document.querySelector('#dialog-payment');
const dialogWhatsApp = document.querySelector('#dialog-whatsapp');

// Allow payment links only from supported Razorpay domains.
function safePaymentUrl(value) {
  try {
    const url = new URL(value);
    const allowedHosts = [
      'rzp.io',
      'rzp-pay.com',
      'pages.razorpay.com'
    ];

    return url.protocol === 'https:' && allowedHosts.includes(url.hostname)
      ? url.href
      : null;
  } catch {
    return null;
  }
}

// Create a WhatsApp link with a default message.
function whatsappUrl(name) {
  const number = String(config.whatsappNumber || '').trim();

  if (!/^[1-9]\d{7,14}$/.test(number)) {
    return null;
  }

  const message = name
    ? `Hi Pop-A-Bite! I'd like to enquire about ${name}. Please confirm availability, price and delivery.`
    : "Hi Pop-A-Bite! I'd like to place an order. Please share availability, prices and delivery details.";

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

// Show links only when a valid URL is available.
function setLink(element, url) {
  element.hidden = !url;

  if (url) {
    element.href = url;
    element.target = '_blank';
    element.rel = 'noopener noreferrer';
  } else {
    element.removeAttribute('href');
    element.removeAttribute('target');
    element.removeAttribute('rel');
  }
}

// Fill and open the product details window.
function showProduct(product) {
  dialogTitle.textContent = product.name;
  dialogDescription.textContent = product.description;
  dialogDetails.replaceChildren();

  const details = [
    ['Price', product.priceLabel],
    ['Pack size', product.packSize],
    ['Ingredients', product.ingredients],
    ['Allergens', product.allergens],
    ['Storage', product.storage]
  ];

  details.forEach(([label, value]) => {
    const term = document.createElement('dt');
    term.textContent = label;

    const definition = document.createElement('dd');
    definition.textContent = value || 'To be confirmed before launch';

    dialogDetails.append(term, definition);
  });

  const complete = [
    ...details.map(([, value]) => value),
    config.deliveryInformation
  ].every(value => typeof value === 'string' && value.trim());

  const payment = complete ? safePaymentUrl(product.paymentUrl) : null;

  dialogNote.textContent = payment
    ? 'Payment opens on Razorpay. Check the product, quantity, total, delivery details and terms on that page before paying.'
    : 'Order on WhatsApp. We will confirm availability, delivery charges and the total before you confirm your order.';

  setLink(dialogPayment, payment);
  setLink(dialogWhatsApp, whatsappUrl(product.name));

  dialog.showModal();
}

// Build product cards using the information in config.js.
config.products.forEach(product => {
  const article = document.createElement('article');
  article.className = 'product';

  const art = document.createElement('div');
  art.className = 'product-art';

  if (product.image) {
    const image = document.createElement('img');
    image.src = product.image;
    image.alt = product.name;
    image.loading = 'lazy';
    image.style.cssText = 'width:100%;height:100%;object-fit:cover';

    art.append(image);
  } else {
    const shape = document.createElement('span');
    shape.className = 'shape';
    shape.setAttribute('aria-hidden', 'true');

    const label = document.createElement('small');
    label.textContent = 'ILLUSTRATION · PHOTO COMING SOON';

    art.append(shape, label);
  }

  const heading = document.createElement('h3');
  heading.textContent = product.name;

  const description = document.createElement('p');
  description.textContent = product.description;

  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Explore this bite ↗';
  button.setAttribute('aria-label', `Explore ${product.name}`);
  button.addEventListener('click', () => showProduct(product));

  article.append(art, heading, description, button);
  products.append(article);
});

// Close the product details window.
document.querySelector('.close').addEventListener('click', () => {
  dialog.close();
});

// Keep the copyright year current.
document.querySelector('#year').textContent = new Date().getFullYear();

// Set the bottom contact button using the number in config.js.
const contact = whatsappUrl();

if (contact) {
  const link = document.querySelector('#contact-link');
  link.textContent = 'Order on WhatsApp ↗';
  setLink(link, contact);

}

// FAQ answers remain in index.html. Edit their wording there.
