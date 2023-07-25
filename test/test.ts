import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import CryptoExRates from '../src/index';
import fetchMock from 'fetch-mock';
import fetch from 'cross-fetch';

describe('CryptoExRates', function () {
    beforeEach(function () {
        fetchMock.reset(); // 기존 모든 fetch 호출을 초기화합니다.

        fetchMock.mock('https://api.binance.com/api/v3/ticker/price', [
            { symbol: 'ETHBTC', price: '0.06367000' },
            { symbol: 'LTCBTC', price: '0.00306700' },
            { symbol: "BNBBTC", price: "0.00813000" }
        ]);

        fetchMock.mock('https://api.coinpaprika.com/v1/tickers', [
            {
                "id": "btc-bitcoin",
                "name": "Bitcoin",
                "symbol": "BTC",
                "rank": 1,
                "circulating_supply": 19439150,
                "total_supply": 19439150,
                "max_supply": 21000000,
                "beta_value": 1.05558,
                "first_data_at": "2010-07-17T00:00:00Z",
                "last_updated": "2023-07-25T23:14:17Z",
                "quotes": {
                    "USD": {
                        "price": 29230.63061342006,
                        "volume_24h": 15995624164.349588,
                        "volume_24h_change_24h": -20.01,
                        "market_cap": 568218613089,
                        "market_cap_change_24h": 0.16,
                        "percent_change_15m": -0.01,
                        "percent_change_30m": -0.05,
                        "percent_change_1h": -0.06,
                        "percent_change_6h": -0.15,
                        "percent_change_12h": 0.23,
                        "percent_change_24h": 0.15,
                        "percent_change_7d": -2.21,
                        "percent_change_30d": -3.38,
                        "percent_change_1y": 38.38,
                        "ath_price": 68692.13703693185,
                        "ath_date": "2021-11-10T16:50:00Z",
                        "percent_from_price_ath": -57.44
                    }
                }
            },
            {
                "id": "eth-ethereum",
                "name": "Ethereum",
                "symbol": "ETH",
                "rank": 2,
                "circulating_supply": 120283794,
                "total_supply": 120281948,
                "max_supply": 0,
                "beta_value": 1.26184,
                "first_data_at": "2015-08-07T00:00:00Z",
                "last_updated": "2023-07-25T23:14:17Z",
                "quotes": {
                    "USD": {
                        "price": 1860.374603230531,
                        "volume_24h": 3620429028.7768745,
                        "volume_24h_change_24h": -31.46,
                        "market_cap": 223772915538,
                        "market_cap_change_24h": 0.55,
                        "percent_change_15m": -0.07,
                        "percent_change_30m": -0.12,
                        "percent_change_1h": -0.12,
                        "percent_change_6h": -0.06,
                        "percent_change_12h": 0.35,
                        "percent_change_24h": 0.48,
                        "percent_change_7d": -2.02,
                        "percent_change_30d": 0.02,
                        "percent_change_1y": 31.88,
                        "ath_price": 4864.113196614236,
                        "ath_date": "2021-11-10T16:05:00Z",
                        "percent_from_price_ath": -61.75
                    }
                }
            }
        ]);

        fetchMock.mock('https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd.json', {
            "date": "2023-07-24",
            "usd": {
                "00": 11.229646,
                "1inch": 3.097964,
                "aave": 0.013909,
                "abt": 11.293055,
                "usd": 1
            }
        });
    });

    afterEach(function () {
        fetchMock.restore(); // fetch-mock을 복구합니다.
    });

    it('should create an instance of CryptoExRates', function () {
        const cryptoExRates = new CryptoExRates('binance');
        expect(cryptoExRates).to.be.instanceOf(CryptoExRates);
    });

    it('should fetch crypto rates from the selected source (binance)', function (done) {
        const cryptoExRates = new CryptoExRates('binance');
        cryptoExRates.testFetchCryptos(); // 비동기 호출

        // 비동기 호출 후, 일정 시간 대기 후에 테스트를 진행합니다.
        setTimeout(() => {
            console.log('cryptoExRates.cryptoRates:');
            console.log(cryptoExRates.cryptoRates);
            expect(cryptoExRates.cryptoRates).to.be.an.instanceOf(Object);
            done();
        }, 1500); // 적절한 시간을 설정합니다.
    });

    it('should fetch crypto rates from the selected source (coinpaprika)', function (done) {
        const cryptoExRates = new CryptoExRates('coinpaprika');
        cryptoExRates.testFetchCryptos(); // 비동기 호출

        // 비동기 호출 후, 일정 시간 대기 후에 테스트를 진행합니다.
        setTimeout(() => {
            console.log('cryptoExRates.cryptoRates:');
            console.log(cryptoExRates.cryptoRates);
            expect(cryptoExRates.cryptoRates).to.be.an.instanceOf(Object);
            done();
        }, 1500); // 적절한 시간을 설정합니다.
    });

    it('should fetch USD rates', function (done) {
        const cryptoExRates = new CryptoExRates('binance');
        cryptoExRates.testFetchUSD();

        setTimeout(() => {
            console.log('cryptoExRates.usdRates:');
            console.log(cryptoExRates.usdRates);
            expect(cryptoExRates.usdRates).to.be.an.instanceOf(Object);
            done();
        }, 1500); // 적절한 시간을 설정합니다.
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