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
        required: {
          value: true,
          message: "Banner Link is required",
        },
      },
    },
    text: {
      label: "Banner Text",
      fieldType: "markdown-editor",
      validation: {
        required: {
          value: true,
          message: "Banner Text is required",
        },
      },
    },
  }

  return schema
}
