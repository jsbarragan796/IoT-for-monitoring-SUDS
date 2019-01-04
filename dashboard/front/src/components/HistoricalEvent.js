import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const styles = {
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
};

class HistoricalEvent extends Component {
  constructor (props) {
    super(props);
    this.margin = {
      top: 20,
      right: 30,
      bottom: 30,
      left: 40
    };
    this.drawGraph = this.drawGraph.bind(this);
  }

  componentDidMount () {
    this.drawGraph();
  }

  drawGraph () {
    const { event } = this.props;
    const { entry, exit } = event;
    const dates1 = entry.map(d => new Date(d.time));
    const dates2 = exit.map(d => new Date(d.time));
    const allDates = dates1.concat(dates2).sort((a, b) => d3.ascending(a, b));
    const dates = allDates.filter((elem, index, self) => index === self.indexOf(elem));
    const series = [{ name: 'entrada', values: entry }, { name: 'salida', values: exit }];
    const svg = d3.select(this.svg);
    this.height = svg.attr('height') - this.margin.top - this.margin.bottom;
    this.width = svg.attr('width') - this.margin.left - this.margin.right;
    this.aspect = this.width / this.height;
    this.x = d3.scaleTime()
      .domain(d3.extent(dates, d => d))
      .range([this.margin.left, this.width - this.margin.right]);

    d3.select(window)
      .on('resize', () => {
        const targetWidth = svg.node().getBoundingClientRect().width;
        svg.attr('width', targetWidth);
        svg.attr('height', targetWidth / this.aspect);
      });

    this.y = d3.scaleLinear()
      .domain([0, Math.max(d3.max(entry, d => d.value), d3.max(exit, d => d.value))]).nice()
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

    const path = svg.append('g')
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

      const dot = svg.append('g')
        .attr('display', 'none');

      dot.append('circle')
        .attr('r', 2.5);

      dot.append('text')
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
          const closestA = a.values.reduce((ac, cv) => {
            const cvTime = new Date(cv.time).getTime();
            const acTime = new Date(ac.time).getTime();
            if (date >= cvTime) {
              return Math.max(cvTime, acTime) === acTime ? ac : cv;
            }
            return acTime === new Date(0).getTime() ? cv : ac;
          },
          { time: new Date(0), value: undefined });

          const closestB = b.values.reduce((ac, cv) => {
            const cvTime = new Date(cv.time).getTime();
            const acTime = new Date(ac.time).getTime();
            if (date >= cvTime) {
              return Math.max(cvTime, acTime) === acTime ? ac : cv;
            }
            return acTime === new Date(0).getTime() ? cv : ac;
          },
          { time: new Date(0), value: undefined });
          return (
            Math.abs(closestA.value - ym) < Math.abs(closestB.value - ym)
              ? { serie: a, value: closestA } : { serie: b, value: closestB });
        });
        // path.attr('stroke', d => (d === s.serie ? null : '#ddd'))
        // .filter(d => d === s.serie).raise();
        dot.attr('transform', `translate(${this.x(new Date(s.value.time))},${this.y(s.value.value)})`);
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
        svg.style('-webkit-tap-highlight-color', 'transparent')
          .on('touchmove', moved)
          .on('touchstart', entered)
          .on('touchend', left);
      } else {
        svg.on('mousemove', moved)
          .on('mouseenter', entered)
          .on('mouseleave', left);
      }
    };
    svg.call(hover, path);
  }

  render () {
    const { event } = this.props;
    const { classes } = this.props;
    const options = {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    };
    const date = new Date(Number(event.startDate.substr(0, 13))).toLocaleDateString('es-US', options);
    return (
      <Grid item sx={6}>

        <Card>
          <CardHeader
            title={`Evento registrado el ${date}`}
          />

          <CardContent>
            <Paper>
              <svg
                width="300"
                height="300"
                ref={(svg) => { this.svg = svg; return this.svg; }}
              >
              vizualización
              </svg>
            </Paper>

            <Grid container spacing={8}>
              <Grid item xs={12}>
                <Grid item container direction="row">
                  <Grid item xs={6} direction="column">
                    <Typography variant="h5" color="inherit">
                      Entrada
                    </Typography>
                    <Typography variant="h6" color="inherit">
                      <strong>
                          Volumen :
                      </strong>
                      {` ${Math.ceil(event.volumeInput)} l³`}
                    </Typography>
                    <Typography variant="h6" color="inherit">
                      <strong>
                          Caudal pico :
                      </strong>
                      {` ${Math.ceil(event.peakInputFlow)} l/s`}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} direction="column">
                    <Typography variant="h5" color="inherit">
                      Salida
                    </Typography>
                    <Typography variant="h6" color="inherit">
                      <strong>
                          Volumen :
                      </strong>
                      {` ${Math.ceil(event.volumeOutput)} l³`}
                    </Typography>
                    <Typography variant="h6" color="inherit">
                      <strong>
                          Caudal pico :
                      </strong>
                      {` ${Math.ceil(event.peakOutFlow)} l/s`}
                    </Typography>

                  </Grid>
                  <Grid item xs={12} direction="column">
                    <Typography variant="h6" color="inherit">
                      <strong>
                          Eficiencia :
                      </strong>
                      {` ${Math.ceil(event.efficiency)} %`}
                    </Typography>

                    <Typography variant="h6" color="inherit">
                      <strong>
                          Reducción del caudal pico :
                      </strong>
                      {` ${Math.ceil(event.reductionOfPeakFlow)} %`}
                    </Typography>

                    <Typography variant="h6" color="inherit">
                      <strong>
                          Duración:
                      </strong>
                      {` ${Math.floor(event.duration)}:${Math.floor((event.duration - Math.floor(event.duration)) * 60)} horas`}
                    </Typography>

                  </Grid>
                </Grid>
              </Grid>
            </Grid>

          </CardContent>
        </Card>
      </Grid>
    );
  }
}

HistoricalEvent.propTypes = {
  event: PropTypes.instanceOf(Object).isRequired,
  classes: PropTypes.instanceOf(Object).isRequired
};

export default withStyles(styles)(HistoricalEvent);
