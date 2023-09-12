import { useState } from "react";
import { Box, Button, TextField, useMediaQuery, Typography, useTheme } from "@mui/material";
import { Formik } from "formik";
import { FormikHelpers, FormikState, FormikValues } from "formik/dist/types";
import * as yup from "yup";
import { Assign, ObjectShape } from "yup/lib/object";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../../redux/slice";
import FlexBetween from "components/FlexBetween";
import UploadWidget from 'components/UploadWidget';
import { ClearOutlined } from "@mui/icons-material";

interface ValuesForm {
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
    location?: string;
    occupation?: string;
    imgPath?: string;
}

const Form = () => {

    const registerSchema = yup.object().shape({
        firstName: yup.string().required("required"),
        lastName: yup.string().required("required"),
        email: yup.string().email("invalid email").required("required"),
        password: yup.string().required("required"),
        location: yup.string().required("required"),
        occupation: yup.string().required("required"),
        imgPath: yup.string().required("required")
    });

    const loginSchema = yup.object().shape({
        email: yup.string().email("invalid email").required("required"),
        password: yup.string().required("required"),
    });

    const initialValuesRegister = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        location: "",
        occupation: "",
        imgPath: ""
    };

    const initialValuesLogin = {
        email: "",
        password: "",
    };

    const [isLogin, setIsLogin] = useState(true);
    const [validationSchema, setValidationSchema] = useState<yup.ObjectSchema<Assign<ObjectShape, any>>>(loginSchema);
    const [initialValues, setInitialValues] = useState<ValuesForm>(initialValuesLogin);

    const { palette } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const handleFormAction = (resetForm: (nextState?: Partial<FormikState<ValuesForm>> | undefined) => void) => {
        const isLoginAux: boolean = !isLogin;

        setIsLogin(isLoginAux);
        setValidationSchema(isLoginAux ? loginSchema : registerSchema);
        setInitialValues(isLoginAux ? initialValuesLogin : initialValuesRegister);
        resetForm();
    }

    const register = async (values: FormikValues, onSubmitProps: FormikHelpers<ValuesForm>) => {

        const savedUserResponse = await fetch(
            `${process.env.REACT_APP_API}/api/auth/register`,
            {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            }
        );
        const savedUser = await savedUserResponse.json();
        onSubmitProps.resetForm();

        if (savedUser) {
            setIsLogin(true);
            setValidationSchema(loginSchema);
            setInitialValues(initialValuesLogin);
        }
    };

    const login = async (values: ValuesForm, onSubmitProps: FormikHelpers<ValuesForm>) => {
        const loggedInResponse = await fetch(`${process.env.REACT_APP_API}/api/auth/login`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values),
        });
        const loggedIn = await loggedInResponse.json();
        onSubmitProps.resetForm();

        if (loggedIn.ok) {
            dispatch(
                setLogin({
                    user: loggedIn.user,
                    token: loggedIn.token,
                })
            );
            navigate("/home");
        }
    };

    const handleUpload = (error: any, result: any, widget: any, setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void) => {
        if (error) {
            console.log(error);

            widget.close({
                quiet: true
            });

            return;
        }
        setFieldValue("imgPath", result.info.secure_url, true);
    }

    const handleDeleteImage = async (event: React.MouseEvent, image: string, setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void) => {

        event.stopPropagation();

        const publicId = image.split('ReactWeb1').pop()?.split(".")[0];

        const deleteResponse = await fetch(`${process.env.REACT_APP_API}/api/cloudinary/ReactWeb1${publicId}`, {
            method: "DELETE"
        });

        const isDeleted = await deleteResponse.json();

        if (isDeleted.ok) {
            setFieldValue("imgPath", '', true);
        }
    }

    const handleFormSubmit = async (values: ValuesForm, onSubmitProps: FormikHelpers<ValuesForm>) => {
        console.log({ isLogin });

        if (isLogin) await login(values, onSubmitProps);
        if (!isLogin) await register(values, onSubmitProps);
    };

    return (
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize={true}
        >
            {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
                setFieldValue,
                resetForm
            }) => (
                <form onSubmit={handleSubmit}>
                    <Box
                        display="grid"
                        gap="30px"
                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                        sx={{
                            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                        }}
                    >
                        {
                            !isLogin && (
                                <>
                                    <TextField
                                        label="First Name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.firstName || ''}
                                        name="firstName"
                                        error={
                                            Boolean(touched.firstName) && Boolean(errors.firstName)
                                        }
                                        helperText={touched.firstName && errors.firstName}
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                    <TextField
                                        label="Last Name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.lastName || ''}
                                        name="lastName"
                                        error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                                        helperText={touched.lastName && errors.lastName}
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                    <TextField
                                        label="Location"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.location || ''}
                                        name="location"
                                        error={Boolean(touched.location) && Boolean(errors.location)}
                                        helperText={touched.location && errors.location}
                                        sx={{ gridColumn: "span 4" }}
                                    />
                                    <TextField
                                        label="Occupation"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.occupation || ''}
                                        name="occupation"
                                        error={
                                            Boolean(touched.occupation) && Boolean(errors.occupation)
                                        }
                                        helperText={touched.occupation && errors.occupation}
                                        sx={{ gridColumn: "span 4" }}
                                    />
                                    <div style={{ width: "100%", gridColumn: 'span 4' }}>
                                        <Box
                                            gridColumn="span 4"
                                            border={`1px solid ${Boolean(touched.imgPath) && Boolean(errors.imgPath)
                                                ? '#d32f2f'
                                                : palette.neutral.medium}`}
                                            borderRadius="5px"
                                            p="1rem"
                                        >                                        <UploadWidget
                                            options={{ maxFiles: 1, folder: "ReactWeb1" }}
                                            onUpload={(error: any, result: any, widget: any) => handleUpload(error, result, widget, setFieldValue)}
                                            uploadPreset="react_web_1"
                                            disabled={!!values.imgPath}
                                        >
                                                {!values.imgPath ? (
                                                    <Button
                                                        type="button"
                                                        sx={{
                                                            p: "1rem",
                                                            backgroundColor: palette.primary.main,
                                                            color: palette.background.alt,
                                                            "&:hover": { backgroundColor: '#03b7d6' },
                                                        }}
                                                    >
                                                        Select image
                                                    </Button>
                                                ) : (
                                                    <FlexBetween>
                                                        <img
                                                            src={values.imgPath}
                                                            alt="avatars"
                                                            width={60}
                                                            height={60}
                                                            style={{
                                                                borderRadius: 9999,
                                                                border: `1px solid ${palette.neutral.medium}`,
                                                                overflow: "clip"
                                                            }}
                                                        />
                                                        <Button
                                                            type="button"
                                                            sx={{
                                                                p: ".3rem",
                                                                pointerEvents: 'auto',
                                                                minWidth: 'max-content',
                                                                borderRadius: 9999,
                                                                backgroundColor: 'transparent',
                                                                color: 'black',
                                                                "&:hover": { backgroundColor: '#03b7d6', color: 'white' },
                                                            }}
                                                            onClick={(e) => handleDeleteImage(e, values.imgPath!, setFieldValue)}
                                                        >
                                                            <ClearOutlined />
                                                        </Button>
                                                    </FlexBetween>
                                                )}
                                            </UploadWidget>
                                        </Box>
                                        {
                                            Boolean(touched.imgPath) && Boolean(errors.imgPath) && (
                                                <span style={{
                                                    color: '#d32f2f',
                                                    margin: '3px 14px 0',
                                                    fontSize: '0.6428571428571428rem'
                                                }}>
                                                    required
                                                </span>
                                            )
                                        }
                                    </div>
                                </>
                            )}

                        <TextField
                            label="Email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.email || ''}
                            name="email"
                            error={Boolean(touched.email) && Boolean(errors.email)}
                            helperText={touched.email && errors.email}
                            sx={{ gridColumn: "span 4" }}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.password || ''}
                            name="password"
                            autoComplete="on"
                            error={Boolean(touched.password) && Boolean(errors.password)}
                            helperText={touched.password && errors.password}
                            sx={{ gridColumn: "span 4" }}
                        />
                    </Box>

                    {/* BUTTONS */}
                    <Box>
                        <Button
                            fullWidth
                            type="submit"
                            sx={{
                                m: "2rem 0",
                                p: "1rem",
                                backgroundColor: palette.primary.main,
                                color: palette.background.alt,
                                "&:hover": { color: palette.primary.main },
                            }}
                        >
                            {isLogin ? "LOGIN" : "REGISTER"}
                        </Button>
                        <Typography
                            onClick={() => handleFormAction(resetForm)}
                            sx={{
                                textDecoration: "underline",
                                color: palette.primary.main,
                                "&:hover": {
                                    cursor: "pointer",
                                    color: palette.primary.light,
                                },
                            }}
                        >
                            {isLogin
                                ? "Don't have an account? Sign Up here."
                                : "Already have an account? Login here."}
                        </Typography>
                    </Box>
                </form>
            )
            }
        </Formik >
    );
};

export default Form;