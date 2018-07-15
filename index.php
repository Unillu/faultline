<?php
/**
 * The main template file for the blog
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

		<header class="hero-container grid-container align-items-end">
			<div class="container">
				<div class="hero-headline grid-xs-col-12 grid-md-col7 grid-md-offset-col1">
					<h1><?php echo get_the_title(495); ?></h1>
				</div>
			</div>
		</header>

		<?php get_template_part('categories', 'Categories'); ?>

		<?php
		if ( have_posts() ) : while ( have_posts() ) : the_post();

			get_template_part( 'post-templates/blog/content', get_post_format() );

		endwhile; endif;
		?>

		<?php get_template_part('categories', 'Categories'); ?>

<?php get_footer(); ?>