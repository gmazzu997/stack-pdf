# StackPDF - Project Rules & Architecture Guide

## App Overview
StackPDF is a free photo-to-PDF converter app with a premium dark theme. Users can select up to 200 photos, reorder them, preview the layout, and generate margin-free PDFs with vertically stacked images.

## Core Philosophy
- **Completely Free**: No subscriptions, no ads, no hidden costs
- **Privacy First**: Local processing where possible, cloud for storage only
- **Speed**: Photos to PDF in under 60 seconds
- **Simplicity**: Clean, efficient UI focused on core workflow

## Design System

### Theme
- **Colors**: Dark theme (`#0f0f0f` background, `#1a1a1a` cards)
- **Accents**: Blue (`#3b82f6` primary, `#60a5fa` light)
- **Typography**: System fonts, 700 weight for headings
- **Border Radius**: 12-20px for cards, 14-16px for buttons
- **Reference**: `components/showcase/Reference.tsx` for design patterns

### Design Patterns
1. **Animations**: Use `useRef(new Animated.Value(0)).current` for smooth transitions
2. **Cards**: Dark surface with border, rounded corners, padding 20-24px
3. **Buttons**: Primary actions use gradient, secondary use card background
4. **Icons**: lucide-react-native only, 20-24px for actions, 40+ for empty states
5. **Empty States**: Large icon (80x80), centered text, call-to-action

## Architecture

### State Management
**Zustand Stores**:
- `stores/appStateStore.ts`: Global app state (auth, user)
- `stores/pdfStore.ts`: PDF workflow state (images, progress, generation)

**Pattern**: Stores are REACTIVE - screens use hooks, updates flow automatically

### Data Layer
**Entities** (auto-generated from schemas):
- `PDFHistory`: Track generated PDFs (user-scoped by default)
- `PDFProject`: Save in-progress projects (draft, not currently used)

**Methods** (from entities):
```typescript
await PDFHistories.create({ pdfName, pdfFileUrl, ... });
await PDFHistories.query({}, { limit: 20, sort: { createdAt: -1 } });
await PDFHistories.delete(historyId);
```

### Services
**pdfService.ts**: Core PDF operations
- `generatePDF()`: Upload images → Call edge function → Save history
- `downloadAndSharePDF()`: Download PDF file and share
- `getHistory()`: Fetch user's PDF history

**Pattern**: Services orchestrate complex operations, screens stay clean

### Edge Functions
**generate-pdf**: Server-side PDF generation
- Location: `magically/functions/generate-pdf/`
- Input: `{ imageUrls: string[], pdfName: string }`
- Output: `{ pdfUrl: string, fileSize: number }`
- Note: Currently a placeholder - production needs proper PDF library

## Navigation Structure

### Tab Navigator (2 tabs)
1. **Home**: PDF history + "New PDF" button
2. **Profile**: User settings, feedback, account deletion

### Stack Navigator (Detail screens)
1. **PhotoSelection**: Multi-select from gallery (200 max)
2. **Reorder**: Reorder images, name PDF
3. **Preview**: Preview layout + Generate button
4. **Feedback**: User feedback (linked from Profile)

**Flow**: Home → PhotoSelection → Reorder → Preview → Generate → Home

## Screen Patterns

### Screen Structure (All screens < 300 lines)
```typescript
// 1. Imports
import { useTheme } from '../contexts/ThemeContext';
import { usePDFStore } from '../stores/pdfStore';

// 2. Component
export default function ScreenName() {
  const { background, text, primary, ... } = useTheme();
  const [localState, setLocalState] = useState();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animations
    // Data loading
  }, []);

  // 3. Handlers
  const handleAction = () => { ... };

  // 4. Render
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: background }}>
      <Animated.View style={{ opacity: fadeAnim }}>
        {/* Content */}
      </Animated.View>
    </SafeAreaView>
  );
}
```

### Loading States
- **Initial load**: Skeleton components from `components/ui/Skeleton`
- **Actions**: AnimatedSpinner from `components/ui/AnimatedSpinner`
- **Progress**: Animated progress bar with percentage

### Empty States
Pattern: Card with icon, heading, description
```typescript
<View style={{ backgroundColor: cardBackground, borderRadius: 20, padding: 40, ... }}>
  <View style={{ width: 80, height: 80, ... }}>
    <Icon size={40} color={textMuted} />
  </View>
  <Text>Heading</Text>
  <Text>Description</Text>
</View>
```

## File Upload Pattern

**CRITICAL**: Always convert URI to File first
```typescript
// ❌ WRONG
await magically.files.upload(image.uri, blob);

// ✅ CORRECT
const file = await magically.files.convertUriToFile(image.uri, fileName, 'image/jpeg');
const result = await magically.files.upload(file);
```

## Common Patterns

