import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form"
import { RouteFocusModal } from "../../../components/modals"
import { Button, Heading, Input, Label, Text, Tooltip } from "@medusajs/ui"
import { useEffect } from "react"
import ImageUpload from "../../../components/custom/components/form/ImageUpload"
import { InformationCircleSolid } from "@medusajs/icons"
import { sdk } from "../../../lib/client"

const getAuthToken = async (data: any) => {
  try {
    const response = await sdk.auth.register("vendor", "emailpass", {
      email: data.email,
      password: data.email,
    })

    return response

    // const response = await fetch(
    //   `${__BACKEND_URL__}/auth/manager/emailpass/register`,
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       email: data.email,
    //       password: data.email, // Replace with actual password if needed
    //     }),
    //   }
    // )

    // const result = await response.json()

    // return result
  } catch (error) {
    console.log(error)
  }
}

const postVendor = async (data, tokenResult) => {
  try {
    const response = await sdk.vendor.create(data, {
      Authorization: `Bearer ${tokenResult}`,
    })
    return response
    // const response = await fetch(`${__BACKEND_URL__}/admin/vendors`, {
    //   method: "POST",
    //   credentials: "include",
    //   body: JSON.stringify({
    //     name: data.name,
    //     handle: data.handle,
    //     logo: data.logo ? data.logo[0] : null,
    //     admin: {
    //       email: data.email,
    //       first_name: data.first_name,
    //       last_name: data.last_name,
    //     },
    //   }),
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${tokenResult.token}`,
    //   },
    // })
    // const res = await response.json()
    // console.log("res", res)
  } catch (error) {
    console.log(error)
  }
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

  useEffect(() => {
    if (name) {
      const generatedHandle = name.trim().replace(/\s+/g, "-").toLowerCase()
      setValue("handle", generatedHandle)
    }
  }, [name, setValue])

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const tokenResult = await getAuthToken(data)

      console.log("tokenResult", tokenResult)

      const vendorResult = await postVendor(data, tokenResult)

      console.log({ vendorResult }, "post vendor")
    } catch (error) {
      console.error("Error:", error)
    }
  }

  return (
    <RouteFocusModal>
      <RouteFocusModal.Header />
      <RouteFocusModal.Body className="relative w-full overflow-y-scroll px-8 py-10">
        <div className="flex flex-col pb-6">
          <Heading level="h1" className="text-xl font-semibold">
            Create Vendor
          </Heading>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <Controller
                name="name"
                control={control}
                rules={{ required: "Name is required" }}
                render={({ field }) => {
                  return (
                    <>
                      <Label>
                        <span>Name</span>
                        <Input placeholder="Name" {...field} />
                      </Label>
                    </>
                  )
                }}
              />
              {errors.title && (
                <Text className="text-red-500">
                  {errors?.title?.message as string}
                </Text>
              )}
            </div>
            <div>
              <Controller
                name="handle"
                control={control}
                rules={{ required: "Handle is required" }}
                render={({ field }) => {
                  return (
                    <>
                      <Label>
                        <div className="flex items-center gap-2">
                          <div>Handle</div>
                          <Tooltip content="This handle is used to refrence the vendor in your storefront.">
                            <InformationCircleSolid />
                          </Tooltip>
                        </div>
                        <Input placeholder="Handle" {...field} />
                      </Label>
                    </>
                  )
                }}
              />
              {errors.title && (
                <Text className="text-red-500">
                  {errors?.title?.message as string}
                </Text>
              )}
            </div>
            <div>
              <Controller
                name="logo"
                control={control}
                render={({ field }) => {
                  return (
                    <>
                      <Label>
                        <span>Logo</span>
                        <ImageUpload multiple={false} {...field} />
                      </Label>
                    </>
                  )
                }}
              />
              {errors.content && (
                <Text className="text-red-500">
                  {errors.content.message as string}
                </Text>
              )}
            </div>
            <Heading level="h1" className="text-xl font-semibold">
              Vendor Admin
            </Heading>
            <div>
              <Controller
                name="email"
                control={control}
                rules={{ required: "Email is required" }}
                render={({ field }) => {
                  return (
                    <>
                      <Label>
                        <span>Email</span>
                        <Input placeholder="Email" {...field} />
                      </Label>
                    </>
                  )
                }}
              />
              {errors.title && (
                <Text className="text-red-500">
                  {errors?.title?.message as string}
                </Text>
              )}
            </div>
            <div>
              <Controller
                name="first_name"
                control={control}
                rules={{ required: "First Name is required" }}
                render={({ field }) => {
                  return (
                    <>
                      <Label>
                        <span>First Name</span>
                        <Input placeholder="First Name" {...field} />
                      </Label>
                    </>
                  )
                }}
              />
              {errors.title && (
                <Text className="text-red-500">
                  {errors?.title?.message as string}
                </Text>
              )}
            </div>
            <div>
              <Controller
                name="last_name"
                control={control}
                rules={{ required: "Last Name is required" }}
                render={({ field }) => {
                  return (
                    <>
                      <Label>
                        <span>Last Name</span>
                        <Input placeholder="Last Name" {...field} />
                      </Label>
                    </>
                  )
                }}
              />
              {errors.title && (
                <Text className="text-red-500">
                  {errors?.title?.message as string}
                </Text>
              )}
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </RouteFocusModal.Body>
    </RouteFocusModal>
  )
}
