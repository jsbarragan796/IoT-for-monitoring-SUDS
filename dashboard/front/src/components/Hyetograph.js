import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import Grid from '@material-ui/core/Grid';
class Hyetograph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0
    };
    this.margin = {
      top: 10,
      right: 8,
      bottom: 20,
      left: 80
    };
    this.drawGraph = this.drawGraph.bind(this);
    this.updateGraph = this.updateGraph.bind(this);
    this.currentSize = this.currentSize.bind(this);
  }

  componentWillMount() {
    this.currentSize();
    window.addEventListener('resize', this.currentSize);
  }


  componentDidMount() {
    this.drawGraph();
  }


  componentWillUpdate() {
    this.updateGraph();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.currentSize);
  }

  currentSize() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  updateGraph() {
    const svg = d3.select(this.svg).selectAll('*');
    svg.remove();
    this.drawGraph();
  }


  drawGraph() {
    const { data } = this.props;

    const getFullTime = date => new Date(date).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

    const dates1 = data.map(d => new Date(d.time));
    const allDates = dates1.sort((a, b) => d3.ascending(a, b));
    const dates = allDates.filter((elem, index, self) => index === self.indexOf(elem));
    const series = [{ name: 'entrada', values: data }];
    const svg = d3.select(this.svg);
    this.height = svg.attr('height') - this.margin.top - this.margin.bottom;
    this.width = svg.attr('width') - this.margin.left - this.margin.right;

    this.x = d3
      .scaleBand()
      .domain(data.map(d => getFullTime(d.time)))
      .range([this.margin.left, this.width - this.margin.right])
      .padding(0.1);

    this.y = d3
      .scaleLinear()
      .domain([0, Math.max(d3.max(data, d => d.value)) * 1.5])
      .nice()
      .range([(this.height) - this.margin.bottom, this.margin.top]);

    svg
      .append('g')
      .attr('transform', `translate(0,${this.height - this.margin.bottom})`)
      .call(
        d3
          .axisBottom(this.x)
          .ticks(this.width / 80)
          .tickSizeOuter(0),
      );

    svg
      .append('g')
      .attr('transform', `translate(${this.margin.left},0)`)
      .call(d3.axisLeft(this.y))
      .call(g => g.select('.domain').remove())
      .call(g => g
        .select('.tick:last-of-type text')
        .clone()
        .attr('x', 3)
        .attr('text-anchor', 'start')
        .attr('font-weight', 'bold'));

    svg.append('text')
      .attr('transform',
        `translate(${this.width / 2} ,${this.height + this.margin.top + 6})`)
      .style('text-anchor', 'middle')
      .text('Hora');

    svg.append('text')
      .attr('transform',
        `translate(${this.margin.left / 2} ,${this.height / 2})rotate(-90)`)
      .style('text-anchor', 'middle')
      .text('Precipitación mm/hr');


    svg.append('text')
      .attr('transform', `translate(${this.width / 2} ,${this.margin.top + 10})`)
      .attr('text-anchor', 'middle')
      .style('font-size', '24px')
      .text('Precipitación ');

    svg.append('g')
      .attr('fill', 'steelblue')
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => this.x(getFullTime(d.time)))
      .attr('y', d => this.y(d.value))
      .attr('height', d => this.y(0) - this.y(d.value))
      .attr('width', this.x.bandwidth());
  }

  render() {
    const { height, width } = this.state;
    const widthSvg = width < 400 ? width * 0.9 : width * 0.7;
    const heightSvg = height < 690 ? height * 0.7 : height * 0.6;
    return (
      <Grid container direction="column" alignItems="center" spacing={0}>
        <Grid item xs={10}>
          <svg
            id="hyetograph"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            className="graph-svg-component"
            width={widthSvg}
            height={heightSvg}
            ref={(svg) => {
              this.svg = svg;
              return this.svg;
            }}
          >
          vizualización
          </svg>
        </Grid>
      </Grid>
    );
  }
}

export default Hyetograph;

Hyetograph.propTypes = {
  data: PropTypes.instanceOf(Array).isRequired
};
