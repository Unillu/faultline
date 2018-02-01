<?php
/**
 * Template part for displaying terrain posts on the terrrain page (excerpts)
 *
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package Faultline
 * @since 1.0
 * @version 1.0
 */

?>

<div class="grid-xs-col12 grid-md-col6 grid-lg-col4">
	<a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>" class="block-link">
		<figure class="terrain-info card">
			<h2 class="name"><?php the_title(); ?></h2>
		  	<div class="terrain-image">
				<?php
					if (has_post_thumbnail()) {

						the_post_thumbnail();
					}
				?>
			</div>

			<figcaption class="terrain-caption">
				<div class="terrain-details">
					<div class="description"><?php the_excerpt(); ?></div>
				</div>
				<div class="terrain-place">
					<p class="location"><span class="icon icon-marker"></span> <?php echo get_field('terrain_location')['value']; ?></p>
				</div>
			</figcaption>
		</figure>
	</a>
</div>
