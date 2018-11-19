import React, { Component } from 'react';
import './App.css';
import { Decimal } from 'decimal.js';
import 'typeface-roboto';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import createBreakpoints from "@material-ui/core/styles/createBreakpoints";

const commas = /\B(?=(\d{3})+(?!\d))/g;
const breakpoints = createBreakpoints({});
const theme = createMuiTheme({
  breakpoints,
  overrides: {
    MuiTypography: {
      h1: {
        fontSize: pxToRem(50),
        [breakpoints.up("sm")]: {
          fontSize: pxToRem(100)
        }
      },
      h3: {
        fontSize: pxToRem(30),
        [breakpoints.up("sm")]: {
          fontSize: pxToRem(45)
        }
      },
      h4: {
        fontSize: pxToRem(28),
        [breakpoints.up("sm")]: {
          fontSize: pxToRem(33)
        }
      }
    }
  }
});

class App extends Component {

  state = {
    number: new Decimal(0),
    clicks: 0,
    speed: new Decimal(0),
    cost: new Decimal(0),
    lastClick: new Date().getTime(),
    numberAtLastClick: new Decimal(0)
  }

  componentWillMount() {
    setTimeout(() => {
      let clicks = localStorage.getItem("clicks");
      clicks = clicks === null ? 0 : clicks;
      let lastClick = localStorage.getItem("lastClick")
      lastClick = lastClick === null ? new Date().getTime() : lastClick;
      let numberAtLastClick = localStorage.getItem("numberAtLastClick")
      numberAtLastClick = numberAtLastClick === null ? 0 : numberAtLastClick;
      this.setState({
        clicks: +clicks,
        lastClick: +lastClick,
        numberAtLastClick: new Decimal(numberAtLastClick),
        speed: this.getSpeed(clicks),
        cost: this.getCost(clicks)
      })
    });
    setInterval(() => {
      this.setState({
        number: this.getNumber()
      })
    }, 50);
    setInterval(() => {
      localStorage.setItem("lastClick", this.state.lastClick);
      localStorage.setItem("numberAtLastClick", this.state.numberAtLastClick);
      localStorage.setItem("clicks", this.state.clicks);
    }, 500)
  }

  updateSpeed(clicks) {
    this.setState({
      speed: this.getSpeed(clicks),
      cost: this.getCost(clicks),
      clicks: clicks
    });
  }

  getSpeed(clicks) {
    return new Decimal(2.5).toPower((clicks) * 0.1).minus(0.9)
  }

  getCost(clicks) {
    return new Decimal(Math.ceil(clicks / 10)).times(this.getSpeed(clicks)).times(3)
  }

  clickButton() {
    this.setState({
      numberAtLastClick: this.getNumber().minus(this.getCost(this.state.clicks)),
      lastClick: new Date().getTime()
    });
    this.updateSpeed(this.state.clicks + 1);
  }

  getNumber() {
    return this.state.numberAtLastClick.plus(this.state.speed.times((new Date().getTime() - this.state.lastClick) / 1000))
  }

  render() {
    return (
        <div className="App">
          <CssBaseline />
          <MuiThemeProvider theme={theme}>
            <Grid container direction="column" justify="center" alignItems="center" style={{ height: "100%" }}>
              <Grid item>
                <Typography variant="h3" className="reponsiveFont">
                  NUMBER
            </Typography>
                <Typography component="h2" variant="h1">
                  {this.state.number.greaterThan(100) ? this.state.number.toFixed(0).replace(commas, ",") : this.state.number.toFixed(2)}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  {
                    //format(+this.state.number)
                  }
                </Typography>
                <Typography variant="h3">
                  NUMBER GO UP SPEED
             </Typography>
                <Typography component="h2" variant="h1">
                  {this.state.speed.greaterThan(100) ? this.state.speed.toFixed(0).replace(commas, ",") : this.state.speed.toFixed(2)}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  {
                    //format(+this.state.speed)
                  }
                </Typography>
              </Grid>
              <Grid item xs={2}></Grid>
              <Grid item>
                <Button variant="contained" size="large" color="primary" onClick={() => this.clickButton()} disabled={this.state.number.lessThan(this.state.cost)} style={{ fontSize: "2em" }}>
                  Make number go up faster
            </Button>
                <Typography variant="subtitle2" gutterBottom>
                  {this.state.number.lessThan(this.state.cost) ? "(not enough number)" : " "}
                </Typography>
                <Typography variant="h4">
                  COST: {this.state.cost.greaterThan(100) ? this.state.cost.toFixed(0).replace(commas, ",") : this.state.cost.toFixed(2)} NUMBER
            </Typography>
              </Grid>
            </Grid>
            <footer>
              <Typography variant="overline" gutterBottom style={{color: "grey"}}>
               2018 — made with ❤ by quantum development
              </Typography>
            </footer>
          </MuiThemeProvider>
        </div>
    );
  }
}


export default App;

const words = [' thousand', ' million', ' billion', ' trillion', ' quadrillion', ' quintillion', ' sextillion', ' septillion', ' octillion', ' nonillion'];
const prefixes = ['', 'un', 'duo', 'tre', 'quattuor', 'quin', 'sex', 'septen', 'octo', 'novem'];
const suffixes = ['decillion', 'vigintillion', 'trigintillion', 'quadragintillion', 'quinquagintillion', 'sexagintillion', 'septuagintillion', 'octogintillion', 'nonagintillion'];
for (let i in suffixes) {
  for (let u in prefixes) {
    words.push(' ' + prefixes[u] + suffixes[i]);
  }
}

function format(value) {
  if (value < 1000) {
    return "";
  }
  let base = 0,
    notationValue = '';
  if (!isFinite(value)) return 'Infinity';
  if (value >= 1000000) {
    value /= 1000;
    while (Math.round(value) >= 1000) {
      value /= 1000;
      base++;
    }
    if (base >= words.length) { return 'Infinity'; } else { notationValue = words[base]; }
  }
  return new Decimal(value).toFixed(1) + notationValue;
};

function pxToRem(value) {
  return `${value / 16}rem`;
}