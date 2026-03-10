# Vercel Speed Insights Setup Guide

This guide documents how Vercel Speed Insights is configured in the SurvivusMC website project.

## Overview

Vercel Speed Insights is already enabled and integrated into this project. The implementation follows the HTML/Static Site approach as outlined in the official Vercel documentation.

## Current Implementation

The Speed Insights integration has been added to `index.html` with the following configuration:

### Scripts Added

Two script tags have been added before the closing `</body>` tag:

```html
<script>
  window.si =
    window.si ||
    function () {
      (window.siq = window.siq || []).push(arguments);
    };
</script>
<script defer src="/_vercel/speed-insights/script.js"></script>
```

These scripts:
1. Initialize the Speed Insights queue if it doesn't exist
2. Load the Speed Insights tracking script asynchronously from Vercel's CDN

## Prerequisites Met

- ✅ Vercel account configured
- ✅ Vercel project created
- ✅ Speed Insights enabled in Vercel dashboard
- ✅ Speed Insights script integrated into HTML

## Deployment

The application is deployed to Vercel. Once deployed, Speed Insights will automatically begin tracking performance metrics including:

- Core Web Vitals (LCP, FID, CLS)
- Page load times
- Performance metrics from real user sessions

## Monitoring Performance

To view Speed Insights data:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select the SurvivusMC project
3. Click the **Speed Insights** tab
4. View real-time performance metrics from visitor sessions

## Data Collection

- Speed Insights only collects data from real visitor sessions
- All data is privacy-compliant and follows Vercel's standards
- Collection begins automatically after each deployment

## Notes

- The `/_vercel/speed-insights/script.js` endpoint becomes available after deployment
- Initial data may take a few days to accumulate
- Performance metrics are collected passively without impacting user experience

## Additional Resources

- [Vercel Speed Insights Documentation](https://vercel.com/docs/speed-insights)
- [Understanding Web Vitals](https://web.dev/vitals/)
- [Vercel Privacy Policy](https://vercel.com/legal/privacy-policy)

## Future Enhancements

If this project evolves to use a JavaScript framework (Next.js, React, Vue, etc.), the Speed Insights implementation can be upgraded to use framework-specific packages:

- **Next.js**: `@vercel/speed-insights/next`
- **React**: `@vercel/speed-insights/react`
- **Vue**: `@vercel/speed-insights/vue`
- **Astro**: `@vercel/speed-insights/astro`
- **And others** (SvelteKit, Remix, Nuxt, etc.)

These packages provide better integration and additional configuration options.
