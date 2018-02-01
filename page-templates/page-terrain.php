<?php /* Template Name: Terrain Page Template */
/**
 * The main page template file
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
					<?php
					if ( have_posts() ) : while ( have_posts() ) : the_post();

						get_template_part( 'post-templates/content', 'terrain-set' );

					endwhile; endif;
					?>
				</div>
			</div>
		</header>

		<section class="container section">
			<div class="grid-container">

			<?php
				$args = array( 'post_type' => 'terrain-set', 'posts_per_page' => 12 );
				$loop = new WP_Query( $args );
				while ( $loop->have_posts() ) : $loop->the_post();

				  get_template_part( 'post-templates/terrain/content', get_post_format() );

				endwhile;
			?>
			</div>
		</section>

<?php get_footer(); ?>
