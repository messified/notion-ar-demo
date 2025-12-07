export interface NoteOverlay {
  id: string;
  label: string;        // e.g. "E", "F#", "G"
  x: number;            // 0–1 relative to width
  y: number;            // 0–1 relative to height (staff area)
}
 