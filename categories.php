<section class="section container blog-categories">
	<h3>Categories:</h3>
	<?php wp_list_categories( array(
		'exclude' => array( 24 ),
		'style' => '',
		'separator' => '',
		'parent' => 0
	)); ?>
</section>