<?php
/**
 * Template part for single post terrain set body
 *
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package Faultline
 * @since 1.0
 * @version 1.0
 */

?>

<section class="container section content flavor-intro">

	<div class="grid-container">
		<div class="grid-xs-col12 grid-md-col9 grid-md-offset-col1">
			<h2 class="terrain-title"><?php the_field('terrain_subhead') ?></h2>
		</div>
		<div class="grid-xs-col12 grid-md-col8 grid-md-offset-col1">
			<?php the_content();?>
		</div>
		<div class="img-tile">
			<img src="<?php the_field('image_tile');?>" alt=" " />
		</div>
	</div>
</section>

<?php

$images = get_field('flavor_gallery');
$size = 'full'; // (thumbnail, medium, large, full or custom size)

if( $images ): ?>
<section class="container section content flavor-gallery">
	<div class="grid-container">
		<div class="grid-xs-col12 grid-md-col10 grid-md-offset-col1">
			<div id="flavorGallery" class="carousel slide" data-ride="carousel">
			  <ol class="carousel-indicators">
			    <li data-target="#flavorGallery" data-slide-to="0" class="active"></li>
			    <li data-target="#flavorGallery" data-slide-to="1"></li>
			    <li data-target="#flavorGallery" data-slide-to="2"></li>
			  </ol>
			  <div class="carousel-inner" role="listbox">


			  		<?php $i = 0; ?>
				  	<?php foreach( $images as $image ): ?>

					<?php $i++ ?>

				    <div class="carousel-item <?php if( $i ==1 ){ echo "active"; } ?>">
				    	<?php echo wp_get_attachment_image( $image['ID'], $size ); ?>
				    </div>

				    <?php endforeach; ?>

			  </div>
			</div>
		</div>
	</div>

</section>
<?php endif; ?>

<section class="container section content">
	<div class="grid-container">
		<div class="grid-xs-col12 grid-md-col10 grid-md-offset-col1 terrain-specs">
			<h3 class="terrain-title location">Current Location: <span class="icon icon-marker"></span> <?php echo get_field('terrain_location')['value']; ?></h3>
			<figure class="terrain-mat">
				<img src="<?php the_field('terrain_mat');?>" alt=" " />
				<figcaption class="terrain-mat-description">
					The Mat: <?php the_field('mat_description') ?>
				</figcaption>
			</figure>

			<h3 class="terrain-title">Suggested Rules for This Terrain:</h3>

			<?php if( have_rows('terrain_rules') ): ?>


			<ul class="terrain-rules">

				<?php while( have_rows('terrain_rules') ): the_row();

					// vars
					$terrain_rule = get_sub_field('terrain_rule');
					$terrain_rule_description = get_sub_field('terrain_rule_description');

					?>

				<li><span class="terrain-name"><?php echo $terrain_rule; ?>:</span>  <?php echo $terrain_rule_description; ?>
				</li>

				<?php endwhile; ?>

			</ul>

			<?php endif; ?>

			<h3 class="terrain-title">Individual Terrain Pieces:</h3>

			<?php if( have_rows('terrain_pieces') ): ?>

			<ul class="terrain-rules">

				<?php while( have_rows('terrain_pieces') ): the_row();

					// vars
					$terrain_piece_image = get_sub_field('terrain_piece_image');
					$terrain_piece_name = get_sub_field('terrain_piece_name');
					$terrain_piece_description = get_sub_field('terrain_piece_description');

					?>

				<li class="terrain-rules-item">
					<div class="terrain-rules-image">
						<img src="<?php echo $terrain_piece_image['url']; ?>">
					</div>
					<div class="terrain-rules-description">
						<h4 class="terrain-name"><?php echo $terrain_piece_name; ?></h4>
						<p><?php echo $terrain_piece_description; ?></p>
					</div>
				</li>
				<?php endwhile; ?>

			</ul>

			<?php endif; ?>

			<p class="return-button">
				<a href="<?php echo get_page_link( 19 ); ?>" class="button button-dark">Back to All Boards</a>
			</p>

		</div>
	</div>
</section>
