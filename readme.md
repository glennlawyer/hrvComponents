# HRV Components

A collection of components for use in heart rate monitoring apps

## Usage -- web page
Put this tag 
```
<script src='https://unpkg.com/FOOBAR@0.7.0/dist/myname.js'></script> 
```
in the head of your index.html

## Usage -- Ionic

Install the package

```
npm install --save FOOBAR
```

Add a schemas property above the imports property:
```
schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
```

Import CUSTOM_ELEMENTS_SCHEMA in your app.module.ts file:

```
import { ErrorHandler, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
```
