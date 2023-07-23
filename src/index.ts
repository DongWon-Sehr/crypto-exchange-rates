export default class CryptoExRates {
    public sources: { [key: string]: { url: string } };
    public cryptoRates: any;
    public usdRates: any;
    public source: string;

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
        this._fetchCryptos();
        this._fetchUSD();
    }

    private _fetchCryptos() {
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

    // private 메서드 래핑을 위한 public 메서드 추가
    public testFetchCryptos() {
        this._fetchCryptos();
    }

    public testFetchUSD() {
        this._fetchUSD();
    }

    setSource(source: string) {
        if (!this._isSupportSource(source)) {
            throw new Error('Invalid source. Please provide a valid source.');
        }

        this.source = source;
        this._fetchCryptos();
    }

    private _isSupportSource(source: string): boolean {
        return Object.keys(this.sources).map(key => key.toLowerCase()).includes(source.toLowerCase());
    }

    private _fetchUSD() {
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
