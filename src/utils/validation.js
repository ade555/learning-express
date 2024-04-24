const makeFieldOptional = (schema) => {
    const optionalSchema = {};
    for (const field in schema) {
        optionalSchema[field] = { ...schema[field], optional: true };
    }
    return optionalSchema;
};

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
    },
    password:{
        isLength:{
            options:{
                min:8
            }
        },
        ...commonValidationRules
    }
}

export const loginValidationSchema = {
    username:{
        isLength:{
            options:{
                min:3,
                max:10
            },
            errorMessage : "Username should have a minimum of 3 characters and a maximum of 10 characters"
        },
        ...commonValidationRules
    },
    password:{
        isLength:{
            options:{
                min:8
            },
            errorMessage : "password should have at least 8 characters"
        },
        ...commonValidationRules
    }
}

export const userUpdateValidationSchema = makeFieldOptional(userValidationSchema);