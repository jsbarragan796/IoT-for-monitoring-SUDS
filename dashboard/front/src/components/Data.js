import React, { Component } from "react";
import { runInThisContext } from "vm";
import * as d3 from "d3";

class Data extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
    this.loadData = this.loadData.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    fetch(
      "events/current-events?pageNumber=1"
    )
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log("Recive data",data)
        this.setState({ data: data });
      })
      .catch(err => console.log(err));
  }

  giveData() {
      console.log(this.state.data !== null);
    if (this.state.data !== null) {
      let results = this.state.data;
      return (
        <div>
          {results.events.map(i => {
            return(<div>
              <h3>startDate: {i.startDate}</h3>
              <h3>lastMeasurementDate: {i.lastMeasurementDate}</h3>
            </div>)
          })}
        </div>
      );
    }
    else {
        return(
            <div>
              <h3>No data sorry</h3>
            </div>
        );
    }
  }

  render() {
    return (
      <div className="center-div">
        <h3>Datos:</h3>

        {this.giveData()}

        <button
          onClick={() => this.loadData()}
          className="btn btn-success btn-block"
        >
          Reload data
        </button>
      </div>
    );
  }
}

export default Data;
