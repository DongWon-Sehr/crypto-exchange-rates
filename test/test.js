const { expect } = require('chai');
const { describe, it, beforeEach, afterEach } = require('mocha');
const CryptoExRates = require('../src/index');
const fetchMock = require('fetch-mock');
const fetch = require('cross-fetch');

describe('CryptoExRates', function () {
    beforeEach(function () {
        fetchMock.reset(); // 기존 모든 fetch 호출을 초기화합니다.

        // mock() 함수를 사용하여 fetch 호출에 대한 응답을 설정합니다.
        fetchMock.mock('https://api.binance.com/api/v3/ticker/price', {
            BTC: {
                USD: 50000,
                EUR: 42000,
            },
            ETH: {
                USD: 3000,
                EUR: 2500,
            },
        });

        fetchMock.mock('https://api.coinpaprika.com/v1/tickers', {
            // 새로운 소스인 coinpaprika에 대한 응답을 설정합니다.
            // 실제 데이터를 가져오는 것이 아닌, 테스트용으로 가상의 데이터를 설정합니다.
            BTC: {
                USD: 55000,
                EUR: 46000,
            },
            ETH: {
                USD: 3200,
                EUR: 2600,
            },
        });

        fetchMock.mock('https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd.json', {
            USD: 1, // 예시로 USD 가치를 1로 설정
            EUR: 0.85, // 예시로 EUR 가치를 0.85로 설정
        });
    });

    afterEach(function () {
        fetchMock.restore(); // fetch-mock을 복구합니다.
    });

    it('should create an instance of CryptoExRates', function () {
        const cryptoExRates = new CryptoExRates('binance');
        expect(cryptoExRates).to.be.instanceOf(CryptoExRates);
    });

    it('should fetch crypto rates from the selected source', function (done) {
        const cryptoExRates = new CryptoExRates('binance');
        cryptoExRates._fetchCryptos();

        setTimeout(() => {
            expect(cryptoExRates.cryptoRates).to.be.an('object');
            done();
        }, 1000);
    });

    it('should fetch USD rates', function (done) {
        const cryptoExRates = new CryptoExRates('binance');
        cryptoExRates._fetchUSD();

        setTimeout(() => {
            expect(cryptoExRates.usdRates).to.be.an('object');
            done();
        }, 1000);
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
});