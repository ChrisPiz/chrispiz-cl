import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((ctx, next) => {
  const { pathname } = ctx.url;

  // Spanish is the default site at '/'. English lives at '/en'.
  // Only a manual choice (cookie set by the language toggle) redirects to English.
  if (pathname === '/') {
    const cookieLang = ctx.cookies.get('lang')?.value;
    if (cookieLang === 'en') return ctx.redirect('/en');
  }
  return next();
});
