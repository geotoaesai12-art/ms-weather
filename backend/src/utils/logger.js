// Safe logger: only plain messages and short metadata. Never pass secrets, URLs with keys, or stack traces to visitors.
function write(level, message, meta) {
  const line = { time: new Date().toISOString(), level, message, ...(meta ?? {}) };
  const out = level === 'error' ? console.error : console.log;
  out(JSON.stringify(line));
}

export const logger = {
  info: (message, meta) => write('info', message, meta),
  warn: (message, meta) => write('warn', message, meta),
  error: (message, meta) => write('error', message, meta),
};
