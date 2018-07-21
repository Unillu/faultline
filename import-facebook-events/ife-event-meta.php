<?php
/**
 * The template for displaying all single Event meta
 */
global $ife_events;

$event_id = get_the_ID();
$start_date_str = get_post_meta( $event_id, 'start_ts', true );
$end_date_str = get_post_meta( $event_id, 'end_ts', true );
$start_date_formated = date_i18n( 'F j', $start_date_str );
$end_date_formated = date_i18n( 'F j', $end_date_str );
$start_time = date_i18n( 'h:i a', $start_date_str );
$end_time = date_i18n( 'h:i a', $end_date_str );
$website = get_post_meta( $event_id, 'ife_event_link', true );
?>



<div class="ife_eventmeta">
<section class="grid-xs-col12 grid-sm-col6">

	<div class="event-content-block">
    <h2> <?php esc_html_e( 'Details','import-facebook-events-pro' ); ?> </h2>

    <?php
    if( date( 'Y-m-d', $start_date_str ) == date( 'Y-m-d', $end_date_str ) ){
    	?>
	    <p>Date: <?php echo $start_date_formated; ?></p>
	    <p>Time: <?php if( $start_time != $end_time ){
	    		echo $start_time . ' - ' . $end_time;
	    	}else{
	    		echo $start_time;
    		}?>
		</p>
		<?php
	}else{
		?>
	    <p>Start: <?php echo $start_date_formated . ' - ' . $start_time; ?></p>
	    <p>End: <?php echo $end_date_formated . ' - ' . $end_time; ?></p>
		<?php
	}

	$eve_tags = $eve_cats = array();
	$event_categories = wp_get_post_terms( $event_id, $ife_events->cpt->get_event_categroy_taxonomy() );
	if( !empty( $event_categories ) ){
		foreach ($event_categories as $event_category ) {
			$eve_cats[] = '<span class="event-category">' . $event_category->name. '</a>';
		}
	}

	$event_tags = wp_get_post_terms( $event_id, $ife_events->cpt->get_event_tag_taxonomy() );
	if( !empty( $event_tags ) ){
		foreach ($event_tags as $event_tag ) {
			$eve_tags[] = '<a href="'. esc_url( get_term_link( $event_tag->term_id ) ).'">' . $event_tag->name. '</a>';
		}
	}

	if( !empty( $eve_cats ) ){
		?>
	    <p>Type: <?php echo implode(', ', $eve_cats ); ?></p>
		<?php
	}

	if( !empty( $eve_tags ) ){
		?>
		<h3><?php esc_html_e( 'Event Tags','import-facebook-events-pro' ); ?>:</h3>
	    <p><?php echo implode(', ', $eve_tags ); ?></p>
		<?php
	}
	?>

    <?php if( $website != '' ){ ?>
    	<h3><?php esc_html_e( 'Event Link','import-facebook-events-pro' ); ?>:</h3>
    	<a href="<?php echo esc_url( $website ); ?>">Facebook event page</a>
    <?php } ?>
    </div>
  </section>


<?php
$venue_name    = get_post_meta( $event_id, 'venue_name', true );
$venue_address = get_post_meta( $event_id, 'venue_address', true );
$venue['city'] = get_post_meta( $event_id, 'venue_city', true );
$venue['state'] = get_post_meta( $event_id, 'venue_state', true );
$venue['country'] = get_post_meta( $event_id, 'venue_country', true );
$venue['zipcode'] = get_post_meta( $event_id, 'venue_zipcode', true );
$venue['lat'] = get_post_meta( $event_id, 'venue_lat', true );
$venue['lon'] = get_post_meta( $event_id, 'venue_lon', true );
$venue_url = esc_url( get_post_meta( $event_id, 'venue_url', true ) );

if( $venue_name != '' && ( $venue_address != '' || $venue['city'] != '' ) ){
	?>
	<section class="grid-xs-col12 grid-sm-col6 event-content-block">
		<div class="event-content-block">
			<h2> <?php esc_html_e( 'Venue','import-facebook-events-pro' ); ?> </h2>
			<address><?php echo $venue_name; ?><br/>
			<?php
			if( $venue_address != '' ){
				echo $venue_address;
			} ?>
			<br/>
			<?php
			$venue_array = array();
			foreach ($venue as $key => $value) {
				if( in_array( $key, array( 'city', 'state', 'country', 'zipcode' ) ) ){
					if( $value != ''){
						$venue_array[] = $value;
					}
				}
			}
			echo implode( ", ", $venue_array );
			?>
		</address>
		</div>
	</section>
		<?php
		if( $venue['lat'] != '' && $venue['lon'] != '' ){
			?><section class="grid-xs-col12 event-content-block">
			<iframe src="https://maps.google.com/maps?q=<?php echo $venue['lat'].",".$venue['lon'];?>&hl=es;z=14&output=embed" width="100%" height="350" frameborder="0" style="border:0; margin:0;" allowfullscreen></iframe>
			</section>
			<?php
		}
		?>

	<?php
}
?>
</div>
<h2>Additional information:</h2>
