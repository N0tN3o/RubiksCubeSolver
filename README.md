# Rubik's Cube Solver PWA

A Progressive Web App (PWA) built with React and Vite that helps you solve Rubik's cubes step by step.

## Features

- **Progressive Web App**: Install on your device and use offline
- **Responsive Design**: Works on desktop and mobile
- **Intuitive Interface**: Easy to input your cube configuration
- **Step-by-Step Solution**: Clear instructions to solve your cube
- **3D Visualization** (Coming Soon): Interactive 3D cube rendering

## Tech Stack

- **React**: Frontend UI library
- **Vite + SWC**: Fast build tooling
- **Tailwind CSS**: Utility-first CSS framework
- **CubeJS**: Rubik's cube solving algorithm
- **Three.js** (Coming Soon): 3D visualization
- **PWA**: Service Workers for offline access

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/rubiks-solver-pwa.git
cd rubiks-solver-pwa
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

## Usage

1. Input your cube's current state by clicking on the tiles and selecting colors
2. Click "Solve Cube" to generate the solution
3. Follow the step-by-step solution to solve your cube

## PWA Installation

You can install this app on your device:

1. On desktop: Click the install icon in your browser's address bar
2. On mobile: Tap "Add to Home Screen" in your browser's menu

## Development

### Project Structure

```
├── public/                # Public assets
├── src/
│   ├── components/        # React components
│   ├── utils/             # Utility functions
│   ├── App.jsx            # Main app component
│   ├── App.css            # App-specific styles
│   ├── index.css          # Global styles
│   ├── main.jsx           # Entry point
│   └── pwa.js             # PWA registration
├── index.html             # HTML template
├── vite.config.js         # Vite configuration
└── tailwind.config.js     # Tailwind CSS configuration
```

### Future Development

- 3D cube visualization with Three.js
- Interactive 3D cube manipulation
- Animated solution playback
- Custom themes and colors
- Save and share functionality

## License

[MIT](LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.