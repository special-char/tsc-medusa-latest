import {
  FieldValues,
  Form,
  RegisterOptions,
  SubmitHandler,
  useForm,
} from "react-hook-form"
import { RouteFocusModal } from "../../../components/modals"
import { Button, Heading, toast } from "@medusajs/ui"
import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import VendorForm from "./vendor-form"
import { sdk } from "../../../lib/client"
type Fields = {
  name: string
  label: string
  placeholder: string
  type?: React.HTMLInputTypeAttribute | undefined
  component?: React.DetailedReactHTMLElement<any, HTMLElement>
  rules?:
    | Omit<
        RegisterOptions<FieldValues, string>,
        "disabled" | "valueAsNumber" | "valueAsDate" | "setValueAs"
      >
    | undefined
}
const fields: {
  merchant: Fields[]
  // merchantAdmin: Fields[]
} = {
  merchant: [
    {
      name: "name",
      label: "Company Name",
      placeholder: "Company Name",
      rules: {
        required: "Company Name is required",
      },
    },
    {
      name: "handle",
      label: "Handle",
      placeholder: "Handle",
      rules: {
        required: "Handle is required",
      },
    },
    {
      name: "email",
      label: "Email",
      placeholder: "Email",
      rules: {
        required: "Email is required",
      },
    },
  ],
  // merchantAdmin: [
  //   // {
  //   //   name: "logo",
  //   //   label: "Logo",
  //   //   placeholder: "Logo",
  //   //   component: FileUploadField,
  //   // },
  //   // {
  //   //   name: "first_name",
  //   //   label: "First Name",
  //   //   placeholder: "First Name",
  //   //   rules: {
  //   //     required: "First Name is required",
  //   //   },
  //   // },
  //   // {
  //   //   name: "last_name",
  //   //   label: "Last Name",
  //   //   placeholder: "Last Name",
  //   //   rules: {
  //   //     required: "Last Name is required",
  //   //   },
  //   // },
  //   // {
  //   //   name: "category",
  //   //   label: "Category",
  //   //   placeholder: "Category",
  //   // },
  //   // {
  //   //   name: "address",
  //   //   label: "Address",
  //   //   placeholder: "Address",
  //   // },
  //   // {
  //   //   name: "postal_code",
  //   //   label: "Postal Code",
  //   //   placeholder: "Postal Code",
  //   //   type: "number",
  //   // },
  //   // {
  //   //   name: "city",
  //   //   label: "City",
  //   //   placeholder: "City",
  //   // },
  //   // {
  //   //   name: "country",
  //   //   label: "Country",
  //   //   placeholder: "Country",
  //   //   component: SelectCountry,
  //   // },
  //   // {
  //   //   name: "state",
  //   //   label: "State",
  //   //   placeholder: "State",
  //   // },
  //   // {
  //   //   name: "commission",
  //   //   label: "Commission",
  //   //   placeholder: "Commission",
  //   //   type: "number",
  //   // },
  //   // {
  //   //   name: "description",
  //   //   label: "Description",
  //   //   placeholder: "Description",
  //   // },
  // ],
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
      console.log("data", data)
      await sdk.vendor.create({
        // ...data,
        name: data.name,
        handle: data.handle,
        // ...(data.logo && { logo: data.logo }),
        email: data.email,
        // first_name: data.first_name,
        // last_name: data.last_name,
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
  console.log(errors)

  return (
    <RouteFocusModal>
      <RouteFocusModal.Header />
      <RouteFocusModal.Body className="relative w-full overflow-y-scroll px-8 py-10">
        <div className="flex flex-col pb-6">
          <Heading level="h1" className="text-xl font-semibold">
            Create Merchant
          </Heading>
        </div>
        <Form control={control} onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <VendorForm
              control={control}
              fields={fields}
              decendentField="merchant"
              errors={errors}
            />
            {/* <Heading level="h1" className="text-xl font-semibold">
              Merchant Admin
            </Heading> */}
            {/* <VendorForm
              className="grid grid-cols-2 gap-4"
              control={control}
              fields={fields}
              decendentField="merchantAdmin"
              errors={errors}
            /> */}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </Form>
      </RouteFocusModal.Body>
    </RouteFocusModal>
  )
}
