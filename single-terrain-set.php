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

<style>
	body {
		background-color: <?php the_field('background_color'); ?>;
	}
</style>

<?php get_template_part('navigation', 'Main Navigation'); ?>

<?php
// Start the loop.
while ( have_posts() ) : the_post(); ?>

<header class="hero-container container content grid-container flex-column" style="background-image: url('<?php echo $backgroundImg[0]; ?>');">
	<div class="hero-headline grid-container justify-content-center">
	  <h1 class="title align-self-center">Planet: <?php
		foreach((get_the_category()) as $category) {
			echo $category->cat_name . ' ';
		}
		?>
		<span class="subhead">War Zone: <?php the_title(); ?></span></h1>
	</div>
	<nav class="breadcrumb grid-container justify-content-end">
	  <a class="breadcrumb-item" href="<?php echo esc_url( home_url( '/' ) ); ?>">Home</a>
	  <a class="breadcrumb-item" href="<?php echo get_page_link( 19 ); ?>">Terrain Sets</a>
	  <span class="breadcrumb-item active"><?php the_title(); ?></span>
	</nav>
</header>

<?php
	/*
	 * Include the post format-specific template for the content. If you want to
	 * use this in a child theme, then include a file called called content-___.php
	 * (where ___ is the post format) and that will be used instead.
	 */

	get_template_part( 'post-templates/terrain/post/content', get_post_format() );

<<<<<<< Updated upstream
	// If comments are open or we have at least one comment, load up the comment template.
	if ( comments_open() || get_comments_number() ) :
		comments_template();
	endif;

	// Previous/next post navigation.
	the_post_navigation( array(
		'next_text' => '<span class="meta-nav" aria-hidden="true">' . __( 'Next', 'faultline' ) . '</span> ' .
			'<span class="screen-reader-text">' . __( 'Next post:', 'faultline' ) . '</span> ' .
			'<span class="post-title">%title</span>',
		'prev_text' => '<span class="meta-nav" aria-hidden="true">' . __( 'Previous', 'faultline' ) . '</span> ' .
			'<span class="screen-reader-text">' . __( 'Previous post:', 'faultline' ) . '</span> ' .
			'<span class="post-title">%title</span>',
	) );
=======
>>>>>>> Stashed changes

// End the loop.
endwhile;
?>

<?php get_footer(); ?>
