import * as yup from "yup";

export const createHotelSchema = yup.object().shape({
  name: yup
    .mixed()
    .test("required", "Name is required", (value) => {
      return value && value.length;
    })
    .test("phoneLength", "Name must be at least 2 characters", (value) => {
      return value && value.length > 2;
    })
    .test("phoneLength", "Name must be no more than 25 characters", (value) => {
      return value && value.length <= 25;
    }),
  price_per_night: yup
    .mixed()
    .test("required", "Price Per Night is required", (value) => {
      return value && value.length;
    }),
  location: yup
    .mixed()
    .test("required", "Location is required", (value) => {
      return value && value.length;
    })
    .test(
      "locationLength",
      "Location must be at least 5 characters",
      (value) => {
        return value && value.length >= 5;
      }
    ),
  description: yup
    .mixed()
    .test("required", "Description is required", (value) => {
      return value && value.length;
    })
    .test(
      "phoneLength",
      "Description must be at least 10 characters",
      (value) => {
        return value && value.length >= 10;
      }
    ),
  services: yup
    .mixed()
    .test("required", "Services are required", (value) => {
      return value && value.length;
    })
    .test("phoneLength", "Services must be at least 10 characters", (value) => {
      return value && value.length >= 10;
    }),
  phone: yup
    .mixed()
    .test("required", "Phone is required", (value) => {
      return value && value.length;
    })
    .test(
      "phoneLength",
      "Phone must be at least than 10 characters",
      (value) => {
        return value && value.length >= 10;
      }
    )
    .test("phoneLength", "Phone must be no more 11 characters", (value) => {
      return value && value.length <= 11;
    }),
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
          if (file && (file.includes(".jpg") || file.includes(".jpeg")))
            result = true;
        }
      }
      return result;
    }),
});

export const updateHotelSchema = yup.object().shape({
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
      if (value.length) {
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
