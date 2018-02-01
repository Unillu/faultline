<?php

/*
Registering post types for Faultline
=================================================
Add this to your `functions.php`
*/

function create_post_type() {
	register_post_type( 'terrain-set',
		array(
			'labels' => array(
				'name' => __( 'Terrain Sets' ),
				'singular_name' => __( 'Terrain Set' )
			),
			'public' => true,
			// 'has_archive' => true,
			'rewrite' => array('slug' => 'terrain-set'),
			'supports' => array(
				'title',
				'editor',
				'excerpt',
				'thumbnail',
				//'author',
				//'trackbacks',
				'custom-fields',
				//'comments',
				'revisions',
				// 'page-attributes', // (menu order, hierarchical must be true to show Parent option)
				// 'post-formats',
			),
			'taxonomies' => array( 'category', 'post_tag' ), // add default post categories and tags
		)
	);

    register_post_type( 'member',
  	array(
  		'labels' => array(
  			'name' => __( 'Members' ),
  			'singular_name' => __( 'Member' )
  		),
  		'public' => true,
  		// 'has_archive' => true,
  		'rewrite' => array('slug' => 'member'),
  		'supports' => array(
  			'title',
  			// 'editor',
  			// 'excerpt',
  			'thumbnail',
  			'author',
  			//'trackbacks',
  			'custom-fields',
  			//'comments',
  			// 'revisions',
  			// 'page-attributes', // (menu order, hierarchical must be true to show Parent option)
  			// 'post-formats',
  		),
  		// 'taxonomies' => array( 'category', 'post_tag' ), // add default post categories and tags
  	)
    );
}
add_action( 'init', 'create_post_type' );
