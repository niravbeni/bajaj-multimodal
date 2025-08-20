# Agentic EMIs - AI Assistant

A chat-first AI assistant for EMI customers built with Next.js, React TypeScript, shadcn/ui, and Tailwind CSS.

## Features

- **Natural Chat Interface**: AI-powered conversation with intent detection
- **Product Scanning**: Camera-based product recognition with mock AI
- **Rate Comparison**: Animated visualization comparing EMI rates
- **Top 3 Ranking**: Podium display highlighting Bajaj as "Best Value"
- **eKYC Mock**: Facial verification interface with progress tracking

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Animation**: Framer Motion
- **State Management**: Zustand
- **Icons**: Lucide React
- **Camera**: Web getUserMedia API

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

## User Flow

### 1. Chat (Home) - `/`
- Welcome message from Agentic EMIs
- Natural language chat interface
- Intent detection for product scanning
- Bottom sheet trigger for scan flow

### 2. Scan (Expanded Camera) - `/scan`
- Full-height camera with corner frame overlay
- Mock image recognition (returns "Smartphone")
- Auto-navigation to comparison after recognition

### 3. Motion Viz: Rate Comparison - `/compare`
- Animated vertical bar chart
- Staggered entrance animations
- Best rates highlighted
- CTA to ranking screen

### 4. Top 3 Ranking - `/ranking`
- Podium layout with crown for winner
- Best value positioned as #1
- Congratulations message
- CTA to eKYC flow

### 5. eKYC + Payment (Mock) - `/ekyc`
- Camera with face outline mask
- Animated progress ring (stops at 70%)
- Step indicator (1/3)
- Disabled "Continue" button to show mock state

## Key Components

### Chat Components
- `ChatWindow`: Main chat container with scroll
- `MessageBubble`: Individual message display
- `Composer`: Input field with send button

### Scan Components
- `CameraView`: Reusable camera component with overlay
- `BottomSheetScan`: Half-height modal with camera

### Visualization Components
- `RateBars`: Animated rate comparison bars
- `RankingPodium`: Top 3 podium with crown and medals

### Hooks
- `useCamera`: Camera access and lifecycle management
- `useFlowStore`: Zustand store for app state
- `useIntent`: Simple NLP intent detection

### Mock Services
- `chatMock`: Simulated AI responses
- `data.ts`: Sample rates and comparisons

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Chat interface (home)
│   ├── compare/page.tsx   # Rate comparison
│   ├── ranking/page.tsx   # Top 3 podium
│   ├── verification/      # OTP verification
│   ├── face-verification/ # Face scanning
│   ├── payment-success/   # Success confirmation
│   └── ekyc/page.tsx      # eKYC verification
├── components/
│   ├── chat/              # Chat-related components
│   ├── scan/              # Camera components
│   ├── viz/               # Data visualization
│   └── ui/                # shadcn/ui components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and mock services
└── types/                 # TypeScript type definitions
```

## Mock Data & Services

All data and AI responses are currently mocked for demonstration:

- **Chat responses**: Simple keyword-based responses
- **Image recognition**: Always returns "Smartphone" after 900ms delay
- **Rate data**: Static comparison with Bajaj as lowest APR
- **eKYC**: Visual progress only, no actual verification

## Future Enhancements

To convert this into a production app:

1. **Replace mock services** with real APIs
2. **Add authentication** and user management
3. **Implement real image recognition** (Google Vision, AWS Rekognition)
4. **Connect to Bajaj Finserv APIs** for rates and products
5. **Add real eKYC integration** with document verification
6. **Implement payment processing**
7. **Add error handling** and offline support
8. **Performance optimization** and analytics

## Development Notes

- Uses modern React patterns (hooks, functional components)
- Fully responsive design with mobile-first approach
- Accessible UI components via Radix primitives
- Type-safe with comprehensive TypeScript definitions
- Animated interactions with Framer Motion
- Clean separation of concerns (components, hooks, services)

## Browser Support

- Modern browsers with camera access
- Requires HTTPS for camera permissions in production
- Responsive design for mobile and desktop

---

Built with ❤️ for Bajaj Finserv customers
