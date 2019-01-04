/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import 'react-datepicker/dist/react-datepicker.css';

import {
  Row,
  Col,
  InputGroup,
  InputGroupAddon,
  Input,
  Label,
  FormFeedback,
  Button

} from 'reactstrap';

class Filter extends Component {
  constructor (props) {
    super(props);
    this.state = {

    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange (date) {
    console.log(date);
    this.setState({
      startDate: date
    });
  }

  render () {
    const { data } = this.state;
    return (
      <Col>
        <Row>
          <div>
            <h2>
                Filtros:
            </h2>
          </div>
        </Row>
        <Row>
          <br />

          <br />
          <Label for="exampleSelect">
            Eficiencia reducción caudal pico.
          </Label>
          <InputGroup>
            <Input type="number" min="0" max="100" step="1" placeholder="min" />
            <FormFeedback valid tooltip>
                Sweet! that name is available
            </FormFeedback>
            <InputGroupAddon addonType="append">
            -
            </InputGroupAddon>
            <Input type="number" min="0" max="100" step="1" placeholder="max" />
            <InputGroupAddon addonType="append">
              <Button color="info">
                  Aplicar
              </Button>
            </InputGroupAddon>
          </InputGroup>
          <br />
          <Label for="exampleSelect">
            Eficiencia reducción caudal pico.
          </Label>
          <br />
          <InputGroup>
            <Input type="number" min="0" max="100" step="1" placeholder="min" />
            <FormFeedback valid tooltip>
                Sweet! that name is available
            </FormFeedback>
            <InputGroupAddon addonType="append">
            -
            </InputGroupAddon>
            <Input type="number" min="0" max="100" step="1" placeholder="max" />
            <InputGroupAddon addonType="append">
              <Button color="info">
                  Aplicar
              </Button>
            </InputGroupAddon>
          </InputGroup>
          <br />
          <Label for="exampleSelect">
            Eficiencia reducción caudal pico.
          </Label>
          <br />
          <InputGroup>
            <Input type="number" min="0" max="100" step="1" placeholder="min" />
            <FormFeedback valid tooltip>
                Sweet! that name is available
            </FormFeedback>
            <InputGroupAddon addonType="append">
            -
            </InputGroupAddon>
            <Input type="number" min="0" max="100" step="1" placeholder="max" />
            <InputGroupAddon addonType="append">
              <Button color="info">
                  Aplicar
              </Button>
            </InputGroupAddon>
          </InputGroup>
          <br />
          <Label for="exampleSelect">
            Eficiencia reducción caudal pico.
          </Label>
          <br />
          <InputGroup>
            <Input type="number" min="0" max="100" step="1" placeholder="min" />
            <FormFeedback valid tooltip>
                Sweet! that name is available
            </FormFeedback>
            <InputGroupAddon addonType="append">
            -
            </InputGroupAddon>
            <Input type="number" min="0" max="100" step="1" placeholder="max" />
            <InputGroupAddon addonType="append">
              <Button color="info">
                  Aplicar
              </Button>
            </InputGroupAddon>
          </InputGroup>
          <br />
          <Label for="exampleSelect">
            Eficiencia reducción caudal pico.
          </Label>
        </Row>
      </Col>
    );
  }
}

export default Filter;
