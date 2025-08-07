import { ArrowDownTray } from "@medusajs/icons"
import { Button } from "@medusajs/ui"

const SAMPLE_CSV_DATA = [
  "Service Category,Weight Slab,Within City,Within State,Metro,Rest of India",
  "Standard - Non Dox - Surface,0 - 1000,45,55,65,75",
  "Standard - Non Dox - Air,0 - 1000,0,0,100,190",
  "Standard - Non Dox - Surface,Addl 1000,0,0,120,140",
  "Standard - Non Dox - Air,Addl 1000,0,0,120,140",
  "Fast Track - Non Dox - Surface,0 - 1000,300,300,350,350",
  "Fast Track - Non Dox - Surface,Addl 1000,300,300,350,350",
  "Fast Track - Non Dox - Air,0 - 1000,300,300,350,350",
  "Fast Track - Non Dox - Air,Addl 1000,300,300,350,350",
];

export const SampleDownloader = () => {
  const downloadSampleCsv = () => {
    const csvContent = SAMPLE_CSV_DATA.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'contract-rate.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Button
      variant="secondary"
      size="small"
      onClick={downloadSampleCsv}
    >
      <ArrowDownTray className="w-4 h-4 mr-2" />
      Download Sample CSV
    </Button>
  )
} 