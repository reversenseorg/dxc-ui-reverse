# Pro GUI for Dexcalibur 

This UI is desiogned for security professionals / reverser.


## 1. Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

To have a behavior close to development server with final dexcalibur server context, please use : `ng build --watch --output-path=<DEXALIBUR_WWW>/pro/ --base-href=/pro/`

If *dxc-ui-reverse* repository and *dexcalibur-codebase* are located into the same parent folder, you can run this command:
```
ng build --watch --output-path=$PWD/../dexcalibur-codebase/dexcalibur-ts/dist/src/webserver/www/pro/ --base-href=/pro/
```

### 1.A Database

Some signatures are stored into external DBMS such as MongoDB database. 

To use privacy scan, ensure a mongodb instance is running and configured.
```
mongod --dbpath $HOME/dxc/db_data/mongodb
```


## 2. Build


To build for DxSecurity, just run  :
```
ng build --base-href /pro/ && ln -s $PWD/dist/dxc-ui-reverse <WEBSTORM_WORKSPACE>/dexcalibur-codebase/dexcalibur-ts/dist/src/webserver/www/pro
```

## 3. Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## 4. Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## 5. Troubleshoot

### Blank Screen / WSOD

If you experiment a blank screen (WSOD), please verify the URL ends with `/#/home`.

## 6. Bonus 

Particle animations
```
$particleSize: 20vmin;
$animationDuration: 6s;
$amount: 20;
div.screen span.dxcanim {
  width: $particleSize;
  height: $particleSize;
  border-radius: $particleSize;
  backface-visibility: hidden;
  position: absolute;
  z-index:0;
  animation-name: move;
  animation-duration: $animationDuration;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  $colors: (
    #583C87,
    #E45A84,
    #FFACAC
  );
  @for $i from 1 through $amount {
    &:nth-child(#{$i}) {
      color: nth($colors, random(length($colors)));
      top: random(100) * 1%;
      left: random(100) * 1%;
      animation-duration: (random($animationDuration * 10) / 10) * 1s + 10s;
      animation-delay: random(($animationDuration + 10s) * 10) / 10 * -1s;
      transform-origin: (random(50) - 25) * 1vw (random(50) - 25) * 1vh;
      $blurRadius: (random() + 0.5) * $particleSize * 0.5;
      $x: if(random() > 0.5, -1, 1);
      box-shadow: ($particleSize * 2 * $x) 0 $blurRadius currentColor;
    }
  }
}

@keyframes move {
  100% {
    transform: translate3d(0, 0, 1px) rotate(360deg);
  }
}

```