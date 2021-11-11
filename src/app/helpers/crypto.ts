export async function sha256WithBlob(blob: Blob) {
  const digested = await crypto.subtle.digest(
    'SHA-256',
    await blob.arrayBuffer()
  );
  return arrayBufferToHex(digested);
}

export function arrayBufferToHex(arrayBuffer: ArrayBuffer) {
  return (
    [...new Uint8Array(arrayBuffer)]
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  );
}
