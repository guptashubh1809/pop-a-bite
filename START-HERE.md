# Pop-A-Bite website starter

This is an editable design draft, not an operating shop. It uses ordinary HTML, CSS and JavaScript. No installation or build command is required. Product artwork is illustrative, and the temporary wordmark is a design suggestion.

## 1. View it

Extract this ZIP. Open `site/index.html` in your browser. Keep the other three files beside it. Product cards open details; the questions expand on click.

## 2. Send the business details

For each product: name, actual photo, description, ingredients, allergens, pack sizes, price, storage instructions and shelf life. Also supply your WhatsApp Business number, delivery areas and charges, contact details, chosen logo, and your delivery/returns/refund terms.

The site currently makes no nutritional claims. We should only add specific health or nutritional statements supported by your actual recipes and information.

Public content lives in `site/config.js`. Edit `site/index.html` for the story and policies, and `site/styles.css` for the design. Do not enter passwords, card details or payment-provider secret keys in any website file.

## 3. Put it on GitHub

1. Create an account at https://github.com if needed.
2. Create a repository named `pop-a-bite`. A private repository keeps the source private; your deployed website can still be public.
3. Upload the contents of this extracted project, preserving the `site` folder. The repository should contain `site/`, `netlify.toml` and this guide at its root.
4. Commit the upload.

## 4. Publish on Netlify

1. Create an account at https://app.netlify.com.
2. Choose the option to add/import a project from GitHub.
3. Authorise the Pop-A-Bite repository and select it.
4. Use the `main` branch. Leave the build command empty. The publish directory is `site` (already declared in `netlify.toml`).
5. Deploy. Netlify assigns a website address; its exact name depends on availability.
6. Changes committed to the connected branch trigger another deployment.

New Netlify teams may start projects private by default. Keep the draft private while preparing it; check project visibility and make it public when you are ready for customers to visit. A `noindex` tag discourages indexing but does not restrict access.

Alternative for a quick preview: upload just the `site` folder to https://app.netlify.com/drop. This is a manual deploy; it does not automatically connect GitHub. Prefer the repository route for ongoing updates.

Keep the preview banner until content is complete. Remove it and the `noindex,nofollow` meta tag in `index.html` when you are ready for public launch. Check the site on your phone too.

## 5. Add hosted payments

1. Set up and activate your business account with Razorpay: https://razorpay.com/docs/payments/payment-pages/.
2. Configure a hosted Payment Page for each product/pack you want to sell. Set real prices there, and collect quantity, customer contact and complete delivery details. Clearly state delivery charges, service areas and your terms before payment. If you sell several packs, expand the website's product/pack structure first so each button has an unambiguous destination.
3. Test the full journey, including quantities, total amount, customer information, payment status and receipt. Confirm that the payment page identifies the correct product and pack.
4. Paste the public hosted payment URL into that product's `paymentUrl` in `site/config.js`. The starter accepts HTTPS URLs on `rzp.io`, `rzp-pay.com` and `pages.razorpay.com`; if your official link uses another domain, verify it before updating the allowlist.
5. The purchase button remains hidden until price, pack size, ingredients, allergens, storage and delivery information are supplied. Empty payment links never simulate a payment.
6. Check successful payment and order details in the Razorpay dashboard before dispatch. Hosted pages handle payment; this website does not store orders, validate payments or provide a multi-product cart. Do not treat a customer's browser redirect or screenshot as proof of payment.

Provider fees apply according to your account and payment method. Hosting plan limits still apply. Recheck both when signing up.

Before taking orders, complete your contact and delivery/returns/refund pages and check any requirements presented by your payment provider. We can add these pages once you supply your actual terms.

## 6. Connect a domain when ready

You can preview with the Netlify address first. A custom domain is optional. Register a domain you own, then follow Netlify's domain settings and the DNS records it provides. The exact domain price and availability must be checked at purchase.

Official Netlify guide: https://docs.netlify.com/start/quickstarts/deploy-from-repository/

## What is ready and what remains

Ready: responsive layout, temporary wordmark, three product cards, accessible product dialogs, expandable FAQ, configurable WhatsApp links, and optional hosted-payment links. No external font, image or code dependency.

Remaining: actual products and photographs, prices, business/contact information, policy content, GitHub/Netlify account setup, Razorpay account activation and real checkout testing. No live deployment or payment integration has been performed. Automated source and interaction checks do not replace visual checks on real devices.
