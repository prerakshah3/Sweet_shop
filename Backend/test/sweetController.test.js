const mongoose = require('mongoose');
const Sweet = require('../models/Sweet');
const sweetController = require('../controllers/sweetController');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { mockRequest, mockResponse } = require('jest-mock-req-res');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Sweet Controller', () => {
  beforeEach(async () => {
    await Sweet.deleteMany({});
  });

  test('should add a new sweet', async () => {
    const req = mockRequest({
      body: { sweetId: '1001', name: 'Kaju Katli', category: 'Nut-Based', price: 50, quantity: 20 }
    });
    const res = mockResponse();
    await sweetController.addSweet(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ sweetId: '1001' }));
  });

  test('should delete a sweet', async () => {
    await Sweet.create({ sweetId: '1001', name: 'Kaju Katli', category: 'Nut-Based', price: 50, quantity: 20 });
    const req = mockRequest({ params: { sweetId: '1001' } });
    const res = mockResponse();
    await sweetController.deleteSweet(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: 'Sweet deleted' });
  });
  test('should get all sweets', async () => {
    await Sweet.create({ sweetId: '1001', name: 'Kaju Katli', category: 'Nut-Based', price: 50, quantity: 20 });
    const req = mockRequest();
    const res = mockResponse();
    await sweetController.getAllSweets(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ sweetId: '1001' })]));
  });

  test('should search sweets by name', async () => {
    await Sweet.create({ sweetId: '1001', name: 'Kaju Katli', category: 'Nut-Based', price: 50, quantity: 20 });
    const req = mockRequest({ query: { name: 'Kaju' } });
    const res = mockResponse();
    await sweetController.searchSweets(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ name: 'Kaju Katli' })]));
  });

  test('should sort sweets by price', async () => {
    await Sweet.create([
      { sweetId: '1001', name: 'Kaju Katli', category: 'Nut-Based', price: 50, quantity: 20 },
      { sweetId: '1002', name: 'Gulab Jamun', category: 'Milk-Based', price: 10, quantity: 50 }
    ]);
    const req = mockRequest({ query: { sortBy: 'price', order: 'asc' } });
    const res = mockResponse();
    await sweetController.sortSweets(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({ price: 10 }),
      expect.objectContaining({ price: 50 })
    ]));
  });

  test('should purchase sweets and update quantity', async () => {
    await Sweet.create({ sweetId: '1001', name: 'Kaju Katli', category: 'Nut-Based', price: 50, quantity: 20 });
    const req = mockRequest({ body: { sweetId: '1001', quantity: 5 } });
    const res = mockResponse();
    await sweetController.purchaseSweet(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ quantity: 15 }));
  });

});