<?php /* Template Name: Home Page Template */ ?>

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

		<?php get_template_part('./navigation', 'Main Navigation'); ?>

		<header class="hero-container grid-container justify-content-center">
			<div class="hero-headline align-self-center">
				<h1 class="title"><?php echo get_bloginfo( 'name' ); ?> <span class="subhead"><?php echo get_bloginfo( 'description' ); ?></span></h1>
				<a href="<?php echo get_page_link( 15 ); ?>" class="button button-primary">Our Principles</a>
			</div>
		</header>

<!-- 		<?php
		//if ( have_posts() ) : while ( have_posts() ) : the_post();

		//	get_template_part( 'post-templates/content', get_post_format() );

		//endwhile; endif;
		?> -->

		<div class="color-primary">
		  <section class="container events section">
			<h2 class="font-secondary">Current Events</h2>

			<div class="grid-container">

				<?php the_field('events'); ?>

			</div> <!-- /.grid-container -->

		  </section> <!-- /.container -->
		</div>

<?php get_footer(); ?>