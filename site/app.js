'use strict';
const config = window.POPABITE;
const products = document.querySelector('#products');
const dialog = document.querySelector('#product-dialog');
function safePaymentUrl(value) {
  try { const url = new URL(value); return url.protocol === 'https:' && ['rzp.io','rzp-pay.com','pages.razorpay.com'].includes(url.hostname) ? url.href : null; }
  catch { return null; }
}
function whatsappUrl(name) {
  const number = String(config.whatsappNumber || '');
  if (!/^[1-9]\d{7,14}$/.test(number)) return null;
  return 'https://wa.me/' + number + '?text=' + encodeURIComponent(name ? `Hi Pop-A-Bite! I'd like to enquire about ${name}. Please confirm availability, price and delivery.` : "Hi Pop-A-Bite! I'd like to know about your treats and delivery.");
}
function setLink(element, url) {
  element.hidden = !url;
  if(url) { element.href = url; element.target = '_blank'; element.rel = 'noopener noreferrer'; }
  else { element.removeAttribute('href'); element.removeAttribute('target'); element.removeAttribute('rel'); }
}
function showProduct(product) {
  document.querySelector('#dialog-title').textContent = product.name;
  document.querySelector('#dialog-description').textContent = product.description;
  const details = document.querySelector('#dialog-details'); details.replaceChildren();
  [['Price',product.priceLabel],['Pack size',product.packSize],['Ingredients',product.ingredients],['Allergens',product.allergens],['Storage',product.storage]].forEach(([label,value])=>{
    const term=document.createElement('dt');term.textContent=label;
    const definition=document.createElement('dd');definition.textContent=value || 'To be confirmed before launch';
    details.append(term,definition);
  });
  const complete = [product.priceLabel,product.packSize,product.ingredients,product.allergens,product.storage,config.deliveryInformation].every(v=>typeof v==='string' && v.trim());
  const payment = complete ? safePaymentUrl(product.paymentUrl) : null;
  document.querySelector('#dialog-note').textContent =
  'Order on WhatsApp. We will confirm availability, delivery charges and the total before you confirm your order.'; payment ? 'Payment opens on Razorpay. Check the product, quantity, total, delivery details and terms on that page before paying.' : 'This collection is being prepared. Online purchase is not yet available.';
  setLink(document.querySelector('#dialog-payment'),payment);
  setLink(document.querySelector('#dialog-whatsapp'),whatsappUrl(product.name));
  dialog.showModal();
}
config.products.forEach(product=>{
  const article=document.createElement('article');article.className='product';
  const art=document.createElement('div');art.className='product-art';
  if(product.image) {
    const img=document.createElement('img');img.src=product.image;img.alt=product.name;img.loading='lazy';img.style.cssText='width:100%;height:100%;object-fit:cover';art.append(img);
  } else {
    const shape=document.createElement('span');shape.className='shape';shape.setAttribute('aria-hidden','true');
    const label=document.createElement('small');label.textContent='ILLUSTRATION · PHOTO COMING SOON';art.append(shape,label);
  }
  const heading=document.createElement('h3');heading.textContent=product.name;
  const description=document.createElement('p');description.textContent=product.description;
  const button=document.createElement('button');button.type='button';button.textContent='Explore this bite ↗';button.setAttribute('aria-label','Explore '+product.name);button.addEventListener('click',()=>showProduct(product));
  article.append(art,heading,description,button);products.append(article);
});
document.querySelector('.close').addEventListener('click',()=>dialog.close());
document.querySelector('#year').textContent=new Date().getFullYear();
if(config.deliveryInformation) document.querySelector('#delivery-answer').textContent=config.deliveryInformation;
const contact = whatsappUrl();
if(contact) {
  const link=document.querySelector('#contact-link');link.textContent='Ask on WhatsApp ↗';setLink(link,contact);
  document.querySelector('#contact-note').textContent='Ask about availability, prices and delivery.';
  document.querySelector('#ordering-answer').textContent =
  'Message us on WhatsApp Business or call us on WhatsApp. Tell us your chosen products, quantities and delivery location. We will confirm availability and the total price, including delivery.';
}
