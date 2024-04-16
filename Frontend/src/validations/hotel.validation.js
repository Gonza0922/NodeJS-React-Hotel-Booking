import * as yup from "yup";

export const createHotelSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(25, "Name must be no more than 25 characters"),
  price_per_night: yup.string().required("Price Per Night is required"),
  location: yup
    .string()
    .required("Location is required")
    .min(5, "Location must be at least 5 characters"),
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
  services: yup
    .string()
    .required("Services are required")
    .min(10, "Services must be at least 10 characters"),
  phone: yup
    .string()
    .required("Number is required")
    .min(10, "Number must be at least 10 characters")
    .max(11, "Number must be no more than 11 characters"),
  principalImg: yup
    .mixed()
    .test("required", "Principal Image is required", (value) => {
      return value && value.length;
    })
    .test(
      "fileType",
      "Principal Image only accept JPEG and JPG files",
      (value) => {
        if (value[0])
          return (
            value[0].name &&
            (value[0].name.includes(".jpg") || value[0].name.includes(".jpeg"))
          );
      }
    ),
  moreImages: yup
    .mixed()
    .test("required", "Other Files are required", (value) => {
      return value && value.length;
    })
    .test("fileLength", "Enter more than 1 file in Other Files", (value) => {
      return value && value.length > 1;
    })
    .test("fileType", "Other Files only accept JPEG and JPG files", (value) => {
      let result = false;
      if (value.length) {
        for (let i = 0; i < value.length; i++) {
          const file = value[i].name;
          if (file) {
            if (file.includes(".jpg") || file.includes(".jpeg")) {
              result = true;
            } else {
              result = false;
              break;
            }
          }
        }
      }
      return result;
    }),
});

export const updateHotelSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(25, "Name must be no more than 25 characters"),
  price_per_night: yup.string().required("Price Per Night is required"),
  location: yup
    .string()
    .required("Location is required")
    .min(5, "Location must be at least 5 characters"),
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
  services: yup
    .string()
    .required("Services are required")
    .min(10, "Services must be at least 10 characters"),
  phone: yup
    .string()
    .required("Phone is required")
    .min(10, "Phone must be at least 10 characters")
    .max(11, "Phone must be no more than 11 characters"),
  principalImg: yup
    .mixed()
    .test("required", "Principal Image is required", (value) => {
      if (value) {
        return true;
      } else {
        return false;
      }
    })
    .test(
      "fileType",
      "Principal Image only accept JPEG and JPG files",
      (value) => {
        if (value.name) {
          return (
            value.name &&
            (value.name.includes(".jpg") || value.name.includes(".jpeg"))
          );
        } else {
          return true;
        }
      }
    ),
  moreImages: yup
    .mixed()
    .test("required", "Other Files are required", (value) => {
      return value && value.length;
    })
    .test("fileLength", "Enter more than 1 file in Other Files", (value) => {
      return value && value.length > 1;
    })
    .test("fileType", "Other Files only accept JPEG and JPG files", (value) => {
      let result = true;
      if (value) {
        for (let i = 0; i < value.length; i++) {
          const name = value[i].name;
          const image_name = value[i].image_name;
          if (image_name) {
            result = true;
            break;
          }
          if (name) {
            if (name.includes(".jpg") || name.includes(".jpeg")) {
              result = true;
            } else {
              result = false;
              break;
            }
          }
        }
      }
      return result;
    }),
});
