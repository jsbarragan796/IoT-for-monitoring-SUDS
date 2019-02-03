import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { Row, Col } from 'reactstrap';

class EventsRealTime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 600,
      height: 300
    };
    this.margin = {
      top: 10,
      right: 10,
      bottom: 20,
      left: 30
    };
    this.drawGraph = this.drawGraph.bind(this);
    this.updateGraph = this.updateGraph.bind(this);
    this.currentSize = this.currentSize.bind(this);
  }

  componentDidMount() {
    this.drawGraph();
    this.currentSize();
    window.addEventListener('resize', this.currentSize);
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
    const { data, data2 } = this.props;
    const dates1 = data.map(d => new Date(d.time));
    const dates2 = data2.map(d => new Date(d.time));
    const allDates = dates1.concat(dates2).sort((a, b) => d3.ascending(a, b));
    const dates = allDates.filter((elem, index, self) => index === self.indexOf(elem));
    const series = [{ name: 'entrada', values: data }, { name: 'salida', values: data2 }];
    const svg = d3.select(this.svg);
    this.height = svg.attr('height') - this.margin.top - this.margin.bottom;
    this.width = svg.attr('width') - this.margin.left - this.margin.right;

    this.x = d3
      .scaleTime()
      .domain(d3.extent(dates, d => d))
      .range([this.margin.left, this.width - this.margin.right]);

    this.y = d3
      .scaleLinear()
      .domain([0, Math.max(d3.max(data, d => d.value), d3.max(data2, d => d.value))])
      .nice()
      .range([this.height - this.margin.bottom, this.margin.top]);

    this.line = d3
      .line()
      .defined(d => !Number.isNaN(d.value))
      .x(d => this.x(new Date(d.time)))
      .y(d => this.y(d.value));

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

    this.color = (name) => {
      switch (name) {
        case 'entrada':
          return 'steelblue';
        case 'salida':
          return 'red';
        default:
          return 'steelblue';
      }
    };

    const path = svg
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

    const hover = () => {
      svg.style('position', 'relative');

      const dot = svg.append('g').attr('display', 'none');

      dot.append('circle').attr('r', 2.5);

      dot
        .append('text')
        .style('font', '10px sans-serif')
        .attr('text-anchor', 'middle')
        .attr('y', -8);

      const moved = () => {
        d3.event.preventDefault();

        const ym = this.y.invert(d3.event.layerY);
        const xm = this.x.invert(d3.event.layerX);
        const i1 = d3.bisectLeft(dates, xm, 1);
        const i0 = i1 - 1;
        const i = xm - dates[i0] > dates[i1] - xm ? i1 : i0;
        const s = series.reduce((a, b) => {
          const date = dates[i].getTime();
          const closestA = a.values.reduce(
            (ac, cv) => {
              const cvTime = new Date(cv.time).getTime();
              const acTime = new Date(ac.time).getTime();
              if (date >= cvTime) {
                return Math.max(cvTime, acTime) === acTime ? ac : cv;
              }
              return acTime === new Date(0).getTime() ? cv : ac;
            },
            { time: new Date(0), value: undefined },
          );

          const closestB = b.values.reduce(
            (ac, cv) => {
              const cvTime = new Date(cv.time).getTime();
              const acTime = new Date(ac.time).getTime();
              if (date >= cvTime) {
                return Math.max(cvTime, acTime) === acTime ? ac : cv;
              }
              return acTime === new Date(0).getTime() ? cv : ac;
            },
            { time: new Date(0), value: undefined },
          );
          return Math.abs(closestA.value - ym) < Math.abs(closestB.value - ym)
            ? { serie: a, value: closestA }
            : { serie: b, value: closestB };
        });
        // path.attr('stroke', d => (d === s.serie ? null : '#ddd'))
        // .filter(d => d === s.serie).raise();
        dot.attr(
          'transform',
          `translate(${this.x(new Date(s.value.time))},${this.y(s.value.value)})`,
        );
        dot.select('text').text(Number(s.value.value).toFixed(3));
      };
      const entered = () => {
        // path.style('mix-blend-mode', null).attr('stroke', '#ddd');
        dot.attr('display', null);
      };

      const left = () => {
        // path.style('mix-blend-mode', 'multiply').attr('stroke', null);
        dot.attr('display', 'none');
      };

      if ('ontouchstart' in document) {
        svg
          .on('touchmove', moved)
          .on('touchstart', entered)
          .on('touchend', left);
      } else {
        svg
          .on('mousemove', moved)
          .on('mouseenter', entered)
          .on('mouseleave', left);
      }
    };
    svg.call(hover, path);
  }

  render() {
    const { height, width } = this.state;
    const widthSvg = width < 400 ? width * 0.9 : width * 0.7;
    const heightSvg = height < 690 ? height * 0.7 : height * 0.6;
    return (
      <div className="center-div">
        <Row>
          <Col sm="12" className="centered">
            <svg
              width={widthSvg}
              height={heightSvg}
              ref={(svg) => {
                this.svg = svg;
                return this.svg;
              }}
            >
              vizualización
            </svg>
          </Col>
        </Row>
      </div>
    );
  }
}

export default EventsRealTime;

EventsRealTime.propTypes = {
  data: PropTypes.instanceOf(Array).isRequired,
  data2: PropTypes.instanceOf(Array).isRequired
};
