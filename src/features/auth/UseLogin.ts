import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/Firebase";

export const useLogin = () => {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState<string | null>(null);

  const login = async () => {

    try {

      setLoading(true);
      setError(null);

      await signInWithEmailAndPassword(auth, email, password);

      console.log("entro")
    } catch(e:any) {

    
        console.log(e.message)
      setError(e.message);

    } finally {

      setLoading(false);

    }

  };

  return {
    email,
    password,
    setEmail,
    setPassword,
    login,
    loading,
    error
  };

};