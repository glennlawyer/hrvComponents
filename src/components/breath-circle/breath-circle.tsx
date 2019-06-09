import { Component, h, Prop, State, Element, Watch } from '@stencil/core';

import { select } from 'd3-selection';
import { transition } from 'd3-transition';
import { interpolateHslLong } from 'd3-interpolate';
import { timeout } from 'd3-timer';
// import { timer } from 'd3-timer';
import { easeCubic } from 'd3-ease';
// import { easeBack } from 'd3-ease';
// import { easeBackOut } from 'd3-ease';
import { hsl } from 'd3-color';
import { scaleLinear } from 'd3-scale';

enum Stage {
    inhale, exhale
}

@Component({
  tag: 'breath-circle',
  styleUrl: 'breath-circle.scss',
  shadow: true
})
export class BreathCircle {

  /**
   * static components
   *
   */
  breathCircle
  maxRadius: number = 112
  minRadius: number = 5
  inhaleColor: string = '#2AB321'
  exhaleColor: string = '#007ADD'
  minRate: number = 500 // the minimum inhale/exhale rate
  maxRate: number = 3 * 60 * 1000 // the maximum inhale/exhale rate

  /**
   * 2. Public API
   * Sets the rate (in miliseconds) for each point in the cycle.
   * Use baseRate to set/override inhale/exhale at once.
   *
   * All times in miliseconds
   */
  /**
   * @Description foobar
   **/
  @Prop() baseRate: number
  @Prop() inhaleTime: number = 4000
  @Prop() inhaleHoldTime: number = 500
  @Prop() exhaleTime: number = 4000
  @Prop() exhaleHoldTime: number = 500

  @Watch('baseRate')
  setBaseRate(newRate: number) {
    if(newRate >= this.minRate && newRate <= this.maxRate){
    console.log( "changing base rate to", newRate, "miliseconds" )
    this.inhaleTime = newRate
    this.exhaleTime = newRate
    }
  }

  // animation related variables
	@Element() svgElem: HTMLElement
  timerCount: number = 0
  colorChangeTime = 1000

  inhaleToExScale = scaleLinear().domain([0,this.colorChangeTime])
  .range([this.inhaleColor, this.exhaleColor])
  .interpolate(interpolateHslLong)
  .clamp(true)

  exhaleToInScale = scaleLinear().domain([0,this.colorChangeTime])
  .range([this.exhaleColor, this.inhaleColor])
  .interpolate(interpolateHslLong)
  .clamp(true)

  mEase = easeCubic
  // mEase = easeBack
  // mEase = easeBackOut //.overshoot(1.1)

	@State() gradientStops = [
		{ offset:   '0%', stopColor: "#EFEFF4" },
		{ offset:  '90%', stopColor: "#DDDDE4" },
		{ offset: '100%', stopColor: "#222255" }
	];

  private computeGradientStops(color: string, extrabright?: boolean){
    // let sColor= d3Color.hsl(color)
    let sColor= hsl(color)
    let gstops = [
      { offset:   '0%', stopColor: sColor.brighter(3).hex() },
      // { offset:   '0%', stopColor: sColor.brighter(3).hex() },
      { offset: extrabright ? '60%' : '50%',
        stopColor: sColor.brighter(1).hex() },
        // stopColor: sColor.brighter(1).hex() },
      { offset: extrabright ? '80%' : '70%', stopColor: sColor.hex() },
      { offset: extrabright ? '118%' : '98%',
        stopColor: sColor.darker(1).hex() },
      { offset: extrabright ? '120%' : '100%',
        stopColor: sColor.darker(1.9).hex() }
    ]
    return gstops
  }


  componentWillLoad(){
    console.log('Hello Breath Circle Component');
    this.gradientStops = this.computeGradientStops(this.inhaleColor)
    if(this.baseRate){
      this.setBaseRate(this.baseRate)
    }
	}

  componentDidLoad(){
    let root = this.svgElem.shadowRoot
    this.breathCircle = select(root).select("#breathRateCircle")
    this.breathCircle.attr('r', this.maxRadius)
    this.shrinkCircle()
    // stop linter from complaining
    let foo = transition
    foo()
    // end linter hack
  }

