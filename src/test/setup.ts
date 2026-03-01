import '@testing-library/jest-dom/vitest';

/** Подавляем известное предупреждение React при async act() в Vitest (флаг IS_REACT_ACT_ENVIRONMENT не подхватывается для бандла React из node_modules). */
const suppressActEnvWarning = (method: 'warn' | 'error') => {
  const original = console[method];
  console[method] = (...args: unknown[]) => {
    const msg = typeof args[0] === 'string' ? args[0] : String(args[0]);
    if (msg.includes('not configured to support act')) return;
    original.apply(console, args);
  };
};
suppressActEnvWarning('warn');
suppressActEnvWarning('error');
