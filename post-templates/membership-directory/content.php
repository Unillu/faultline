<?php
/**
 * Template part for displaying member posts on the membership directory page
 *
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package Faultline
 * @since 1.0
 * @version 1.0
 */

// vars
$army40k = get_field('armies_40k');
$army30k = get_field('armies_30k');

?>

<div class="grid-xs-col12 grid-md-col6 grid-lg-col4">
	<a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>" class="block-link">
		<figure class="membership-info card">
		  	<div class="membership-image">
		  		<span class="profile button button-secondary">See Profile</span>
				<?php
					if (has_post_thumbnail()) {

						the_post_thumbnail();
					}
				?>
			</div>

			<figcaption class="membership-caption">
			  <div class="membership-name">
				<p class="description"><?php the_title(); ?></p>
			  </div>
				<div class="army-logos">
					<?php
					if ($army40k):
						echo "<p class='army-logo-list'><span class='army-type'>40K</span>";
					foreach( $army40k as $army40k_faction ):

					$patterns = array ('/\s+/', '/\'/');
					$replace = array ('-', '');

					$string = preg_replace($patterns, $replace, $army40k_faction);
					$class = strtolower($string);

					?>
					<span class="army-faction <?php echo ( $class ); ?>"></span>

					<?php endforeach; echo "</p>"; endif; ?>

					<?php
					if ($army30k):
						echo "<p class='army-logo-list'><span class='army-type'>30K</span>";
					foreach( $army30k as $army30k_faction ):

					$patterns = array ('/\s+/', '/\'/');
					$replace = array ('-', '');

					$string = preg_replace($patterns, $replace, $army30k_faction);
					$class = strtolower($string);

					?>
					<span class="army-faction <?php echo ( $class ); ?>"></span>

					<?php endforeach; echo "</p>"; endif; ?>
			  </div>
			  <div class="membership-place">
				<p class="location"><span class="icon icon-marker"></span> <?php echo get_field('member_location')['label']; ?></p>
			  </div>
			</figcaption>
		</figure>
	</a>
</div>
