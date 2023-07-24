import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import CryptoExRates from '../src/index';
// import fetch, { Response } from 'node-fetch';
import * as nodeFetch from 'node-fetch';
import sinon, { SinonStub } from 'sinon';

// node-fetch 모듈의 fetch 함수를 직접 가져와서 사용
// const fetch = nodeFetch.default;
(global as any).fetch = nodeFetch.default;

describe('CryptoExRates', function () {
    let fetchStub: SinonStub;

    // beforeEach를 사용하여 각 테스트 케이스마다 fetch 메서드를 모킹합니다.
    beforeEach(function () {

        fetchStub = sinon.stub(nodeFetch, 'default').resolves(new nodeFetch.Response(JSON.stringify({
            // Mock response data here...
        }), { status: 200, headers: { 'Content-Type': 'application/json' } }));

        fetchStub.withArgs('https://api.binance.com/api/v3/ticker/price').resolves(new nodeFetch.Response(JSON.stringify({
            BTC: {
                USD: 50000,
                EUR: 42000,
            },
            ETH: {
                USD: 3000,
                EUR: 2500,
            },
        }), { status: 200, headers: { 'Content-Type': 'application/json' } }));

        // 두 번째 URL: https://api.coinpaprika.com/v1/tickers
        fetchStub.withArgs('https://api.coinpaprika.com/v1/tickers').resolves(new nodeFetch.Response(JSON.stringify({
            BTC: {
                USD: 55000,
                EUR: 46000,
            },
            ETH: {
                USD: 3200,
                EUR: 2600,
            },
        }), { status: 200, headers: { 'Content-Type': 'application/json' } }));

        // 세 번째 URL: https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd.json
        fetchStub.withArgs('https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd.json').resolves(new nodeFetch.Response(JSON.stringify({
            USD: 1, // 예시로 USD 가치를 1로 설정
            EUR: 0.85, // 예시로 EUR 가치를 0.85로 설정
        }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
    });

    it('should create an instance of CryptoExRates', function () {
        const cryptoExRates = new CryptoExRates('binance');
        expect(cryptoExRates).to.be.instanceOf(CryptoExRates);
    });

    // it('should fetch crypto rates from the selected source', function (done) {
    //     const cryptoExRates = new CryptoExRates('binance');
    //     cryptoExRates.testFetchCryptos(); // 비동기 호출

    //     // 비동기 호출 후, 일정 시간 대기 후에 테스트를 진행합니다.
    //     setTimeout(() => {
    //         expect(cryptoExRates['cryptoRates']).to.be.an('object');
    //         done();
    //     }, 1000); // 적절한 시간을 설정합니다.
    // });

    // it('should fetch USD rates', function (done) {
    //     const cryptoExRates = new CryptoExRates('binance');
    //     cryptoExRates.testFetchUSD(); // 비동기 호출

    //     // 비동기 호출 후, 일정 시간 대기 후에 테스트를 진행합니다.
    //     setTimeout(() => {
    //         expect(cryptoExRates['usdRates']).to.be.an('object');
    //         done();
    //     }, 1000); // 적절한 시간을 설정합니다.
    // });

    it('should fetch crypto rates from the selected source', async function () {
        const cryptoExRates = new CryptoExRates('binance');
        await cryptoExRates.testFetchCryptos();
    
        expect(cryptoExRates['cryptoRates']).to.be.an('object');
    });
    
    it('should fetch USD rates', async function () {
        const cryptoExRates = new CryptoExRates('binance');
        await cryptoExRates.testFetchUSD();
    
        expect(cryptoExRates['usdRates']).to.be.an('object');
    });

    it('should set a new source', function () {
        const cryptoExRates = new CryptoExRates('binance');
        cryptoExRates.setSource('coinpaprika');
        expect(cryptoExRates.source).to.equal('coinpaprika');
    });

    it('should throw an error for an invalid source', function () {
        const cryptoExRates = new CryptoExRates('binance');
        expect(() => cryptoExRates.setSource('invalid_source')).to.throw('Invalid source. Please provide a valid source.');
    });

    // afterEach를 사용하여 각 테스트 케이스 실행 후에 fetchStub을 복구합니다.
    afterEach(function () {
        fetchStub.restore();
    });
});