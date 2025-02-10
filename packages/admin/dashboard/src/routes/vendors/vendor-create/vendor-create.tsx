import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { RouteFocusModal } from "../../../components/modals"
import { Button, Heading, toast } from "@medusajs/ui"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import VendorForm from "./vendor-form"
import SelectCountry from "./select-coutry"
import { sdk } from "../../../lib/client"

const fields = {
  merchant: [
    {
      name: "name",
      label: "Name",
      placeholder: "Name",
    },
    {
      name: "handle",
      label: "Handle",
      placeholder: "Handle",
    },
  ],
  merchantAdmin: [
    {
      name: "logo",
      label: "Logo",
      placeholder: "Logo",
    },
    {
      name: "email",
      label: "Email",
      placeholder: "Email",
    },
    {
      name: "first_name",
      label: "First Name",
      placeholder: "First Name",
    },
    {
      name: "last_name",
      label: "Last Name",
      placeholder: "Last Name",
    },
    {
      name: "category",
      label: "Category",
      placeholder: "Category",
    },
    {
      name: "address",
      label: "Address",
      placeholder: "Address",
    },
    {
      name: "postal_code",
      label: "Postal Code",
      placeholder: "Postal Code",
      inputType: "number",
    },
    {
      name: "city",
      label: "City",
      placeholder: "City",
    },
    {
      name: "country",
      label: "Country",
      placeholder: "Country",
      component: SelectCountry,
    },
    {
      name: "state",
      label: "State",
      placeholder: "State",
    },
    {
      name: "commission",
      label: "Commission",
      placeholder: "Commission",
    },
    {
      name: "description",
      label: "Description",
      placeholder: "Description",
    },
  ],
}

export function VendorCreate() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<FieldValues>()

  const name = watch("name")

  const navigate = useNavigate()

  useEffect(() => {
    if (name) {
      const generatedHandle = name.trim().replace(/\s+/g, "-").toLowerCase()
      setValue("handle", generatedHandle)
    }
  }, [name, setValue])

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      console.log(data)

      await await sdk.vendor.create({
        ...data,
        name: data.name,
        handle: data.handle,
        logo: data.logo,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
      })
      toast.success("Vendor created successfully.")
      navigate("/merchants", {
        replace: true,
        state: { isSubmittingSuccessful: true },
      })
    } catch (error: any) {
      toast.error(error.message)
      console.log(error)
    }
  }

  return (
    <RouteFocusModal>
      <RouteFocusModal.Header />
      <RouteFocusModal.Body className="relative w-full overflow-y-scroll px-8 py-10">
        <div className="flex flex-col pb-6">
          <Heading level="h1" className="text-xl font-semibold">
            Create Merchant
          </Heading>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <VendorForm
              control={control}
              fields={fields}
              decendentField="merchant"
              errors={errors}
            />
            <Heading level="h1" className="text-xl font-semibold">
              Merchant Admin
            </Heading>
            <VendorForm
              className="grid grid-cols-2 gap-4"
              control={control}
              fields={fields}
              decendentField="merchantAdmin"
              errors={errors}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </RouteFocusModal.Body>
    </RouteFocusModal>
  )
}
