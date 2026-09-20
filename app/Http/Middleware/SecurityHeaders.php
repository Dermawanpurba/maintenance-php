<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Handle an incoming request and attach hardened HTTP security headers.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // 1. HTTP Strict Transport Security (HSTS)
        $response->headers->set(
            'Strict-Transport-Security',
            'max-age=31536000; includeSubDomains; preload'
        );

        // 2. Content Security Policy (CSP)
        $csp = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; font-src 'self' https: data:; img-src 'self' data: https: blob:; connect-src 'self' https: wss:; frame-ancestors 'self';";
        $response->headers->set('Content-Security-Policy', $csp);

        // API dataset harus selalu dibaca ulang agar perubahan Filament langsung
        // terlihat di React dan tidak tertahan cache browser/proxy/CDN.
        if ($request->is('api/*')) {
            $response->headers->set('Cache-Control', 'no-store, no-cache, must-revalidate, private, max-age=0');
            $response->headers->set('Pragma', 'no-cache');
            $response->headers->set('Expires', '0');
        }

        // 3. Clickjacking & MIME Sniffing Protection
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('Referrer-Policy', 'no-referrer-when-downgrade');
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
        $response->headers->set('X-XSS-Protection', '1; mode=block');

        return $response;
    }
}
