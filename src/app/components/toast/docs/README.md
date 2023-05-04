Toast serves as a feedback & confirmation mechanism after the user takes an action.

By default, toasts are shown relative to where they have been specified in markup. For *fixed-to-the-top* just place them inside a `<div>` decorated with the `'slds-notify_container'` class.

You can bind to `(close)` to be apprised of when the close button has been clicked.

You can set the `[duration]` attribute to a positive integer (in milliseconds, including 0) to set a timeout for automatically closing. If the binding changes, any previous timeout is canceled and if the new binding is valid as described above, a new timeout is set to that number.
