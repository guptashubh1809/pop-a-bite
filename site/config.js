// Edit public business details here. Never put passwords or Razorpay secret keys in this file.
//
// PENDING before publishing (see the change plan):
//  - Ingredient lists below follow the current wrap order. FSSAI requires descending order of
//    weight, so re-sort each list once the recipe weights are known (plan section 8).
//  - Confirm the dates in the Sund, and that no ingredient contains a preservative (plan section 11).
//  - Add "Organic" back to jaggery only if the jaggery is certified organic.
window.POPABITE = {
  whatsappNumber: '917889484101', // Country code + number, digits only; for example 91 followed by 10 digits.
  deliveryInformation: '',

  products: [
    {
      id: 'ladoo-one',
      name: 'Haldi Ladoo',
      description: 'Whole wheat, turmeric and nuts, bound with cow ghee.',
      priceLabel: '₹500',
      price: 500,
      packSize: '500 g',
      highlight: '11.9 g protein per 100 g',
      ingredients: 'Whole wheat flour, cow ghee, jaggery, turmeric, gond (edible gum), almonds, cashews, coconut, makhana (fox nuts), cardamom, black pepper.',
      allergens: 'Contains nuts (almonds, cashews), milk (ghee) and wheat (gluten).',
      storage: 'Store at room temperature away from direct sunlight. Shelf life: 3 months.',
      nutrition: [
        ['Energy', '537.47 kcal'],
        ['Protein', '11.88 g'],
        ['Carbohydrate', '52.31 g'],
        ['Total sugars', '11.88 g'],
        ['Total fat', '31.19 g'],
        ['Saturated fat', '21.50 g'],
        ['Monounsaturated fat', '9.20 g'],
        ['Polyunsaturated fat', '2.75 g'],
        ['Trans fat', '<0.01 g'],
        ['Cholesterol', '<0.01 mg']
      ],
      image: 'images/haldi-ladoo.png',
      paymentUrl: ''
    },
    {
      id: 'sund',
      name: 'Jammu Sund',
      description: 'A Jammu winter speciality of dry fruits roasted in cow ghee.',
      priceLabel: '₹550',
      price: 550,
      packSize: '500 g',
      highlight: '',
      ingredients: 'Cow ghee, almonds, cashews, raisins, dates, coconut, gond (edible gum), jaggery, melon seeds, poppy seeds, dry ginger powder.',
      allergens: 'Contains nuts (almonds, cashews) and milk (ghee).',
      storage: 'Store at room temperature away from direct sunlight. Shelf life: 3 months.',
      nutrition: null, // No lab report yet for Sund.
      image: 'images/sund.png',
      paymentUrl: ''
    },
    {
      id: 'ladoo-two',
      name: 'Sattu Ladoo',
      description: 'Chana, makhana and nuts, bound with cow ghee.',
      priceLabel: '₹500',
      price: 500,
      packSize: '500 g',
      highlight: '11.6 g protein per 100 g',
      ingredients: 'Chana, cow ghee, jaggery, almonds, cashews, makhana (fox nuts), coconut, cardamom, black pepper.',
      allergens: 'Contains nuts (almonds, cashews) and milk (ghee).',
      storage: 'Store at room temperature away from direct sunlight. Shelf life: 3 months.',
      nutrition: [
        ['Energy', '548.49 kcal'],
        ['Protein', '11.64 g'],
        ['Carbohydrate', '50.22 g'],
        ['Total sugars', '11.97 g'],
        ['Total fat', '33.45 g'],
        ['Saturated fat', '20.05 g'],
        ['Monounsaturated fat', '8.58 g'],
        ['Polyunsaturated fat', '2.56 g'],
        ['Trans fat', '<0.01 g'],
        ['Cholesterol', '<0.01 mg']
      ],
      image: 'images/sattu-ladoo.png',
      paymentUrl: ''
    }
  ]
};
