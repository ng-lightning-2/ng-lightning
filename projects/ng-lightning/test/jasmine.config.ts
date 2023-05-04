import { toHaveCssClass, toHaveText } from './jasmine.matchers';

// Timeouts
jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000;

// Matchers
beforeEach(() => {
  jasmine.addMatchers({
    toHaveCssClass,
    toHaveText,
  });
});
