export const signupConfig = {
  bgImage: "https://images.unsplash.com/photo-1687678952427-72b8f462d855?auto=format&fit=crop&w=2000&q=80",
  bgAlt: "Background blur",
  cardImage: "https://images.unsplash.com/photo-1687678952427-72b8f462d855?auto=format&fit=crop&w=1200&q=80",
  quote: {
    label: "A Wise Quote",
    title: "Start\nYour New\nJourney",
    text: "Every big achievement starts with a single step. Join us today and start mapping your goals."
  },
  logoText: "Cogie",
  heading: "Create Account",
  subheading: "Sign up now to start your structured journal writing",
  fields: [
    {
      id: "firstName",
      label: "First Name",
      type: "text",
      placeholder: "Enter your first name",
      required: true,
    },
    {
      id: "lastName",
      label: "Last Name",
      type: "text",
      placeholder: "Enter your last name",
      required: true,
    },
    {
      id: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter your email",
      required: true,
    },
    {
      id: "password",
      label: "Password",
      type: "password",
      placeholder: "Create a password",
      required: true,
    },
    {
      id: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      placeholder: "Confirm your password",
      required: true,
    }
  ],
  submitButtonText: "Sign Up",
  loginLinkText: "Already have an account? Sign In",
  loginPath: "/"
};

export default signupConfig;
