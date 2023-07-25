interface CryptoRate {
    [symbol: string]: {
        USD: number;
    };
}

interface UsdRates {
    date: string;
    usd: {
        [currency: string]: number;
    };
}

export default class CryptoExRates {
    public sources: { [key: string]: { url: string } };
    public cryptoRates: CryptoRate = {};
    public usdRates: UsdRates = { date: '', usd: {} };
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
                if (this.source === 'binance') {
                    this.cryptoRates = this._convertBinanceResponse(data);
                } else if (this.source === 'coinpaprika') {
                    this.cryptoRates = this._convertCoinpaprikaResponse(data);
                } else {
                    throw new Error('Invalid source. Please provide a valid source.');
                }
            })
            .catch(error => {
                throw new Error('Error fetching crypto rates:' + error);
            });
    }

    private _convertBinanceResponse(data: any): CryptoRate {
        return data.reduce((cryptoRates: CryptoRate, crypto: any) => {
            cryptoRates[crypto.symbol] = { USD: parseFloat(crypto.price) };
            return cryptoRates;
        }, {});
    }

    private _convertCoinpaprikaResponse(data: any): CryptoRate {
        return data.reduce((cryptoRates: CryptoRate, crypto: any) => {
            cryptoRates[crypto.symbol] = { USD: crypto.quotes.USD.price };
            return cryptoRates;
        }, {});
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
