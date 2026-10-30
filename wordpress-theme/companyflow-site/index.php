<?php
/**
 * Theme entry point. The build workflow bundles the original Vite/React site
 * in /app so the complete original UI can be served from WordPress.
 */
if (!defined('ABSPATH')) { exit; }
if (function_exists('cf_original_render_app')) {
    cf_original_render_app();
    return;
}
?><!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>CompanyFlow</title><?php wp_head(); ?></head><body><main><h1>CompanyFlow</h1><p>The bundled CompanyFlow application is not present yet. Download the WordPress package produced by the GitHub Actions workflow.</p></main><?php wp_footer(); ?></body></html>
