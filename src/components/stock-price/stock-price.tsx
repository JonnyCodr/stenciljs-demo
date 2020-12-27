import {Component, h, Listen, Prop, State, Watch} from '@stencil/core';

@Component({
  tag: 'mm-stick-price',
  styleUrl: './stock-price.css',
  shadow: true
})
export class StockPrice {
  stockInput: HTMLInputElement;
  // @Element() el: HTMLElement;
  @State() fetchedPrice;
  @State() stockUserInput;
  @State() errorMsg;
  // initialStockSymbol: string;

  @Prop({mutable: true, reflect: true}) stockSymbol: string;

  @Watch('stockSymbol')
  stockSymbolChanged(newVal: string, oldVal: string) {
    if (newVal !== oldVal) {
      this.stockUserInput = newVal;
      this.stockUserInput = true;
      this.fetchStockPrice(newVal);
    }
  }

  onFetchStockPrice(event: Event) {
    event.preventDefault();
    // const valuestockSynbol = (this.el.shadowRoot.querySelector('#stock-symbol') as HTMLInputElement).value;
    this.stockSymbol = this.stockInput.value;
    // this.fetchStockPrice(valuestockSynbol);
  }

  onUserInput(event: Event) {
    this.stockUserInput = (event.target as HTMLInputElement).value;
  }

  componentWillLoad() {
    console.log('component will mount fired')
    console.log(this.stockSymbol)
  }

  componentDidLoad() {
    console.log(this.stockSymbol)
    if (this.stockSymbol) {
      // this.initialStockSymbol = this.stockSymbol;
      this.stockUserInput = this.stockSymbol;
      this.fetchStockPrice(this.stockSymbol);
    }
  }

  componentWillUpdate() {
    console.log('component will update fired')
    console.log(this.stockSymbol)
  }

  componentDidUpdate() {
    console.log('component did update fired')
    // if (this.stockSymbol !== this.initialStockSymbol) {
    //   this.initialStockSymbol = this.stockSymbol
    //   this.fetchStockPrice(this.stockSymbol);
    // }
  }

  render() {
    let data = 'Please enter a symbol';
    if (this.errorMsg) data = <p>{this.errorMsg}</p>;
    if (this.fetchedPrice) data = <p>Price: ${this.fetchedPrice}</p>;
    return [
      <form onSubmit={this.onFetchStockPrice.bind(this)}>
        <input type="text" id="stock-symbol" ref={el => this.stockInput = el} value={this.stockUserInput}
               onInput={this.onUserInput.bind(this)}/>
        <button type="submit">Fetch</button>
      </form>,
      <div>
        {data}
      </div>
    ];
  }

  @Listen('mmSymbolSelected', { target: 'body' })
  onStockSymbolSelected(event: CustomEvent) {
    if (event.detail && event.detail !== this.stockSymbol) {
      this.stockSymbol = event.detail;
    }
}

  private fetchStockPrice(valuestockSynbol: string) {
    fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${valuestockSynbol}&apikey=2VO8JK6F0U69S6OJ`)
      .then(res => {
        return res.json();
      })
      .then(parsedRes => {
        console.log(JSON.stringify(parsedRes))
        if (!parsedRes['Global Quote']['05. price']) {
          throw new Error('invalid symbol')
        }
        this.fetchedPrice = +parsedRes['Global Quote']['05. price']
      })
      .catch(err => {
        this.errorMsg = err.message
      });
  }
}
