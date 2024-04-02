const commonValidationRules = {
    isString:{
        errorMessage:"This field must be a string"
    },
    notEmpty:{
        errorMessage:"This field must not be empty"
    }
}

export const userValidationSchema = {
    fullName:{ ...commonValidationRules },
    username:{
        isLength:{
            options:{
                min:3,
                max:10
            },
            errorMessage : "Username should have a minimum of 3 characters and a maximum of 10 characters"
        },
        ...commonValidationRules
    }
}