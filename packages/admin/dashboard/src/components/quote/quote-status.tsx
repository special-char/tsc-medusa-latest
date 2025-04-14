import { QuoteStatus, getQuoteStatus } from "../../lib/quote-status-helper"
import { StatusCell } from "../table/table-cells/common/status-cell"

type QuoteStatusCellProps = {
  status: QuoteStatus
}

export const QuoteStatusCell = ({ status }: QuoteStatusCellProps) => {
  const { label, color } = getQuoteStatus(status)

  return <StatusCell color={color}>{label}</StatusCell>
}

export const QuoteStatusHeader = () => {
  return (
    <div className="flex h-full w-full items-center">
      <span className="truncate">Quote Status</span>
    </div>
  )
}
