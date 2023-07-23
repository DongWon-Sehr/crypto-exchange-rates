class CryptoExRates {
    private sources: { [key: string]: { url: string } };
    private cryptoRates: any;
    private usdRates: any;
    private source: string;

    constructor(source: string = 'binance') {
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

    private fetchCryptos() {
        fetch(this.sources[this.source].url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok while fetching crypto rates');
                }
                return response.json();
            })
            .then(data => {
                this.cryptoRates = data;
            })
            .catch(error => {
                throw new Error('Error fetching crypto rates:' + error);
            });
    }

    setSource(source: string) {
        if (!this._isSupportSource(source)) {
            throw new Error('Invalid source. Please provide a valid source.');
        }

        this.source = source;
        this.fetchCryptos();
    }

    private _isSupportSource(source: string): boolean {
        return Object.keys(this.sources).map(key => key.toLowerCase()).includes(source.toLowerCase());
    }

    private _get_usd_currency() {
        const apiUrl = 'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd.json';

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok while fetching USD rates');
                }
                return response.json();
            })
            .then(data => {
                this.usdRates = data;
            })
            .catch(error => {
                throw new Error('Error fetching USD rates:' + error);
            });
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = CryptoExRates;
} else {
    (window as any).CryptoExRates = CryptoExRates;
}
