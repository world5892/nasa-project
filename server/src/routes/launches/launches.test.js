const request = require('supertest');
const app = require('../../app');
const { mongoConnect, mongoDisconnect } = require('../../services/mongo');
const { loadPlanetsData } = require('../../models/planets.model');

describe('Launches API', () => {
  beforeAll(async () => {
    await mongoConnect();
    await loadPlanetsData();
  }, 20000);

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe('Test GET /launches', () => {
    it('responds with 200 success', async () => {
      await request(app).get('/v1/launches').expect('Content-Type', /json/).expect(200);
    });
  });

  describe('Test POST /launches', () => {
    const completeLaunchData = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      target: 'Kepler-442 b',
      launchDate: 'January 4, 2028',
    };

    const launchDataWithoutDate = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      target: 'Kepler-442 b',
    };

    const launchDataWithInvalidDate = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      target: 'Kepler-442 b',
      launchDate: 'abc',
    };

    it('responds with 201 created', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(completeLaunchData)
        .expect('Content-Type', /json/)
        .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();

      expect(response.body).toMatchObject(launchDataWithoutDate);
      expect(requestDate).toBe(responseDate);
    });

    it('throws 400 error if a property is missing', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchDataWithoutDate)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toStrictEqual({ error: 'Missing launch property' });
    });

    it('throws 400 error if launchDate is invalid', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchDataWithInvalidDate)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toStrictEqual({ error: 'Invalid date property' });
    });
  });
});
