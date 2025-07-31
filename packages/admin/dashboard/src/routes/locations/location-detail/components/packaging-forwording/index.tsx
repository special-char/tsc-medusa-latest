import { Input } from "@medusajs/ui"
import { useFormContext, Controller } from "react-hook-form"

interface PackagingAndForwordingProps {
  metaKeys: string[]
  title?: string
  name: string
}

function PackagingAndForwording({ metaKeys, title, name }: PackagingAndForwordingProps) {
  const { control } = useFormContext()

  return (
    <div className="px-2 py-6">
      <h6 className="font-bold mb-6 text-ui-fg-base">{title} - charges</h6>
      <div className="space-y-5">
        {metaKeys.map((key) => (
          <Controller
            key={key}
            name={`${name}.${key}`}
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-2">
                <label className="font-medium text-ui-fg-subtle" htmlFor={`${name}.${key}`}>
                  {key}
                </label>
                <Input
                  id={`${name}.${key}`}
                  placeholder={`Enter value for ${key}`}
                  type="number"
                  className="w-full"
                  {...field}
                />
              </div>
            )}
          />
        ))}
      </div>
    </div>
  )
}

export default PackagingAndForwording
