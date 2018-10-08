<!doctype html>
<html lang="">

<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="description" content="">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title><?php echo get_bloginfo( 'name' ); ?></title>
	<link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,800" rel="stylesheet">
	<link href="<?php echo get_bloginfo('template_directory'); ?>/style.css" rel="stylesheet">
	<!-- Disable tap highlight on IE -->
	<meta name="msapplication-tap-highlight" content="no">
	<!-- Web Application Manifest -->
	<link rel="manifest" href="manifest.json">
	<!-- Add to homescreen for Chrome on Android -->
	<meta name="mobile-web-app-capable" content="yes">
	<meta name="application-name" content="Web Starter Kit">
	<link rel="icon" sizes="192x192" href="<?php echo esc_url( home_url( '/' ) ); ?>images/touch/chrome-touch-icon-192x192.png">
	<!-- Add to homescreen for Safari on iOS -->
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta name="apple-mobile-web-app-status-bar-style" content="black">
	<meta name="apple-mobile-web-app-title" content="Web Starter Kit">
	<link rel="apple-touch-icon" href="<?php echo esc_url( home_url( '/' ) ); ?>images/touch/apple-touch-icon.png">
	<!-- Tile icon for Win8 (144x144 + tile color) -->
	<meta name="msapplication-TileImage" content="<?php echo esc_url( home_url( '/' ) ); ?>images/touch/ms-touch-icon-144x144-precomposed.png">
	<meta name="msapplication-TileColor" content="#3B3158">
	<!-- Color the status bar on mobile devices -->
	<meta name="theme-color" content="#3B3158">

<?php if( !current_user_can('administrator') ) {  ?>
	<!-- Global site tag (gtag.js) - Google Analytics -->
	<script async src="https://www.googletagmanager.com/gtag/js?id=UA-101217209-2"></script>
	<script>
	  window.dataLayer = window.dataLayer || [];
	  function gtag(){dataLayer.push(arguments);}
	  gtag('js', new Date());

	  gtag('config', 'UA-101217209-2');
	</script>
<?php } ?>


	<?php wp_head();?>
</head>

<?php
	global $post;
	$post_slug = $post->post_type;
	$name_class = $post->post_name;

	$classes = array(
		$name_class,
		$post_slug
	);
?>

<body>

	<?php if (is_front_page() && is_home()) { ?>
	<main class="home">
		<?php
	} else { ?>
	<main <?php body_class($classes); ?>>
		<?php } ?>