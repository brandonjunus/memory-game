import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      setUp: [],
      currRow: null,
      currCol: null,
      currSelection: null,
      lastRow: null,
      lastCol: null,
      lastSelection: null, 
      firstTurn: false,
      matches: new Set(),
    }

    this.revealCard = this.revealCard.bind(this);
  }

  shuffle(a) {
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
  }
  revealCard(rowPosition, colPosition){
    const { setUp, currSelection, currRow, currCol, firstTurn, matches, lastSelection} = this.state;
    
    let justChosen = setUp[rowPosition][colPosition];
    // if you made two moves already, reset the turn 
    if (lastSelection && currSelection) {
      this.setState({
        currRow: null,
        currCol: null,
        currSelection: null,
        lastRow: null,
        lastCol: null,
        lastSelection: null, 
        firstTurn: false,
      })
    } else {

      // if they match, add them to matches set
      if (justChosen === currSelection){
        this.setState({
          matches: new Set(matches.add(justChosen)),
        }, () => {
          if(matches.size === 8){
            alert('you win!');
          }
        });
      }
  
      // set the state with what we found
      this.setState({
        currRow: rowPosition,
        currCol: colPosition,
        currSelection: setUp[rowPosition][colPosition],
        lastRow: firstTurn ? currRow : null,
        lastCol: firstTurn ? currCol : null,
        lastSelection: firstTurn ? currSelection : null,
        firstTurn: !firstTurn,
      });
    }
  }
  setUp(){
    // 1. create an array of two of each card
    // 2. shuffle that array
    // 3. make a 2d matrix from that array and set it in state
    let cards = [];
    for (let i = 1; i < 13; i++){
      cards.push(i);
      cards.push(i);
    }
    cards = this.shuffle(cards)
    let setUp = [];
    for (let i = 0; i < cards.length; i += cards.length / 4){
      let currRow = [];
      for (let j = 0; j < Math.sqrt(cards.length); j++){
        currRow.push(cards[i + j])
      }
      setUp.push(currRow);
    }
    this.setState({setUp})
  }

  componentDidMount(){
    this.setUp();
  }

  render() {
    const { setUp, currRow, currCol, lastRow, lastCol, matches } = this.state;
    let board = setUp.map((row, rowIndex) => 
      <div key={rowIndex}>
        {row.map((col, colIndex) => 
          <Card className='card' 
            key={colIndex} 
            rowPosition={rowIndex}
            colPosition={colIndex}
            value={col}
            revealed={
              (currRow === rowIndex && currCol === colIndex) ||
              (lastRow === rowIndex && lastCol === colIndex) ||
              matches.has(col)
              ? true: false}
            revealCard={this.revealCard} 
            />)}
      </div>
    )
    return (
      <div className="App">
        {board}
      </div>
    );
  }
}

export default App;

const Card = (props) => {
  const { revealCard, rowPosition, colPosition, revealed, value } = props;
  return (
    <span className='card'
      onClick={() => revealCard(rowPosition, colPosition)}>
      {revealed ? value : '_'}
    </span>

  )
}