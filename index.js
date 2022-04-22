// Place your server entry point code here
// Serve static HTML files
app.use(express.static('./public'));
// Make Express use its own built-in body parser to handle JSON
app.use(express.json());
