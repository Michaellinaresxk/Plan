export interface GroceryItem {
  id: string;
  translationKey: string;
}

export interface GroceryCategory {
  id: string;
  translationKey: string;
  items: GroceryItem[];
}

// Categorías de comestibles
export const GROCERY_CATEGORIES: GroceryCategory[] = [
  {
    id: 'vegetables',
    translationKey: 'grocery.categories.vegetables',
    items: [
      { id: 'lettuce', translationKey: 'grocery.items.lettuce' },
      { id: 'avocado', translationKey: 'grocery.items.avocado' },
      { id: 'carrots', translationKey: 'grocery.items.carrots' },
      { id: 'celery', translationKey: 'grocery.items.celery' },
      { id: 'tomatoes', translationKey: 'grocery.items.tomatoes' },
      { id: 'peppers', translationKey: 'grocery.items.peppers' },
      { id: 'potatoes', translationKey: 'grocery.items.potatoes' },
      { id: 'broccoli', translationKey: 'grocery.items.broccoli' },
      { id: 'cucumber', translationKey: 'grocery.items.cucumber' },
      { id: 'mushrooms', translationKey: 'grocery.items.mushrooms' },
      { id: 'zucchini', translationKey: 'grocery.items.zucchini' },
      { id: 'arugula', translationKey: 'grocery.items.arugula' },
      { id: 'spinach', translationKey: 'grocery.items.spinach' },
      { id: 'onion', translationKey: 'grocery.items.onion' },
    ],
  },
  {
    id: 'fruits',
    translationKey: 'grocery.categories.fruits',
    items: [
      { id: 'pineapple', translationKey: 'grocery.items.pineapple' },
      { id: 'apples', translationKey: 'grocery.items.apples' },
      { id: 'bananas', translationKey: 'grocery.items.bananas' },
      { id: 'papaya', translationKey: 'grocery.items.papaya' },
      { id: 'watermelon', translationKey: 'grocery.items.watermelon' },
      { id: 'mango', translationKey: 'grocery.items.mango' },
      { id: 'berries', translationKey: 'grocery.items.berries' },
      { id: 'lemons', translationKey: 'grocery.items.lemons' },
    ],
  },
  {
    id: 'breads',
    translationKey: 'grocery.categories.breads',
    items: [
      { id: 'bagels', translationKey: 'grocery.items.bagels' },
      { id: 'croissants', translationKey: 'grocery.items.croissants' },
      { id: 'french-bread', translationKey: 'grocery.items.frenchBread' },
      { id: 'hamburger-buns', translationKey: 'grocery.items.hamburgerBuns' },
      { id: 'white-bread', translationKey: 'grocery.items.whiteBread' },
      {
        id: 'gluten-free-bread',
        translationKey: 'grocery.items.glutenFreeBread',
      },
      {
        id: 'whole-wheat-bread',
        translationKey: 'grocery.items.wholeWheatBread',
      },
    ],
  },
  {
    id: 'refrigerated',
    translationKey: 'grocery.categories.refrigerated',
    items: [
      { id: 'whole-milk', translationKey: 'grocery.items.wholeMilk' },
      { id: 'skim-milk', translationKey: 'grocery.items.skimMilk' },
      { id: 'almond-milk', translationKey: 'grocery.items.almondMilk' },
      { id: 'soy-milk', translationKey: 'grocery.items.soyMilk' },
      { id: 'yogurt', translationKey: 'grocery.items.yogurt' },
      { id: 'eggs', translationKey: 'grocery.items.eggs' },
      { id: 'cream-cheese', translationKey: 'grocery.items.creamCheese' },
      { id: 'smoked-salmon', translationKey: 'grocery.items.smokedSalmon' },
    ],
  },
  {
    id: 'cheese',
    translationKey: 'grocery.categories.cheese',
    items: [
      { id: 'gouda-cheese', translationKey: 'grocery.items.goudaCheese' },
      { id: 'goat-cheese', translationKey: 'grocery.items.goatCheese' },
      { id: 'swiss-cheese', translationKey: 'grocery.items.swissCheese' },
      { id: 'cheddar-cheese', translationKey: 'grocery.items.cheddarCheese' },
      { id: 'prosciutto', translationKey: 'grocery.items.prosciutto' },
      { id: 'turkey-ham', translationKey: 'grocery.items.turkeyHam' },
      { id: 'pork-ham', translationKey: 'grocery.items.porkHam' },
    ],
  },
  {
    id: 'snacks',
    translationKey: 'grocery.categories.snacks',
    items: [
      { id: 'chips-salsa', translationKey: 'grocery.items.chipsSalsa' },
      { id: 'mixed-nuts', translationKey: 'grocery.items.mixedNuts' },
      { id: 'almonds', translationKey: 'grocery.items.almonds' },
      { id: 'pistachios', translationKey: 'grocery.items.pistachios' },
      { id: 'crackers', translationKey: 'grocery.items.crackers' },
      { id: 'pita-chips', translationKey: 'grocery.items.pitaChips' },
      { id: 'oreos', translationKey: 'grocery.items.oreos' },
      { id: 'doritos', translationKey: 'grocery.items.doritos' },
      { id: 'granola-bars', translationKey: 'grocery.items.granolaBars' },
      { id: 'potato-chips', translationKey: 'grocery.items.potatoChips' },
      { id: 'popcorn', translationKey: 'grocery.items.popcorn' },
    ],
  },
  {
    id: 'drinks',
    translationKey: 'grocery.categories.drinks',
    items: [
      { id: 'orange-juice', translationKey: 'grocery.items.orangeJuice' },
      { id: 'cranberry-juice', translationKey: 'grocery.items.cranberryJuice' },
      { id: 'apple-juice', translationKey: 'grocery.items.appleJuice' },
      { id: 'coffee-regular', translationKey: 'grocery.items.coffeeRegular' },
      { id: 'coffee-decaf', translationKey: 'grocery.items.coffeeDecaf' },
      { id: 'tea', translationKey: 'grocery.items.tea' },
      { id: 'coca-cola', translationKey: 'grocery.items.cocaCola' },
      { id: 'diet-coke', translationKey: 'grocery.items.dietCoke' },
      { id: 'dasani-water', translationKey: 'grocery.items.dasaniWater' },
    ],
  },
  {
    id: 'water',
    translationKey: 'grocery.categories.water',
    items: [
      { id: 'evian-water', translationKey: 'grocery.items.evianWater' },
      { id: 'san-pellegrino', translationKey: 'grocery.items.sanPellegrino' },
      { id: 'perrier', translationKey: 'grocery.items.perrier' },
    ],
  },
  {
    id: 'dry-foods',
    translationKey: 'grocery.categories.dryFoods',
    items: [
      { id: 'cereal', translationKey: 'grocery.items.cereal' },
      { id: 'granola-muesli', translationKey: 'grocery.items.granolaMuesli' },
      { id: 'rice', translationKey: 'grocery.items.rice' },
      { id: 'quinoa', translationKey: 'grocery.items.quinoa' },
      { id: 'oatmeal', translationKey: 'grocery.items.oatmeal' },
      { id: 'pasta', translationKey: 'grocery.items.pasta' },
      { id: 'cous-cous', translationKey: 'grocery.items.cousCous' },
      { id: 'white-sugar', translationKey: 'grocery.items.whiteSugar' },
      { id: 'brown-sugar', translationKey: 'grocery.items.brownSugar' },
      { id: 'splenda', translationKey: 'grocery.items.splenda' },
      { id: 'stevia', translationKey: 'grocery.items.stevia' },
      { id: 'pancake-mix', translationKey: 'grocery.items.pancakeMix' },
    ],
  },
  {
    id: 'meats',
    translationKey: 'grocery.categories.meats',
    items: [
      { id: 'churrasco', translationKey: 'grocery.items.churrasco' },
      { id: 'tenderloin', translationKey: 'grocery.items.tenderloin' },
      { id: 'rib-eye', translationKey: 'grocery.items.ribEye' },
      { id: 'pork-ribs', translationKey: 'grocery.items.porkRibs' },
      { id: 'pork-chops', translationKey: 'grocery.items.porkChops' },
      { id: 'chicken-breast', translationKey: 'grocery.items.chickenBreast' },
      {
        id: 'chicken-drumsticks',
        translationKey: 'grocery.items.chickenDrumsticks',
      },
      {
        id: 'hot-dogs-hamburgers',
        translationKey: 'grocery.items.hotDogsHamburgers',
      },
    ],
  },
  {
    id: 'seafood',
    translationKey: 'grocery.categories.seafood',
    items: [
      { id: 'red-snapper', translationKey: 'grocery.items.redSnapper' },
      { id: 'grouper', translationKey: 'grocery.items.grouper' },
      { id: 'mahi-mahi', translationKey: 'grocery.items.mahiMahi' },
      { id: 'salmon', translationKey: 'grocery.items.salmon' },
      { id: 'shrimp', translationKey: 'grocery.items.shrimp' },
      { id: 'lobster', translationKey: 'grocery.items.lobster' },
      { id: 'crab', translationKey: 'grocery.items.crab' },
    ],
  },
  {
    id: 'condiments',
    translationKey: 'grocery.categories.condiments',
    items: [
      { id: 'ketchup', translationKey: 'grocery.items.ketchup' },
      { id: 'mustard', translationKey: 'grocery.items.mustard' },
      { id: 'mayonnaise', translationKey: 'grocery.items.mayonnaise' },
      { id: 'soy-sauce', translationKey: 'grocery.items.soySauce' },
      { id: 'jam-jelly', translationKey: 'grocery.items.jamJelly' },
      { id: 'peanut-butter', translationKey: 'grocery.items.peanutButter' },
      { id: 'nutella', translationKey: 'grocery.items.nutella' },
      { id: 'honey', translationKey: 'grocery.items.honey' },
      { id: 'olive-oil', translationKey: 'grocery.items.oliveOil' },
      { id: 'canola-oil', translationKey: 'grocery.items.canolaOil' },
      {
        id: 'balsamic-vinegar',
        translationKey: 'grocery.items.balsamicVinegar',
      },
      { id: 'sherry-vinegar', translationKey: 'grocery.items.sherryVinegar' },
      { id: 'salt', translationKey: 'grocery.items.salt' },
      { id: 'cinnamon', translationKey: 'grocery.items.cinnamon' },
    ],
  },
  {
    id: 'supplies',
    translationKey: 'grocery.categories.supplies',
    items: [
      { id: 'shampoo', translationKey: 'grocery.items.shampoo' },
      { id: 'bug-repellent', translationKey: 'grocery.items.bugRepellent' },
      { id: 'soap', translationKey: 'grocery.items.soap' },
      { id: 'sunscreen', translationKey: 'grocery.items.sunscreen' },
      { id: 'toothbrush', translationKey: 'grocery.items.toothbrush' },
      { id: 'toothpaste', translationKey: 'grocery.items.toothpaste' },
    ],
  },
  {
    id: 'miscellaneous',
    translationKey: 'grocery.categories.miscellaneous',
    items: [
      { id: 'ice-cream', translationKey: 'grocery.items.iceCream' },
      { id: 'chocolate-chips', translationKey: 'grocery.items.chocolateChips' },
    ],
  },
];

