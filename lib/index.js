'use strict'

class CryptoExRates {
    constructor(source = 'binance') {
        this.sources = {
            'binance': {
                'url': 'https://api.binance.com/api/v3/ticker/price'
            },
            'coinpaprika': {
                'url': 'https://api.coinpaprika.com/v1/tickers'
            }
        }

        if (!this._isSupportSource(source)) {
            throw new Error('Invalid source. Please provide a valid source.');
        }

        this.source = source;
        this.fetchCryptos();
        this._get_usd_currency();
    }

    fetchCryptos() {
        fetch(this.sources[this.source].url)
            .then(data => data.json())
            .then(json => { this.exRates = json; })
            .catch(error => { throw new Error('Error fetching crypto rates:', error); });
    }

    setSource(source) {
        if (!this._isSupportSource(source)) {
            throw new Error('Invalid source. Please provide a valid source.');
        }

        this.source = source;
        this.fetchCryptos();
    }

    _isSupportSource(source) {
        return Object.keys(this.sources).map(key => key.toLowerCase()).includes(source.toLowerCase());
    }

    _get_usd_currency() {
        const url = 'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd.json';

        fetch(url)
            .then(data => data.json())
            .then(json => { this.usdRates = json; })
            .catch(error => { throw new Error('Error fetching USD rates:', error); });
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = CryptoExRates;
} else {
    window.CryptoExRates = CryptoExRates;
}