### Image Selection
```typescript
const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsMultipleSelection: true,
  quality: 0.8,
  selectionLimit: 200,
});

if (!result.canceled && result.assets) {
  const newImages = result.assets.map(asset => ({
    uri: asset.uri,
    name: asset.fileName || `Image-${Date.now()}.jpg`,
    width: asset.width,
    height: asset.height,
  }));
}
```

### Alerts
```typescript
import { MagicallyAlert } from '../components/ui';

MagicallyAlert.alert('Title', 'Message');
MagicallyAlert.alert('Title', 'Message', [
  { text: 'Cancel', style: 'cancel' },
  { text: 'OK', onPress: () => { ... } }
]);
```

### Navigation
```typescript
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation();
navigation.navigate('ScreenName' as never);
navigation.navigate('ScreenName' as never, { param: value } as never);
navigation.goBack();
```

## Dependencies

### Core
- expo-image-picker: Gallery access
- expo-file-system: File operations
- expo-sharing: Share PDFs
- expo-image: Optimized image rendering

### UI
- lucide-react-native: Icons
- expo-linear-gradient: Gradient buttons
- react-native-safe-area-context: Safe areas

### State
- zustand: State management
- date-fns: Date formatting

## Critical Rules

### DO
✅ Use theme hooks: `const { background, text, ... } = useTheme()`
✅ Keep screens under 300 lines
✅ Use Animated.Value in useRef().current
✅ Use MagicallyAlert for all alerts
✅ Convert URIs to Files before upload
✅ Handle all states: loading, empty, error, success
✅ Use SafeAreaView for all screens

### DON'T
❌ Use StyleSheet.create (use inline styles only)
❌ Use Alert.alert (use MagicallyAlert)
❌ Upload URIs directly (convert to File first)
❌ Create new Animated.Value() without useRef
❌ Hardcode colors (use theme)
❌ Navigate immediately after actions (use useEffect)

## Extending the App

### Adding a New Feature
1. Update `stores/pdfStore.ts` if needed (state)
2. Create service method in `services/pdfService.ts` (logic)
3. Create screen in `screens/` (UI)
4. Add to `navigation/RootNavigator.tsx` (routing)
5. Follow design patterns from `Reference.tsx`

### Adding a New Screen
1. Copy HomeScreen.tsx as template
2. Replace content, keep structure
3. Use theme hooks for colors
4. Add animations (fadeAnim, slideAnim)
5. Handle all states (loading, empty, error)
6. Keep under 300 lines

### Modifying PDF Generation
Current implementation is a placeholder. For production:

1. **Option A**: Client-side with expo-print
2. **Option B**: Edge function with PDF library (requires external service)
3. **Option C**: Third-party API (CloudConvert, DocRaptor)

Update `services/pdfService.ts` and `magically/functions/generate-pdf/index.ts`

## Performance Considerations

### Image Handling
- Max 200 images (enforced in PhotoSelectionScreen)
- Quality 0.8 in picker (balance quality/size)
- Upload in sequence (not parallel) to avoid memory issues
- Use expo-image for efficient rendering

### PDF Generation
- Progress tracking for user feedback
- Offload to edge function (keep client responsive)
- File size limits: 10MB per image upload

## Deployment Checklist

1. ✅ LoginScreen has auth UI (Google, Apple, Email)
2. ✅ ProfileScreen has subscription info (free forever), feedback link, account deletion
3. ✅ All screens use theme
4. ✅ No component={() => null} in navigation
5. ✅ All entities have proper CRUD methods
6. ✅ Edge functions deployed
7. ✅ No hardcoded colors
8. ✅ All screens < 300 lines

## User Flow Summary

1. **Login** → Google/Apple/Email authentication
2. **Home** → View history or tap "New PDF"
3. **PhotoSelection** → Select up to 200 photos
4. **Reorder** → Reorder photos, name PDF
5. **Preview** → Preview layout, generate PDF
6. **Generate** → Upload images, create PDF, save history
7. **Share** → Download and share PDF
8. **Profile** → View stats, send feedback, manage account

## Support & Maintenance

### Common Issues
- **Upload fails**: Check file size (10MB limit per image)
- **PDF generation fails**: Check edge function logs
- **Images not showing**: Check URI conversion
- **Navigation broken**: Check RootNavigator types

### Debugging
1. Check console logs
2. Inspect network requests
3. Verify edge function deployment
4. Check entity queries in Admin Panel

### Future Enhancements (Roadmap)
1. Batch processing multiple PDFs
2. Custom page sizes/orientations
3. Text overlays and watermarks  
4. PDF compression options
5. Cloud storage integration (Drive, Dropbox)
6. OCR text extraction

---

**Last Updated**: 2026-03-31
**App Version**: 1.0.0
**Platform**: React Native (Expo) + Cloudflare Workers
