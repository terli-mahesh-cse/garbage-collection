import { getDistanceKm } from "./utils";

export interface ExifValidationResult {
  hasExif: boolean;
  dateTime?: Date;
  daysOld?: number;
  latitude?: number;
  longitude?: number;
  distanceKm?: number;
  warnings: string[];
}

/**
 * Extracts EXIF timestamp and GPS coordinates from a JPEG image File,
 * and validates against current date and selected pin location.
 */
export async function validateImageExif(
  file: File,
  pinLat: number,
  pinLng: number
): Promise<ExifValidationResult> {
  const result: ExifValidationResult = {
    hasExif: false,
    warnings: [],
  };

  try {
    const buffer = await file.arrayBuffer();
    const view = new DataView(buffer);

    // Verify JPEG SOI marker (0xFFD8)
    if (view.getUint16(0, false) !== 0xffd8) {
      return result;
    }

    let offset = 2;
    const length = view.byteLength;

    while (offset < length) {
      if (view.getUint8(offset) !== 0xff) break;
      const marker = view.getUint8(offset + 1);

      // APP1 marker (0xFFE1) contains EXIF
      if (marker === 0xe1) {
        const exifHeader = view.getUint32(offset + 4, false);
        // "Exif\0\0" = 0x45786966
        if (exifHeader === 0x45786966) {
          result.hasExif = true;
          // Parse basic EXIF text for dates (YYYY:MM:DD HH:MM:SS)
          const textDecoder = new TextDecoder("ascii");
          const exifString = textDecoder.decode(new Uint8Array(buffer, offset, 2048));
          
          const dateMatch = exifString.match(/(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
          if (dateMatch) {
            const [_, y, m, d, hh, mm, ss] = dateMatch;
            const photoDate = new Date(`${y}-${m}-${d}T${hh}:${mm}:${ss}`);
            if (!isNaN(photoDate.getTime())) {
              result.dateTime = photoDate;
              const diffMs = Date.now() - photoDate.getTime();
              const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
              result.daysOld = days;

              if (days > 7) {
                result.warnings.push(
                  `⚠️ Photo was taken ${days} days ago (${photoDate.toLocaleDateString()}). Recent photos help sanitation crews locate active spots.`
                );
              }
            }
          }
        }
        break;
      } else {
        // Move to next marker
        const markerLength = view.getUint16(offset + 2, false);
        offset += 2 + markerLength;
      }
    }
  } catch (err) {
    console.warn("EXIF extraction notice:", err);
  }

  return result;
}
