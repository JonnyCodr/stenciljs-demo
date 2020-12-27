import {Component, h, State, Event, EventEmitter} from "@stencil/core";

@Component({
  tag: 'mm-stock-finder',
  styleUrl: './stock-finder.css',
  shadow: true
})
export class StockFinder {
  stockNameInput: HTMLInputElement;

  @State() searchResults: {symbol: string, name: string}[] = [];
  @Event({bubbles: true, composed: true}) mmSymbolSelected: EventEmitter<string>;

  onFindStocks(event: Event) {
    event.preventDefault();
    const searchTerm = this.stockNameInput.value;
    fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${searchTerm}&apikey=2VO8JK6F0U69S6OJ`)
      .then(res => res.json())
      .then(parsedRes => {
        this.searchResults = parsedRes['bestMatches'].map( match => {
          return {name: match['2. name'], symbol: match['1. symbol']}
        })
      })
      .catch( err => console.log(err))
  }

  onSelectSymbol(symbol: string) {
    this.mmSymbolSelected.emit(symbol);
  }

  render() {
    return [
      <form onSubmit={this.onFindStocks.bind(this)}>
        <input id="stock-symbol" ref={el => this.stockNameInput = el} />
        <button type="submit">Find</button>
      </form>,
      <ul>{
        this.searchResults.map(result => (
          <li onClick={this.onSelectSymbol.bind(this, result.symbol)}><strong>{result.symbol}</strong> - {result.name}</li>
        ))}
      </ul>
    ]
  }
}
