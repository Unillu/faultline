<?php

/*
Faultline Footer Menus
=================================================
Add this to your `functions.php`
*/
/**
 * Generates the featured blogs per
 *
 * @param string $html
 *
 * @return string
 */
function display_post_via_specific_author( $nicename ) {

	// The Query
	$the_query = new WP_Query( array( 'author_name' => $nicename, 'posts_per_page' => '4' ) );
	$author = get_the_author_meta( 'first_name' );

	// The Loop
	if ( $the_query->have_posts() ) {
		echo '<div class="member-blog">
			<h2 class="member-blog-header">Recent posts by '. $author .':</h2>
		';  while ( $the_query->have_posts() ) {
			$the_query->the_post();
			$categories = get_the_category();

			echo '

			<div class="grid-xs-col12 grid-md-col6">
				<a href="'. get_the_permalink() . '" title="' . get_the_title() . '" class="block-link">
					<figure class="blog-info card">
						<div class="blog-image">
							<h3 class="blog-title"> ' . get_the_title() . ' </h3>
							' . get_the_post_thumbnail() . '
						</div>

						<figcaption class="blog-excerpt">
							<div class="blog-name">
								<p class="description">' . get_the_excerpt() . '</p>
							</div>

							<div class="blog-link">
								<span class="read-more">Read more&hellip;</span>
							</div>
						</figcaption>
					</figure>
				</a>
			</div>

			' .
			/* Restore original Post Data */
			wp_reset_postdata();
		};

		'</div>';

	}
}
