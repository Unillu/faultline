<?php
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

if (has_post_thumbnail()) {

	$background = get_the_post_thumbnail_url();

}

get_header(); ?>

		<?php get_template_part('navigation', 'Main Navigation'); ?>

		<div class="container">
			<header class="hero-container grid-container align-items-end"  style="background-image: url('<?php echo $background; ?>'); background-repeat: no-repeat; background-size: cover;">
					<div class="hero-headline grid-xs-col-12 grid-md-col7 grid-md-offset-col1">
						<h1 class="page-post-title"><?php the_title(); ?></h1>

						<?php
						if ( have_posts() ) : while ( have_posts() ) : the_post();

							the_content();

						endwhile; endif;
						?>
					</div>
			</header>
		</div>

		<section class="container section page-post">
			<div class="grid-container">
				<?php the_field('page_content') ?>
			</div>
		</section>

<?php get_footer(); ?>