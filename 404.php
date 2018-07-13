<?php
/**
 * The template for displaying 404 pages (not found)
 *
 * @link https://codex.wordpress.org/Creating_an_Error_404_Page
 *
 * @package Faultline
 * @since 1.0
 * @version 1.0
 */

get_header(); ?>

<?php get_template_part('navigation', 'Main Navigation'); ?>

<div class="container">
	<section id="primary" class="post-404 section">
		<div class="grid-xs-col12">
			<h1 class="page-post-title">All systems are not go.</h1>
			<p>We can't find what you were looking for. It probably doesn't exist yet!</p>
		</div>
	</section>
</div>

<?php get_footer(); ?>
