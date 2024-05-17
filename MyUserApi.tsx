import { useAuth0 } from "@auth0/auth0-react";
import { useMutation } from "react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type UserType = {
  auth0Id: string;
  email: string;
  city?: string;
  country?: string;
  addressLine1?: string;
};

export const useCreateUser = () => {
  const { getAccessTokenSilently } = useAuth0();
  const createUserRequest = async (userFormData: UserType) => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(userFormData),
    });
    if (!response.ok) {
      throw new Error("Something Went Wrong");
    }
    return response.json();
  };

  const { mutateAsync: createUser, isError } = useMutation(createUserRequest);
  if (isError) {
    console.log("Something went wrong");
  }
  return {
    createUser,
  };
};
