import React, { Component } from "react";

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
      "measurement?measurementType=ph&fromDate='2008-01-01'&toDate='2020-01-01'"
    )
      .then(res => {
        return res.json();
      })
      .then(data => {
        this.setState({ data: data });
      })
      .catch(err => console.log(err));
  }

  giveData() {
      console.log(this.state.data !== null);
    if (this.state.data !== null) {
      let results = this.state.data.results;
      return (
        <div>
          {results.map(i => {
            return(<div>
              <h3>Time: {i.time}</h3>
              <h3>Value: {i.value}</h3>
              <h3>sensorId: {i.sensorId}</h3>
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
