import {Component, h, State} from '@stencil/core';

@Component({
  tag: 'mm-stick-price',
  styleUrl: './stock-price.css',
  shadow: true
})
export class StockPrice {
  @State() fetchedPrice;

onFetchStockPrice(event: Event) {
  event.preventDefault();
  fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTES&symbol=MSFT&apikey=demo`)
    .then(res => {
      return res.json();
    }).then(parsedRes => this.fetchedPrice = +parsedRes['Global Quote']['05 price'])
    .catch(err => console.log(err));
}

  render () {
    return [
      <form onSubmit={this.onFetchStockPrice.bind(this)}>
        <input type="text" id="stock-symbol"/>
        <button type="submit">Fetch</button>
      </form>,
      <div>
          <p>Price: ${this.fetchedPrice}</p>
      </div>
    ];
  }
}

