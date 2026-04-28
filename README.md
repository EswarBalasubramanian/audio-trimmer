# Audio Trimmer

A mobile audio trimming application built with Ionic Angular and Capacitor. This app allows users to record, trim, and export audio files on Android devices.

## Features

- Record audio directly from the device microphone
- Trim audio files with precision controls
- Export trimmed audio as WAV files
- Mobile-optimized interface using Ionic components
- Cross-platform support via Capacitor

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Android Studio (for Android development)
- Capacitor CLI

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/EswarBalasubramanian/audio-trimmer.git
   cd audio-trimmer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Capacitor CLI globally (if not already installed):
   ```bash
   npm install -g @capacitor/cli
   ```

## Development

### Web Development
To run the app in a web browser for development:

```bash
npm start
# or
ionic serve
```

The app will be available at `http://localhost:4200`

### Mobile Development

1. Build the web assets:
   ```bash
   npm run build
   ```

2. Add the Android platform:
   ```bash
   npx cap add android
   ```

3. Open in Android Studio:
   ```bash
   npx cap open android
   ```

4. Or run directly on a connected device/emulator:
   ```bash
   npx cap run android
   ```

## Building for Production

1. Build the production version:
   ```bash
   npm run build --prod
   ```

2. Sync with Capacitor:
   ```bash
   npx cap sync
   ```

3. Build APK in Android Studio or use:
   ```bash
   npx cap build android
   ```

## Testing

Run unit tests:
```bash
npm test
```

Run linting:
```bash
npm run lint
```

## Project Structure

```
src/
├── app/
│   ├── components/     # Reusable components
│   ├── pages/         # App pages
│   ├── services/      # Business logic services
│   └── types/         # TypeScript interfaces
├── assets/            # Static assets
├── environments/      # Environment configurations
└── theme/            # Styling and themes
```

## Technologies Used

- **Angular 18**: Frontend framework
- **Ionic 8**: UI components and mobile toolkit
- **Capacitor 6**: Native runtime for web apps
- **audiobuffer-to-wav**: Audio processing library
- **TypeScript**: Type-safe JavaScript

## Capacitor Configuration

The app is configured with the following Capacitor settings:
- App ID: `com.eswar.audiotrimmer`
- App Name: `audio-trimmer`
- Web Directory: `www`

## Permissions

The app requires the following permissions for audio functionality:
- Microphone access for recording
- File system access for saving/exporting audio files

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Built by [Ionic Framework](https://ionicframework.com/)

## Support

For issues and questions, please open an issue on the GitHub repository.