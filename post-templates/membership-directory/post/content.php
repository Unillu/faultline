<?php
/**
 * Template part for single post membership set body
 *
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package Faultline
 * @since 1.0
 * @version 1.0
 */

$army40k = get_field('armies_40k');
$army40k_adeptus_astartes = get_field('40k_adeptus_astartes');
$army40k_imperium = get_field('40k_imperium');
$army40k_chaos_space_marines = get_field('40k_chaos_space_marines');
$army40k_aeldari = get_field('40k_aeldari');
$army40k_tyranids = get_field('40k_tyranids');

$army30k = get_field('armies_30k');
$army30k_traitors = get_field('30k_traitors');
$army30k_imperial = get_field('30k_imperial');
$army30k_mechanicum = get_field('30k_mechanicum');
$army30k_loyalist = get_field('30k_loyalist');

$location = get_field('member_location')[value];

$question_1 = get_field('question_1');
$question_2 = get_field('question_2');
$question_3 = get_field('question_3');
$question_4 = get_field('question_4');
$question_5 = get_field('question_5');

$facebook_profile = get_field('facebook_profile');

?>

  <section class="container section">

	<div class="grid-container">

		<div class="grid-xs-col12 grid-md-col4">
			<div class="member-profile-card">
				<div class="member-frame">
						<?php if( $location == 'east_bay' ): ?>
							<span class="icon-eb"></span>
						<?php elseif( $location == 'silicon_valley' ): ?>
							<span class="icon-sv"></span>
						<?php endif; ?>
					<div class="member-image">
						<?php
							if (has_post_thumbnail()) {

								the_post_thumbnail();
							}
						?>
					</div>
				</div>
				<h1 class="member-name"><?php the_title(); ?></h1>
				<?php
					if ($facebook_profile):
					?>
					<p class="member-contact">
						<a href="<?php the_field('facebook_profile') ?>" class="button button-secondary" target="_blank">Contact <?php the_field('nickname') ?></a>
					</p>
				<?php endif; ?>
			</div>


			<?php
			if ($army40k):
			?>
			<h3 class="member-army-header">40K Armies:</h3>
			<div class="member-armies">
				<ul class="fortyk army-list">
					<?php foreach( $army40k as $army40k_faction ):

					$patterns = array ('/\s+/', '/\'/');
					$replace = array ('-', '');

					$string = preg_replace($patterns, $replace, $army40k_faction);
					$class = strtolower($string);

					?>

					<li class="army-faction <?php echo ( $class ); ?>"><h4><?php echo ( $army40k_faction ); ?></h4>

						<?php if ( $army40k_faction == 'Adeptus Astartes' ): ?>
							<ul class="army-faction-list">
							<?php foreach( $army40k_adeptus_astartes as $adeptus_astartes ): ?>
								<li class="army-faction-item"><?php echo ( $adeptus_astartes ); ?></li>
							<?php endforeach; ?>
							</ul>

						<?php elseif ( $army40k_faction == 'Imperium' ): ?>
							<ul class="army-faction-list">
							<?php foreach( $army40k_imperium as $imperium ): ?>
								<li class="army-faction-item"><?php echo ( $imperium ); ?></li>
							<?php endforeach; ?>
							</ul>

						<?php elseif ( $army40k_faction == 'Chaos Space Marines' ): ?>

							<ul class="army-faction-list">
							<?php foreach( $army40k_chaos_space_marines as $chaos_space_marines ): ?>
								<li class="army-faction-item"><?php echo ( $chaos_space_marines ); ?></li>
							<?php endforeach; ?>
							</ul>

						<?php elseif ( $army40k_faction == 'Aeldari' ): ?>

							<ul class="army-faction-list">
							<?php foreach( $army40k_aeldari as $aldari ): ?>
								<li class="army-faction-item"><?php echo ( $aldari ); ?></li>
							<?php endforeach; ?>
							</ul>

						<?php elseif ( $army40k_faction == 'Tyranids' ): ?>

							<ul class="army-faction-list">
							<?php foreach( $army40k_tyranids as $tyranids ): ?>
								<li class="army-faction-item"><?php echo ( $tyranids ); ?></li>
							<?php endforeach; ?>
							</ul>

						<?php endif; ?>

						</li>

						<?php endforeach;?>
					</ul>
				</div>
			<?php endif; ?>

			<?php
			if ($army30k):
			?>

			<h3 class="member-army-header">30K Armies:</h3>
			<div class="member-armies">
				<ul class="thirtyk army-list">
					<?php foreach( $army30k as $army30k_faction ):

					$patterns = array ('/\s+/', '/\'/');
					$replace = array ('-', '');

					$string = preg_replace($patterns, $replace, $army30k_faction);
					$class = strtolower($string);

					?>

					<li class="army-faction <?php echo ( $class ); ?>"><h4><?php echo ( $army30k_faction ); ?></h4>

						<?php if ( $army30k_faction == 'Traitors' ): ?>
							<ul class="army-faction-list">
							<?php foreach( $army30k_traitors as $traitor ): ?>
								<li class="army-faction-item"><?php echo ( $traitor ); ?></li>
							<?php endforeach; ?>
							</ul>

						<?php elseif ( $army30k_faction == 'Imperial' ): ?>
							<ul class="army-faction-list">
							<?php foreach( $army30k_imperial as $imperial ): ?>
								<li class="army-faction-item"><?php echo ( $imperial ); ?></li>
							<?php endforeach; ?>
							</ul>

						<?php elseif ( $army30k_faction == 'Mechanicum' ): ?>

							<ul class="army-faction-list">
							<?php foreach( $army30k_mechanicum as $mechanicum ): ?>
								<li class="army-faction-item"><?php echo ( $mechanicum ); ?></li>
							<?php endforeach; ?>
							</ul>

						<?php elseif ( $army30k_faction == 'Loyalists' ): ?>

							<ul class="army-faction-list">
							<?php foreach( $army30k_loyalist as $loyalist ): ?>
								<li class="army-faction-item"><?php echo ( $loyalist ); ?></li>
							<?php endforeach; ?>
							</ul>

						<?php endif; ?>

						</li>
						<?php endforeach;?>
					</ul>
				</div>
			<?php endif; ?>
		</div>

		<div class="grid-xs-col12 grid-md-col8">
			<div class="member-survey">
				<?php
					if ($question_1):
					?>
					<h2 class="member-question">Where do you primarily do your gaming?</h2>
					<p class="member-answer"><?php the_field('question_1'); ?></p>
				<?php endif; ?>
				<?php
					if ($question_2):
					?>
					<h2 class="member-question">Tell us about what got you interested in playing 40k/30k:</h2>
					<p class="member-answer"><?php the_field('question_2'); ?></p>
				<?php endif; ?>
				<?php
					if ($question_3):
					?>
					<h2 class="member-question">What is your best 40k/30k story?</h2>
					<p class="member-answer"><?php the_field('question_3'); ?></p>
				<?php endif; ?>
				<?php
					if ($question_4):
					?>
					<h2 class="member-question">What is the worst 40k/30k experience you've had?</h2>
					<p class="member-answer"><?php the_field('question_4'); ?></p>
				<?php endif; ?>
				<?php
					if ($question_5):
					?>
					<h2 class="member-question">What army is your favorite and why?</h2>
					<p class="member-answer"><?php the_field('question_5'); ?></p>
				<?php endif; ?>
					<p class="member-back">
						<a href="<?php echo get_page_link( 17 ); ?>" class="button button-dark">Back to All Members</a>
					</p>
			</div>
		</div>

	</div> <!-- /.grid-container -->

  </section> <!-- /.container -->
