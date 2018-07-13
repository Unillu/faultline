<?php
/**
 * The main post template file
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

<div class="color-primary">
  <section class="container section">
	<?php
	// Start the loop.
	while ( have_posts() ) : the_post();
		/*
		 * Include the post format-specific template for the content. If you want to
		 * use this in a child theme, then include a file called called content-___.php
		 * (where ___ is the post format) and that will be used instead.
		 */

		get_template_part( 'post-templates/content', get_post_format() );

		// If comments are open or we have at least one comment, load up the comment template.
		if ( comments_open() || get_comments_number() ) :
			comments_template();
		endif;

		// Previous/next post navigation.
		the_post_navigation( array(
			'next_text' => '<span class="meta-nav" aria-hidden="true">' . __( 'Next', 'faultline' ) . '</span> ' .
				'<span class="screen-reader-text">' . __( ':', 'faultline' ) . '</span> ' .
				'<span class="post-title">%title</span>',
			'prev_text' => '<span class="meta-nav" aria-hidden="true">' . __( 'Previous', 'faultline' ) . '</span> ' .
				'<span class="screen-reader-text">' . __( ':', 'faultline' ) . '</span> ' .
				'<span class="post-title">%title</span>',
		) );

	// End the loop.
	endwhile;
	?>
</section>
</div>

<?php get_footer(); ?>