/* global window */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import Grid from '@material-ui/core/Grid';

class DinamicGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
    };
    this.margin = {
      top: 10,
      right: 8,
      bottom: 20,
      left: 80,
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

  componentDidUpdate() {
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
    const {
      rain, conductivity, level, showOption,
    } = this.props;
    const getFullTime = date => new Date(date).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

    const dates1 = level.entry.map(d => new Date(d.time));
    const dates2 = level.exit.map(d => new Date(d.time));
    const dates3 = conductivity.entry.map(d => new Date(d.time));
    const dates4 = conductivity.exit.map(d => new Date(d.time));
    const dates5 = rain.map(d => new Date(d.time));
    const allDates = dates1.concat(dates2).concat(dates3).concat(dates4).concat(dates5)
      .sort((a, b) => d3.ascending(a, b));
    const dates = allDates.filter((elem, index, self) => index === self.indexOf(elem));
    const scale = showOption === 'rain' ? 1.5 : 1;
    let series = [];
    let yDimention = 0;
    let labelY = '';
    if (showOption === 'conductivity') {
      series = [{ name: 'entrada', values: conductivity.entry }, { name: 'salida', values: conductivity.exit }];
      yDimention = scale * Math.max(
        d3.max(conductivity.entry, d => d.value), d3.max(conductivity.exit, d => d.value),
      );
      labelY = 'Conductividad μS/cm';
    } else {
      series = [{ name: 'entrada', values: level.entry }, { name: 'salida', values: level.exit }];
      yDimention = scale * Math.max(
        d3.max(level.entry, d => d.value), d3.max(level.exit, d => d.value),
      );
      labelY = 'Caudal l/s';
    }
    const svg = d3.select(this.svg);
    this.height = svg.attr('height') - this.margin.top - this.margin.bottom;
    this.width = svg.attr('width') - this.margin.left - this.margin.right;

    this.x = d3
      .scaleTime()
      .domain(d3.extent(dates, d => d))
      .range([this.margin.left, this.width - this.margin.right]);

    this.xRain = d3
      .scaleBand()
      .domain(rain.map(d => getFullTime(d.time)))
      .range([this.margin.left, this.width - this.margin.right])
      .padding(0.1);

    this.yRain = d3
      .scaleLinear()
      .domain([Math.max(d3.max(rain, d => d.value)) * 3, 0])
      .nice()
      .range([(this.height) - this.margin.bottom, this.margin.top]);

    this.xConductivity = d3
      .scaleBand()
      .domain(d3.extent(dates, d => d))
      .range([this.margin.left, this.width - this.margin.right])
      .padding(0.1);

    this.yConductivity = d3
      .scaleLinear()
      .domain([scale * Math.max(
        d3.max(conductivity.entry, d => d.value), d3.max(conductivity.exit, d => d.value),
      ) * 3, 0])
      .nice()
      .range([(this.height) - this.margin.bottom, this.margin.top]);


    this.y = d3
      .scaleLinear()
      .domain([0, yDimention])
      .nice()
      .range([this.height - this.margin.bottom, this.margin.top]);

    this.line = d3
      .line()
      .defined(d => !Number.isNaN(d.value))
      .x(d => this.x(new Date(d.time)))
      .y(d => this.y(d.value));

    this.color = d3.scaleOrdinal()
      .domain(['Cámara de entrada', 'Cámara de salida'])
      .range(['red', 'steelblue']);

    const gw = svg.selectAll('g')
      .data(this.color.domain())
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(${this.width - this.margin.left * 2.55},${this.height * 0.13 + i * 26})`);

    gw.append('rect')
      .attr('width', 18)
      .attr('height', 18)
      .attr('fill', this.color);

    gw.append('text')
      .attr('x', 24)
      .attr('y', 9)
      .attr('dy', '0.35em')
      .text(d => d);


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


    const makeXGridLines = () => d3.axisBottom(this.x)
      .ticks(8);
    const makeYGridLines = () => d3.axisLeft(this.y)
      .ticks(8);
    svg.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${this.height - this.margin.bottom})`)
      .style('stroke-dasharray', ('0.2,1'))
      .call(makeXGridLines()
        .tickSize(-(this.height - this.margin.bottom))
        .tickFormat(''));

    svg.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(${this.margin.left},0)`)
      .style('stroke-dasharray', ('0.2,1'))
      .call(makeYGridLines()
        .tickSize(-(this.width - this.margin.left))
        .tickFormat(''));


    if (showOption === 'rain') {
      svg
        .append('g')
        .attr('transform', `translate(${this.width},0)`)
        .call(d3.axisRight(this.yRain))
        .call(g => g.select('.domain').remove())
        .call(g => g
          .select('.tick:last-of-type text')
          .clone()
          .attr('x', 3)
          .attr('text-anchor', 'start')
          .attr('font-weight', 'bold'));

      svg.append('text')
        .attr('transform',
          `translate(${this.width + (this.margin.left) / 2} ,${this.height / 2})rotate(-90)`)
        .style('text-anchor', 'middle')
        .text('Precipitación mm/hr');

      svg.append('g')
        .attr('fill', 'steelblue')
        .selectAll('rect')
        .data(rain)
        .enter()
        .append('rect')
        .attr('x', d => this.xRain(getFullTime(d.time)))
        .attr('y', this.margin.top)
        .attr('height', d => this.yRain(d.value) - this.margin.top)
        .attr('width', this.xRain.bandwidth());
    }


    svg.append('text')
      .attr('transform',
        `translate(${this.width / 2} ,${this.height + this.margin.top + 6})`)
      .style('text-anchor', 'middle')
      .text('Hora');

    svg.append('text')
      .attr('transform',
        `translate(${this.margin.left / 2} ,${this.height / 2})rotate(-90)`)
      .style('text-anchor', 'middle')
      .text(labelY);

    this.color = (name) => {
      switch (name) {
        case 'entrada':
          return 'red';
        case 'salida':
          return 'steelblue';
        default:
          return 'steelblue';
      }
    };

    svg
      .append('g')
      .selectAll('path')
      .data(series)
      .enter()
      .append('path')
      .style('mix-blend-mode', 'multiply')
      .attr('fill', 'none')
      .attr('stroke', d => this.color(d.name))
      .attr('stroke-width', 1.5)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('d', d => this.line(d.values));
  }

  render() {
    const { height, width } = this.state;
    const widthSvg = width < 400 ? width * 0.9 : width * 0.7;
    const heightSvg = height < 690 ? height * 0.7 : height * 0.6;
    return (
      <Grid container direction="column" alignItems="center" spacing={0}>
        <Grid item xs={12}>
          <svg
            id="realTimeGraph"
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

export default DinamicGraph;

DinamicGraph.propTypes = {
  rain: PropTypes.instanceOf(Object).isRequired,
  conductivity: PropTypes.instanceOf(Object).isRequired,
  level: PropTypes.instanceOf(Object).isRequired,
  showOption: PropTypes.bool.isRequired,
};
