import { NextResponse } from 'next/server';

export async function GET() {
  const presets = ['ml_default', 'default', 'unsigned', 'nasmal', 'nasmal_preset', 'preset1', 'woe2kr5p'];
  const sampleImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAtdEVYdGRhdGU6Y3JlYXRlADIwMjYtMTAtMTFUMDI6MjI6MzQrMDA6MDDNlGgGAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDI2LTEwLTExVDAyOjIyOjM0KzAwOjAw2n383wAAAABJRU5ErkJggg==';

  const results: any = {};

  for (const preset of presets) {
    try {
      const formData = new FormData();
      formData.append('file', sampleImage);
      formData.append('upload_preset', preset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/woe2kr5p/image/upload`, {
        method: 'POST',
        body: formData
      });

      const json = await res.json();
      results[preset] = { status: res.status, ok: res.ok, json };
    } catch (e: any) {
      results[preset] = { error: e.message };
    }
  }

  return NextResponse.json(results);
}
