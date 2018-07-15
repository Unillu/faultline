<?php
/**
 * The template for displaying archive pages.
 *
 * Learn more: http://codex.wordpress.org/Template_Hierarchy
 *
 * @package Faultline
 */

$category = get_queried_object();

get_header(); ?>

	<?php if ( have_posts() ) : ?>

		<?php get_template_part('navigation', 'Main Navigation'); ?>

			<header class="hero-container grid-container align-items-end">
				<div class="container">
					<div class="hero-headline grid-xs-col-12 grid-md-col7 grid-md-offset-col1">
						<h1>Category: <?php echo $category->name; ?></h1>
					</div>
				</div>
			</header>

		<?php /* Start the Loop */ ?>
		<?php while ( have_posts() ) : the_post(); ?>

			<?php
				/* Include the Post-Format-specific template for the content.
				 * If you want to override this in a child theme, then include a file
				 * called content-___.php (where ___ is the Post Format name) and that will be used instead.
				 */
				get_template_part( 'post-templates/blog/content', get_post_format() );
			?>

		<?php endwhile; ?>
		<section class="section container">
			<a class="button button-dark" href="<?php echo get_permalink( get_option( 'page_for_posts' ) ); ?>">Back to All Blog Posts</a>
		</section>
	<?php else : ?>

		<?php get_template_part( 'content', 'none' ); ?>

	<?php endif;

get_footer(); ?>
