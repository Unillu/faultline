<?php
/**
/**
 * Template Name: Member Profile
 * @package materialwp
 * @subpackage Faultline
 * @since Material Design WordPress Theme
 *
 *
 */

get_header(); ?>

<?php

// vars
$location = get_field('faultline_location');
$image = get_field('profile_image');
$size = 'medium'; // (thumbnail, medium, large, full or custom size)
$armies = array('armies_space-marines', 'armies_chaos-space-marines', 'armies_chaos-daemons');

?>

<div class="container">
	<div class="row">

		<div id="primary" class="col-sm-12">
			<main id="main" class="site-main" role="main">

				<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

					<div class="entry-container">
						<div class="entry-content member-content">
							<h1 class="entry-title"><?php the_title_attribute(); ?></h1>
							<a href="http://www.facebook.com/<?php the_field('facebook_profile'); ?>" class="button" target="_blank">Contact <?php the_field('nickname'); ?></a>

							<p class="battle-cry"><?php the_field('battle_cry'); ?></p>
							<?php // profile image

							if( $image ) {
								echo wp_get_attachment_image( $image, $size );
							}
							?>

							<?php // armies

							foreach ($armies as $army) {
								$game = get_field($army);
								$faction = get_field_object($army);

								// echo '<pre>';
								// 	var_dump( $army );
								// echo '</pre>';

								if( $game['value'] != 'neither' ): ?>
									<p class="<?php echo $army; ?> <?php echo $game['value']; ?>"><?php echo $faction['label']; ?>: <?php echo $game['label']; ?></p>
								<?php endif; ?>
							<?php
							}

							?>

								<?php //chaos factions

								// vars
								$chaos = get_field('armies_forces-of-chaos');

								// check
								echo '<pre>';
									var_dump( $chaos );
								echo '</pre>';

								if( $chaos ): ?>
								<p><?php echo implode(', ', $chaos); ?></p>
								<?php endif; ?>


							<p>Location: <span class="location-<?php echo $location['value']; ?>"><?php echo $location['label']; ?></span></p>

							<h2>What made you want to join Faultline?</h2>
							<p><?php the_field('why_join_faultline'); ?></p>

							<?php  // question 2

							$question = get_field('favorite_army');

							if( !empty($question) ): ?>

								<h2>Which army that you play is your favorite?</h2>
								<p><?php the_field('favorite_army'); ?></p>

							<?php endif; ?>

							<?php // question 3

							$question = get_field('first_warhammer_army');

							if( !empty($question) ): ?>

								<h2>Tell us about your first Warhammer army.</h2>
								<p><?php the_field('first_warhammer_army'); ?></p>

							<?php endif; ?>

							<?php // question 4

							$question = get_field('great_game_of_warhammer');

							if( !empty($question) ): ?>

								<h2>What do you think makes for a great game of Warhammer?</h2>
								<p><?php the_field('great_game_of_warhammer'); ?></p>

							<?php endif; ?>

							<?php // question 5

							$question = get_field('like_to_try');

							if( !empty($question) ): ?>

								<h2>Are there any armies you haven't played but would like to try out?</h2>
								<p><?php the_field('like_to_try'); ?></p>

							<?php endif; ?>

						</div>

						<footer class="entry-footer">
							<?php materialwp_entry_footer(); ?>
						</footer><!-- .entry-footer -->
					</div> <!-- .entry-container -->
				</article><!-- #post-## -->

			</main><!-- #main -->
		</div><!-- #primary -->

	</div> <!-- .row -->
</div> <!-- .container -->

<?php get_footer(); ?>
