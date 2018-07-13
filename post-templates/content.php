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

$rows = get_field('additional_content');
$size = 'full';
?>

<div class="blog-post">

	<header class="hero-container container content grid-container flex-column" style="background-image: url('<?php echo $background; ?>');">
		<h1 class="blog-post-title"><?php the_title(); ?></h1>
		<p class="blog-post-meta">By <?php the_author(); ?><span class="blog-post-date"><?php the_date( '', ', Published ', '' ); ?> </span></p>
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
						<div class="grid-xs-col12 grid-md-col6">
							<?php echo wp_get_attachment_image( $image['ID'], $size ); ?>
							<?php echo $image['caption']; ?>
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