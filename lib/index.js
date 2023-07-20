'use strict'

class CryptoExRates {
    constructor(source = 'binance') {
        this.sources = {
            'binance' : {
                'url' : 'https://api.binance.com/api/v3/ticker/price'
            },
            'coinpaprika' : {
                'url' : 'https://api.coinpaprika.com/v1/tickers'
            }
        }

        if (!_isSupportSource(source)) {
            throw new Error('Invalid source. Please provide a valid source.');
        }

        this.source = source;
        this.fetchCryptos();
    }

    fetchCryptos() {
        fetch(this.sources[this.source].url).then(data => data.json()).then(json => {this.exRates = json});
    }

    setSource(source) {
        if (!_isSupportSource(source)) {
            throw new Error('Invalid source. Please provide a valid source.');
        }

        this.source = source;
        this.fetchCryptos();
    }

    _isSupportSource(source) {
        return Object.keys(this.sources).map(key => key.toLowerCase()).includes(source.toLowerCase());
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = CryptoExRates;
} else {
    window.CryptoExRates = CryptoExRates;
}