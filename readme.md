# HRV Components

A collection of components for use in heart rate monitoring apps.

## Usage -- web page
Put these tags 

```
<script type="module" src="https://unpkg.com/hrvcomponents@0.7.3/dist/hrvcomponents/hrvcomponents.esm.js"></script>
<script nomodule="" src="https://unpkg.com/hrvcomponents@0.7.3/dist/hrvcomponents/hrvcomponents.js"></script
```
in the head of your index.html

## Usage -- Ionic/Angular

Install the package

```
npm install --save hrvcomponents
```

The main steps are:

1. Include the `CUSTOM_ELEMENTS_SCHEMA` in the modules that use the components.
2. Call `defineCustomElements(window)` from `main.ts` (or some other appropriate place).

See the [Stencil docs](https://stenciljs.com/docs/angular)
for a walk-through. 
## Other frameworks

Install the package

```
npm install --save hrvcomponents
```

Then in `main.ts` or the equivalent,

```
import { defineCustomElements } from 'test-components/dist/loader';
defineCustomElements(window);
```

See details for your framework at the [Stencil docs](https://stenciljs.com/docs/overview) under `Framework Integrations.` For example, in a Vue app, you may need to config ignored elements.


# API

## `<breath-circle>`

The component is helpful for guiding breathing rates. It displays a circle which grows and shrinks at a controllable rate; you simply time your inhales/exhales to the growth/shrinking of the circle.

[Demo it here](https://s3.eu-central-1.amazonaws.com/moodhealer.com/breathing/index.html)

Examples:

```
<breath-circle></breath-circle >
```
```
<breath-circle base-rate="3000"></breath-circle > 
```
```
<breath-circle inhale-time="4000" exhale-time="4000" inhale-hold-time="1200" exhale-hold-time="3000" is-verbose="true"></breath-circle >
```



## Properties

Most properties set the time for the stages in the breathing cycle, in milliseconds.

| Property         | Attribute          | Description                                                                                                                                             | Type      | Default     |
| ---------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------- |
| `baseRate`       | `base-rate`        | If set, overrides inhale/exhale times and sets hold times to 100ms | `number`  | `undefined` |
| `inhaleTime`     | `inhale-time`      |                                                                                                                                                         | `number`  | `2000` |
| `inhaleHoldTime` | `inhale-hold-time` |                                                                                                                                                         | `number`  | `100` |
| `exhaleTime`     | `exhale-time`      |                                                                                                                                                         | `number`  | `2000` |
| `exhaleHoldTime` | `exhale-hold-time` |                                                                                                                                                         | `number`  | `100` |
| `isVerbose`      | `is-verbose`       |     Toggles console messaging of changes to the different times.                                                                                                                                                    | `boolean` | `false` |


----------------------------------------------

*Built with [Stenciljs](stenciljs.com/docs/getting-started)*


