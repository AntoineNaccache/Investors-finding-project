# Graph Visualization Module

Interactive radial graph visualization using Cytoscape.js for displaying founder → connections → VC relationships.

## Overview

This module automatically loads JSON data and renders an interactive network graph with:
- **Founder nodes**: Large red circles at the center
- **Connection nodes**: Medium blue circles in the middle ring
- **VC nodes**: Green hexagons on the outer ring

## Files

- `index.html` - Main visualization page (production-ready)
- `sample-graph.json` - Example data file
- `.gitignore` - Git ignore rules

## Quick Start

### Local Development

1. Start a local server:
```bash
python3 -m http.server 8000
```

2. Open in browser:
```
http://localhost:8000/index.html
```

### Using Custom Data

Load your own JSON file:
```
http://localhost:8000/index.html?json=your-data.json
```

## JSON Format

```json
{
  "elements": [
    {
      "data": {
        "id": "unique-node-id",
        "label": "Display Name",
        "group": "founder|connection|vc"
      }
    },
    {
      "data": {
        "id": "unique-edge-id",
        "source": "source-node-id",
        "target": "target-node-id"
      }
    }
  ]
}
```

### Node Types

- **Founder**: `"group": "founder"` - Red, 80px, centered
- **Connection**: `"group": "connection"` - Blue, 60px, middle ring
- **VC**: `"group": "vc"` - Green hexagon, 60px, outer ring

### Example

```json
{
  "elements": [
    {
      "data": {
        "id": "founder1",
        "label": "Jane Doe",
        "group": "founder"
      }
    },
    {
      "data": {
        "id": "conn1",
        "label": "John Smith",
        "group": "connection"
      }
    },
    {
      "data": {
        "id": "vc1",
        "label": "Acme Ventures",
        "group": "vc"
      }
    },
    {
      "data": {
        "id": "e1",
        "source": "founder1",
        "target": "conn1"
      }
    },
    {
      "data": {
        "id": "e2",
        "source": "conn1",
        "target": "vc1"
      }
    }
  ]
}
```

## Features

### Layout
- Automatic radial/force-directed layout using COSE-Bilkent
- Fallback to standard COSE layout if COSE-Bilkent unavailable
- Optimized for founder-centric network visualization

### Interactions
- **Zoom**: Mouse wheel or trackpad pinch
- **Pan**: Click and drag on canvas
- **Drag Nodes**: Click and drag individual nodes
- **Hover**: Highlights node borders in orange
- **Click Node**: Highlights the node and its connections (others fade)
- **Click Canvas**: Reset all highlights

### Visual Features
- Color-coded nodes by type
- Hexagonal shape for VC nodes
- Curved bezier edges with arrow indicators
- Legend in bottom-right corner
- Responsive full-screen layout

## Validation

The module automatically validates:
- Required `elements` array exists
- All node IDs are unique
- At least one founder node exists
- Edge `source` and `target` reference valid node IDs

Invalid data displays an error message with details.

## Dependencies

Loaded from CDN (no installation required):
- Cytoscape.js v3.28.1
- Cytoscape COSE-Bilkent v4.1.0

## Browser Support

Works in all modern browsers with ES6 support:
- Chrome/Edge 60+
- Firefox 60+
- Safari 12+

## Deployment

### Static Hosting

Copy all files to any static host:
- GitHub Pages
- Netlify
- Vercel
- AWS S3
- Or any web server

### Usage
```
https://your-domain.com/index.html?json=your-data.json
```

## Customization

### Colors

Edit the style section in `index.html`:

```javascript
// Founder nodes
'background-color': '#e74c3c',  // Red
'border-color': '#c0392b',

// Connection nodes
'background-color': '#3498db',  // Blue
'border-color': '#2980b9',

// VC nodes
'background-color': '#2ecc71',  // Green
'border-color': '#27ae60',
```

### Layout Parameters

Adjust the layout configuration in the `loadGraph()` function:

```javascript
idealEdgeLength: 200,      // Distance between nodes
nodeRepulsion: 8000,       // How much nodes push apart
gravity: 0.5,              // Pull toward center
numIter: 2500,             // Layout iterations
```

## Troubleshooting

**Graph not appearing:**
- Check browser console (F12) for errors
- Verify JSON file is accessible
- Ensure JSON format is valid
- Check that at least one founder node exists

**Nodes overlapping:**
- Increase `nodeRepulsion` value in layout config
- Increase `idealEdgeLength` value
- Reduce number of nodes per connection

**Layout looks wrong:**
- Verify node `group` values are correct
- Check edge `source`/`target` IDs match node IDs
- Try refreshing the page

## Architecture

The module is a self-contained single-page application with:
- No build process required
- No server-side dependencies
- Pure JavaScript with CDN libraries
- Runs entirely in the browser

## License

MIT License - Free to use and modify for any purpose.

## Contributing

This is a standalone module. Contributions welcome:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For issues or questions, please open an issue in the repository.
