<?php
/**
 * Template part for terrain post body content
 *
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package Faultline
 * @since 1.0
 * @version 1.0
 */

$backgroundImg = wp_get_attachment_image_src( get_post_thumbnail_id($post->ID), 'full' );

get_header(); ?>

<?php get_template_part('navigation', 'Main Navigation'); ?>

<?php
// Start the loop.
while ( have_posts() ) : the_post(); ?>

<header class="hero-container grid-container align-items-end">
	<div class="container">
		<nav class="breadcrumb grid-container justify-content-end">
		  <a class="breadcrumb-item" href="<?php echo esc_url( home_url( '/' ) ); ?>">Home</a>
		  <a class="breadcrumb-item" href="<?php echo get_page_link( 17 ); ?>">Member Directory</a>
		  <span class="breadcrumb-item active"><?php the_title(); ?></span>
		</nav>
	</div>
</header>

<?php
	/*
	 * Include the post format-specific template for the content. If you want to
	 * use this in a child theme, then include a file called called content-___.php
	 * (where ___ is the post format) and that will be used instead.
	 */

	get_template_part( 'post-templates/membership-directory/post/content', get_post_format() );

// End the loop.
endwhile;
?>

<?php get_footer(); ?>
