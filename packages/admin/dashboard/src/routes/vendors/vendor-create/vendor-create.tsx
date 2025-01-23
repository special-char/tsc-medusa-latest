import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form"
import { RouteFocusModal } from "../../../components/modals"
import {
  Button,
  Heading,
  Input,
  Label,
  Text,
  toast,
  Tooltip,
} from "@medusajs/ui"
import { useEffect } from "react"
import { InformationCircleSolid } from "@medusajs/icons"
import { sdk } from "../../../lib/client"
import { useNavigate } from "react-router-dom"

const getAuthToken = async (data: any) => {
  try {
    const response = await sdk.auth.register("vendor", "emailpass", {
      email: data.email,
      password: data.email,
    })
    return response
  } catch (error: any) {
    toast.error(error.message)
    console.log(error, "erroradmin")
  }
}

const postVendor = async (data: any, tokenResult?: string) => {
  try {
    const response = await sdk.vendor.create(data, {
      Authorization: `Bearer ${tokenResult}`,
    })
    return response
  } catch (error: any) {
    toast.error(error.message)
    console.log(error, "error")
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

  const navigate = useNavigate()

  useEffect(() => {
    if (name) {
      const generatedHandle = name.trim().replace(/\s+/g, "-").toLowerCase()
      setValue("handle", generatedHandle)
    }
  }, [name, setValue])

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const tokenResult = await getAuthToken(data)

      if (tokenResult) {
        await postVendor(
          {
            name: data.name,
            handle: data.handle,
            // logo: data.logo,
            admin: {
              email: data.email,
              first_name: data.first_name,
              last_name: data.last_name,
            },
          },
          tokenResult
        )

        navigate("/merchants", {
          replace: true,
          state: { isSubmittingSuccessful: true },
        })
        navigate(0)
      }
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
            {/* <div>
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
            </div> */}
            <Heading level="h1" className="text-xl font-semibold">
              Merchant Admin
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
