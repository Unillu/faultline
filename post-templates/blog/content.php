<?php
/**
 * Template part for displaying collection of posts
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

$rows = get_field('additional_content');
$size = 'full';
?>

<section class="container section">
	<div class="grid-container">
		<div class="blog-post">

			<a href="<?php echo esc_url( get_permalink() ); ?>">
				<header class="hero-container container content grid-container flex-column" style="background-image: url('<?php echo $background; ?>');">
					<h2 class="blog-post-title"><?php the_title(); ?></h2>
					<p class="blog-post-meta">By <?php the_author(); ?><span class="blog-post-date"><?php the_date( '', ', Published ', '' ); ?> </span></p>
				</header>
			</a>
			<section class="section content grid-container flex-column">
				<?php the_content(); ?>
			</section>

		</div><!-- /.blog-post -->
	</div>
</section>

