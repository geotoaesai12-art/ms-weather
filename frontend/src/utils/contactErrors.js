// Turns a failed contact request into one friendly sentence for the visitor.
export function describeContactError(err) {
  switch (err?.code) {
    case 'INVALID_INPUT':
      return err.detail || 'Please check your details and try again.';
    case 'RATE_LIMITED':
      return 'You have sent several messages already. Please try again in a few minutes.';
    case 'NETWORK':
      return 'You seem to be offline. Please check your internet connection and try again.';
    case 'REQUEST_TIMEOUT':
    case 'UPSTREAM_TIMEOUT':
      return 'Sending took too long. Please try again.';
    default:
      return 'We could not send your message right now. Please try again later.';
  }
}
