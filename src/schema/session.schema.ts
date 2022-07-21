import {object, string} from 'yup';

export const createUserSessionSchema=object({
    body:object({
        email:string()
        .email("Must be valid email")
        .required("Email is required"),
        password:string()
        .required("Password is required")
        .min(6,"Password is too sort-should be 6 chars minium.")
        .matches(/^[a-zA-Z0-9_.-]*$/,"Password can only contain Latin letters ")
    }),
});