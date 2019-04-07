var faker = require('faker');


function genRandomProducts(numOfProducts) {
  for (let i = 0; i < numOfProducts; i++) {
    let randomProductName = faker.commerce.productName();
    let randomProductPrice = faker.commerce.price();
    console.log(`${randomProductName} - $${randomProductPrice}`);
  }
}


function welcome() {
  console.log('===================================================');
  console.log('WELCOME TO MY SHOP');
  console.log('===================================================\n');
}



welcome();
genRandomProducts(25);
