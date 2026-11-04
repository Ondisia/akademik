export const useExport = () => {
  const escapeCsv = (value: unknown): string => {
    const s = String(value ?? '')
    if (/[",\n\r]/.test(s)) {
      return '"' + s.replace(/"/g, '""') + '"'
    }
    return s
  }

  const toCsv = (headers: string[], rows: unknown[][]): string => {
    const head = headers.map(escapeCsv).join(',')
    const body = rows.map(row => row.map(escapeCsv).join(',')).join('\n')
    return body ? head + '\n' + body : head
  }

  const exportToCsv = (headers: string[], rows: unknown[][], filename: string) => {
    const csv = '\uFEFF' + toCsv(headers, rows)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${filename}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return { exportToCsv, toCsv }
}
