const expect = require('chai').expect;
// const server = require('../index');

describe('test', () => {
  it('should be equal', () => {
    expect('ci with travis').to.equal('ci with travis');
  });
  it('should return a string', () => {
    expect('carlos').to.be.a('string');

  });
});