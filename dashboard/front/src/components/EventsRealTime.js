import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { Row, Col } from 'reactstrap';
// import { map } from 'd3-collection';

class EventsRealTime extends Component {
  constructor (props) {
    super(props);
    this.margin = {
      top: 20,
      right: 30,
      bottom: 30,
      left: 40
    };
    this.drawGraph = this.drawGraph.bind(this);
    // this.data = [{ date: '2007-04-23T05:00:00.000Z', value: 93.24 }, { date: '2007-04-24T05:00:00.000Z', value: 95.35 }, { date: '2007-04-25T05:00:00.000Z', value: 98.84 }, { date: '2007-04-26T05:00:00.000Z', value: 99.92 }, { date: '2007-04-29T05:00:00.000Z', value: 99.8 }, { date: '2007-05-01T05:00:00.000Z', value: 99.47 }, { date: '2007-05-02T05:00:00.000Z', value: 100.39 }, { date: '2007-05-03T05:00:00.000Z', value: 100.4 }, { date: '2007-05-04T05:00:00.000Z', value: 100.81 }, { date: '2007-05-07T05:00:00.000Z', value: 103.92 }, { date: '2007-05-08T05:00:00.000Z', value: 105.06 }, { date: '2007-05-09T05:00:00.000Z', value: 106.88 }, { date: '2007-05-09T05:00:00.000Z', value: 107.34 }, { date: '2007-05-10T05:00:00.000Z', value: 108.74 }, { date: '2007-05-13T05:00:00.000Z', value: 109.36 }, { date: '2007-05-14T05:00:00.000Z', value: 107.52 }, { date: '2007-05-15T05:00:00.000Z', value: 107.34 }, { date: '2007-05-16T05:00:00.000Z', value: 109.44 }, { date: '2007-05-17T05:00:00.000Z', value: 110.02 }, { date: '2007-05-20T05:00:00.000Z', value: 111.98 }, { date: '2007-05-21T05:00:00.000Z', value: 113.54 }, { date: '2007-05-22T05:00:00.000Z', value: 112.89 }, { date: '2007-05-23T05:00:00.000Z', value: 110.69 }, { date: '2007-05-24T05:00:00.000Z', value: 113.62 }, { date: '2007-05-28T05:00:00.000Z', value: 114.35 }, { date: '2007-05-29T05:00:00.000Z', value: 118.77 }, { date: '2007-05-30T05:00:00.000Z', value: 121.19 }, { date: '2007-06-01T05:00:00.000Z', value: 118.4 }, { date: '2007-06-04T05:00:00.000Z', value: 121.33 }, { date: '2007-06-05T05:00:00.000Z', value: 122.67 }, { date: '2007-06-06T05:00:00.000Z', value: 123.64 }, { date: '2007-06-07T05:00:00.000Z', value: 124.07 }, { date: '2007-06-08T05:00:00.000Z', value: 124.49 }, { date: '2007-06-10T05:00:00.000Z', value: 120.19 }, { date: '2007-06-11T05:00:00.000Z', value: 120.38 }, { date: '2007-06-12T05:00:00.000Z', value: 117.5 }, { date: '2007-06-13T05:00:00.000Z', value: 118.75 }, { date: '2007-06-14T05:00:00.000Z', value: 120.5 }, { date: '2007-06-17T05:00:00.000Z', value: 125.09 }, { date: '2007-06-18T05:00:00.000Z', value: 123.66 }, { date: '2007-06-19T05:00:00.000Z', value: 121.55 }, { date: '2007-06-20T05:00:00.000Z', value: 123.9 }, { date: '2007-06-21T05:00:00.000Z', value: 123 }, { date: '2007-06-24T05:00:00.000Z', value: 122.34 }, { date: '2007-06-25T05:00:00.000Z', value: 119.65 }, { date: '2007-06-26T05:00:00.000Z', value: 121.89 }, { date: '2007-06-27T05:00:00.000Z', value: 120.56 }, { date: '2007-06-28T05:00:00.000Z', value: 122.04 }, { date: '2007-07-02T05:00:00.000Z', value: 121.26 }, { date: '2007-07-03T05:00:00.000Z', value: 127.17 }, { date: '2007-07-05T05:00:00.000Z', value: 132.75 }, { date: '2007-07-06T05:00:00.000Z', value: 132.3 }, { date: '2007-07-09T05:00:00.000Z', value: 130.33 }, { date: '2007-07-09T05:00:00.000Z', value: 132.35 }];
  }

  // componentWillUpdate (newProps) {
  //   this.drawGraph(newProps);
  // }
  componentDidMount () {
    this.drawGraph();
  }

  drawGraph () {
    const { data } = this.props;
    const svg = d3.select(this.svg);
    this.height = svg.attr('height') - this.margin.top - this.margin.bottom;
    this.width = svg.attr('width') - this.margin.left - this.margin.right;

    this.x = d3.scaleTime()
      .domain(d3.extent(data, d => new Date(d.time)))
      .range([this.margin.left, this.width - this.margin.right]);

    this.y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)]).nice()
      .range([this.height - this.margin.bottom, this.margin.top]);

    this.line = d3.line()
      .defined(d => !Number.isNaN(d.value))
      .x(d => this.x(new Date(d.time)))
      .y(d => this.y(d.value));

    svg.append('g')
      .attr('transform', `translate(0,${this.height - this.margin.bottom})`)
      .call(d3.axisBottom(this.x).ticks(this.width / 80).tickSizeOuter(0));

    svg.append('g')
      .attr('transform', `translate(${this.margin.left},0)`)
      .call(d3.axisLeft(this.y))
      .call(g => g.select('.domain').remove())
      .call(g => g.select('.tick:last-of-type text').clone()
        .attr('x', 3)
        .attr('text-anchor', 'start')
        .attr('font-weight', 'bold')
        .text('HOLA'));

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('d', this.line);
  }

  render () {
    return (
      <div className="center-div">
        <Row>
          <Col sm="12" className="centered">
            <svg
              width="700"
              height="500"
              ref={(svg) => { this.svg = svg; return this.svg; }}
            >
              vizualizacion
            </svg>
          </Col>
        </Row>
      </div>
    );
  }
}

export default EventsRealTime;

EventsRealTime.propTypes = {
  data: PropTypes.instanceOf(Array).isRequired
};
