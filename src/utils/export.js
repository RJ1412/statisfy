import html2canvas from 'html2canvas';

export async function exportComponentAsPNG(elementRef, filename = 'spotify-personality.png') {
  if (!elementRef.current) return false;

  try {
    const canvas = await html2canvas(elementRef.current, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: null, 
      scale: 2, // Higher quality
      logging: false
    });

    const image = canvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.download = filename;
    link.href = image;
    link.click();
    
    return true;
  } catch (error) {
    console.error('Error exporting image:', error);
    return false;
  }
}
