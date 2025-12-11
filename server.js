const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'hello-world-service-demo'
  });
});

// Root endpoint - HTML page
app.get('/', (req, res) => {
  const startTime = Date.now();
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hello World Service Demo</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }
    
    .container {
      max-width: 800px;
      width: 100%;
    }
    
    .card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      overflow: hidden;
      animation: fadeIn 0.6s ease-out;
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .hero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }
    
    .hero h1 {
      font-size: 2.5rem;
      margin-bottom: 10px;
      font-weight: 700;
    }
    
    .hero .subtitle {
      font-size: 1.1rem;
      opacity: 0.9;
    }
    
    .version-badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.2);
      padding: 5px 15px;
      border-radius: 20px;
      margin-top: 15px;
      font-size: 0.9rem;
    }
    
    .content {
      padding: 40px;
    }
    
    .section {
      margin-bottom: 30px;
    }
    
    .section:last-child {
      margin-bottom: 0;
    }
    
    .section-title {
      font-size: 1.3rem;
      color: #333;
      margin-bottom: 15px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .section-text {
      color: #666;
      line-height: 1.6;
      margin-bottom: 15px;
    }
    
    .features-list {
      list-style: none;
      display: grid;
      gap: 12px;
    }
    
    .features-list li {
      background: #f7f9fc;
      padding: 12px 20px;
      border-radius: 8px;
      color: #555;
      border-left: 4px solid #667eea;
    }
    
    .features-list li:before {
      content: "✓ ";
      color: #667eea;
      font-weight: bold;
      margin-right: 8px;
    }
    
    .api-links {
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
    }
    
    .api-link {
      display: inline-block;
      padding: 12px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 500;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .api-link:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
    
    .status-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
    }
    
    .status-item {
      background: #f7f9fc;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
    }
    
    .status-label {
      color: #888;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }
    
    .status-value {
      color: #333;
      font-size: 1.1rem;
      font-weight: 600;
    }
    
    .status-healthy {
      color: #10b981;
    }
    
    .footer {
      background: #f7f9fc;
      padding: 20px 40px;
      text-align: center;
      color: #666;
      font-size: 0.9rem;
    }
    
    .footer a {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }
    
    .footer a:hover {
      text-decoration: underline;
    }
    
    @media (max-width: 600px) {
      .hero h1 {
        font-size: 2rem;
      }
      
      .content {
        padding: 30px 20px;
      }
      
      .api-links {
        flex-direction: column;
      }
      
      .api-link {
        width: 100%;
        text-align: center;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="hero">
        <h1>🚀 Hello World Service</h1>
        <p class="subtitle">A demo service powered by Planton Cloud</p>
        <span class="version-badge">Version 1.0.0</span>
      </div>
      
      <div class="content">
        <div class="section">
          <h2 class="section-title">📋 About This Service</h2>
          <p class="section-text">
            This is a demonstration Node.js Express service showcasing deployment capabilities 
            on Planton Cloud. It includes health checks, API endpoints, and a clean, modern 
            interface for testing and presentation purposes.
          </p>
        </div>
        
        <div class="section">
          <h2 class="section-title">✨ Features</h2>
          <ul class="features-list">
            <li>RESTful API endpoints with JSON responses</li>
            <li>Health check monitoring for service availability</li>
            <li>Containerized deployment with Docker</li>
            <li>Modern, responsive web interface</li>
            <li>Zero external dependencies for frontend</li>
          </ul>
        </div>
        
        <div class="section">
          <h2 class="section-title">🔗 Available Endpoints</h2>
          <div class="api-links">
            <a href="/health" class="api-link">Health Check</a>
            <a href="/api" class="api-link">JSON API</a>
          </div>
        </div>
        
        <div class="section">
          <h2 class="section-title">📊 System Status</h2>
          <div class="status-grid">
            <div class="status-item">
              <div class="status-label">Status</div>
              <div class="status-value status-healthy">● Healthy</div>
            </div>
            <div class="status-item">
              <div class="status-label">Timestamp</div>
              <div class="status-value">${new Date().toLocaleTimeString()}</div>
            </div>
            <div class="status-item">
              <div class="status-label">Port</div>
              <div class="status-value">${PORT}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="footer">
        <p>Deployed with ❤️ on <a href="https://planton.cloud" target="_blank">Planton Cloud</a></p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
  res.send(html);
});

// JSON API endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Hello World from Planton Cloud!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      api: '/api',
      root: '/'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});

