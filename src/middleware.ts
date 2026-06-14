import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((ctx, next) => {
  const { pathname } = ctx.url;

  // only act on the root EN path; /es and assets pass through
  if (pathname === '/') {
    const cookieLang = ctx.cookies.get('lang')?.value;
    if (cookieLang === 'es') return ctx.redirect('/es');
    if (cookieLang === 'en') return next();

    const accept = ctx.request.headers.get('accept-language') ?? '';
    if (accept.toLowerCase().startsWith('es')) return ctx.redirect('/es');
  }
  return next();
});
