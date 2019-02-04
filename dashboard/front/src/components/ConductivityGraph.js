import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { saveSvgAsPng } from 'save-svg-as-png';
import Grid from '@material-ui/core/Grid';
import SaveAlt from '@material-ui/icons/SaveAlt';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

class ConductivityGraph extends Component {
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

    this.color = d3.scaleOrdinal()
      .domain(['Cámara de entrada', 'Cámara de salida'])
      .range(['olivedrab', 'midnightblue']);


    const gw = svg.selectAll('g')
      .data(this.color.domain())
      .enter().append('g')
      .attr('transform', (d, i) => `translate(${this.width - this.margin.left * 2},${this.height * 0.1 + i * 26})`);

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

    svg.append('text')
      .attr('transform',
        `translate(${this.width / 2} ,${this.height + this.margin.top + 6})`)
      .style('text-anchor', 'middle')
      .text('Hora');

    svg.append('text')
      .attr('transform',
        `translate(${this.margin.left / 2} ,${this.height / 2})rotate(-90)`)
      .style('text-anchor', 'middle')
      .text('Conductividad μS/cm ');

    svg.append('text')
      .attr('transform', `translate(${this.width / 2} ,${this.margin.top + 10})`)
      .attr('text-anchor', 'middle')
      .style('font-size', '24px')
      .text('Conductividad de la escorrentía');

    this.color = (name) => {
      switch (name) {
        case 'entrada':
          return 'olivedrab';
        case 'salida':
          return 'midnightblue';
        default:
          return 'olivedrab';
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
      <Grid container direction="column" alignItems="center" spacing={0}>
        <Grid item xs={10}>
          <svg
            id="conductivity"
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
          <Tooltip title="Descargar gráfica" placement="bottom">
            <IconButton
              onClick={() => { saveSvgAsPng(document.querySelector('#conductivity'), 'conductividad', { scale: 3 }); }}
              className="marginRight: 'auto'"
              aria-label="descargar"
            >
              <SaveAlt />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    );
  }
}

export default ConductivityGraph;

ConductivityGraph.propTypes = {
  data: PropTypes.instanceOf(Array).isRequired,
  data2: PropTypes.instanceOf(Array).isRequired
};
