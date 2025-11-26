export function useClipboard() {

  const copyText = async (text: string): Promise<boolean> => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text)
        return true
      } catch (err) {
        console.error('Clipboard write failed:', err)
        return false
      }
    } else {
      // Fallback for non-secure contexts
      try {
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-9999px'
        textArea.style.top = '-9999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        const success = document.execCommand('copy')
        document.body.removeChild(textArea)
        if (success) {
          return true
        } else {
          console.error('Fallback copy failed')
          return false
        }
      } catch (err) {
        console.error('Fallback copy failed:', err)
        return false
      }
    }
  }

  return {
    copyText,
  }
}
