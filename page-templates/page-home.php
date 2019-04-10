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
			<div class="hero-headline align-self-end">
				<h1 class="title"><?php echo get_bloginfo( 'name' ); ?> <span class="subhead"><?php echo get_bloginfo( 'description' ); ?></span></h1>
				<a href="<?php echo get_page_link( 15 ); ?>" class="button button-secondary">Our Principles</a>
			</div>
			<div class="home-hero-bottom-mask"></div>
			<div id="scene" class="home-parallax">
				<div data-depth="0.4" class="home-hero-parallax-2"></div>
				<div data-depth="0.3" class="home-hero-parallax-1"></div>
				<div data-depth="0.2" class="home-hero-sun"></div>
				<img data-depth="0.7" class="fighter fighter-baddie" name="baddie" src=""/>
				<img data-depth="0.9" class="fighter fighter-goodie" name="goodie" src=""/>
			</div>
		</header>

		<!-- Event banner -->

		<div class="color-secondary">
		  <section class="container maelstrom-event-home-section section">
		  	<h2 class="font-primary maelstrom-home-header">Join us for the first ever</h2>
			<div class="maelstrom-hero"></div>
			<a href="<?php echo get_page_link( 977 ); ?>" class="button button-dark">Buy Your Tickets</a>
		  </section> <!-- /.container -->
		</div>

		<!-- end Event banner -->

		<div class="color-primary">
		  <section class="container events section">
			<h2 class="font-secondary">Current Events</h2>

			<div class="grid-container"><?php the_field('events'); ?></div> <!-- /.grid-container -->

		  </section> <!-- /.container -->
		</div>

<?php get_footer(); ?>