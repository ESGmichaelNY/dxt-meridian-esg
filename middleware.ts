import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks/clerk(.*)',
]);

// Define routes that require organization selection
const isOrganizationRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/reports(.*)',
  '/settings(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  // Protect all routes except public ones
  if (!isPublicRoute(request)) {
    await auth.protect();
    
    // Check if organization is required for this route
    if (isOrganizationRoute(request)) {
      const { orgId } = await auth();
      
      // Redirect to organization selection if no org is selected
      if (!orgId) {
        const organizationsUrl = new URL('/organizations', request.url);
        organizationsUrl.searchParams.set('redirect_url', request.url);
        return Response.redirect(organizationsUrl);
      }
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};