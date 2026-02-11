# Recall - Privacy First AI Recorder

![GHBanner](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

> **🏆 Hackathon Demo Ready** - Privacy-first AI meeting recorder with stunning liquid glass UI

## ✨ Features

- 🎤 **Real-time Speech-to-Text** - Live transcription using Web Speech API
- 🤖 **Local AI Summarization** - Powered by Google Gemini AI
- 🎨 **Liquid Glass UI** - Premium animations with ambient lighting
- 🔒 **Privacy First** - All processing happens locally
- 📝 **Smart Summaries** - Key takeaways and action items
- ✅ **Task Management** - Auto-extracted action items with urgency detection

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Chrome or Edge browser (for Web Speech API)
- Internet connection (for AI processing)

### Installation

```bash
# Clone the repository
git clone https://github.com/lakshyapamnani/recall-.git
cd recall-

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 🎯 Usage

1. **Start Recording**
   - Click "Start Capturing" on the Capture tab
   - Grant microphone permission when prompted
   - Speak naturally - transcription appears in real-time

2. **Stop & Process**
   - Click "Finish & Process" when done
   - AI analyzes your speech locally
   - View summary with key takeaways and action items

3. **Manage Sessions**
   - Browse all recordings in the Library tab
   - View detailed summaries and transcripts
   - Export sessions as text files

4. **Track Tasks**
   - Auto-extracted action items appear in Tasks tab
   - Urgent items are automatically flagged
   - Mark tasks as complete

## 🎨 UI Features

### Liquid Glass Animations
- Ambient glow effects on hover
- Smooth elevation transforms
- Shimmer and ripple effects
- GPU-accelerated for 60fps performance

### Available Effect Classes
```tsx
liquid-btn           // Expanding ripple + rotating gradient
glass-morph-hover    // Enhanced blur + liquid morphing
glow-pulse-hover     // Pulsing cyan glow
holographic-hover    // Rainbow gradient overlay
neon-border-hover    // Animated gradient border
float-hover          // Gentle floating motion
```

## 🔧 Configuration

The app uses Google Gemini AI for summarization. The API key is already configured for demo purposes.

For production use, get your own API key:
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add to `.env.local`:
   ```
   GEMINI_API_KEY=your_key_here
   ```

## 🏗️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: TailwindCSS + Custom CSS animations
- **Speech-to-Text**: Web Speech API
- **AI**: Google Gemini AI
- **Storage**: IndexedDB (via idb)
- **Build Tool**: Vite

## 📱 Browser Support

- ✅ Chrome (recommended)
- ✅ Edge
- ❌ Firefox (limited Web Speech API support)
- ❌ Safari (limited Web Speech API support)

## 🎯 Hackathon Highlights

### Innovation
- Real-time speech recognition with live feedback
- Privacy-first architecture (no cloud storage)
- Intelligent action item extraction
- Urgency detection using NLP patterns

### Design
- Premium liquid glass aesthetic
- Ambient lighting effects
- Smooth 60fps animations
- Mobile-responsive layout

### Technical Excellence
- TypeScript for type safety
- Modular component architecture
- Efficient state management
- GPU-accelerated animations

## 📝 Project Structure

```
recall/
├── components/          # React components
│   ├── Recorder.tsx    # Speech recognition & recording
│   ├── SummaryView.tsx # Session details view
│   ├── TasksView.tsx   # Task management
│   └── ...
├── services/
│   ├── ai.ts          # Gemini AI integration
│   └── db.ts          # IndexedDB operations
├── index.html         # Enhanced with animations
├── index.css          # Custom liquid glass effects
└── App.tsx            # Main application
```

## 🐛 Troubleshooting

### Speech Recognition Not Working
1. Ensure you're using Chrome or Edge
2. Grant microphone permissions
3. Check internet connection (required for Web Speech API)
4. Open DevTools (F12) → Console for detailed logs

### AI Summarization Fails
1. Verify internet connection
2. Check API key is valid
3. Ensure transcript has sufficient content

## 📄 License

MIT License - feel free to use for your projects!

## 👨‍💻 Author

**Lakshya Pamnani**
- GitHub: [@lakshyapamnani](https://github.com/lakshyapamnani)

## 🙏 Acknowledgments

- Google Gemini AI for powerful summarization
- Web Speech API for real-time transcription
- React and Vite communities

---

**Built with ❤️ for hackathon judges** 🏆
