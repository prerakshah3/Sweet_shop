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

});