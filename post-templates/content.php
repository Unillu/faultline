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
$url = 'http://' . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];
$rows = get_field('additional_content');
$size = 'full';
$date = get_the_time( 'F j, Y');
?>

<div class="blog-post">

	<header class="hero-container container content grid-container flex-column" style="background-image: url('<?php echo $background; ?>');">
		<h1 class="blog-post-title"><?php the_title(); ?></h1>
		<?php if ( strpos($url,'facebook-event') == false ) { ?>
			<p class="blog-post-meta">By <?php the_author(); ?>, <span class="blog-post-date">Published <?php echo $date; ?> </span></p>
		<?php } ?>
	</header>
	<section class="section content grid-container flex-column">
		<?php the_content(); ?>
		<?php
		// check if the repeater field has rows of data
		if($rows): {

			foreach($rows as $row):
			$images = $row['gallery'];
			$content = $row['content'];

			?>

			<div class="grid-container blog-gallery">
				<?php if ($images): {

					$i = 0;
					foreach( $images as $image ):

						$i++ ?>
						<div class="grid-xs-col12 grid-md-col6 blog-gallery-image">
							<figure>
								<?php echo wp_get_attachment_image( $image['ID'], $size ); ?>
								<figcaption class="blog-gallery-image-caption"><?php echo $image['caption']; ?></figcaption>
							</figure>
						</div>

					<?php endforeach;
				}

				endif; ?>

			</div>

			<?php

				if ($content): {
					echo $content;
				}

				endif;

			endforeach;
		}
		endif;
	?>
	</section>

</div><!-- /.blog-post -->