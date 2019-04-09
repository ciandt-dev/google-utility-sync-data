const {expect} = require('chai');
const LogUtil = require('../../../src/common/util/LogUtil');
const sinon = require('sinon');

log = new LogUtil('UNIT TESTES', 'x');
noLog = new LogUtil('UNIT TESTES', 'test');

describe('LogInfo and LogError', () => {
  const context = {context: 'testcontext', timestamp: 'testtimestamp',
    type: 'test'};
  const currentNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    sinon.restore();
    process.env.NODE_ENV = currentNodeEnv;
  });

  afterEach(() => {
    process.env.NODE_ENV = currentNodeEnv;
  });

  it('Should accept 2 parameters and print message', () => {
    process.env.NODE_ENV = undefined;
    const consoleLogInfoFake = sinon.fake(function() {});
    sinon.replace(console, 'info', consoleLogInfoFake);
    log.logInfo(context, 'Info message');
    expect(consoleLogInfoFake.calledOnce).to.be.true;

    const consoleLogErrorFake = sinon.fake(function() {});
    sinon.replace(console, 'error', consoleLogErrorFake);
    log.logError(context, 'Error message');
    expect(consoleLogErrorFake.calledOnce).to.be.true;
  });

  it('Should accept 2 parameters but not print message in test env', () => {
    const consoleLogInfoFake = sinon.fake(function() {});
    sinon.replace(console, 'info', consoleLogInfoFake);
    noLog.logInfo(context, 'Info message');
    expect(consoleLogInfoFake.notCalled).to.be.true;

    const consoleLogErrorFake = sinon.fake(function() {});
    sinon.replace(console, 'error', consoleLogErrorFake);
    noLog.logError(context, 'Error message');
    expect(consoleLogErrorFake.notCalled).to.be.true;
  });

  it('Should accept 3 parameters and print message', () => {
    process.env.NODE_ENV = undefined;
    const consoleLogInfoFake = sinon.fake(function() {});
    sinon.replace(console, 'info', consoleLogInfoFake);
    log.logInfo(context, 'Info message', context);
    expect(consoleLogInfoFake.calledOnce).to.be.true;

    const consoleLogErrorFake = sinon.fake(function() {});
    sinon.replace(console, 'error', consoleLogErrorFake);
    log.logError(context, 'Error message', context);
    expect(consoleLogErrorFake.calledOnce).to.be.true;
  });

  it('Should accept 3 parameters but not print message in test env', () => {
    const consoleLogInfoFake = sinon.fake(function() {});
    sinon.replace(console, 'info', consoleLogInfoFake);
    noLog.logInfo(context, 'Info message', context);
    expect(consoleLogInfoFake.notCalled).to.be.true;

    const consoleLogErrorFake = sinon.fake(function() {});
    sinon.replace(console, 'error', consoleLogErrorFake);
    noLog.logError(context, 'Error message', context);
    expect(consoleLogErrorFake.notCalled).to.be.true;
  });
});
