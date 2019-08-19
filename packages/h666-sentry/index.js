export default {
  captureException (error) {
    if (typeof Raven !== 'undefined') {
      // eslint-disable-next-line
      Raven.captureException(error)
    }
    else if (typeof Sentry !== 'undefined') {
      // eslint-disable-next-line
      Sentry.captureException(error)
    }
    else {
      console.warn(error)
    }
  }
}
