// Import required Node.js built-in modules
const http = require('http');   // Used to create the web server
const fs = require('fs');       // Used to read files from the system
const path = require('path');   // Used to handle file paths correctly

// Port number where the server will run
const PORT = 3000;

/*
  Helper function to read and send HTML files as response.
  res        → response object (to send data back to browser)
  filePath   → path of the HTML file to send
  statusCode → HTTP status code (default 200 OK)
*/
function servePage(res, filePath, statusCode = 200) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // If file not found or cannot be read
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
      return;
    }

    // If file is successfully read, send it to the browser
    res.writeHead(statusCode, { 'Content-Type': 'text/html' });
    res.end(data);
  });
}

// Create HTTP server
const server = http.createServer((req, res) => {

  // Log each incoming request to the console
  console.log(`Request: ${req.url}`);

  // Routing based on URL
  if (req.url === '/' || req.url === '/home') {
    // Serve Home Page
    servePage(res, path.join(__dirname, 'home.html'));
  } 
  else if (req.url === '/about') {
    // Serve About Page
    servePage(res, path.join(__dirname, 'about.html'));
  } 
  else if (req.url === '/contact') {
    // Serve Contact Page
    servePage(res, path.join(__dirname, 'contact.html'));
  } 
  else if (req.url === '/services') {
    // Serve Services Page
    servePage(res, path.join(__dirname, 'service.html'));
  } 
  else if (req.url === '/style.css') {
    // Serve CSS file
    fs.readFile(path.join(__dirname, 'style.css'), (err, data) => {
      if (err) {
        // If CSS not found
        res.writeHead(404);
        res.end('CSS Not Found');
      } else {
        // Send CSS file to browser
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(data);
      }
    });
  } 
  else {
    // Handle all invalid routes with a custom 404 page
    servePage(res, path.join(__dirname, '404.html'), 404);
  }
});

// Start the server and listen on the given port
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});