# Background Audio Directory

Place your custom audio track here (optional).

Recommended filename:
- `birthday-ambient.mp3`

To activate:
In `src/data/birthdayContent.ts`:
```ts
audio: {
  src: '/audio/birthday-ambient.mp3',
  title: 'Your Song Title',
  description: 'Optional description'
}
```

If left empty, the site automatically uses a built-in soothing Web Audio API pentatonic chime synthesiser with user-controlled play/pause. Sound never autoplays.
