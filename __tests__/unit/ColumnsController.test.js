const app = require('../../src/server'); // Link to your server file
const supertest = require('supertest');
const request = supertest(app);

describe("Tests from columns's controller", () => {
  it('Get columns', async (done) => {
    const response = await request.get('/columns');
    expect(response.status).toBe(200);
    done();
  });
});
