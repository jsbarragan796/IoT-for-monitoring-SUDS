import React, { Component } from 'react';
import * as d3 from 'd3';

class EventsRealTime extends Component {
  constructor (props) {
    super(props)
    this.state = {
      data: null
    }
    this.margin = { top: 20, right: 50, bottom: 30, left: 40 }
    this.loadData = this.loadData.bind(this)
    
  }

  componentDidMount () {
    this.loadData()
  }

  loadData () {
    fetch(
      'events/current-events?pageNumber=1'
    )
      .then(res => {
        return res.json()
      })
      .then(data => {
        this.setState({ data: data })
      })
      .catch(err => console.log(err))
  }

  giveData () {
    const svg = d3.select(this.svg)
    svg.append('g')
      .call(xAxis)
      
    svg.append('g')
      .call(yAxis)
    
    const path = svg.append('g')
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .selectAll('path')
      .data(data.series)
      .enter().append('path')
      .style('mix-blend-mode', 'multiply')
      .attr('d', d => line(d.values))

  svg.call(hover, path)


  


    console.log(this.state.data !== null)
    if (this.state.data !== null) {
      let results = this.state.data
      return (
        <div>
          {results.events.map(i => {
            return (<div>
              <h3>startDate: {i.startDate}</h3>
              <h3>lastMeasurementDate: {i.lastMeasurementDate}</h3>
            </div>)
          })}
        </div>
      )
    } else {
      return (
        <div>
          <h3>No data sorry</h3>
        </div>
      )
    }
  }

  render () {
    return (
      <div className='center-div'>
        <h3>Datos:</h3>

        {this.giveData()}

        <button
          onClick={() => this.loadData()}
          className='btn btn-success btn-block'
        >
          Reload data
        </button>
      </div>
    )
  }
}

export default EventsRealTime
