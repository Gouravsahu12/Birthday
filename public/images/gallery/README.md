# Gallery Photos Directory

Place Kavisha's photos here for Section 2 (Floating Photo Gallery).

Recommended files:
- `photo-01.jpg` (Portrait orientation)
- `photo-02.jpg` (Landscape orientation)
- `photo-03.jpg` (Square orientation)
- `photo-04.jpg` (Portrait orientation)
- `photo-05.jpg` (Landscape orientation)
- `photo-06.jpg` (Square orientation)

After adding photos, update `src/data/birthdayContent.ts`:
```ts
photos: [
  {
    id: 'photo-1',
    title: 'College Mornings',
    src: '/images/gallery/photo-01.jpg', // Set path here!
    caption: 'Your personal caption...',
    ...
  }
]
```
When no image is set, the website automatically displays an elegant, bespoke floral botanical frame so the design remains pristine!
