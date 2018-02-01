<?php
/**
 * Template part for displaying posts
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

?>

<div class="blog-post">

	<header class="hero-container container content grid-container flex-column" style="background-image: url('<?php echo $background; ?>');">
		<h1 class="blog-post-title"><?php the_title(); ?></h1>
	</header>
	<section class="section content grid-container flex-column">
		<?php the_content(); ?>
	</section>

</div><!-- /.blog-post -->