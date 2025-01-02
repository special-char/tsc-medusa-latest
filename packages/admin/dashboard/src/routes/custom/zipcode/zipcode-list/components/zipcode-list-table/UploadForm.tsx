import { Heading, Button } from "@medusajs/ui"
import { useForm, Controller, SubmitHandler } from "react-hook-form"
import FileInput from "../../../../../../components/custom/components/form/FileInput"
import { backendUrl } from "../../../../../../lib/client"

interface FormValues {
  file: File | null
}

const UploadForm = () => {
  const { handleSubmit, control } = useForm<FormValues>()

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!data.file) {
      console.log("file required")
      return null
    }

    const formdata = new FormData()
    formdata.append("file", data.file)

    try {
      const response = await fetch(`${backendUrl}/admin/zipcodes`, {
        method: "POST",
        body: formdata,
      })
    } catch (error) {
      console.log({ error })
    }
  }
  return (
    <div>
      <Heading level="h1" className="pb-2 font-semibold">
        Upload Zipcode CSV file
      </Heading>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Controller
          name="file"
          control={control}
          rules={{ required: "CSV file is required" }}
          render={({ field }) => (
            <FileInput
              title="Upload CSV File"
              {...field}
              control={control}
              rules={{ required: "CSV file is required" }}
            />
          )}
        />
        <Button type="submit">Upload File</Button>
      </form>
    </div>
  )
}

export default UploadForm
