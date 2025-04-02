export const bannerSchema = async () => {
  const schema = {
    image: {
      label: "Banner Image",
      fieldType: "seo-file-upload",
      props: {
        multiple: true,
      },
      validation: {},
    },
    name: {
      label: "Banner Name",
      fieldType: "input",
      validation: {
        required: {
          value: true,
          message: "Banner Name is required",
        },
      },
    },
    link: {
      label: "Banner Link",
      fieldType: "input",
      validation: {
        // required: {
        //   value: true,
        //   message: "Banner Link is required",
        // },
      },
    },
    description: {
      label: "Banner description",
      fieldType: "markdown-editor",
      validation: {
        // required: {
        //   value: true,
        //   message: "Banner description is required",
        // },
      },
    },
    isActive: {
      label: "Banner Active or Not",
      fieldType: "toggle",
      validation: {},
    },
  }

  return schema
}
