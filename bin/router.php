<?php
// router.php
$path = pathinfo($_SERVER["SCRIPT_FILENAME"]);

if ($path["extension"] == "webapp") {
    header("Content-Type: application/x-web-app-manifest+json");
    readfile($_SERVER["SCRIPT_FILENAME"]);
} else if ($path["extension"] == "manifest") {
    header("Content-Type: text/cache-manifest");
    readfile($_SERVER["SCRIPT_FILENAME"]);
} else if ($path["extension"] == "svg") {
    header("Content-Type: image/svg+xml");
    readfile($_SERVER["SCRIPT_FILENAME"]);
} else {
    return FALSE;
}
?>
