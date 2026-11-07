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
const orderItems = document.querySelector('#order-items');
const orderArea = document.querySelector('#order-area');
const orderSummary = document.querySelector('#order-summary');
const orderSend = document.querySelector('#order-send');
const stickyOrder = document.querySelector('#sticky-order');
const orderPickup = document.querySelector('#order-pickup');
const orderAreaGroup = document.querySelector('#order-area-group');
const orderPickupNote = document.querySelector('#order-pickup-note');
const orderGift = document.querySelector('#order-gift');
const orderGiftGroup = document.querySelector('#order-gift-group');
const orderGiftMessage = document.querySelector('#order-gift-message');

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

// Create a WhatsApp link from any message.
function whatsappLink(message) {
  const number = String(config.whatsappNumber || '').trim();

  if (!/^[1-9]\d{7,14}$/.test(number)) {
    return null;
  }

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

// Create a WhatsApp link with a default message.
function whatsappUrl(name) {
  const message = name
    ? `Hi Pop-A-Bite! I'd like to enquire about ${name}. Please confirm availability, price and delivery.`
    : "Hi Pop-A-Bite! I'd like to place an order. Please share availability, prices and delivery details.";

  return whatsappLink(message);
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

  // Only show rows that have content, so visitors never see placeholder text.
  details.forEach(([label, value]) => {
    if (typeof value !== 'string' || !value.trim()) {
      return;
    }

    const term = document.createElement('dt');
    term.textContent = label;

    const definition = document.createElement('dd');
    definition.textContent = value;

    dialogDetails.append(term, definition);
  });

  // Nutrition table, shown only when a lab report exists for the product.
  if (Array.isArray(product.nutrition) && product.nutrition.length) {
    const term = document.createElement('dt');
    term.textContent = 'Nutrition per 100 g';

    const definition = document.createElement('dd');
    const table = document.createElement('table');
    table.className = 'nutri';

    product.nutrition.forEach(([label, value]) => {
      const row = table.insertRow();
      row.insertCell().textContent = label;
      row.insertCell().textContent = value;
    });

    const note = document.createElement('p');
    note.className = 'nutri-note';
    note.textContent = 'Values marked < are below lab quantification limits.';

    definition.append(table, note);
    dialogDetails.append(term, definition);
  }

  const complete = [
    ...details.map(([, value]) => value),
    config.deliveryInformation
  ].every(value => typeof value === 'string' && value.trim());

  const payment = complete ? safePaymentUrl(product.paymentUrl) : null;

  dialogNote.textContent = payment
    ? 'Payment opens on Razorpay. Check the product, quantity, total, delivery details and terms on that page before paying.'
    : 'Send us your order. We will confirm availability, delivery charges and the total before you confirm your order.';

  setLink(dialogPayment, payment);
  setLink(dialogWhatsApp, 'build-your-order.html');
dialogWhatsApp.removeAttribute('target');
dialogWhatsApp.removeAttribute('rel');

  dialog.showModal();
}

// Build product cards using the information in config.js.
if (products) config.products.forEach(product => {
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

  const meta = document.createElement('p');
  meta.className = 'product-meta';
  meta.textContent = `${product.priceLabel} for ${product.packSize}`;

  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Explore this bite ↗';
  button.setAttribute('aria-label', `Explore ${product.name}`);
  button.addEventListener('click', () => showProduct(product));

  article.append(art, heading, description, meta);

  if (product.highlight) {
    const highlight = document.createElement('p');
    highlight.className = 'product-protein';
    highlight.textContent = product.highlight;
    article.append(highlight);
  }

  article.append(button);
  products.append(article);
});

// Order builder: choose quantities, then open a ready-made WhatsApp message.
const quantities = new Map();
const quantityChangers = new Map();

function formatRupees(amount) {
  return `₹${amount.toLocaleString('en-IN')}`;
}

function buildOrderMessage() {
  const lines = [];
  let total = 0;

  config.products.forEach(product => {
    const quantity = quantities.get(product.id) || 0;

    if (quantity > 0) {
      lines.push(`- ${product.name} (${product.packSize}) x ${quantity}`);
      total += quantity * product.price;
    }
  });

  if (!lines.length) {
    return null;
  }

  const area = orderArea.value.trim();
  const pickup = orderPickup.checked;
  const giftMessage = orderGiftMessage.value.trim();

  const message = [
    "Hi Pop-A-Bite! I'd like to order:",
    ...lines,
    pickup
      ? `Product total: ${formatRupees(total)}`
      : `Product total: ${formatRupees(total)} (delivery charges extra)`,
    pickup
      ? "I'll pick it up from your kitchen. Please share the pickup location and time."
      : area
        ? `Delivery area or PIN code: ${area}`
        : "I'll share my delivery location here."
  ];

  if (orderGift.checked) {
    message.push(giftMessage ? `This is a gift. Message for the card: "${giftMessage}"` : 'This is a gift.');
  }

  message.push(
    pickup
      ? 'Please confirm availability and the total.'
      : 'Please confirm availability, delivery charge and the total.'
  );

  return message.join('\n');
}

// Show the delivery area field or the pickup note, and the gift message field when needed.
function updateOrderOptions() {
  const pickup = orderPickup.checked;
  const pickupArea = String(config.pickupArea || '').trim();

  orderAreaGroup.hidden = pickup;
  orderPickupNote.hidden = !pickup;
  orderPickupNote.textContent = pickupArea
    ? `Pickup from our home kitchen in ${pickupArea}. We'll send the exact location after you order.`
    : "Pickup from our home kitchen in Jammu. We'll send the exact location after you order.";
  orderGiftGroup.hidden = !orderGift.checked;
  updateOrder();
}

function updateOrder() {
  const message = buildOrderMessage();
  const link = message ? whatsappLink(message) : null;

  if (message) {
    const total = config.products.reduce(
      (sum, product) => sum + (quantities.get(product.id) || 0) * product.price,
      0
    );
    orderSummary.textContent = orderPickup.checked
      ? `Product total ${formatRupees(total)}. No delivery charge for pickup.`
      : `Product total ${formatRupees(total)}. Delivery charges are extra and we will confirm them before you pay.`;
  } else {
    orderSummary.textContent = 'Choose at least one treat to build your order message.';
  }

  setLink(orderSend, link);
}

if (orderItems) config.products.forEach(product => {
  quantities.set(product.id, 0);

  const row = document.createElement('div');
  row.className = 'order-row';

  const info = document.createElement('div');

  const name = document.createElement('div');
  name.className = 'order-name';
  name.textContent = product.name;

  const sub = document.createElement('div');
  sub.className = 'order-sub';
  sub.textContent = `${product.priceLabel} for ${product.packSize}`;

  info.append(name, sub);

  const controls = document.createElement('div');
  controls.className = 'qty';

  const minus = document.createElement('button');
  minus.type = 'button';
  minus.textContent = '−';
  minus.setAttribute('aria-label', `Remove one ${product.name}`);

  const output = document.createElement('output');
  output.textContent = '0';
  output.setAttribute('aria-label', `${product.name} quantity`);

  const plus = document.createElement('button');
  plus.type = 'button';
  plus.textContent = '+';
  plus.setAttribute('aria-label', `Add one ${product.name}`);

  function change(step) {
    const next = Math.min(20, Math.max(0, (quantities.get(product.id) || 0) + step));
    quantities.set(product.id, next);
    output.textContent = String(next);
    updateOrder();
  }

  quantityChangers.set(product.id, change);
  minus.addEventListener('click', () => change(-1));
  plus.addEventListener('click', () => change(1));

  controls.append(minus, output, plus);
  row.append(info, controls);
  orderItems.append(row);
});

if (orderArea && orderPickup && orderGift && orderGiftMessage) {
orderArea.addEventListener('input', updateOrder);
orderGiftMessage.addEventListener('input', updateOrder);
document.querySelectorAll('[name="order-method"]').forEach(input => {
  input.addEventListener('change', updateOrderOptions);
});
orderGift.addEventListener('change', updateOrderOptions);
updateOrderOptions();
}

// Close the product details window.
document.querySelector('.close').addEventListener('click', () => {
  dialog.close();
});

// Keep the copyright year current.
document.querySelector('#year').textContent = new Date().getFullYear();

// Set the bottom contact button and the mobile order button using the number in config.js.
const contact = whatsappUrl();

if (contact && document.querySelector('#contact-link')) {
  const link = document.querySelector('#contact-link');
  link.textContent = 'Message us ↗';
  setLink(link, contact);
}

if (stickyOrder) {
  stickyOrder.href = 'build-your-order.html';
  stickyOrder.hidden = false;
}

// Share button: opens WhatsApp so visitors can forward the site to family.
if (document.querySelector('#share-link')) setLink(
  document.querySelector('#share-link'),
  `https://wa.me/?text=${encodeURIComponent(
    'Found these homemade ladoos from Jammu, hand-rolled by a mom with desi ghee and jaggery: https://pop-a-bite.netlify.app/'
  )}`
);

// Kitchen status under the opening headline, set in config.js.
const kitchenStatus = document.querySelector('#kitchen-status');

if (kitchenStatus && typeof config.kitchenStatus === 'string' && config.kitchenStatus.trim()) {
  kitchenStatus.textContent = config.kitchenStatus;
  kitchenStatus.classList.toggle('closed', config.kitchenOpen === false);
  kitchenStatus.hidden = false;
}

// Bite chooser: suggest a product for a moment, then add it to the order builder.
const pickSuggestions = {
  'ladoo-one': 'Try the Haldi Ladoo. Whole wheat, haldi and nuts roasted in ghee, made for a cup of chai.',
  'ladoo-two': 'Try the Sattu Ladoo. Roasted chana, makhana and nuts, with 11.6 g protein per 100 g.',
  sund: 'Try Jammu Sund. Dry fruits roasted in ghee, the way Jammu homes make it every winter.',
  all: 'Get one of each: Haldi Ladoo, Sattu Ladoo and Jammu Sund.'
};
const pickResult = document.querySelector('#pick-result');
const pickText = document.querySelector('#pick-text');
const pickAdd = document.querySelector('#pick-add');
let pickChoice = null;

document.querySelectorAll('[data-pick]').forEach(button => {
  button.addEventListener('click', () => {
    pickChoice = button.dataset.pick;
    document.querySelectorAll('[data-pick]').forEach(other => {
      other.setAttribute('aria-pressed', String(other === button));
    });
    pickText.textContent = pickSuggestions[pickChoice];
    pickAdd.textContent = 'Add to my order';
    pickResult.hidden = false;
  });
});

if (pickAdd) pickAdd.addEventListener('click', () => {
  const ids = pickChoice === 'all' ? config.products.map(product => product.id) : [pickChoice];
  ids.forEach(id => quantityChangers.get(id)?.(1));
  pickAdd.textContent = 'Added ✓';
  document.querySelector('#order')?.scrollIntoView();
});

// Customer reviews, shown only when config.js has at least one.
const reviews = Array.isArray(config.reviews)
  ? config.reviews.filter(review => review && typeof review.quote === 'string' && review.quote.trim())
  : [];

if (reviews.length) {
  const list = document.querySelector('#review-list');

  reviews.forEach(review => {
    const figure = document.createElement('figure');
    figure.className = 'review';

    const quote = document.createElement('blockquote');
    quote.textContent = `“${review.quote.trim()}”`;

    const caption = document.createElement('figcaption');
    caption.textContent = [review.name, review.place].filter(Boolean).join(', ');

    figure.append(quote, caption);
    list.append(figure);
  });

  document.querySelector('#reviews').hidden = false;
}

// FAQ answers remain in index.html. Edit their wording there.