// Categorías de bebidas alcohólicas
export const SPIRIT_CATEGORIES: GroceryCategory[] = [
  {
    id: 'whiskies',
    translationKey: 'spirits.categories.whiskies',
    items: [
      { id: 'macallan-12y', translationKey: 'spirits.items.macallan12y' },
      {
        id: 'johnnie-walker-black',
        translationKey: 'spirits.items.johnnieWalkerBlack',
      },
      { id: 'makers-mark', translationKey: 'spirits.items.makersMark' },
      { id: 'buffalo-trace', translationKey: 'spirits.items.buffaloTrace' },
    ],
  },
  {
    id: 'vodka',
    translationKey: 'spirits.categories.vodka',
    items: [
      { id: 'absolut-magnum', translationKey: 'spirits.items.absolutMagnum' },
      {
        id: 'absolut-original',
        translationKey: 'spirits.items.absolutOriginal',
      },
      { id: 'titos-large', translationKey: 'spirits.items.titosLarge' },
      { id: 'titos-small', translationKey: 'spirits.items.titosSmall' },
      { id: 'belvedere-750', translationKey: 'spirits.items.belvedere750' },
      {
        id: 'belvedere-magnum',
        translationKey: 'spirits.items.belvedereMagnum',
      },
    ],
  },
  {
    id: 'gin',
    translationKey: 'spirits.categories.gin',
    items: [
      { id: 'bombay-gin', translationKey: 'spirits.items.bombayGin' },
      { id: 'hendricks-gin', translationKey: 'spirits.items.hendricksGin' },
      { id: 'the-botanist', translationKey: 'spirits.items.theBotanist' },
    ],
  },
  {
    id: 'rum',
    translationKey: 'spirits.categories.rum',
    items: [
      { id: 'brugal-white', translationKey: 'spirits.items.brugalWhite' },
      {
        id: 'brugal-extra-viejo',
        translationKey: 'spirits.items.brugalExtraViejo',
      },
      { id: 'brugal-leyenda', translationKey: 'spirits.items.brugalLeyenda' },
      { id: 'brugal-1888', translationKey: 'spirits.items.brugal1888' },
    ],
  },
  {
    id: 'tequila',
    translationKey: 'spirits.categories.tequila',
    items: [
      {
        id: 'jose-cuervo-silver',
        translationKey: 'spirits.items.joseCuervoSilver',
      },
      {
        id: 'jose-cuervo-reposado',
        translationKey: 'spirits.items.joseCuervoReposado',
      },
      { id: '1800-silver', translationKey: 'spirits.items.1800Silver' },
      { id: '1800-reposado', translationKey: 'spirits.items.1800Reposado' },
      { id: '1800-anejo', translationKey: 'spirits.items.1800Anejo' },
      {
        id: 'casamigos-silver',
        translationKey: 'spirits.items.casamigosSilver',
      },
      {
        id: 'casamigos-reposado',
        translationKey: 'spirits.items.casamigosReposado',
      },
      { id: 'casamigos-anejo', translationKey: 'spirits.items.casamigosAnejo' },
      { id: 'maestro-dobel', translationKey: 'spirits.items.maestroDobel' },
      {
        id: 'clase-azul-silver',
        translationKey: 'spirits.items.claseAzulSilver',
      },
      {
        id: 'clase-azul-reposado',
        translationKey: 'spirits.items.claseAzulReposado',
      },
    ],
  },
  {
    id: 'liquors',
    translationKey: 'spirits.categories.liquors',
    items: [
      { id: 'grand-marnier', translationKey: 'spirits.items.grandMarnier' },
      { id: 'cointreau', translationKey: 'spirits.items.cointreau' },
      { id: 'aperol', translationKey: 'spirits.items.aperol' },
      { id: 'campari', translationKey: 'spirits.items.campari' },
      {
        id: 'amaretto-disaronno',
        translationKey: 'spirits.items.amarettoDisaronno',
      },
      {
        id: 'cinzano-vermouth',
        translationKey: 'spirits.items.cinzanoVermouth',
      },
    ],
  },
  {
    id: 'cognac',
    translationKey: 'spirits.categories.cognac',
    items: [
      { id: 'hennessy-vs', translationKey: 'spirits.items.hennessyVS' },
      {
        id: 'hennessy-pure-white',
        translationKey: 'spirits.items.hennessyPureWhite',
      },
      { id: 'hennessy-vsop', translationKey: 'spirits.items.hennessyVSOP' },
    ],
  },
  {
    id: 'wine-sparkling',
    translationKey: 'spirits.categories.wineSparkling',
    items: [
      {
        id: 'chandon-extra-brut',
        translationKey: 'spirits.items.chandonExtraBrut',
      },
      {
        id: 'chandon-demi-sec',
        translationKey: 'spirits.items.chandonDemiSec',
      },
      { id: 'chandon-rose', translationKey: 'spirits.items.chandonRose' },
      {
        id: 'cavit-prosecco-brut',
        translationKey: 'spirits.items.cavitProseccoBrut',
      },
      {
        id: 'cavit-prosecco-rose',
        translationKey: 'spirits.items.cavitProseccoRose',
      },
      { id: 'monistrol-brut', translationKey: 'spirits.items.monistrolBrut' },
      { id: 'monistrol-rose', translationKey: 'spirits.items.monistrolRose' },
      {
        id: 'moet-chandon-brut',
        translationKey: 'spirits.items.moetChandonBrut',
      },
      {
        id: 'veuve-clicquot-brut',
        translationKey: 'spirits.items.veuveClicquotBrut',
      },
    ],
  },
  {
    id: 'wine-white',
    translationKey: 'spirits.categories.wineWhite',
    items: [
      {
        id: 'santa-carolina-chardonnay',
        translationKey: 'spirits.items.santaCarolinaChardonnay',
      },
      {
        id: 'santa-carolina-sauvignon',
        translationKey: 'spirits.items.santaCarolinaSauvignon',
      },
      {
        id: 'catena-alta-chardonnay',
        translationKey: 'spirits.items.catenaAltaChardonnay',
      },
      { id: 'josh-chardonnay', translationKey: 'spirits.items.joshChardonnay' },
      { id: 'josh-sauvignon', translationKey: 'spirits.items.joshSauvignon' },
      {
        id: 'cloudy-bay-sauvignon',
        translationKey: 'spirits.items.cloudyBaySauvignon',
      },
      {
        id: 'kim-crawford-sauvignon',
        translationKey: 'spirits.items.kimCrawfordSauvignon',
      },
      {
        id: 'cavit-pinot-grigio',
        translationKey: 'spirits.items.cavitPinotGrigio',
      },
    ],
  },
  {
    id: 'wine-red',
    translationKey: 'spirits.categories.wineRed',
    items: [
      { id: 'catena-malbec', translationKey: 'spirits.items.catenaMalbec' },
      { id: 'mondavi-merlot', translationKey: 'spirits.items.mondaviMerlot' },
      { id: 'josh-cabernet', translationKey: 'spirits.items.joshCabernet' },
      { id: 'josh-pinot-noir', translationKey: 'spirits.items.joshPinotNoir' },
      { id: 'caymus-cabernet', translationKey: 'spirits.items.caymusCabernet' },
      {
        id: 'belle-glos-pinot-noir',
        translationKey: 'spirits.items.belleGlosPinotNoir',
      },
      { id: 'the-prisoner', translationKey: 'spirits.items.thePrisoner' },
      {
        id: 'seghesio-zinfandel',
        translationKey: 'spirits.items.seghesioZinfandel',
      },
    ],
  },
  {
    id: 'wine-rose',
    translationKey: 'spirits.categories.wineRose',
    items: [
      {
        id: 'whispering-angel',
        translationKey: 'spirits.items.whisperingAngel',
      },
      {
        id: 'marques-caceres-rosado',
        translationKey: 'spirits.items.marquesCaceresRosado',
      },
      {
        id: 'sutter-home-zinfandel',
        translationKey: 'spirits.items.sutterHomeZinfandel',
      },
    ],
  },
  {
    id: 'beer-seltzer',
    translationKey: 'spirits.categories.beerSeltzer',
    items: [
      { id: 'perrier-water', translationKey: 'spirits.items.perrierWater' },
      {
        id: 'san-pellegrino-750',
        translationKey: 'spirits.items.sanPellegrino750',
      },
      { id: 'high-noon-vodka', translationKey: 'spirits.items.highNoonVodka' },
      {
        id: 'high-noon-tequila',
        translationKey: 'spirits.items.highNoonTequila',
      },
    ],
  },
];
