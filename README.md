# ng-lightning

This library is a version of the original library ng-lightning.

This library contains native [Angular](https://angular.io/) components and directives written from scratch in TypeScript using the [Lightning Design System](https://www.lightningdesignsystem.com/) CSS framework.


## Installation

Install through `npm`:

```bash
npm install --save @analystik/ng-lightning
```

#### Dependencies
This library depends on Salesforce's LDS markup and CSS (tested with 2.9). We don't ship any CSS file, but you have to take care of including LDS CSS rules in your page. There are various ways to achieve this, for example compiling through their source files ([`@salesforce-ux/design-system`](https://github.com/salesforce-ux/design-system)) or by adding this into your `<head>`:

```html
<link rel="stylesheet" href="https://unpkg.com/@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.min.css">
```

#### SVG Icons
Because of various cross-domain issues, if you want to use SLDS icons, you must provide a copy of the various sprite files (ie `@salesforce-ux/design-system/assets/icons/action-sprite/svg/symbols.svg`), served locally through your server.

#### IE11 support
Unfortunately, IE11 does not support two important features.

* [SVG External Content](https://css-tricks.com/svg-use-with-external-reference-take-2/), used to load SVG icons from a spritemap. In order to support this, you will need to use a small script called [svg4everybody](https://github.com/jonathantneal/svg4everybody).  
Available on npm cdn [here](https://unpkg.com/svg4everybody).

* `Element.classList` on SVG elements, used by Angular's `renderer.setElementClass`. See [here](https://github.com/angular/angular/issues/6327) for more information. Use [classList.js](https://github.com/eligrey/classList.js) shim, available on npm cdn [here](https://unpkg.com/classlist.js).

Typically, these shims should be placed within the `<head>` element.  


## Browsers

We support the same browsers and versions supported by both Angular and Salesforce's Lightning Design System.  
Cross browser/environment testing is performed through [Saucelabs](https://saucelabs.com/).  
