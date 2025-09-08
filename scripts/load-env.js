/**
 * Environment loader for database scripts
 * This module loads environment variables from .env.local file
 */

const path = require('path');
const fs = require('fs');

function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env.local');
  
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envLines = envContent.split('\n');
    
    envLines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim();
          process.env[key.trim()] = value;
        }
      }
    });
    
    return true;
  }
  
  return false;
}

// Auto-load when this module is required
loadEnvFile();

module.exports = { loadEnvFile };
