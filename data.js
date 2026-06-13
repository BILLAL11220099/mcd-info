const INITIAL_INVENTORY = [
  { id: 'item_1', category: 'FOOD & MEAT ITEMS', name: 'Chicken Burger', innerDetails: '1 inner (40 pcs)', caseDetails: '1 case (8 inner)', lidInfo: 'N/A' },
  { id: 'item_2', category: 'FOOD & MEAT ITEMS', name: 'Grilled Chicken', innerDetails: '1 inner (40 pcs)', caseDetails: '1 case 8 inner', lidInfo: 'N/A' },
  { id: 'item_3', category: 'FOOD & MEAT ITEMS', name: 'Suages', innerDetails: '1 inner (40 pcs)', caseDetails: '8 inner', lidInfo: 'N/A' },
  { id: 'item_4', category: 'FOOD & MEAT ITEMS', name: 'Chicken Strips', innerDetails: '1 inner (39 pcs)', caseDetails: '8 inner', lidInfo: 'N/A' },
  { id: 'item_5', category: 'FOOD & MEAT ITEMS', name: 'Chicken Nuggets', innerDetails: '1 inner (50 pcs)', caseDetails: '1 case (18 inner)', lidInfo: 'N/A' },
  { id: 'item_6', category: 'FOOD & MEAT ITEMS', name: 'Jalapeno', innerDetails: '1 inner (48 pcs)', caseDetails: '1 case (6 inner)', lidInfo: 'N/A' },
  { id: 'item_7', category: 'FOOD & MEAT ITEMS', name: 'Crispy High Crunch', innerDetails: '1 inner (8 pcs)', caseDetails: '1 case (12 inner)', lidInfo: 'N/A' },
  { id: 'item_8', category: 'FOOD & MEAT ITEMS', name: 'Grand Chicken', innerDetails: '1 inner (20 pcs)', caseDetails: '1 case (6 inner)', lidInfo: 'N/A' },
  { id: 'item_9', category: 'FOOD & MEAT ITEMS', name: 'Grand Chicken Spicy', innerDetails: '1 inner (20 pcs)', caseDetails: '1 case (6 inner)', lidInfo: 'N/A' },
  { id: 'item_10', category: 'FOOD & MEAT ITEMS', name: 'Mc Chicken', innerDetails: '1 inner (27 pcs)', caseDetails: '1 case (8 inner)', lidInfo: 'N/A' },
  { id: 'item_11', category: 'FOOD & MEAT ITEMS', name: 'Mc Chicken Spicy', innerDetails: '1 inner (27 pcs)', caseDetails: '1 case (8 inner)', lidInfo: 'N/A' },
  { id: 'item_12', category: 'FOOD & MEAT ITEMS', name: '10:1 beef', innerDetails: 'N/A', caseDetails: '1 case 300 pcs', lidInfo: 'N/A' },
  { id: 'item_13', category: 'FOOD & MEAT ITEMS', name: '4:1 beef', innerDetails: 'N/A', caseDetails: '1 case 120 pcs', lidInfo: 'N/A' },
  { id: 'item_14', category: 'FOOD & MEAT ITEMS', name: '3:1 beef', innerDetails: 'N/A', caseDetails: '1 case 90 pcs', lidInfo: 'N/A' },
  { id: 'item_15', category: 'FOOD & MEAT ITEMS', name: 'Regular Bun', innerDetails: '1 inner (30 pcs)', caseDetails: '1 case (2 inner)', lidInfo: 'N/A' },
  { id: 'item_16', category: 'FOOD & MEAT ITEMS', name: 'Quarter Bun', innerDetails: '2 inner (30 pcs)', caseDetails: '1 case (2 inner)', lidInfo: 'N/A' },
  { id: 'item_17', category: 'FOOD & MEAT ITEMS', name: 'Bigmac Bun', innerDetails: 'N/A', caseDetails: '1 case 30 pcs', lidInfo: 'N/A' },
  { id: 'item_18', category: 'FOOD & MEAT ITEMS', name: 'Big tasty Bun', innerDetails: '1 inner 20 pcs', caseDetails: '1 case 2 inner', lidInfo: 'N/A' },
  { id: 'item_19', category: 'FOOD & MEAT ITEMS', name: 'Water split bun', innerDetails: '1 inner 20 pcs', caseDetails: '1 case 2 inner', lidInfo: 'N/A' },
  { id: 'item_20', category: 'FOOD & MEAT ITEMS', name: 'Hash brown', innerDetails: '1 inner 25 pcs', caseDetails: '1 case (6 inner)', lidInfo: 'N/A' },
  { id: 'item_21', category: 'FOOD & MEAT ITEMS', name: 'English muffin', innerDetails: '1 inner 12 pcs', caseDetails: '1 case 8 inner', lidInfo: 'N/A' },
  { id: 'item_22', category: 'FOOD & MEAT ITEMS', name: 'fajita chicken strips', innerDetails: '1 inner 17.62 oz', caseDetails: '1 case 20 inner', lidInfo: 'N/A' },

  { id: 'item_23', category: 'BEVERAGES & CONDIMENTS', name: 'Orange + Apple Juice', innerDetails: '1 inner (4.5 Liter)', caseDetails: 'Case 1 inner / 3 inner', lidInfo: 'N/A' },
  { id: 'item_24', category: 'BEVERAGES & CONDIMENTS', name: 'Ketchup Pack', innerDetails: 'N/A', caseDetails: '1 case (1892 pcs)', lidInfo: 'N/A' },
  { id: 'item_25', category: 'BEVERAGES & CONDIMENTS', name: 'Ketchup Pouch', innerDetails: '1 inner (1 kg)', caseDetails: '1 case (15 inner)', lidInfo: 'N/A' },
  { id: 'item_26', category: 'BEVERAGES & CONDIMENTS', name: 'Mustard', innerDetails: '1 inner (1 kg)', caseDetails: '1 case (24 inner)', lidInfo: 'N/A' },
  { id: 'item_27', category: 'BEVERAGES & CONDIMENTS', name: 'Cheddar + Mental', innerDetails: '1 inner (2.27 kg / 160 pcs)', caseDetails: '1 case (8 inner)', lidInfo: 'N/A' },
  { id: 'item_28', category: 'BEVERAGES & CONDIMENTS', name: 'Periperi Sauce Pouch', innerDetails: 'N/A', caseDetails: '1 case (24 inner)', lidInfo: 'N/A' },
  { id: 'item_29', category: 'BEVERAGES & CONDIMENTS', name: 'All Pouch Sauce', innerDetails: '30 inner', caseDetails: 'N/A', lidInfo: 'N/A' },
  { id: 'item_30', category: 'BEVERAGES & CONDIMENTS', name: 'All Sauce Cups', innerDetails: 'N/A', caseDetails: '1 case (288 pcs)', lidInfo: 'N/A' },
  { id: 'item_31', category: 'BEVERAGES & CONDIMENTS', name: 'Regular Ice Cream Cone', innerDetails: 'N/A', caseDetails: '1 case (952 pcs)', lidInfo: 'N/A' },
  { id: 'item_32', category: 'BEVERAGES & CONDIMENTS', name: 'Oreo Pieces', innerDetails: '1 inner (454 g)', caseDetails: '1 case (24 inner)', lidInfo: 'N/A' },

  { id: 'item_33', category: 'CUPS, LIDS & PACKAGING (PAPER)', name: 'Regular 16oz Cold Cup', innerDetails: '60 pcs', caseDetails: '20 inner', lidInfo: '135 pcs' },
  { id: 'item_34', category: 'CUPS, LIDS & PACKAGING (PAPER)', name: 'Medium 22oz Cold Cup', innerDetails: '65 pcs', caseDetails: '20 inner', lidInfo: '135 pcs' },
  { id: 'item_35', category: 'CUPS, LIDS & PACKAGING (PAPER)', name: 'Large 32oz Cold Cup', innerDetails: '40 pcs', caseDetails: '20 inner', lidInfo: '100 pcs' },
  { id: 'item_36', category: 'CUPS, LIDS & PACKAGING (PAPER)', name: 'Small 12oz Cold Cup', innerDetails: '90 pcs', caseDetails: '24 inner', lidInfo: '140 pcs' },
  { id: 'item_37', category: 'CUPS, LIDS & PACKAGING (PAPER)', name: 'Oreo Cup', innerDetails: '35 pcs', caseDetails: '20 pcs (Case)', lidInfo: 'N/A' },
  { id: 'item_38', category: 'CUPS, LIDS & PACKAGING (PAPER)', name: 'Sunde Cup', innerDetails: '50 pcs', caseDetails: 'N/A', lidInfo: '1 inner (50 pcs)' },
  { id: 'item_39', category: 'CUPS, LIDS & PACKAGING (PAPER)', name: '10 oz Clear Cup', innerDetails: '50 pcs', caseDetails: '20 inner', lidInfo: '100 pcs (10 inner case)' },
  { id: 'item_40', category: 'CUPS, LIDS & PACKAGING (PAPER)', name: '14oz Clear Cup', innerDetails: '50 pcs', caseDetails: '20 inner', lidInfo: '100 pcs (10 inner case)' },
  { id: 'item_41', category: 'CUPS, LIDS & PACKAGING (PAPER)', name: 'Small Fries', innerDetails: '500 pcs', caseDetails: '8,000 pcs 16 inner', lidInfo: 'N/A' },
  { id: 'item_42', category: 'CUPS, LIDS & PACKAGING (PAPER)', name: 'Medium Fries', innerDetails: 'N/A', caseDetails: '2,000 pcs', lidInfo: 'N/A' },
  { id: 'item_43', category: 'CUPS, LIDS & PACKAGING (PAPER)', name: 'Large Fries', innerDetails: 'N/A', caseDetails: '1,200 pcs', lidInfo: 'N/A' },
  { id: 'item_44', category: 'CUPS, LIDS & PACKAGING (PAPER)', name: 'Regular Fries', innerDetails: 'N/A', caseDetails: '1,200 pcs', lidInfo: 'N/A' },
  { id: 'item_45', category: 'CUPS, LIDS & PACKAGING (PAPER)', name: 'E Bag', innerDetails: 'N/A', caseDetails: '250 pcs', lidInfo: 'N/A' },
  { id: 'item_46', category: 'CUPS, LIDS & PACKAGING (PAPER)', name: 'B Bag', innerDetails: 'N/A', caseDetails: '1,000 pcs', lidInfo: 'N/A' },
  { id: 'item_47', category: 'CUPS, LIDS & PACKAGING (PAPER)', name: 'C Bag', innerDetails: 'N/A', caseDetails: '1,000 pcs', lidInfo: 'N/A' },
  { id: 'item_48', category: 'CUPS, LIDS & PACKAGING (PAPER)', name: 'A Bag', innerDetails: 'N/A', caseDetails: '2,000 pcs', lidInfo: 'N/A' },
  { id: 'item_49', category: 'CUPS, LIDS & PACKAGING (PAPER)', name: 'Happy Meal Carton', innerDetails: 'N/A', caseDetails: '350 pcs', lidInfo: 'N/A' },
  { id: 'item_50', category: 'CUPS, LIDS & PACKAGING (PAPER)', name: 'Napkin', innerDetails: '250 pcs', caseDetails: 'N/A', lidInfo: 'N/A' },
  { id: 'item_51', category: 'CUPS, LIDS & PACKAGING (PAPER)', name: 'Straw', innerDetails: '250 pcs', caseDetails: 'N/A', lidInfo: 'N/A' },
  { id: 'item_52', category: 'CUPS, LIDS & PACKAGING (PAPER)', name: '4 cup carrier', innerDetails: 'N/A', caseDetails: '1 case 300 pcs', lidInfo: 'N/A' },
  { id: 'item_53', category: 'CUPS, LIDS & PACKAGING (PAPER)', name: '2 cup carrier', innerDetails: 'N/A', caseDetails: '1 case 600 pcs', lidInfo: 'N/A' },
  { id: 'item_54', category: 'CUPS, LIDS & PACKAGING (PAPER)', name: 'spon', innerDetails: 'N/A', caseDetails: '1 case', lidInfo: 'N/A' },
];

