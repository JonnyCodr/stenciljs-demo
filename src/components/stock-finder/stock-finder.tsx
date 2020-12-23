import {Component, h} from "@stencil/core";
import {logBuild} from "@stencil/core/dev-server/client";

@Component({
  tag: 'mm-stock-finder',
  styleUrl: './stock-finder.css',
  shadow: true
})
export class StockFinder {

  stockNameInput: HTMLInputElement;

  onFindStocks(event: Event) {
    event.preventDefault();
    const searchTerm = this.stockNameInput.value;
    fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${searchTerm}&apikey=2VO8JK6F0U69S6OJ`)
      .then(res => res.json())
      .then(parsedRes => {
        console.log(parsedRes)
      })
      .catch( err => logBuild(err))
  }

  render() {
    return [
      <form onSubmit={this.onFindStocks.bind(this)}>
        <input type="text" id="stock-symbol" ref={el => this.stockNameInput = el} />
        <button type="submit">Find</button>
      </form>,
      <div>foo</div>
    ]
  }
}
