import React, { useState, useEffect } from "react"
import { backendUrl } from "../../../../lib/client"
import { Button } from "@medusajs/ui"
// import Loader from "../../../components/Loader"

const Loader = () => {
  return <div>Loading...</div>
}

const DataTable: React.FC = () => {
  const [zipcode, setZipcode] = useState<Record<string, string>[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10) // Number of rows per page

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${backendUrl}/admin/zipcodes`, {
          credentials: "include",
        })
        const json = await response.json()
        setZipcode(json.data)
      } catch (error) {
        console.log({ error })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="grid h-full min-h-[calc(100vh-200px)] w-full place-items-center">
        <Loader />
      </div>
    )
  }

  if (!zipcode) {
    return null
  }

  // Calculate the total number of pages
  const totalPages = Math.ceil(zipcode.length / pageSize)

  // Get the data for the current page
  const currentData = zipcode.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <div className="w-full">
      <div className="w-full overflow-x-scroll">
        <table>
          <thead className="bg-gray-200">
            <tr>
              {Object.keys(zipcode[0]).map((key) => (
                <th key={key} className="border-b border-gray-200 px-4 py-2">
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-100">
                {Object.values(item).map((value, i) => (
                  <td key={i} className="border-b border-gray-200 px-4 py-2">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </Button>
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </Button>
      </div>
    </div>
  )
}

export default DataTable
