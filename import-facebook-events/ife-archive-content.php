<?php
/**
 * Template part for displaying posts
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package WordPress
 * @subpackage Twenty_Seventeen
 * @since 1.0
 * @version 1.0
 */

$event_date = get_post_meta( get_the_ID(), 'event_start_date', true );
if( $event_date != '' ){
	$event_date = strtotime( $event_date );
}
$event_address = get_post_meta( get_the_ID(), 'venue_name', true );
$venue_address = get_post_meta( get_the_ID(), 'venue_address', true );
if( $event_address != '' && $venue_address != '' ){
	$event_address .= ' - '.$venue_address;
}elseif( $venue_address != '' ){
	$event_address = $venue_address;
}

$image_url =  array();
if ( '' !== get_the_post_thumbnail() ){
	$image_url =  wp_get_attachment_image_src( get_post_thumbnail_id(  get_the_ID() ), 'full' );
}else{
	$image_date = date_i18n('F+d', $event_date );
	$image_url[] =  "http://placehold.it/420x150?text=".$image_date;
}

$start_date_string = get_post_meta( get_the_ID(), 'start_ts', true );
$end_date_string = get_post_meta( get_the_ID(), 'end_ts', true );
$start_date_formatted = date_i18n( 'm/d/Y', $event_date );
$end_date_formatted = date_i18n( 'm/d/Y', $event_date );
$start_time = date_i18n( 'gA', $start_date_string );
$end_time = date_i18n( 'gA', $end_date_string );
$website = get_post_meta( get_the_ID(), 'ife_event_link', true );
?>

<div class="grid-xs-col12 grid-md-col6 grid-xl-col4">
	<a href="<?php echo esc_url( get_permalink() ) ?>" target="_blank" class="block-link">
		<figure <?php post_class( "event-info card" );?>>
		  <div class="event-image" style="background-image: url('<?php echo $image_url[0]; ?>')"></div>
		  <figcaption class="event-caption">
			<div class="event-details">
				<span class="date"><?php echo $start_date_formatted ?></span>
				<span class="members">Members only</span>
				<span class="public">Public</span>
				</div>
				<div class="event-name">
					<?php the_title( '<h3 class="title">','</h3>' ); ?>
					<p class="location"><span class="icon icon-marker"></span> <?php echo $event_address; ?> - <?php echo $start_time ?> to <?php echo $end_time ?></p>
				</div>
			</figcaption>
		</figure>
	</a>
</div>
