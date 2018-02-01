<?php
/**
 * The main template file
 *
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package Faultline
 * @since 1.0
 * @version 1.0
 */

get_header(); ?>

		<?php get_template_part('navigation', 'Main Navigation'); ?>

		<?php
		if ( have_posts() ) : while ( have_posts() ) : the_post();

			get_template_part( 'post-templates/content', get_post_format() );

		endwhile; endif;
		?>

<?php get_footer(); ?>