import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase/firebase";

import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserRole = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          switch(userData.role) {
            case "admin":
              navigate("/dashboard");
              break;
            case "encargado":
              navigate("/inventario");
              break;
            case "vendedor":
              navigate("/ventas");
              break;
            default:
              navigate("/");
          }
        }
      }
    };

    if (!loading) checkUserRole();
  }, [user, loading, navigate]);

  return { user, loading };
};