window.INITIAL_INVENTORY = INITIAL_INVENTORY;

const INITIAL_PROCEDURES = [
  {
    id: 'proc_1',
    title: 'Handwashing & Hygiene Standard',
    desc: '1. Wash hands with anti-microbial soap for at least 20 seconds (up to the elbows).\n2. Wash hands every hour or whenever changing stations (e.g., from register to grill).\n3. ALWAYS wear blue gloves when handling raw meat (beef/chicken).\n4. ALWAYS wear clear gloves when assembling ready-to-eat food.',
    date: new Date().toLocaleDateString(),
    timestamp: Date.now() - 100000,
    image: null
  },
  {
    id: 'proc_2',
    title: 'French Fries Station',
    desc: '1. Fill fry baskets exactly to the line (do not overfill or underfill).\n2. Drop basket into the vat and press the designated timer button immediately.\n3. Shake the basket at the "Duty" beep (approx 30 seconds in) to prevent fries from sticking together.\n4. When the timer finishes, pull the basket, let the oil drain for 5-10 seconds, and dump into the heated holding station.\n5. Salt immediately using the "W" or "M" pattern from front to back for even coating.',
    date: new Date().toLocaleDateString(),
    timestamp: Date.now() - 90000,
    image: null
  },
  {
    id: 'proc_3',
    title: 'Grill Operation (10:1 Beef Patties)',
    desc: '1. Set the grill to the correct temperature for 10:1 meat.\n2. Lay patties from front to back, left to right.\n3. Close the upper platen immediately after laying the last patty and hit the timer.\n4. When the clamshell opens, season each patty evenly with salt & pepper blend.\n5. Remove patties quickly and place them into the UHC (Universal Holding Cabinet) trays within 15 seconds to retain moisture.',
    date: new Date().toLocaleDateString(),
    timestamp: Date.now() - 80000,
    image: null
  },
  {
    id: 'proc_4',
    title: 'Big Mac Assembly',
    desc: '1. Toast the club, crown, and heel buns.\n2. Apply exactly 1 shot of Mac Sauce to the heel and club.\n3. Add a pinch of dehydrated onions to both.\n4. Add a handful of shredded lettuce to both.\n5. Place 2 pickle slices on the club, and 1 slice of cheese on the heel.\n6. Place hot 10:1 beef patties on both the club and heel.\n7. Carefully stack the club onto the heel, then top with the crown bun. Box immediately.',
    date: new Date().toLocaleDateString(),
    timestamp: Date.now() - 70000,
    image: null
  },
  {
    id: 'proc_5',
    title: 'Drive-Thru Speed & Accuracy (OEPE)',
    desc: '1. Target OEPE (Order End to Present End) time is under 120 seconds.\n2. Greet the customer within 3 seconds of them pulling up to the speaker.\n3. Always repeat the order back to ensure 100% accuracy.\n4. The presenter must double-check the bag contents against the receipt before handing it out the window.\n5. Always hand drinks out first, followed by food.',
    date: new Date().toLocaleDateString(),
    timestamp: Date.now() - 60000,
    image: null
  },
  {
    id: 'proc_6',
    title: 'UHC (Universal Holding Cabinet) Times',
    desc: '1. Never serve expired food. Always strictly follow the UHC holding times.\n2. 10:1 Beef: Hold for max 15 minutes.\n3. 4:1 Beef (Quarter Pounder): Cooked to order, do not hold.\n4. Chicken Nuggets/McChicken: Hold for max 20 minutes.\n5. When the timer expires, the product MUST be discarded as waste.',
    date: new Date().toLocaleDateString(),
    timestamp: Date.now() - 50000,
    image: null
  },
  {
    id: 'proc_7',
    title: 'Cleaning the Lobby & Dining Area',
    desc: '1. Wipe down tables immediately after a guest leaves using a sanitized towel.\n2. Check and empty trash bins before they are 3/4 full.\n3. Sweep the floor every 30 minutes, and spot-mop any spills immediately with a wet floor sign.\n4. Restock the condiment station (ketchup, napkins, straws) every hour during peak times.',
    date: new Date().toLocaleDateString(),
    timestamp: Date.now() - 40000,
    image: null
  },

  // ============ SOC - SAUDI ARABIA McDONALD'S STANDARDS ============

  {
    id: 'soc_1',
    title: 'SOC: Food Safety & Temperature Control',
    desc: '📋 SAUDI McDONALD\'S STANDARD — FOOD SAFETY\n\n🌡️ CRITICAL TEMPERATURES:\n• Raw beef must be stored at -18°C or below (frozen).\n• Refrigerated items (cheese, sauces, salads) must be at 0°C to 4°C.\n• Hot held food must be at 63°C or above at all times.\n• Do NOT allow food to stay in the temperature danger zone (5°C – 63°C) for more than 4 hours.\n\n✅ CHECKS:\n• Check and record all cooler & freezer temperatures every 2 hours.\n• If temperature is out of range, alert the manager immediately.\n• Use a calibrated probe thermometer — never guess temperatures.\n• Discard any food that has been in the danger zone for over 4 hours.',
    date: new Date().toLocaleDateString(),
    timestamp: Date.now() - 30000,
    image: null
  },
  {
    id: 'soc_2',
    title: 'SOC: Personal Hygiene & Uniform Standards',
    desc: '📋 SAUDI McDONALD\'S STANDARD — PERSONAL HYGIENE\n\n👕 UNIFORM:\n• Full McDonald\'s uniform must be worn at all times including hat/visor, non-slip shoes, and name badge.\n• Uniform must be clean, pressed, and free from stains at the start of every shift.\n• Jewellery is NOT allowed (except a plain wedding band). No watches, earrings, or bracelets.\n• Long hair MUST be tied back and covered with a hat or hair net.\n• No strong perfume or cologne on the floor.\n\n🧼 HYGIENE:\n• Nails must be clean, short, and free from nail polish.\n• No eating, chewing gum, or drinking (except water) while in production areas.\n• Report any illness, cuts, or skin infections to your manager before starting work.',
    date: new Date().toLocaleDateString(),
    timestamp: Date.now() - 29000,
    image: null
  },
  {
    id: 'soc_3',
    title: 'SOC: Product Quality & Freshness Standards',
    desc: '📋 SAUDI McDONALD\'S STANDARD — PRODUCT QUALITY\n\n⏱️ PRODUCT HOLDING TIMES (KSA STANDARD):\n• French Fries: Max 7 minutes (discard after)\n• Big Mac / McChicken / Chicken burgers: Max 10 minutes in UHC\n• Grilled Chicken: Max 20 minutes\n• Chicken McNuggets: Max 20 minutes\n• Hotcakes: Max 20 minutes\n• Apple Pie: Max 90 minutes\n• Coffee/Hot drinks: Serve immediately, max 20 minutes\n\n🚫 NEVER:\n• Serve product past its holding time — this is a zero-tolerance violation.\n• Re-use discarded product.\n• Override or ignore holding time timers.\n\n✅ ALWAYS:\n• Visually check the product for correct colour, size, and presentation before serving.\n• Apply FIFO (First In, First Out) — always use older stock first.',
    date: new Date().toLocaleDateString(),
    timestamp: Date.now() - 28000,
    image: null
  },
  {
    id: 'soc_4',
    title: 'SOC: Cleanliness & Sanitation (C&S) Standards',
    desc: '📋 SAUDI McDONALD\'S STANDARD — CLEANLINESS & SANITATION\n\n🧹 DAILY CLEANING SCHEDULE:\n• Every 30 minutes: Wipe lobby tables and chairs, sweep lobby floors, restock condiment stations.\n• Every Hour: Clean and sanitize food prep surfaces, wipe down counters and equipment, mop all kitchen floor areas.\n• Every 2 Hours: Clean fryer area, wipe down all kitchen equipment exteriors.\n• End of Shift: Full deep clean of assigned station, sanitize all surfaces, clean and drain floor drains.\n\n🧴 SANITIZER USE:\n• Always use McDonald\'s approved sanitizer at the correct dilution ratio.\n• Change sanitizer water every 2 hours or whenever it looks dirty.\n• Sanitizing cloths must NOT be used for anything except sanitizing surfaces.\n\n🚽 RESTROOM CHECKS:\n• Check restrooms every 30 minutes.\n• Restock paper, soap, and hand towels.\n• Record all checks on the restroom checklist board.',
    date: new Date().toLocaleDateString(),
    timestamp: Date.now() - 27000,
    image: null
  },
  {
    id: 'soc_5',
    title: 'SOC: Customer Service & Hospitality (KSA)',
    desc: '📋 SAUDI McDONALD\'S STANDARD — CUSTOMER SERVICE\n\n😊 THE 6 STEPS OF SERVICE (FRONT COUNTER):\n1. GREET: Smile and greet the customer warmly within 3 seconds of them approaching.\n2. TAKE ORDER: Suggest sell a combo upgrade or extra item ("Would you like to make that a large?").\n3. ASSEMBLE: Prepare the order accurately and quickly.\n4. PRESENT: Double check the order before handing it over. Confirm all items.\n5. THANK: Thank the customer and invite them back ("Thank you, enjoy your meal!").\n6. MAINTAIN: Keep your area clean and be ready for the next customer.\n\n🚗 DRIVE-THRU STANDARD:\n• Greet at the speaker within 3 seconds.\n• Target total drive-thru time: Under 90 seconds (KSA peak standard).\n• Present the order and payment simultaneously if possible.\n• Never leave a customer waiting at the window without a verbal update.',
    date: new Date().toLocaleDateString(),
    timestamp: Date.now() - 26000,
    image: null
  },
  {
    id: 'soc_6',
    title: 'SOC: Opening Procedures (Pre-Shift)',
    desc: '📋 SAUDI McDONALD\'S STANDARD — OPENING CHECKLIST\n\n✅ BEFORE OPENING, COMPLETE ALL OF THE FOLLOWING:\n\n🧊 COOLER & FREEZER:\n□ Check and record all freezer temps (target: -18°C or below).\n□ Check and record all cooler temps (target: 0°C – 4°C).\n□ Verify all products are labelled with prep date and time.\n□ Remove and discard any expired products.\n\n🍟 PRODUCTION AREAS:\n□ Turn on all cooking equipment and verify temperatures reach standard.\n□ Calibrate timers on fryers, grills, and UHC.\n□ Set up all station condiments, sauces, and toppings with fresh product.\n□ Ensure all bins are clean and lined.\n\n🧹 CLEANLINESS:\n□ Sweep and mop all kitchen and lobby floors.\n□ Wipe down all countertops, equipment, and surfaces.\n□ Restock condiment stations, napkin holders, straw dispensers.\n□ Ensure all restrooms are clean and fully stocked.',
    date: new Date().toLocaleDateString(),
    timestamp: Date.now() - 25000,
    image: null
  },
  {
    id: 'soc_7',
    title: 'SOC: Closing Procedures (End of Shift)',
    desc: '📋 SAUDI McDONALD\'S STANDARD — CLOSING CHECKLIST\n\n✅ AT CLOSE, COMPLETE ALL OF THE FOLLOWING:\n\n🍔 PRODUCTION:\n□ Discard ALL remaining held product in UHC and record as waste.\n□ Deep clean all grills, fryers, and cooking surfaces.\n□ Drain and filter fryer oil. Replace if Quality Indicator (QI) is past limit.\n□ Clean and sanitize all prep tables, cutting boards, and utensils.\n□ Turn off all equipment safely and in the correct order.\n\n🧹 CLEANING:\n□ Sweep and mop all kitchen floors. Clean floor drains.\n□ Empty and clean all waste bins. Replace bin liners.\n□ Wipe down all exterior surfaces of equipment.\n□ Clean and sanitize restrooms. Restock for opening.\n\n🔒 SECURITY:\n□ Lock all delivery doors and storage areas.\n□ Count and secure cash (manager only).\n□ Verify all lights and non-essential equipment are turned off.\n□ Set alarm and lock the restaurant.',
    date: new Date().toLocaleDateString(),
    timestamp: Date.now() - 24000,
    image: null
  },
  {
    id: 'soc_8',
    title: 'SOC: Oil Management & Fryer Standards',
    desc: '📋 SAUDI McDONALD\'S STANDARD — OIL MANAGEMENT\n\n🛢️ OIL QUALITY:\n• Test fryer oil EVERY 4 HOURS using the Quality Indicator (QI) tester.\n• Record the QI reading on the oil management log.\n• If QI reading reaches the discard level, change the oil immediately.\n• NEVER cook in oil that has passed its QI limit — this is a food safety violation.\n\n⏰ OIL FILTERING:\n• Filter oil EVERY 4 HOURS or after every 4 loads of chicken/fish.\n• Follow the 3-step filtering process: drain, filter, refill.\n• Never leave the fryer unattended while filtering.\n\n📏 OIL LEVEL:\n• Maintain oil at the proper level line at all times.\n• Top up with fresh oil as needed to maintain correct level.\n• Record all oil additions and changes in the oil log.',
    date: new Date().toLocaleDateString(),
    timestamp: Date.now() - 23000,
    image: null
  },
  {
    id: 'soc_9',
    title: 'SOC: Waste & FIFO Management',
    desc: '📋 SAUDI McDONALD\'S STANDARD — WASTE & FIFO\n\n🗑️ WASTE RECORDING:\n• ALL discarded product must be recorded on the waste log sheet immediately.\n• Record the product name, quantity, reason for waste, and the time.\n• Never throw away product without recording it first.\n• Report high waste levels to the manager on duty.\n\n📦 FIFO (First In, First Out):\n• When new stock arrives, always place it BEHIND existing stock.\n• Always use the OLDEST product first (check prep dates and labels).\n• Never use a product past its use-by or expiry date.\n\n🏷️ LABELLING:\n• All prepped food must be labelled with: Product Name, Prep Date, Prep Time, Use-By Time.\n• Labels must be clearly readable and placed in a visible position.\n• Unlabelled product must be discarded immediately.',
    date: new Date().toLocaleDateString(),
    timestamp: Date.now() - 22000,
    image: null
  },
  {
    id: 'soc_10',
    title: 'SOC: Delivery & Stock Receiving Standards',
    desc: '📋 SAUDI McDONALD\'S STANDARD — DELIVERY RECEIVING\n\n🚚 WHEN DELIVERY ARRIVES:\n1. Check the delivery vehicle for cleanliness and any signs of contamination.\n2. Verify the delivery temperature before unloading:\n   • Frozen items: Must arrive at -15°C or below.\n   • Chilled items: Must arrive at 4°C or below.\n3. Count all items and verify against the delivery invoice.\n4. Check all packaging for damage, tears, or leaks.\n5. Do NOT accept any product that is above temperature or has damaged packaging — reject it and record it.\n\n📝 AFTER RECEIVING:\n• Immediately move frozen items to the freezer and chilled items to the cooler.\n• Label all new stock with the received date.\n• Store new stock BEHIND existing stock (FIFO).\n• File the signed delivery invoice and report any discrepancies to the manager.',
    date: new Date().toLocaleDateString(),
    timestamp: Date.now() - 21000,
    image: null
  },
  {
    id: 'soc_11',
    title: 'SOC: Allergen Awareness (KSA Standard)',
    desc: '📋 SAUDI McDONALD\'S STANDARD — ALLERGEN AWARENESS\n\n⚠️ THE 14 MAJOR ALLERGENS TO KNOW:\nGluten (Wheat), Milk/Dairy, Eggs, Peanuts, Tree Nuts, Sesame, Soy, Fish, Shellfish, Celery, Mustard, Lupin, Sulphites, Molluscs.\n\n🚫 CROSS-CONTAMINATION PREVENTION:\n• If a customer mentions an allergy — STOP and get the manager immediately.\n• Use separate, clean utensils and gloves when preparing an allergen-sensitive order.\n• Change gloves and wash hands before handling any allergen-free order.\n• Never prepare an allergen order on the same surface as a regular order without sanitizing first.\n\nℹ️ CUSTOMER ENQUIRIES:\n• If a customer asks about allergens in a product, direct them to the McDonald\'s Allergen Information Sheet.\n• Never guess — if in doubt, always get the manager.',
    date: new Date().toLocaleDateString(),
    timestamp: Date.now() - 20000,
    image: null
  },
  {
    id: 'soc_12',
    title: 'SOC: Pest Control & Restaurant Safety',
    desc: '📋 SAUDI McDONALD\'S STANDARD — PEST CONTROL & SAFETY\n\n🐀 PEST PREVENTION:\n• Keep all doors closed except during active deliveries.\n• Seal all food storage containers tightly after use.\n• Never leave food debris on the floor overnight.\n• Report any sign of pests (droppings, gnaw marks, insects) to the manager IMMEDIATELY.\n• Pest control inspections are scheduled by the company — ensure full access for inspectors.\n\n🔥 FIRE SAFETY:\n• Know the location of ALL fire extinguishers in your restaurant.\n• Know the emergency exit routes.\n• Never block emergency exits with equipment or boxes.\n• If a fryer fire occurs: Do NOT use water. Use the fire suppression system or a Class K extinguisher.\n• In any emergency: Evacuate customers first, then call emergency services (911 in KSA).\n\n💡 ELECTRICAL SAFETY:\n• Never operate equipment with damaged cords or missing covers.\n• Report all damaged equipment to the manager immediately — do not attempt to fix it yourself.',
    date: new Date().toLocaleDateString(),
    timestamp: Date.now() - 19000,
    image: null
  }
];

window.INITIAL_PROCEDURES = INITIAL_PROCEDURES;
