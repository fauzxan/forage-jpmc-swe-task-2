import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[],
  showGraph: boolean,
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    /**
     * The state is first initialized with showGraph set to false, because we don't want the graph to render undless
     * the user clicks the button. 
     */

    this.state = {
      // data saves the server responds.
      // We use this state to parse data down to the child element (Graph) as element property
      data: [],
      showGraph: false,
    };
  }

  /**
   * Render Graph react component with state.data parse as property data
   */
  renderGraph() {
    /**
     * Check to see if the showGraph state is true, if it is then render the graph
     */
    if (this.state.showGraph){
      return (<Graph data={this.state.data} />)
    }
  }

  /**
   * Get new data from server and update the state with the new data
   */
  getDataFromServer() {
    DataStreamer.getData((serverResponds: ServerRespond[]) => {
      // Update the state by creating a new array of data that consists of
      // Previous data in the state and the new data from server
      /*
       * The getData function is called every 100ms over a 1000 times. This means that the data is being updated every 100ms, 
       * instead of having to click the button to update the data. 
       * By right, the getData should be called every 100ms for a period of 100s. 
       */
      let guard = 0;
      const interval = setInterval(() => {
        DataStreamer.getData((serverResponds: ServerRespond[]) => {
          this.setState({
            data: serverResponds,
            showGraph: true,
          });
        });
        guard++;
        if (guard > 1000){
          clearInterval(interval);
        }
      }, 100)

      this.setState({ data: [...this.state.data, ...serverResponds] });
    });
  }

  /**
   * Render the App react component
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button className="btn btn-primary Stream-button"
            // when button is clicked, our react app tries to request
            // new data from the server.
            // As part of your task, update the getDataFromServer() function
            // to keep requesting the data every 100ms until the app is closed
            // or the server does not return anymore data.
            onClick={() => {this.getDataFromServer()}}>
            Start Streaming Data
          </button>
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    )
  }
}

export default App;
