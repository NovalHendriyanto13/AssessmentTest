'use strict';

function getRandomProductName() {
  const adjectives = ['Super', 'Mega', 'Ultra', 'Cool', 'Fancy', 'Smart', 'Bright', 'Fast', 'Fresh', 'Golden'];
  const items = ['Phone', 'Laptop', 'Tablet', 'Camera', 'Watch', 'Bag', 'Shoes', 'Shirt', 'Bottle', 'Headset'];
  
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const item = items[Math.floor(Math.random() * items.length)];
  return `${adj} ${item}`;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    const products = [];

    const images = [
        'https://images.unsplash.com/photo-1593032457863-4620e53874d5',
        'https://images.unsplash.com/photo-1606813907973-7f0d6fda7ffb',
        'https://images.unsplash.com/photo-1580910051076-9e4db7e40c1c',
        'https://images.unsplash.com/photo-1573497491208-6b1acb260507',
        'https://images.unsplash.com/photo-1563298723-dcfebaa392e3',
        'https://images.unsplash.com/photo-1585238342028-6fa239a6b24d',
        'https://images.unsplash.com/photo-1574180045827-681f8a1a9622',
        'https://images.unsplash.com/photo-1598032893246-07f97d08e0f2',
        'https://images.unsplash.com/photo-1611078488454-c2b9a2d4a2f4',
        'https://images.unsplash.com/photo-1607746882042-944635dfe10e',
        'https://images.unsplash.com/photo-1580910051053-5d5c7e8d5d7f',
        'https://images.unsplash.com/photo-1593032457876-c7c5e182b36c',
        'https://images.unsplash.com/photo-1607746872042-944635dfe11f',
        'https://images.unsplash.com/photo-1611078488454-c2b9a2d4a2f5',
        'https://images.unsplash.com/photo-1574180045828-681f8a1a9623',
        'https://images.unsplash.com/photo-1606813907974-7f0d6fda7ffc',
        'https://images.unsplash.com/photo-1598032893247-07f97d08e0f3',
        'https://images.unsplash.com/photo-1585238342029-6fa239a6b24e',
        'https://images.unsplash.com/photo-1611078488455-c2b9a2d4a2f6',
        'https://images.unsplash.com/photo-1607746882043-944635dfe10f'
    ];

    for (let i = 0; i < 20; i++) {
      products.push({
        product_name: getRandomProductName(),
        picture: images[i % images.length], // ambil gambar secara looping
        stock: Math.floor(Math.random() * 100) + 1,
        price: Math.floor(Math.random() * 500000) + 50000,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await queryInterface.bulkInsert('products', products, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
  }
};