  // STATE MACHINE:
  //   Each function calls the next one in the lineup
  growCircle(){
    let delay = Math.max(this.inhaleTime, this.colorChangeTime)
    this.timerCount = 0 // safety
    this.changeColor(Stage.inhale)
    this.breathCircle.transition()
      .duration(delay)
      .attr('r',this.maxRadius)
      .on("end", () => {
        timeout(this.shrinkCircle.bind(this), this.inhaleHoldTime)
      })
    // .on("end", this.shrinkCircle.bind(this))
  }

  shrinkCircle(){
    let delay = Math.max(this.inhaleTime, this.colorChangeTime)
    this.timerCount = 0 // safety
    this.changeColor(Stage.exhale)
    this.breathCircle.transition()
      .duration(delay)
      .attr('r', this.minRadius)
      .on("end", () => {
        timeout(this.growCircle.bind(this), this.exhaleHoldTime)
      })
      // .on("end", this.growCircle.bind(this))
  }


  // transition the gradient
  changeColor(direction: Stage){
    let timerInterval = 25
    if(this.timerCount < this.colorChangeTime) {
      this.timerCount += timerInterval
      this.adjustGradient(direction, this.timerCount)
      timeout(() => {
         this.changeColor(direction)
      }, timerInterval)
    } else { // noop
    }
  }

  // direction is the direction being entered.
  // So if it is entering Stage.inhale, the current
  // color is assumed to be exhaleColor, and the
  // transition is from exhale to inhale color
  adjustGradient(direction: Stage, step: number){
    let betweenColor = this.exhaleToInScale(step)
    if (direction === Stage.exhale) {
      betweenColor = this.inhaleToExScale(step)
    }
    this.gradientStops = this.computeGradientStops(betweenColor)
  }


  render() {
		return (
<div class="breath-circle-wrapper">
  <svg id="svgObj" width="100%" viewBox="0 0 260 260" >
    <defs>
	    <radialGradient id="BreathGradient"  cx='52%' cy='52%' r='100%'>
	    {this.gradientStops.map(stop => {
	      return (
	        <stop
	          offset={ stop.offset }
	          stop-color={ stop.stopColor }>
	        </stop>
	      )
	    })}
	    </radialGradient>
    </defs>
    <circle cx="130" cy="130" r="5" fill="url(#BreathGradient)"
      id="breathRateCircle"></circle>
    <circle cx="130" cy="130" r="115" fill="none" stroke="#000000" stroke-width="2"></circle>
  </svg>
</div>
		)
  }
}

  // private ruby() {
  //   let gstops = [
  //     { offset:   '0%', stopColor: d3Color.rgb(color).brighter(3).toString() },
  //     { offset: extrabright ? '60%' : '50%',
  //       stopColor: d3Color.rgb(color).brighter(1) },
  //     { offset: extrabright ? '80%' : '70%', stopColor: color },
  //     { offset: extrabright ? '120%' : '100%',
  //       stopColor: d3Color.rgb(color).darker(1) }
  //   ]
  //   return gstops
  // }


  // growCircle(stage: Stage){
  //   let drift = Date.now() - this.expectedTime
  //   if(drift > this.timerInterval) {
  //     // TODO bail out
  //   }
  //   let radiusStep: number
  //   switch(stage){
  //       case Stage.inhale: { radiusStep = 1 }
  //       case Stage.inpause: { radiusStep = 0 }
  //       case Stage.exhale: { radiusStep = -1 }
  //       case Stage.expause: { radiusStep = 0 }
  //   }
  //   let currentRadius: number =  Number(this.breathCircle.attr('r'))
  //   this.breathCircle.attr('r', currentRadius + radiusStep)
  //   let driftStep = Math.max(0, this.timerInterval - drift)
  //   if(currentRadius > 113) {
  //     setTimeout(this.growCircle(Stage.inhale).bind(this), driftStep)
  //   } else {
  //     setTimeout(this.growCircle(Stage.exhale).bind(this), driftStep)
  //   }
  // }
